"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { resetMetricsCache } from "@/lib/metrics/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma, type Role } from "@prisma/client";
import { db } from "@/lib/db";
import { assertUser, AuthError } from "@/lib/auth/guard";
import { createSession, destroySession, purgeExpiredSessions } from "@/lib/auth/session";
import { hashPassword, PASSWORD_MIN, verifyPassword } from "@/lib/auth/password";
import { clientFingerprint, rateLimit } from "@/lib/security/rate-limit";
import { getResource } from "@/lib/admin/resources";
import { parseResourceForm } from "@/lib/admin/form";
import { publishIssues } from "@/lib/editorial/checks";
import { canTransition, requiresPublishChecks, STATUSES, type Status } from "@/lib/editorial/status";
import { checkAllSources } from "@/lib/links/check";

export type ActionState = { ok: boolean; message: string; errors?: Record<string, string>; issues?: string[] };

type Delegate = {
  findUnique: (a: unknown) => Promise<Record<string, unknown> | null>;
  create: (a: unknown) => Promise<Record<string, unknown>>;
  update: (a: unknown) => Promise<Record<string, unknown>>;
  delete: (a: unknown) => Promise<unknown>;
};
const delegate = (client: unknown, model: string) => (client as Record<string, Delegate>)[model];

async function audit(userId: string | null, action: string, summary: string, entityType?: string, entityId?: string, meta?: unknown) {
  await db.auditLog.create({ data: { userId, action, summary, entityType, entityId, meta: (meta ?? undefined) as Prisma.InputJsonValue | undefined } });
}

function friendly(e: unknown): string {
  if (e instanceof AuthError) return e.message;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return "Já existe um registro com este identificador (slug/chave).";
    if (e.code === "P2003") return "Este registro está ligado a outros conteúdos e não pode ser removido ou a referência é inválida.";
    if (e.code === "P2025") return "Registro não encontrado.";
  }
  console.error(e);
  return "Não foi possível concluir a operação.";
}

class PublishBlocked extends Error {
  constructor(public issues: string[]) {
    super("bloqueado");
  }
}

// ── Autenticação ────────────────────────────────────────────────

const loginSchema = z.object({ email: z.string().trim().toLowerCase().email().max(200), password: z.string().min(1).max(200) });

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { ok: false, message: "Informe e-mail e senha válidos." };
  const fp = await clientFingerprint("login");
  const byClient = rateLimit(`login:${fp}`, 5, 15 * 60 * 1000);
  const byAccount = rateLimit(`login-acct:${parsed.data.email}`, 10, 60 * 60 * 1000);
  if (!byClient.ok || !byAccount.ok) return { ok: false, message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash);
  if (!user || !valid || !user.active) {
    await audit(null, "login.failed", "Tentativa de login sem sucesso");
    return { ok: false, message: "E-mail ou senha incorretos." };
  }
  await createSession(user.id);
  await purgeExpiredSessions();
  await audit(user.id, "login", `Login de ${user.email}`);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ── CRUD genérico ───────────────────────────────────────────────

export async function saveRecord(resourceKey: string, id: string | null, _: ActionState, form: FormData): Promise<ActionState> {
  const def = getResource(resourceKey);
  if (!def) return { ok: false, message: "Tipo de conteúdo desconhecido." };
  let user;
  try {
    user = await assertUser(def.editRoles);
  } catch (e) {
    return { ok: false, message: friendly(e) };
  }
  const idField = def.idField ?? "id";
  const { data, errors, claimSources } = parseResourceForm(def, form);
  if (Object.keys(errors).length) return { ok: false, message: "Revise os campos destacados.", errors };

  // Fontes de afirmações: valida slugs.
  let sourceLinks: { sourceId: string; locator: string | null }[] | undefined;
  if (claimSources) {
    const found = await db.source.findMany({ where: { slug: { in: claimSources.map((s) => s.slug) } }, select: { id: true, slug: true } });
    const missing = claimSources.filter((s) => !found.some((f) => f.slug === s.slug)).map((s) => s.slug);
    if (missing.length) return { ok: false, message: "Revise os campos destacados.", errors: { sources: `Fontes inexistentes: ${missing.join(", ")}` } };
    sourceLinks = claimSources.map((s) => ({ sourceId: found.find((f) => f.slug === s.slug)!.id, locator: s.locator }));
  }

  let savedId: string;
  try {
    savedId = await db.$transaction(async (tx) => {
      const d = delegate(tx, def.model);
      let record: Record<string, unknown>;
      if (id) {
        const current = await d.findUnique({ where: { [idField]: id } });
        if (!current) throw new Prisma.PrismaClientKnownRequestError("not found", { code: "P2025", clientVersion: "" });
        const status = current.status as Status | undefined;
        const locked = status === "PUBLISHED" || status === "VERIFIED";
        if (def.editorial && locked && user.role === "EDITOR") {
          throw new AuthError("Conteúdo verificado ou publicado só pode ser editado por revisores. Peça para reabrir em revisão.");
        }
        record = await d.update({ where: { [idField]: id }, data: { ...data, ...(def.editorial ? { version: { increment: 1 } } : {}) } });
        if (sourceLinks) {
          await tx.claimSource.deleteMany({ where: { claimId: id } });
          await tx.claimSource.createMany({ data: sourceLinks.map((s) => ({ ...s, claimId: id })) });
        }
        if (def.editorial && locked) {
          const issues = await publishIssues(tx, def.model, id);
          if (issues.length) throw new PublishBlocked(issues);
        }
      } else {
        record = await d.create({ data: { ...data, ...(def.editorial ? { status: "DRAFT" } : {}) } });
        if (sourceLinks?.length) await tx.claimSource.createMany({ data: sourceLinks.map((s) => ({ ...s, claimId: record.id as string })) });
      }
      const rid = String(record[idField]);
      if (def.editorial) {
        await tx.revision.create({
          data: {
            entityType: def.model,
            entityId: rid,
            version: Number(record.version ?? 1),
            status: record.status as Status,
            snapshot: JSON.parse(JSON.stringify({ ...record, sources: sourceLinks })) as Prisma.InputJsonValue,
            authorId: user.id,
            note: (form.get("_note") as string | null)?.slice(0, 500) || null,
          },
        });
      }
      return rid;
    });
  } catch (e) {
    if (e instanceof PublishBlocked) return { ok: false, message: "Alteração não salva: o conteúdo publicado deixaria de cumprir as regras editoriais.", issues: e.issues };
    return { ok: false, message: friendly(e) };
  }
  await audit(user.id, id ? "update" : "create", `${id ? "Editou" : "Criou"} ${def.singular} ${savedId}`, def.model, savedId);
  revalidatePath("/", "layout");
  revalidateTag("content");
  redirect(`/admin/${def.key}/${encodeURIComponent(savedId)}?salvo=1`);
}

export async function transitionRecord(resourceKey: string, id: string, _: ActionState, form: FormData): Promise<ActionState> {
  const def = getResource(resourceKey);
  if (!def?.editorial) return { ok: false, message: "Este conteúdo não tem fluxo editorial." };
  const to = String(form.get("to") ?? "") as Status;
  if (!STATUSES.includes(to)) return { ok: false, message: "Estado inválido." };
  const note = String(form.get("note") ?? "").trim().slice(0, 500) || null;
  try {
    const user = await assertUser();
    const d = delegate(db, def.model);
    const current = await d.findUnique({ where: { id } });
    if (!current) return { ok: false, message: "Registro não encontrado." };
    const from = current.status as Status;
    if (!canTransition(user.role, from, to)) return { ok: false, message: "Transição não permitida para o seu papel." };

    if (requiresPublishChecks(to)) {
      const issues = await publishIssues(db, def.model, id);
      if (issues.length) return { ok: false, message: "Ainda não é possível avançar. Resolva as pendências:", issues };
    }
    if (to === "VERIFIED" && process.env.EDITORIAL_REQUIRE_SECOND_REVIEWER !== "false") {
      const last = await db.revision.findFirst({ where: { entityType: def.model, entityId: id, authorId: { not: null } }, orderBy: { createdAt: "desc" } });
      if (last?.authorId === user.id) return { ok: false, message: "A verificação deve ser feita por pessoa diferente de quem fez a última edição." };
    }

    const now = new Date();
    const extra: Record<string, unknown> = {};
    if ((def.model === "claim" || def.model === "source") && (to === "VERIFIED" || (to === "PUBLISHED" && !current.verifiedAt))) extra.verifiedAt = now;
    const updated = await d.update({ where: { id }, data: { status: to, version: { increment: 1 }, ...extra } });
    await db.revision.create({
      data: { entityType: def.model, entityId: id, version: Number(updated.version), status: to, snapshot: JSON.parse(JSON.stringify(updated)) as Prisma.InputJsonValue, authorId: user.id, note },
    });
    await audit(user.id, `status.${to.toLowerCase()}`, `${def.singular} ${id}: ${from} → ${to}`, def.model, id, { from, to, note });
    revalidatePath("/", "layout");
  revalidateTag("content");
    return { ok: true, message: "Estado atualizado." };
  } catch (e) {
    return { ok: false, message: friendly(e) };
  }
}

export async function deleteRecord(resourceKey: string, id: string): Promise<void> {
  const def = getResource(resourceKey);
  if (!def) throw new Error("Tipo desconhecido");
  const user = await assertUser(["ADMIN"]);
  const idField = def.idField ?? "id";
  const d = delegate(db, def.model);
  const current = await d.findUnique({ where: { [idField]: id } });
  if (!current) redirect(`/admin/${def.key}`);
  if (def.editorial && !["DRAFT", "OUTDATED", "IN_REVIEW"].includes(String(current.status))) {
    redirect(`/admin/${def.key}/${encodeURIComponent(id)}?erro=${encodeURIComponent("Despublique (marque como desatualizado) antes de excluir.")}`);
  }
  try {
    await d.delete({ where: { [idField]: id } });
  } catch (e) {
    redirect(`/admin/${def.key}/${encodeURIComponent(id)}?erro=${encodeURIComponent(friendly(e))}`);
  }
  await audit(user.id, "delete", `Excluiu ${def.singular} ${id}`, def.model, id, { snapshot: JSON.parse(JSON.stringify(current)) });
  revalidatePath("/", "layout");
  revalidateTag("content");
  redirect(`/admin/${def.key}?excluido=1`);
}

// ── Links, relatos, usuários, funcionalidades ───────────────────

export async function runLinkCheck(): Promise<void> {
  const user = await assertUser(["ADMIN", "REVIEWER"]);
  const limited = rateLimit(`linkcheck`, 1, 60 * 1000);
  if (!limited.ok) redirect("/admin?erro=" + encodeURIComponent("Verificação já executada há menos de 1 minuto."));
  const results = await checkAllSources(db);
  const broken = results.filter((r) => r.result.status === "BROKEN").length;
  await audit(user.id, "links.check", `Verificou ${results.length} links (${broken} quebrados)`);
  revalidatePath("/", "layout");
  revalidateTag("content");
  redirect(`/admin?links=${results.length}&quebrados=${broken}`);
}

export async function setReportHandled(id: string, handled: boolean) {
  const user = await assertUser(["ADMIN", "REVIEWER"]);
  await db.errorReport.update({ where: { id }, data: { handled } });
  await audit(user.id, "report.handled", `Relato ${id} marcado como ${handled ? "tratado" : "pendente"}`, "errorReport", id);
  revalidatePath("/admin/relatos");
}

export async function deleteReport(id: string) {
  const user = await assertUser(["ADMIN"]);
  await db.errorReport.delete({ where: { id } });
  await audit(user.id, "report.delete", `Relato ${id} excluído (retenção/LGPD)`, "errorReport", id);
  revalidatePath("/admin/relatos");
}

const userSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  name: z.string().trim().min(2).max(120),
  role: z.enum(["ADMIN", "REVIEWER", "EDITOR"]),
  password: z.string().min(PASSWORD_MIN, `A senha precisa de ao menos ${PASSWORD_MIN} caracteres.`).max(200),
});

export async function createUser(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const admin = await assertUser(["ADMIN"]);
    const parsed = userSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
    const u = await db.user.create({
      data: { email: parsed.data.email, name: parsed.data.name, role: parsed.data.role as Role, passwordHash: await hashPassword(parsed.data.password) },
    });
    await audit(admin.id, "user.create", `Criou usuário ${u.email} (${u.role})`, "user", u.id);
    revalidatePath("/admin/usuarios");
    return { ok: true, message: `Usuário ${u.email} criado.` };
  } catch (e) {
    return { ok: false, message: friendly(e) };
  }
}

export async function setUserActive(id: string, active: boolean) {
  const admin = await assertUser(["ADMIN"]);
  if (id === admin.id) return;
  await db.user.update({ where: { id }, data: { active } });
  if (!active) await db.session.deleteMany({ where: { userId: id } });
  await audit(admin.id, "user.active", `Usuário ${id} ${active ? "reativado" : "desativado"}`, "user", id);
  revalidatePath("/admin/usuarios");
}

export async function setFeatureFlag(key: string, _: ActionState, form: FormData): Promise<ActionState> {
  try {
    const admin = await assertUser(["ADMIN"]);
    const enable = form.get("enabled") === "on";
    const legalReviewRef = String(form.get("legalReviewRef") ?? "").trim().slice(0, 300);
    if (enable && legalReviewRef.length < 8) return { ok: false, message: "Para ativar, informe a referência do parecer jurídico (número/protocolo e data)." };
    if (enable && key === "aggregate-metrics" && process.env.AGGREGATE_METRICS_ENABLED !== "true") {
      return { ok: false, message: "Bloqueado pela configuração do servidor (AGGREGATE_METRICS_ENABLED). A ativação exige também decisão técnica explícita no ambiente." };
    }
    if (enable && key === "collective-results" && process.env.COLLECTIVE_RESULTS_ENABLED !== "true") {
      return { ok: false, message: "Bloqueado pela configuração do servidor (COLLECTIVE_RESULTS_ENABLED). A ativação exige também decisão técnica explícita no ambiente." };
    }
    await db.featureFlag.update({
      where: { key },
      data: { enabled: enable, legalReviewRef: legalReviewRef || null, approvedBy: enable ? admin.email : null, approvedAt: enable ? new Date() : null },
    });
    await audit(admin.id, "feature.flag", `${key}: ${enable ? "ativada" : "desativada"}`, "featureFlag", key, { legalReviewRef });
    revalidatePath("/admin/funcionalidades");
    if (key === "aggregate-metrics") {
      resetMetricsCache();
      revalidatePath("/", "layout");
    }
    return { ok: true, message: "Configuração salva." };
  } catch (e) {
    return { ok: false, message: friendly(e) };
  }
}

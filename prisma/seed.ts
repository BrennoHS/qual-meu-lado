/**
 * Seed editorial do DOIS LADOS.
 *
 * Importa o acervo inicial de /content para o banco. É IDEMPOTENTE e
 * SOBRESCREVE o conteúdo editorial (não os usuários). Por segurança,
 * recusa-se a rodar em produção sem SEED_ALLOW_OVERWRITE=true.
 *
 * O status de cada item é calculado pelas mesmas regras usadas no painel:
 * só é publicado o que passa nas regras (ex.: fato com fonte). O resto
 * entra como "Em revisão" — e aparece no painel como pendente de apuração.
 */
import { PrismaClient, type EditorialStatus, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sources } from "../content/sources";
import { claims } from "../content/claims";
import { currents } from "../content/currents";
import { themes } from "../content/themes";
import { timeline } from "../content/timeline";
import { myths, curiosities } from "../content/myths";
import { dimensions, statements } from "../content/affinity";
import { esquerda } from "../content/perspectives/esquerda";
import { direita } from "../content/perspectives/direita";
import { candidates2026, election2026, infoDate } from "../content/candidates-2026";
import { pages, settings } from "../content/pages";
import {
  blocksSchema,
  collectClaimKeys,
  collectCuriositySlugs,
  collectCurrentSlugs,
  collectStatementKeys,
} from "../src/lib/content/blocks";
import { claimPublishIssues, referencedClaimIssues, referencedIssues, type ClaimForRules } from "../src/lib/editorial/rules";

const db = new PrismaClient();
const SEED_DATE = new Date("2026-10-12T12:00:00-03:00");
const pending: string[] = [];

function statusFrom(issues: string[], label: string): EditorialStatus {
  if (issues.length === 0) return "PUBLISHED";
  pending.push(`• ${label}\n    ${issues.join("\n    ")}`);
  return "IN_REVIEW";
}

async function revision(entityType: string, entityId: string, status: EditorialStatus, snapshot: unknown) {
  await db.revision.create({
    data: { entityType, entityId, version: 1, status, snapshot: snapshot as Prisma.InputJsonValue, note: "Importação inicial (seed)" },
  });
}

async function wipe() {
  // Ordem respeita chaves estrangeiras.
  await db.$transaction([
    db.revision.deleteMany(),
    db.declaration.deleteMany(),
    db.proposal.deleteMany(),
    db.candidate.deleteMany(),
    db.election.deleteMany(),
    db.statement.deleteMany(),
    db.dimension.deleteMany(),
    db.chapter.deleteMany(),
    db.perspective.deleteMany(),
    db.themePosition.deleteMany(),
    db.theme.deleteMany(),
    db.current.deleteMany(),
    db.timelineEvent.deleteMany(),
    db.myth.deleteMany(),
    db.curiosity.deleteMany(),
    db.claimSource.deleteMany(),
    db.claim.deleteMany(),
    db.source.deleteMany(),
    db.page.deleteMany(),
    db.siteSetting.deleteMany(),
  ]);
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_OVERWRITE !== "true") {
    throw new Error("Seed bloqueado em produção. Defina SEED_ALLOW_OVERWRITE=true se tiver certeza.");
  }
  console.log("› Limpando conteúdo editorial…");
  await wipe();

  // ── Fontes ──
  console.log(`› ${sources.length} fontes`);
  const sourceIds = new Map<string, string>();
  const sourceRules = new Map<string, ClaimForRules["sources"][number]>();
  for (const s of sources) {
    const status: EditorialStatus = "PUBLISHED";
    const row = await db.source.create({
      data: {
        slug: s.slug,
        title: s.title,
        url: s.url ?? null,
        institution: s.institution,
        author: s.author ?? null,
        kind: s.kind,
        publishedLabel: s.publishedLabel ?? null,
        publishedAt: s.publishedAt ? new Date(s.publishedAt) : null,
        verifiedAt: s.isDemo ? null : SEED_DATE,
        notes: s.notes ?? null,
        linkStatus: s.linkStatus ?? "UNKNOWN",
        linkCheckedAt: s.url ? SEED_DATE : null,
        isDemo: s.isDemo ?? false,
        status,
      },
    });
    sourceIds.set(s.slug, row.id);
    sourceRules.set(s.slug, { slug: s.slug, title: s.title, url: s.url ?? null, kind: s.kind, linkStatus: s.linkStatus ?? "UNKNOWN", isDemo: !!s.isDemo, status });
    await revision("source", row.id, status, s);
  }

  // ── Afirmações ──
  console.log(`› ${claims.length} afirmações`);
  const claimRules = new Map<string, ClaimForRules>();
  for (const c of claims) {
    const missing = c.sources.filter((s) => !sourceIds.has(s.slug)).map((s) => s.slug);
    if (missing.length) throw new Error(`Afirmação ${c.key} referencia fontes inexistentes: ${missing.join(", ")}`);
    const forRules: ClaimForRules = { key: c.key, type: c.type, status: "DRAFT", isDemo: !!c.isDemo, sources: c.sources.map((s) => sourceRules.get(s.slug)!) };
    const status = statusFrom(claimPublishIssues(forRules), `Afirmação ${c.key}`);
    const row = await db.claim.create({
      data: {
        key: c.key,
        text: c.text,
        type: c.type,
        excerpt: c.excerpt ?? null,
        context: c.context ?? null,
        limitations: c.limitations ?? null,
        isDemo: !!c.isDemo,
        status,
        verifiedAt: status === "PUBLISHED" ? SEED_DATE : null,
        sources: { create: c.sources.map((s) => ({ sourceId: sourceIds.get(s.slug)!, locator: s.locator ?? null })) },
      },
    });
    claimRules.set(c.key, { ...forRules, status });
    await revision("claim", row.id, status, c);
  }

  // ── Correntes ──
  for (const [i, c] of currents.entries()) {
    const row = await db.current.create({ data: { ...c, side: c.side ?? null, inBrazil: c.inBrazil ?? null, order: i, status: "PUBLISHED" } });
    await revision("current", row.id, "PUBLISHED", c);
  }

  // ── Temas ──
  for (const [i, t] of themes.entries()) {
    const theme = await db.theme.create({ data: { slug: t.slug, name: t.name, description: t.description, valueConflict: t.valueConflict, order: i, status: "PUBLISHED" } });
    await revision("theme", theme.id, "PUBLISHED", { slug: t.slug, name: t.name });
    for (const [side, p] of [["LEFT", t.left], ["RIGHT", t.right]] as const) {
      const status = statusFrom(referencedClaimIssues(p.claimKeys ?? [], claimRules), `Posição ${t.slug}/${side}`);
      const pos = await db.themePosition.create({ data: { themeId: theme.id, side, summary: p.summary, points: [...p.points], nuances: p.nuances, claimKeys: p.claimKeys ?? [], status } });
      await revision("themePosition", pos.id, status, p);
    }
  }

  // ── Linha do tempo ──
  for (const [i, e] of timeline.entries()) {
    const status = statusFrom(e.claimKey ? referencedClaimIssues([e.claimKey], claimRules) : ["Evento sem afirmação de referência."], `Evento ${e.slug}`);
    const row = await db.timelineEvent.create({ data: { ...e, claimKey: e.claimKey ?? null, order: i, status } });
    await revision("timelineEvent", row.id, status, e);
  }

  // ── Mitos e curiosidades ──
  for (const [i, m] of myths.entries()) {
    const status = statusFrom(m.claimKeys.length ? referencedClaimIssues(m.claimKeys, claimRules) : ["Mito sem afirmação de referência."], `Mito ${m.slug}`);
    const row = await db.myth.create({ data: { ...m, order: i, status } });
    await revision("myth", row.id, status, m);
  }
  for (const c of curiosities) {
    const status = statusFrom(c.claimKey ? referencedClaimIssues([c.claimKey], claimRules) : ["Curiosidade sem fonte — pendente de apuração."], `Curiosidade ${c.slug}`);
    const row = await db.curiosity.create({ data: { ...c, claimKey: c.claimKey ?? null, status } });
    await revision("curiosity", row.id, status, c);
  }

  // ── Mapa de afinidades ──
  const dimIds = new Map<string, string>();
  for (const [i, d] of dimensions.entries()) {
    const row = await db.dimension.create({ data: { ...d, order: i, status: "PUBLISHED" } });
    dimIds.set(d.key, row.id);
    await revision("dimension", row.id, "PUBLISHED", d);
  }
  for (const [i, s] of statements.entries()) {
    const status = statusFrom(referencedClaimIssues(s.claimKeys ?? [], claimRules), `Afirmação do mapa ${s.key}`);
    const { dimension, ...rest } = s;
    const row = await db.statement.create({ data: { ...rest, claimKeys: s.claimKeys ?? [], dimensionId: dimIds.get(dimension)!, order: i, status } });
    await revision("statement", row.id, status, s);
  }

  // ── Perspectivas e capítulos ──
  const statementKeys = new Set(statements.map((s) => s.key));
  const currentSlugs = new Set(currents.map((c) => c.slug));
  const curiositySlugs = new Set(curiosities.map((c) => c.slug));
  for (const p of [esquerda, direita]) {
    const persp = await db.perspective.create({
      data: { slug: p.slug, side: p.side, name: p.name, tagline: p.tagline, heroDescription: p.heroDescription, intro: p.intro, status: "PUBLISHED" },
    });
    await revision("perspective", persp.id, "PUBLISHED", { ...p, chapters: undefined });
    for (const ch of p.chapters) {
      const blocks = blocksSchema.parse(ch.blocks);
      const issues = [
        ...referencedClaimIssues(collectClaimKeys(blocks), claimRules),
        ...referencedIssues("Afirmação do mapa", collectStatementKeys(blocks), statementKeys),
        ...referencedIssues("Corrente", collectCurrentSlugs(blocks), currentSlugs),
        ...referencedIssues("Curiosidade", collectCuriositySlugs(blocks), curiositySlugs),
      ];
      const status = statusFrom(issues, `Capítulo ${p.slug}/${ch.slug}`);
      const row = await db.chapter.create({
        data: { perspectiveId: persp.id, number: ch.number, slug: ch.slug, title: ch.title, kicker: ch.kicker, summary: ch.summary, keyPoints: [...ch.keyPoints], blocks: blocks as Prisma.InputJsonValue, deepDive: ch.deepDive ?? null, status },
      });
      await revision("chapter", row.id, status, { ...ch, blocks });
    }
  }

  // ── Páginas e configurações ──
  for (const pg of pages) {
    const row = await db.page.create({ data: { ...pg, status: "PUBLISHED" } });
    await revision("page", row.id, "PUBLISHED", pg);
  }
  for (const [key, value] of Object.entries(settings)) {
    await db.siteSetting.create({ data: { key, value: value as Prisma.InputJsonValue } });
  }

  // ── Candidaturas reais: 2º turno 2026 ──
  const election = await db.election.create({ data: { ...election2026, isCurrent: true } });
  for (const c of candidates2026) {
    const { proposals, sourceSlug, ...data } = c;
    const planSourceId = sourceIds.get(sourceSlug);
    if (!planSourceId) throw new Error(`Fonte ${sourceSlug} inexistente`);
    const planUrl = sources.find((x) => x.slug === sourceSlug)?.url ?? null;
    const cand = await db.candidate.create({
      data: { ...data, coalition: data.coalition ?? null, history: data.history ?? null, electionId: election.id, isDemo: false, planUrl, officialRegistryUrl: "https://divulgacandcontas.tse.jus.br/divulga/", status: "PUBLISHED" },
    });
    await revision("candidate", cand.id, "PUBLISHED", data);
    for (const [i, p] of proposals.entries()) {
      const row = await db.proposal.create({
        data: { ...p, costs: p.costs ?? null, candidateId: cand.id, sourceId: planSourceId, infoDate: new Date(infoDate), order: i, isDemo: false, status: "PUBLISHED" },
      });
      await revision("proposal", row.id, "PUBLISHED", p);
    }
  }

  // ── Medição agregada de uso (desligada) ──
  await db.featureFlag.upsert({
    where: { key: "aggregate-metrics" },
    update: {},
    create: {
      key: "aggregate-metrics",
      enabled: false,
      notes:
        "Contagem anônima de até onde os reels são vistos (por dia e por tela; nas propostas, só por tema, nunca por candidatura). Sem cookies, IP ou identificadores; números abaixo de 10 ficam ocultos; retenção de 90 dias. Exige AGGREGATE_METRICS_ENABLED=true no servidor, parecer jurídico registrado e atualização da política de privacidade. Os números são de uso interno: não podem ser divulgados nem apresentados como preferência do eleitorado.",
    },
  });

  // ── Funcionalidade condicional: resultados coletivos (desligada) ──
  await db.featureFlag.upsert({
    where: { key: "collective-results" },
    update: {},
    create: {
      key: "collective-results",
      enabled: false,
      notes: "Visualização coletiva de preferências. Requer parecer jurídico (legislação eleitoral e LGPD), metodologia apropriada e confirmação de que não configura enquete eleitoral. Desligada por padrão.",
    },
  });

  // ── Conta administrativa ──
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "";
  if (email && password.length >= 12) {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.upsert({
      where: { email },
      update: {},
      create: { email, name: process.env.SEED_ADMIN_NAME ?? "Administração", passwordHash, role: "ADMIN" },
    });
    console.log(`› Conta administrativa garantida: ${email}`);
  } else {
    console.log("› Conta administrativa NÃO criada (defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD com 12+ caracteres, ou use npm run admin:create).");
  }

  await db.auditLog.create({ data: { action: "seed", summary: "Importação do acervo editorial inicial" } });

  console.log(`\n✓ Seed concluído. ${pending.length} item(ns) ficaram "Em revisão" por não passarem nas regras de publicação:`);
  if (pending.length) console.log(pending.join("\n"));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

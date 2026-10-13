import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { getResource, type Option } from "@/lib/admin/resources";
import { fieldToInput } from "@/lib/admin/form";
import { publishIssues } from "@/lib/editorial/checks";
import { allowedTransitions, type Status } from "@/lib/editorial/status";
import { ResourceForm } from "@/components/admin/resource-form";
import { WorkflowPanel } from "@/components/admin/workflow-panel";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteRecord, saveRecord, transitionRecord } from "../../../actions";

type Delegate = { findUnique: (a: unknown) => Promise<Record<string, unknown> | null>; findMany: (a: unknown) => Promise<Record<string, unknown>[]> };

export default async function EditPage({ params, searchParams }: { params: Promise<{ recurso: string; id: string }>; searchParams: Promise<{ salvo?: string; erro?: string }> }) {
  const user = await requireUser();
  const { recurso, id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const sp = await searchParams;
  const def = getResource(recurso);
  if (!def) notFound();
  const isNew = id === "novo";
  const idField = def.idField ?? "id";
  const d = (db as unknown as Record<string, Delegate>)[def.model];

  const record = isNew
    ? null
    : await d.findUnique({ where: { [idField]: id }, ...(def.model === "claim" ? { include: { sources: { include: { source: { select: { slug: true } } } } } } : {}) });
  if (!isNew && !record) notFound();

  const relationOptions: Record<string, Option[]> = {};
  for (const f of def.fields) {
    if (f.type !== "relation") continue;
    const rows = await (db as unknown as Record<string, Delegate>)[f.model].findMany({ select: { id: true, [f.labelField]: true }, orderBy: { [f.labelField]: "asc" }, take: 500 });
    relationOptions[f.name] = rows.map((r) => ({ value: String(r.id), label: String(r[f.labelField]).slice(0, 100) }));
  }

  const values: Record<string, string> = {};
  for (const f of def.fields) {
    if (!record) continue;
    if (f.type === "claimSources") {
      const links = (record.sources as { locator: string | null; source: { slug: string } }[]) ?? [];
      values[f.name] = links.map((l) => (l.locator ? `${l.source.slug} | ${l.locator}` : l.source.slug)).join("\n");
    } else values[f.name] = fieldToInput(f, record[f.name]);
  }

  const status = (record?.status as Status | undefined) ?? "DRAFT";
  const locked = def.editorial && (status === "PUBLISHED" || status === "VERIFIED") && user.role === "EDITOR";
  const canEdit = !def.editRoles || def.editRoles.includes(user.role);
  const issues = record && def.editorial ? await publishIssues(db, def.model, String(record.id)) : [];
  const revisions = record && def.editorial
    ? await db.revision.findMany({ where: { entityType: def.model, entityId: String(record.id) }, orderBy: { createdAt: "desc" }, take: 30, include: { author: { select: { name: true } } } })
    : [];
  const publicPath = record && def.publicPath ? def.publicPath(record) : null;

  return (
    <div>
      <nav aria-label="Trilha" className="font-mono text-xs text-ash">
        <Link href="/admin" className="hover:underline">Painel</Link> / <Link href={`/admin/${def.key}`} className="hover:underline">{def.label}</Link>
      </nav>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl tracking-tight">
          {isNew ? `Novo(a) ${def.singular}` : String(record![def.titleField] ?? id).slice(0, 80)}
        </h1>
        <div className="flex items-center gap-3">
          {record && def.editorial && <StatusBadge status={status} />}
          {record && def.editorial && <span className="font-mono text-xs text-ash">v{String(record.version)}</span>}
          {publicPath && status === "PUBLISHED" && <Link href={publicPath} target="_blank" className="kicker link-u">Ver publicado ↗</Link>}
        </div>
      </div>
      {sp.salvo && <p role="status" className="mt-4 border border-line p-3 text-sm">Alterações salvas. Uma nova versão foi registrada no histórico.</p>}
      {sp.erro && <p role="alert" className="mt-4 border border-ev-critique p-3 text-sm text-ev-critique">{sp.erro}</p>}
      {record?.isDemo === true && <p className="mt-4 border border-dashed border-ev-critique p-3 text-sm text-ev-critique">Registro demonstrativo (fictício). É exibido no site com aviso.</p>}

      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ResourceForm
          fields={def.fields}
          values={values}
          relationOptions={relationOptions}
          action={saveRecord.bind(null, def.key, isNew ? null : id)}
          submitLabel={isNew ? "Criar rascunho" : "Salvar alterações"}
          editorial={def.editorial}
          disabled={locked || !canEdit}
          disabledReason={
            !canEdit
              ? "Seu papel não permite editar este tipo de conteúdo."
              : locked
                ? "Conteúdo verificado/publicado: só revisores podem editar. Peça para reabrir em revisão."
                : undefined
          }
        />

        {record && (
          <aside className="space-y-6">
            {def.editorial && (
              <WorkflowPanel status={status} allowed={allowedTransitions(user.role, status)} issues={issues} action={transitionRecord.bind(null, def.key, String(record.id))} />
            )}
            {def.editorial && (
              <section aria-labelledby="hist" className="card p-5">
                <h2 id="hist" className="kicker">Histórico de versões</h2>
                <ol className="mt-3 space-y-2 text-sm">
                  {revisions.map((r) => (
                    <li key={r.id} className="border-b border-line pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs">v{r.version}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="text-xs text-ash">{r.author?.name ?? "Sistema"} · {r.createdAt.toLocaleString("pt-BR")}</p>
                      {r.note && <p className="text-xs">{r.note}</p>}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {user.role === "ADMIN" && (
              <form action={deleteRecord.bind(null, def.key, id)} className="card p-5">
                <h2 className="kicker">Excluir</h2>
                <p className="mt-2 text-xs text-ash">Somente rascunhos, itens em revisão ou desatualizados. A exclusão fica registrada na auditoria com uma cópia do conteúdo.</p>
                <button type="submit" className="btn btn-ghost mt-3 min-h-10 border-ev-critique py-2 text-[0.7rem] text-ev-critique hover:bg-ev-critique hover:text-graphite">Excluir definitivamente</button>
              </form>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

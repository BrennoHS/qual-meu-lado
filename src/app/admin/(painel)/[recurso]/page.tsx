import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { getResource } from "@/lib/admin/resources";
import { STATUSES, statusLabel } from "@/lib/editorial/status";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/labels";

type Delegate = { findMany: (a: unknown) => Promise<Record<string, unknown>[]>; count: (a: unknown) => Promise<number> };
const PAGE = 50;

function cell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (v instanceof Date) return formatDate(v);
  if (typeof v === "boolean") return v ? "sim" : "não";
  return String(v).slice(0, 80);
}

export default async function ResourceList({ params, searchParams }: { params: Promise<{ recurso: string }>; searchParams: Promise<{ q?: string; status?: string; p?: string; excluido?: string }> }) {
  await requireUser();
  const { recurso } = await params;
  const def = getResource(recurso);
  if (!def) notFound();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const status = STATUSES.find((s) => s === sp.status);
  const page = Math.max(0, Number(sp.p ?? 0) || 0);
  const idField = def.idField ?? "id";

  const where = {
    ...(q ? { OR: def.searchFields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } })) } : {}),
    ...(def.editorial && status ? { status } : {}),
  };
  const d = (db as unknown as Record<string, Delegate>)[def.model];
  const [rows, total] = await Promise.all([d.findMany({ where, orderBy: def.orderBy, take: PAGE, skip: page * PAGE }), d.count({ where })]);

  // Resolve rótulos de relações exibidas na lista.
  const relFields = def.fields.filter((f) => f.type === "relation" && def.listFields.includes(f.name));
  const relLabels: Record<string, Record<string, string>> = {};
  for (const f of relFields) {
    if (f.type !== "relation") continue;
    const ids = [...new Set(rows.map((r) => r[f.name]).filter(Boolean))] as string[];
    const rel = await (db as unknown as Record<string, Delegate>)[f.model].findMany({ where: { id: { in: ids } } });
    relLabels[f.name] = Object.fromEntries(rel.map((r) => [String(r.id), String(r[f.labelField])]));
  }
  const labelOf = (name: string) => def.fields.find((f) => f.name === name)?.label ?? (name === "linkStatus" ? "Link" : name === "updatedAt" ? "Atualizado" : name);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">{def.group}</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">{def.label}</h1>
          <p className="mt-1 font-mono text-xs text-ash">{total} registro(s)</p>
        </div>
        <Link href={`/admin/${def.key}/novo`} className="btn btn-solid">Novo(a) {def.singular}</Link>
      </div>
      {sp.excluido && <p role="status" className="mt-4 border border-line p-3 text-sm">Registro excluído. A ação foi registrada na auditoria.</p>}

      <form className="mt-6 flex flex-wrap gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Buscar…" aria-label="Buscar" className="h-11 min-w-0 flex-1 border border-line bg-graphite-2 px-3 text-sm focus:border-paper focus:outline-none" />
        {def.editorial && (
          <select name="status" defaultValue={status ?? ""} aria-label="Filtrar por estado" className="h-11 border border-line bg-graphite-2 px-2 text-sm">
            <option value="">Todos os estados</option>
            {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
          </select>
        )}
        <button className="btn btn-ghost min-h-11 py-2">Filtrar</button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="font-mono text-xs uppercase tracking-[0.08em] text-ash">
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4">Título</th>
              {def.listFields.map((f) => <th key={f} scope="col" className="py-2 pr-4">{labelOf(f)}</th>)}
              {def.editorial && <th scope="col" className="py-2 pr-4">Estado</th>}
              {def.editorial && <th scope="col" className="py-2">Versão</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r[idField])} className="border-b border-line align-top hover:bg-graphite-2">
                <td className="max-w-md py-2 pr-4">
                  <Link href={`/admin/${def.key}/${encodeURIComponent(String(r[idField]))}`} className="hover:underline">{cell(r[def.titleField])}</Link>
                  {r.isDemo === true && <span className="ml-2 font-mono text-[0.6rem] uppercase text-ev-critique">demo</span>}
                </td>
                {def.listFields.map((f) => (
                  <td key={f} className="py-2 pr-4 text-paper/80">{relLabels[f] ? relLabels[f][String(r[f])] ?? "—" : cell(r[f])}</td>
                ))}
                {def.editorial && <td className="py-2 pr-4"><StatusBadge status={String(r.status)} /></td>}
                {def.editorial && <td className="py-2 font-mono text-xs text-ash">v{String(r.version)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-8 text-center text-ash">Nenhum registro encontrado.</p>}
      </div>

      {total > PAGE && (
        <nav aria-label="Paginação" className="mt-6 flex justify-between font-mono text-xs">
          {page > 0 ? <Link className="link-u" href={`?q=${q}&status=${status ?? ""}&p=${page - 1}`}>← Anterior</Link> : <span />}
          {(page + 1) * PAGE < total && <Link className="link-u" href={`?q=${q}&status=${status ?? ""}&p=${page + 1}`}>Próxima →</Link>}
        </nav>
      )}
    </div>
  );
}

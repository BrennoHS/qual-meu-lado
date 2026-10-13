import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { RESOURCES } from "@/lib/admin/resources";
import { STATUSES, statusLabel } from "@/lib/editorial/status";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/labels";
import { runLinkCheck } from "../actions";

type CountDelegate = { groupBy: (a: unknown) => Promise<{ status: string; _count: { _all: number } }[]> };
type FindDelegate = { findMany: (a: unknown) => Promise<Record<string, unknown>[]> };

const STALE_DAYS = 180;

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const editorial = RESOURCES.filter((r) => r.editorial);

  const counts = await Promise.all(
    editorial.map(async (r) => {
      const rows = await (db as unknown as Record<string, CountDelegate>)[r.model].groupBy({ by: ["status"], _count: { _all: true } });
      return { r, by: Object.fromEntries(rows.map((x) => [x.status, x._count._all])) as Record<string, number> };
    }),
  );
  const inReview = (
    await Promise.all(
      editorial.map(async (r) => {
        const rows = await (db as unknown as Record<string, FindDelegate>)[r.model].findMany({ where: { status: "IN_REVIEW" }, take: 10, orderBy: { updatedAt: "desc" } });
        return rows.map((row) => ({ r, row }));
      }),
    )
  ).flat();

  const staleDate = new Date(Date.now() - STALE_DAYS * 86400000);
  const [broken, blocked, unchecked, staleClaims, reports, recent, flag] = await Promise.all([
    db.source.findMany({ where: { linkStatus: "BROKEN" }, select: { id: true, title: true, url: true, linkHttpCode: true } }),
    db.source.count({ where: { linkStatus: "BLOCKED" } }),
    db.source.count({ where: { url: { not: null }, linkStatus: "UNKNOWN" } }),
    db.claim.findMany({ where: { status: "PUBLISHED", OR: [{ verifiedAt: null }, { verifiedAt: { lt: staleDate } }] }, select: { id: true, key: true, verifiedAt: true }, take: 20 }),
    db.errorReport.count({ where: { handled: false } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: { select: { name: true } } } }),
    db.featureFlag.findUnique({ where: { key: "collective-results" } }),
  ]);

  return (
    <div className="space-y-12">
      <header>
        <p className="kicker">Visão geral</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Olá, {user.name.split(" ")[0]}.</h1>
        {sp.erro && <p role="alert" className="mt-4 border border-ev-critique p-3 text-sm text-ev-critique">{sp.erro === "permissao" ? "Você não tem permissão para acessar aquela área." : sp.erro}</p>}
        {sp.links && <p role="status" className="mt-4 border border-line p-3 text-sm">Verificação concluída: {sp.links} links, {sp.quebrados} quebrados.</p>}
      </header>

      <section aria-labelledby="pendencias" className="grid gap-4 md:grid-cols-4">
        <h2 id="pendencias" className="sr-only">Pendências</h2>
        {[
          { k: "Em revisão", v: inReview.length, href: "#revisao" },
          { k: "Links quebrados", v: broken.length, href: "#links" },
          { k: "Afirmações a reverificar", v: staleClaims.length, href: "#reverificar" },
          { k: "Relatos não tratados", v: reports, href: "/admin/relatos" },
        ].map((x) => (
          <a key={x.k} href={x.href} className="card p-5 hover:border-paper">
            <p className="kicker">{x.k}</p>
            <p className="mt-2 font-display text-5xl font-bold">{x.v}</p>
          </a>
        ))}
      </section>

      <section aria-labelledby="estado">
        <h2 id="estado" className="font-display text-2xl">Conteúdo por estado editorial</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="font-mono text-xs uppercase tracking-[0.08em] text-ash">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4">Tipo</th>
                {STATUSES.map((s) => <th key={s} scope="col" className="py-2 pr-4">{statusLabel[s]}</th>)}
              </tr>
            </thead>
            <tbody>
              {counts.map(({ r, by }) => (
                <tr key={r.key} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-normal"><Link className="hover:underline" href={`/admin/${r.key}`}>{r.label}</Link></th>
                  {STATUSES.map((s) => (
                    <td key={s} className="py-2 pr-4 font-mono">
                      {by[s] ? <Link className="hover:underline" href={`/admin/${r.key}?status=${s}`}>{by[s]}</Link> : <span className="text-ash">·</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="revisao" aria-labelledby="h-revisao">
        <h2 id="h-revisao" className="font-display text-2xl">Aguardando revisão</h2>
        {inReview.length === 0 ? (
          <p className="mt-3 text-sm text-ash">Nada pendente.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
            {inReview.map(({ r, row }) => (
              <li key={`${r.key}-${row.id}`} className="flex items-center justify-between gap-4 py-2">
                <Link href={`/admin/${r.key}/${row.id}`} className="truncate hover:underline">
                  <span className="kicker mr-2">{r.singular}</span>
                  {String(row[r.titleField] ?? row.id).slice(0, 90)}
                </Link>
                <StatusBadge status="IN_REVIEW" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="links" aria-labelledby="h-links">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="h-links" className="font-display text-2xl">Saúde dos links</h2>
          {user.role !== "EDITOR" && (
            <form action={runLinkCheck}>
              <button type="submit" className="btn btn-ghost">Verificar todos os links agora</button>
            </form>
          )}
        </div>
        <p className="mt-2 text-sm text-ash">{blocked} portais bloqueiam verificação automática (conferência manual) · {unchecked} nunca verificados.</p>
        {broken.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm">
            {broken.map((b) => (
              <li key={b.id} className="border border-ev-critique/40 p-3">
                <Link href={`/admin/fontes/${b.id}`} className="font-medium hover:underline">{b.title}</Link>
                <p className="break-all font-mono text-xs text-ash">{b.url} · HTTP {b.linkHttpCode ?? "sem resposta"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="reverificar" aria-labelledby="h-rev">
        <h2 id="h-rev" className="font-display text-2xl">Afirmações publicadas que precisam de nova verificação</h2>
        <p className="mt-2 text-sm text-ash">Sem data de verificação ou verificadas há mais de {STALE_DAYS} dias.</p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {staleClaims.map((c) => (
            <li key={c.id}><Link href={`/admin/afirmacoes/${c.id}`} className="chip">{c.key} · {formatDate(c.verifiedAt)}</Link></li>
          ))}
          {staleClaims.length === 0 && <li className="text-ash">Nenhuma.</li>}
        </ul>
      </section>

      <section aria-labelledby="h-flag" className="card p-5">
        <h2 id="h-flag" className="font-display text-xl">Resultados coletivos</h2>
        <p className="mt-2 text-sm text-paper/80">
          Estado: <strong>{flag?.enabled ? "ATIVADO" : "desativado"}</strong>. Funcionalidade condicionada a parecer jurídico (legislação eleitoral e LGPD).{" "}
          <Link href="/admin/funcionalidades" className="link-u">Detalhes</Link>
        </p>
      </section>

      <section aria-labelledby="h-audit">
        <h2 id="h-audit" className="font-display text-2xl">Atividade recente</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line text-sm">
          {recent.map((a) => (
            <li key={a.id} className="flex flex-wrap justify-between gap-2 py-2">
              <span>{a.summary}</span>
              <span className="font-mono text-xs text-ash">{a.user?.name ?? "sistema"} · {a.createdAt.toLocaleString("pt-BR")}</span>
            </li>
          ))}
        </ul>
        <Link href="/admin/auditoria" className="kicker link-u mt-3 inline-block">Ver registro completo</Link>
      </section>
    </div>
  );
}

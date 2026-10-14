import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCandidate, getThemes } from "@/lib/content/queries";
import { featuredProposals, toProposalView } from "@/lib/content/candidates";
import { PageFrame } from "@/components/site/page-frame";
import { DemoNotice } from "@/components/candidates/demo-notice";
import { ProposalCard } from "@/components/candidates/proposal-card";
import { ShareButton } from "@/components/ui/share-button";
import { formatDate } from "@/lib/labels";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCandidate(slug);
  return c ? { title: `${c.ballotName} (${c.partyAcronym}) — propostas`, description: c.summary, alternates: { canonical: `/segundo-turno/${slug}` } } : {};
}

export default async function CandidatePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ todas?: string }> }) {
  const { slug } = await params;
  const { todas } = await searchParams;
  const c = await getCandidate(slug);
  if (!c) notFound();
  const themes = await getThemes();
  const themeNames = Object.fromEntries(themes.map((t) => [t.slug, t.name]));
  const all = c.proposals.map((p) => toProposalView(p, themeNames));
  const showAll = todas === "1";
  const list = showAll ? all : featuredProposals(all);

  return (
    <PageFrame kicker={`${c.number ? `Nº ${c.number} · ` : ""}${c.party} (${c.partyAcronym}) · ${c.office}`} title={c.ballotName} lead={c.summary}>
      {c.isDemo && <DemoNotice className="mb-10" />}

      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-8">
          <section>
            <h2 className="kicker mb-2">Nome completo</h2>
            <p>{c.name}</p>
          </section>
          {(c.runningMate || c.coalition) && (
            <section>
              <h2 className="kicker mb-2">Chapa</h2>
              {c.runningMate && <p>Vice: {c.runningMate}</p>}
              {c.coalition && <p className="text-sm text-ash">Coligação: {c.coalition}</p>}
            </section>
          )}
          <section>
            <h2 className="kicker mb-2">Contexto público e trajetória</h2>
            <p className="leading-relaxed text-paper/85">{c.trajectory}</p>
          </section>
          {c.history && (
            <section>
              <h2 className="kicker mb-2">Histórico relevante</h2>
              <p className="leading-relaxed text-paper/85">{c.history}</p>
            </section>
          )}
          <section>
            <h2 className="kicker mb-2">Referências primárias</h2>
            <ul className="space-y-1 text-sm">
              {c.planUrl && <li><a className="link-u" href={c.planUrl} target="_blank" rel="noopener noreferrer">Plano de governo registrado no TSE (PDF) <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></a></li>}
              {c.officialRegistryUrl && <li><a className="link-u" href={c.officialRegistryUrl} target="_blank" rel="noopener noreferrer">Registro de candidatura (DivulgaCandContas) <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></a></li>}
              {!c.officialRegistryUrl && !c.planUrl && <li className="text-ash">Nenhuma (candidatura demonstrativa).</li>}
            </ul>
          </section>
          <p className="font-mono text-xs text-ash">Última atualização: {formatDate(c.updatedAt)}</p>
          <ShareButton title={`${c.ballotName} — propostas`} path={`/quem-defende-o-que/${c.slug}`} />
        </aside>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="h-section">{showAll ? "Todas as propostas" : "Propostas em destaque"}</h2>
            <Link href={showAll ? `/quem-defende-o-que/${c.slug}` : `/quem-defende-o-que/${c.slug}?todas=1`} className="kicker link-u text-paper">
              {showAll ? "Ver só destaques" : `Ver conjunto completo (${all.length})`}
            </Link>
          </div>
          <p className="mt-2 text-sm text-ash">Promessas de campanha são registradas como promessas — não como políticas implementadas.</p>
          <div className="mt-6 space-y-4">
            {list.map((p) => <ProposalCard key={p.id} p={p} />)}
          </div>

          {c.declarations.length > 0 && (
            <section className="mt-14">
              <h2 className="h-section">Declarações públicas, com contexto</h2>
              <ul className="mt-6 space-y-4">
                {c.declarations.map((d) => (
                  <li key={d.id} className="border-l-2 border-paper/50 pl-5">
                    <blockquote className="font-display text-xl">{d.quote}</blockquote>
                    <p className="mt-2 text-sm text-paper/75">{d.context}</p>
                    <p className="mt-1 font-mono text-xs text-ash">
                      {formatDate(d.saidAt)} · {d.source ? (d.source.url ? <a className="link-u" href={d.source.url} target="_blank" rel="noopener noreferrer">{d.source.title}</a> : d.source.title) : "sem fonte"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line pt-6">
        <Link href="/quem-defende-o-que" className="kicker link-u">← Todas as candidaturas</Link>
        <Link href="/segundo-turno" className="kicker link-u text-paper">Duelo de propostas do 2º turno →</Link>
      </div>
    </PageFrame>
  );
}

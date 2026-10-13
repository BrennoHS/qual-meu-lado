import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentElection } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { DemoNotice } from "@/components/candidates/demo-notice";
import { orderForHome } from "@/lib/election";
import { criteriaLabels, formatDate } from "@/lib/labels";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Quem defende o quê?",
  description: "Informações factuais sobre candidaturas e propostas documentadas, com fontes primárias e comparador manual. Sem ranking e sem recomendação.",
  alternates: { canonical: "/quem-defende-o-que" },
};

export default async function CandidatesPage() {
  const election = await getCurrentElection();
  const candidates = orderForHome(election?.candidates ?? []);
  const hasDemo = candidates.some((c) => c.isDemo);

  return (
    <PageFrame
      kicker="Quem defende o quê?"
      title="Propostas, não preferências"
      lead="Candidaturas e suas propostas documentadas, organizadas pelos mesmos critérios para todas. Não ranqueamos, não recomendamos e não sugerimos candidaturas — nem por inteligência artificial."
    >
      {hasDemo && <DemoNotice className="mb-10" />}
      <Link href="/segundo-turno" className="group mb-10 flex items-center justify-between gap-4 border border-paper/40 bg-graphite-2 p-6 hover:border-paper">
        <span>
          <span className="kicker text-ev-pro">2º turno · 25 de outubro</span>
          <span className="mt-1 block font-display text-2xl group-hover:underline">Ver o duelo de propostas, tema por tema →</span>
        </span>
      </Link>
      {election && (
        <p className="kicker mb-6">
          {election.label}
          {election.notes ? <span className="mt-2 block normal-case tracking-normal text-ash">{election.notes}</span> : null}
        </p>
      )}

      {candidates.length === 0 ? (
        <p role="status" className="text-ash">Nenhuma candidatura publicada ainda.</p>
      ) : (
        <>
          <p className="mb-4 font-mono text-xs text-ash">Mesma posição da página inicial; a ordem não indica preferência.</p>
          <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
            {candidates.map((c) => (
              <li key={c.id} className="bg-graphite">
                <Link href={`/quem-defende-o-que/${c.slug}`} className="group flex h-full min-h-64 flex-col p-6 hover:bg-graphite-2">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-ash">{c.number ? `Nº ${c.number} · ` : ""}{c.partyAcronym} · {c.office}</span>
                  <span className="mt-4 font-display text-3xl tracking-tight group-hover:underline">{c.ballotName}</span>
                  <span className="mt-1 text-sm text-ash">{c.name}</span>
                  <span className="mt-4 text-sm text-paper/75">{c.proposals.length} propostas documentadas</span>
                  <span className="mt-auto pt-6 font-mono text-xs text-ash">Atualizado em {formatDate(c.updatedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-line p-6">
            <p className="max-w-xl text-paper/80">Escolha duas ou mais candidaturas e veja as propostas lado a lado, tema por tema.</p>
            <Link href="/quem-defende-o-que/comparar" className="btn btn-solid">Abrir comparador</Link>
          </div>
        </>
      )}

      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="h-section">Como as propostas em destaque são escolhidas</h2>
          <p className="mt-4 text-paper/80">De 4 a 8 propostas por candidatura, pelos mesmos seis critérios públicos, cada um pontuado de 0 a 2. O conjunto completo fica sempre disponível.</p>
          <ul className="rt mt-4">
            {Object.values(criteriaLabels).map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="h-section">O que você encontra em cada proposta</h2>
          <ol className="rt mt-4">
            <li>O que propõe, em linguagem simples</li>
            <li>O que consta na fonte original</li>
            <li>O problema que pretende enfrentar</li>
            <li>Instrumentos necessários</li>
            <li>Benefícios alegados ou documentados</li>
            <li>Críticas fundamentadas e obstáculos</li>
            <li>Custos estimados — só com dados confiáveis</li>
            <li>Situação atual (promessa ≠ política implementada)</li>
            <li>Fonte original com link</li>
            <li>Data da informação</li>
          </ol>
        </div>
      </section>
    </PageFrame>
  );
}

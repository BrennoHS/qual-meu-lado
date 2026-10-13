import Link from "next/link";
import type { Metadata } from "next";
import { getClaims, getCurrentElection, getThemes } from "@/lib/content/queries";
import { toProposalView } from "@/lib/content/candidates";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SourceButton } from "@/components/evidence/source-panel";
import { Countdown } from "./countdown";
import { Duel } from "./duel";
import { orderForHome } from "@/lib/election";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "2º turno 2026: compare as propostas",
  description: "As propostas de Flávio Bolsonaro e Lula lado a lado, em 8 temas, com trechos literais dos planos de governo registrados no TSE. Sem ranking e sem recomendação de voto.",
  alternates: { canonical: "/segundo-turno" },
  openGraph: { images: [{ url: "/og/tema/geral", width: 1200, height: 630 }] },
};

export default async function SecondRoundPage() {
  const [election, themes, claims] = await Promise.all([getCurrentElection(), getThemes(), getClaims(["eleicao-2026-1turno"])]);
  const themeNames = Object.fromEntries(themes.map((t) => [t.slug, t.name]));
  const candidates = orderForHome(election?.candidates ?? []).map((c) => ({
    slug: c.slug,
    ballotName: c.ballotName,
    name: c.name,
    party: c.party,
    partyAcronym: c.partyAcronym,
    number: c.number,
    runningMate: c.runningMate,
    proposals: c.proposals.map((p) => toProposalView(p, themeNames)),
  }));

  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="overflow-x-clip">
        <section className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(60% 80% at 50% 0%, #2a2d36, transparent 70%)" }} />
          <div className="wrap relative grid gap-10 py-14 md:grid-cols-[1.5fr_1fr] md:items-end md:py-20">
            <div>
              <p className="kicker text-ev-pro">Eleições 2026 · 2º turno presidencial</p>
              <h1 className="display mt-4 text-[clamp(2.6rem,8.5vw,6.5rem)]">Duas propostas de país.</h1>
              <p className="mt-6 max-w-xl text-lg text-paper/80">
                O que cada candidatura promete, tema por tema — com o trecho exato do plano de governo registrado no TSE, os pontos de atenção e a página da fonte.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ash">
                <span>{election?.notes}</span>
                <SourceButton claim={claims["eleicao-2026-1turno"]} label="Fonte do resultado" />
              </div>
            </div>
            <Countdown />
          </div>
        </section>

        <div className="wrap py-12 md:py-16">
          {candidates.length >= 2 ? <Duel candidates={candidates} /> : <p className="text-ash">Candidaturas em revisão editorial.</p>}

          <aside className="mt-16 grid gap-6 border-t border-line pt-10 md:grid-cols-3">
            <div>
              <p className="kicker">Como escolhemos</p>
              <p className="mt-2 text-sm text-paper/80">Uma proposta em destaque por tema para cada candidatura, pelos mesmos critérios públicos. As demais ficam a um toque.</p>
            </div>
            <div>
              <p className="kicker">O que não fazemos</p>
              <p className="mt-2 text-sm text-paper/80">Não damos nota, não ranqueamos e não dizemos em quem votar. Promessa de campanha não é política implementada.</p>
            </div>
            <div>
              <p className="kicker">Ainda em dúvida sobre as ideias?</p>
              <p className="mt-2 text-sm text-paper/80">
                <Link href="/explorar/esquerda" className="link-u text-paper">Explore a esquerda</Link>, <Link href="/explorar/direita" className="link-u text-paper">a direita</Link> ou{" "}
                <Link href="/afinidades" className="link-u text-paper">descubra suas afinidades</Link>.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter sponsor={false} />
    </>
  );
}

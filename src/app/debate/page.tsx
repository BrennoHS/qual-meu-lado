import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Brand } from "@/components/site/site-header";
import { ProposalThemes } from "@/components/site/proposal-themes";
import { DebatePlayer } from "./debate-player";

/**
 * Debate do 2º turno, em tela cheia: a transmissão OFICIAL da emissora,
 * incorporada pelo player do YouTube (nada é retransmitido por nós), e uma
 * "segunda tela" com as propostas dos dois candidatos por tema.
 * Para trocar de transmissão, mude só o VIDEO_ID.
 */
const VIDEO_ID = "Gqc1rQtzWUk";
const TITLE = "Debate do 2º turno na Band — Lula × Flávio Bolsonaro";

export const metadata: Metadata = {
  title: "Debate do 2º turno ao vivo: Lula × Flávio Bolsonaro",
  description: "Assista ao debate da Band ao vivo e compare, ao mesmo tempo, as propostas dos dois candidatos por tema, com o trecho do plano de governo.",
  alternates: { canonical: "/debate" },
};

export default function DebatePage() {
  return (
    <div className="flex min-h-svh flex-col bg-graphite">
      <header className="flex items-center justify-between gap-3 border-b border-line px-[var(--gutter)] py-3">
        <Brand />
        <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ash hover:text-paper">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Voltar ao site
        </Link>
      </header>

      <main id="conteudo" className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="debate-titulo" className="flex flex-col justify-center bg-black/40 lg:min-h-0">
          <div className="mx-auto w-full max-w-[calc((100svh-9rem)*16/9)]">
            <DebatePlayer id={VIDEO_ID} title={TITLE} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-[var(--gutter)] py-3">
            <h1 id="debate-titulo" className="font-display text-base tracking-tight md:text-lg">
              <span className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-[#e5484d] px-2 py-0.5 align-middle font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Ao vivo
              </span>
              {TITLE}
            </h1>
            <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ash hover:text-paper">
              Assistir no YouTube <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="px-[var(--gutter)] pb-4 text-xs text-ash">
            Transmissão oficial da Band, pelo YouTube. O DOIS LADOS não comenta nem avalia o debate. O vídeo só carrega quando você clica em assistir.
          </p>
        </section>

        {/* segunda tela: o que cada um propõe, tema por tema */}
        <aside aria-labelledby="segunda-tela" className="border-t border-line p-[var(--gutter)] lg:max-h-[calc(100svh-3.6rem)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-5">
          <p className="kicker text-ash">Enquanto assiste</p>
          <h2 id="segunda-tela" className="mt-1 font-display text-xl tracking-tight">O que cada um propõe?</h2>
          <p className="mt-1 text-sm text-paper/70">Toque num tema para ver as propostas lado a lado, com o trecho do plano registrado no TSE. Abre em outra aba.</p>
          <div className="mt-4">
            <ProposalThemes newTab compact />
          </div>
          <Link href="/afinidades" target="_blank" className="btn btn-afinidade mt-5 w-full justify-center">
            Descobrir minha afinidade
          </Link>
        </aside>
      </main>
    </div>
  );
}

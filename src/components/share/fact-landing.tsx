import Link from "next/link";
import type { ClaimView } from "@/lib/content/queries";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SourceButton } from "@/components/evidence/source-panel";
import { ShareRow } from "./share-row";

/**
 * Página de destino de um card compartilhado ("Você sabia?" ou "Fato com
 * fonte"): a frase, a fonte e o convite para conhecer os dois lados.
 */
export function FactLanding({ kicker, text, claim, path, story, fileName }: { kicker: string; text: string; claim: ClaimView | null; path: string; story: string; fileName: string }) {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="wrap-text py-16 md:py-24">
        <p className="inline-block -rotate-2 border-2 border-paper px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.18em]">{kicker}</p>
        <h1 className="mt-8 font-display text-[clamp(1.8rem,5vw,3rem)] leading-tight tracking-tight">{text}</h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {claim && <SourceButton claim={claim} />}
          <ShareRow path={path} title={`${kicker.charAt(0)}${kicker.slice(1).toLowerCase()} · DOIS LADOS`} text={`${text} Veja a fonte e os dois lados:`} storyHref={story} fileName={fileName} />
        </div>
        <div className="mt-14 border border-line bg-graphite-2 p-6 md:p-8">
          <p className="font-display text-2xl tracking-tight">Esquerda ou direita? Entenda os dois lados.</p>
          <p className="mt-2 text-paper/75">O que cada lado defende, os melhores argumentos e as críticas — em telas curtas, com fontes e sem torcida.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-solid">Conhecer os dois lados</Link>
            <Link href="/afinidades" className="btn">Descobrir minha afinidade</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

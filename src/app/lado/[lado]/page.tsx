import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Hand, Lock, Timer } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { clampMeter, identifyPrefix, isSideSlug, SIDE_SHARE } from "@/lib/choice";

type Props = { params: Promise<{ lado: string }>; searchParams: Promise<{ p?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lado } = await params;
  const { p } = await searchParams;
  if (!isSideSlug(lado)) return {};
  const c = SIDE_SHARE[lado];
  const meter = clampMeter(p ?? 50);
  const word = `${c.word.charAt(0)}${c.word.slice(1).toLowerCase()}`;
  const title = `${identifyPrefix(lado)} ${word} — teste de afinidade DOIS LADOS`;
  return {
    title: { absolute: title },
    description: `“${c.belief}” E você? Faça o teste de afinidade política do DOIS LADOS: 4 minutos, sem cadastro, nada sai do seu celular.`,
    robots: { index: false, follow: true },
    openGraph: { title, description: c.belief, images: [{ url: `/og/lado/${lado}?p=${meter}`, width: 1200, height: 630 }] },
  };
}

/** O que quem recebe o card vê: de onde veio o teste — e um convite claro para fazer o próprio. */
export default async function SharedSide({ params, searchParams }: Props) {
  const { lado } = await params;
  const { p } = await searchParams;
  if (!isSideSlug(lado)) notFound();
  const c = SIDE_SHARE[lado];
  const meter = clampMeter(p ?? 50);
  const bg = lado === "esquerda" ? "var(--color-esq-deep)" : lado === "direita" ? "var(--color-dir-deep)" : "#3a2742";
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(90% 80% at 50% 0%, ${bg}, transparent 70%)` }} />
        <div className="wrap relative grid gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:py-24">
          <div className="text-center md:text-left">
            <p className="kicker">Alguém fez o teste de afinidade política do DOIS LADOS</p>
            <p className="mt-6 font-mono text-sm uppercase tracking-[0.25em] text-paper/80">{identifyPrefix(lado)}</p>
            <h1 className="display mt-2 whitespace-nowrap text-[clamp(3.4rem,15vw,9rem)] leading-none" style={{ color: c.ink }}>
              {c.word}
            </h1>
            <div className="mx-auto mt-8 max-w-xl md:mx-0">
              <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,var(--color-esq-ink),var(--color-paper),var(--color-dir-ink))]">
                <span className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-paper bg-graphite" style={{ left: `${meter}%` }} />
              </div>
              <div className="mt-3 flex justify-between font-mono text-xs tracking-[0.15em] text-ash">
                <span>ESQUERDA</span>
                <span>CENTRO</span>
                <span>DIREITA</span>
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-2xl font-display text-[clamp(1.2rem,3vw,1.7rem)] leading-snug md:mx-0">“{c.belief}”</p>
          </div>

          {/* convite: o motivo de quem chegou aqui */}
          <div className="border border-paper/25 bg-graphite/80 p-6 backdrop-blur md:p-8">
            <p className="kicker">E você?</p>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">Descubra com que lado você se identifica.</h2>
            <ul className="mt-6 space-y-3 text-paper/90">
              <li className="flex gap-3">
                <Hand aria-hidden className="mt-0.5 h-5 w-5 shrink-0" /> 24 afirmações: sim, não ou depende.
              </li>
              <li className="flex gap-3">
                <Timer aria-hidden className="mt-0.5 h-5 w-5 shrink-0" /> Uns 4 minutos, sem cadastro.
              </li>
              <li className="flex gap-3">
                <Lock aria-hidden className="mt-0.5 h-5 w-5 shrink-0" /> Suas respostas ficam só no seu celular.
              </li>
            </ul>
            <Link href="/afinidades" className="btn btn-afinidade mt-8 w-full">
              Fazer o teste agora <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <p className="mt-4 text-center text-sm text-ash">
              Antes, se quiser: <Link href="/explorar/esquerda" className="underline">conheça a esquerda</Link> e <Link href="/explorar/direita" className="underline">a direita</Link>.
            </p>
          </div>
        </div>
        <p className="wrap relative pb-12 text-center text-xs text-ash md:text-left">
          Indicador individual, calculado só no aparelho de quem fez o teste. Não é pesquisa, não é previsão de voto e o DOIS LADOS não guarda respostas.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { TLink } from "@/components/transition/transition-provider";
import { CHOICE_SHARE, isChoiceSlug, type ChoiceSlug } from "@/lib/choice";

export const dynamicParams = false;
export function generateStaticParams() {
  return (Object.keys(CHOICE_SHARE) as ChoiceSlug[]).map((escolha) => ({ escolha }));
}

export async function generateMetadata({ params }: { params: Promise<{ escolha: string }> }): Promise<Metadata> {
  const { escolha } = await params;
  if (!isChoiceSlug(escolha)) return {};
  const c = CHOICE_SHARE[escolha];
  return {
    title: c.headline,
    description: `“${c.belief}” E você? Conheça os dois lados e descubra o seu.`,
    robots: { index: false, follow: true },
    openGraph: { title: c.headline, description: c.belief, images: [{ url: `/og/escolha/${escolha}`, width: 1200, height: 630 }] },
  };
}

/** O que quem recebe o link compartilhado vê: a frase + um convite para conhecer OS DOIS lados. */
export default async function SharedChoice({ params }: { params: Promise<{ escolha: string }> }) {
  const { escolha } = await params;
  if (!isChoiceSlug(escolha)) notFound();
  const c = CHOICE_SHARE[escolha];
  const side = c.tone === "esquerda" || c.tone === "direita" ? c.tone : undefined;
  return (
    <>
      <SiteHeader />
      <main id="conteudo" data-side={side} className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(80% 70% at 50% 0%, var(--accent-deep), transparent 70%)" }} />
        <div className="wrap-text relative py-20 text-center md:py-28">
          <p className="kicker text-[var(--accent-ink)]">Alguém compartilhou com você</p>
          <h1 className="display mt-4 text-[clamp(2.2rem,7vw,4.5rem)]">{c.headline}</h1>
          <p className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.3rem,3.4vw,2rem)] leading-snug">“{c.belief}”</p>
          <p className="mx-auto mt-10 max-w-xl text-lg text-paper/80">
            E você? Aqui você conhece o que a esquerda e a direita defendem — os melhores argumentos e as críticas, com fontes — e decide por conta própria.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <TLink href="/explorar/esquerda" scene={{ label: "Esquerda", sub: "Capítulo 1 · De onde veio?", tone: "esquerda", number: "1" }} className="btn" data-side="esquerda">
              Explorar a esquerda
            </TLink>
            <TLink href="/explorar/direita" scene={{ label: "Direita", sub: "Capítulo 1 · De onde veio?", tone: "direita", number: "1", from: "right" }} className="btn" data-side="direita">
              Explorar a direita
            </TLink>
            <TLink href="/afinidades" scene={{ label: "Sua afinidade", sub: "24 afirmações · sim ou não", tone: "neutral" }} className="btn btn-afinidade">
              Fazer o teste de afinidade
            </TLink>
          </div>
          <p className="mt-10 text-xs text-ash">O DOIS LADOS não guarda escolhas nem respostas. Esta página só mostra a frase que a pessoa decidiu compartilhar.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

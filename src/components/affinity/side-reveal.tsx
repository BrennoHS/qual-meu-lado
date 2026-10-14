"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { OverallResult } from "@/lib/affinity/score";
import { identifyPrefix, SIDE_SHARE } from "@/lib/choice";
import { Scale } from "@/components/art/illustrations";
import { ShareChip } from "@/components/reel/share-chip";
import { haptic } from "@/lib/haptics";
import { ArrowRight } from "lucide-react";

const THEME = {
  esquerda: { bg: "linear-gradient(165deg, #b72e38 0%, #641c27 45%, #160b0e 100%)", data: "esquerda" as const },
  direita: { bg: "linear-gradient(195deg, #2455a4 0%, #142d59 45%, #0b1226 100%)", data: "direita" as const },
  centro: { bg: "linear-gradient(135deg, #8e2a35 0%, #3a2742 50%, #1f3f7a 100%)", data: undefined },
};

const CONFETTI = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  const r = 160 + (i % 4) * 70;
  return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r * 0.7), rot: (i * 53) % 360, w: i % 3 === 0 ? 10 : 6 };
});

/** Tela final do mapa: o lado em letras gigantes, a posição no trilho e o card para compartilhar. */
export function SideReveal({ result, total, answered }: { result: OverallResult; total: number; answered: number }) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(!!reduce);
  // se a imagem do card falhar, some com a moldura e o download (o link continua)
  const [cardFailed, setCardFailed] = useState(false);
  const c = SIDE_SHARE[result.side];
  const t = THEME[result.side];

  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => {
      setRevealed(true);
      haptic("success");
    }, 1500);
    return () => window.clearTimeout(id);
  }, [reduce]);

  const strengthText =
    result.side === "centro"
      ? "Suas respostas ficaram equilibradas entre as ideias dos dois lados."
      : `Afinidade ${result.strength} com ideias associadas à ${result.side}.`;
  const confettiColors = result.side === "esquerda" ? ["#f08a91", "#b72e38", "#f5f3ee"] : result.side === "direita" ? ["#8db0f0", "#2455a4", "#f5f3ee"] : ["#f08a91", "#8db0f0", "#f5f3ee"];
  const sharePath = `/lado/${result.side}?p=${result.meter}`;
  const storyUrl = `/og/lado/${result.side}?p=${result.meter}&formato=story`;

  return (
    <section data-side={t.data} className="relative overflow-hidden" aria-live="polite">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <m.div key="calc" exit={{ opacity: 0, scale: 0.9 }} className="grid min-h-[80svh] place-items-center bg-graphite">
            <div className="text-center">
              <m.div animate={{ rotate: [-14, 14, -10, 10, -4, 4, 0] }} transition={{ duration: 1.4, ease: "easeInOut" }} className="mx-auto w-fit">
                <Scale className="h-28 w-36 text-paper" />
              </m.div>
              <p className="kicker mt-6 text-paper">Comparando suas {answered} respostas com as ideias de cada lado…</p>
            </div>
          </m.div>
        ) : (
          <m.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative" style={{ background: t.bg }}>
            {/* confete */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%]">
              {CONFETTI.map((p, i) => (
                <m.span
                  key={i}
                  className="absolute block"
                  style={{ width: p.w, height: p.w * 1.8, background: confettiColors[i % 3] }}
                  initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                  animate={{ x: p.x, y: [0, p.y, p.y + 120], opacity: [0, 1, 0], rotate: p.rot }}
                  transition={{ duration: 1.8, delay: 0.5 + (i % 5) * 0.03, ease: "easeOut" }}
                />
              ))}
            </div>

            <div className="wrap relative grid min-h-[86svh] items-center gap-10 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
              <div className="text-center md:text-left">
                <m.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-sm uppercase tracking-[0.35em] text-paper/85">
                  {identifyPrefix(result.side)}
                </m.p>
                <h1 className="display mt-2 whitespace-nowrap text-[clamp(3.6rem,18vw,6rem)] leading-[0.85] md:text-[clamp(4rem,8.6vw,9rem)]" aria-label={c.word}>
                  {c.word.split("").map((ch, i) => (
                    <m.span
                      key={i}
                      aria-hidden
                      className="inline-block"
                      initial={{ y: "60%", opacity: 0, scale: 1.6, filter: "blur(8px)" }}
                      animate={{ y: "0%", opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300, damping: 18 }}
                    >
                      {ch}
                    </m.span>
                  ))}
                </h1>
                <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 text-lg text-paper/90">
                  {strengthText}
                </m.p>

                {/* trilho esquerda — centro — direita */}
                <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mx-auto mt-8 max-w-xl md:mx-0">
                  <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,var(--color-esq-ink),var(--color-paper),var(--color-dir-ink))]">
                    <m.span
                      className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-paper bg-graphite shadow-[0_0_0_8px_rgba(245,243,238,0.15)]"
                      initial={{ left: "50%" }}
                      animate={{ left: `${result.meter}%` }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 70, damping: 12 }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between font-mono text-xs tracking-[0.15em] text-paper/75">
                    <span>ESQUERDA</span>
                    <span>CENTRO</span>
                    <span>DIREITA</span>
                  </div>
                </m.div>

                <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 max-w-2xl font-display text-[clamp(1.3rem,3vw,1.9rem)] leading-snug">
                  “{c.belief}”
                </m.p>
              </div>

              {/* card para os stories */}
              <m.div
                initial={{ opacity: 0, y: 40, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ delay: 1.7, type: "spring", stiffness: 120, damping: 14 }}
                className="mx-auto w-full max-w-[16rem]"
              >
                {!cardFailed && (
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-paper/40 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                  <Image src={storyUrl} alt={`Card para stories: ${identifyPrefix(result.side).toLowerCase()} ${c.word.toLowerCase()}`} fill sizes="256px" unoptimized className="object-cover" onError={() => setCardFailed(true)} />
                  </div>
                )}
                <div className="mt-5 flex flex-col items-center gap-2">
                  {!cardFailed && (
                    <a href={storyUrl} download={`dois-lados-afinidade-${result.side}.png`} onClick={() => haptic("tap")} className="btn btn-solid w-full">
                      Baixar para os stories
                    </a>
                  )}
                  <ShareChip path={sharePath} title={`${identifyPrefix(result.side)} ${c.word.toLowerCase()} · DOIS LADOS`} text={`${identifyPrefix(result.side)} ${c.word}. “${c.belief}” E você? Faça o teste de afinidade do DOIS LADOS:`} label="Compartilhar no WhatsApp ou link" />
                </div>
              </m.div>
            </div>

            <div className="wrap relative flex flex-wrap items-center justify-between gap-3 pb-8 text-xs text-paper/70">
              <span className="max-w-3xl">
                Indicador individual, calculado a partir das suas {answered} respostas em {result.basedOn} temas. Não é pesquisa, não é previsão de voto e não mede a opinião de mais ninguém. Compartilhar mostra sua opinião a quem receber — faça só se quiser.
              </span>
              <span className="flex gap-4">
                <Link href="/afinidades" className="underline">Revisar respostas</Link>
                <a href="#dimensoes" className="underline">Ver tema por tema</a>
              </span>
            </div>

            {/* E agora? — nunca deixar a pessoa sem saída */}
            <div className="relative border-t border-paper/20 bg-graphite/40">
              <div className="wrap grid gap-3 py-8 md:grid-cols-3">
                <p className="kicker md:col-span-3">E agora?</p>
                <Link href="/segundo-turno" className="group flex items-center justify-between gap-3 border border-paper/30 bg-graphite/60 p-4 hover:border-paper">
                  <span>
                    <span className="block font-display text-lg">Ver as propostas do 2º turno</span>
                    <span className="block text-sm text-paper/70">O que cada candidatura promete, tema por tema.</span>
                  </span>
                  <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href={`/explorar/${result.side === "direita" ? "esquerda" : "direita"}`} className="group flex items-center justify-between gap-3 border border-paper/30 bg-graphite/60 p-4 hover:border-paper">
                  <span>
                    <span className="block font-display text-lg">Conhecer melhor o outro lado</span>
                    <span className="block text-sm text-paper/70">Os melhores argumentos de quem pensa diferente.</span>
                  </span>
                  <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/sua-escolha" className="group flex items-center justify-between gap-3 border border-paper/30 bg-graphite/60 p-4 hover:border-paper">
                  <span>
                    <span className="block font-display text-lg">Não se reconhece?</span>
                    <span className="block text-sm text-paper/70">Diga com suas palavras com que lado você se identifica.</span>
                  </span>
                  <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}

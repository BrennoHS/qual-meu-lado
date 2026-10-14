"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { ClaimView } from "@/lib/content/queries";
import { verdictLabel } from "@/lib/labels";
import { SourceButton } from "@/components/evidence/source-panel";
import { Vignette } from "@/components/art/dimension-art";
import { haptic } from "@/lib/haptics";

export type MythCard = { slug: string; statement: string; verdict: string; explanation: string; claimKeys: string[] };

/** O palpite tem 3 opções simples; o veredito mostrado é sempre o completo (5 categorias). */
type Guess = "true" | "depends" | "false";
const GUESSES: { g: Guess; label: string }[] = [
  { g: "true", label: "Verdade" },
  { g: "depends", label: "Depende" },
  { g: "false", label: "Mito" },
];
const verdictToGuess = (v: string): Guess => (v === "CONFIRMED" ? "true" : v === "FALSE" ? "false" : "depends");
const verdictColor = (v: string) => (v === "CONFIRMED" ? "var(--color-ev-pro)" : v === "FALSE" ? "var(--color-ev-critique)" : "var(--color-ev-unconfirmed)");

/**
 * "É fato?" como um baralho: uma afirmação por vez, palpite em um toque, o
 * cartão vira com o veredito e a fonte, e a próxima entra. Sem placar e nada
 * é enviado — o objetivo é conferir o raciocínio. Afirmações falsas não são
 * tratadas como "o outro lado" de um debate.
 * mode="teaser": uma carta só (home), com o convite para ver as outras.
 */
export function MythDeck({ myths, claims, mode = "deck", moreCount = 0 }: { myths: MythCard[]; claims: Record<string, ClaimView>; mode?: "deck" | "teaser"; moreCount?: number }) {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState<Guess | null>(null);
  const myth = myths[i];
  if (!myth) return null;
  const last = i >= myths.length - 1;

  function answer(g: Guess) {
    haptic(verdictToGuess(myth.verdict) === g ? "success" : "tap");
    setGuess(g);
  }
  function next() {
    haptic("tap");
    setGuess(null);
    setI((v) => (v + 1) % myths.length);
  }

  return (
    <div>
      {mode === "deck" && (
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs text-ash">
            {i + 1} de {myths.length}
          </span>
          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-paper/15">
            <m.span className="block h-full bg-paper" animate={{ width: `${((i + (guess ? 1 : 0)) / myths.length) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }} />
          </span>
        </div>
      )}

      <div className="relative">
        {/* cartas por baixo: sensação de baralho */}
        {mode === "deck" &&
          [0, 1].map((k) => (
            <span key={k} aria-hidden className="absolute inset-0 border border-line bg-graphite-2" style={{ transform: `translate(${(k + 1) * 7}px, ${(k + 1) * 7}px)`, opacity: 0.55 - k * 0.25 }} />
          ))}
        <AnimatePresence mode="wait" initial={false}>
          <m.article
            key={myth.slug}
            initial={{ x: 90, rotate: 4, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            exit={{ x: -90, rotate: -4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 170, damping: 20 }}
            className="relative border border-paper/25 bg-graphite-2 p-6 md:p-9"
            aria-label={`Afirmação ${i + 1}`}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="kicker text-ash">É fato?</p>
              <span className="h-12 w-[4.5rem] shrink-0 text-paper/70">
                <Vignette key={`${myth.slug}-${!!guess}`} name={guess ? "fato" : "lupa"} className="h-12 w-[4.5rem]" />
              </span>
            </div>
            <p className="mt-2 font-display text-[clamp(1.35rem,3.4vw,2.2rem)] leading-tight tracking-tight">“{myth.statement}”</p>

            <AnimatePresence mode="wait" initial={false}>
              {!guess ? (
                <m.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid grid-cols-3 gap-2 sm:max-w-md">
                  {GUESSES.map((o) => (
                    <m.button
                      key={o.g}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => answer(o.g)}
                      className={`min-h-14 border font-display text-lg transition-colors ${o.g === "depends" ? "border-paper/30 text-paper/85 hover:border-paper" : "border-paper/60 hover:bg-paper hover:text-graphite"}`}
                    >
                      {o.label}
                    </m.button>
                  ))}
                </m.div>
              ) : (
                <m.div key="answer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6" aria-live="polite">
                  <div className="flex flex-wrap items-center gap-3">
                    <m.span
                      initial={{ scale: 1.6, rotate: -10, opacity: 0 }}
                      animate={{ scale: 1, rotate: -3, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="inline-block border-2 px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.16em]"
                      style={{ borderColor: verdictColor(myth.verdict), color: verdictColor(myth.verdict) }}
                    >
                      {verdictLabel[myth.verdict] ?? myth.verdict}
                    </m.span>
                    <span className="font-mono text-xs text-ash">
                      {verdictToGuess(myth.verdict) === guess ? "Seu palpite bateu." : `Você disse: ${GUESSES.find((o) => o.g === guess)?.label}.`}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl leading-relaxed text-paper/85">{myth.explanation}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {mode === "deck" ? (
                      <button type="button" onClick={next} className="btn btn-solid">
                        {last ? "Recomeçar" : "Próxima"} {last ? <RotateCcw aria-hidden className="h-4 w-4" /> : <ArrowRight aria-hidden className="h-4 w-4" />}
                      </button>
                    ) : (
                      <Link href="/mitos" className="btn btn-solid">
                        Mais {moreCount} afirmações <ArrowRight aria-hidden className="h-4 w-4" />
                      </Link>
                    )}
                    {myth.claimKeys.map((k) => claims[k] && <SourceButton key={k} claim={claims[k]} />)}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

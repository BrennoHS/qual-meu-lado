"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, Lock, RotateCcw } from "lucide-react";
import { setAnswer, useJourney } from "@/lib/journey/store";
import type { Answer } from "@/lib/affinity/score";
import { Vignette } from "@/components/art/dimension-art";
import { haptic } from "@/lib/haptics";

type Q = { key: string; text: string; dimensionKey: string; dimensionName: string };

const OPTIONS: { a: Answer; label: string; stamp: string }[] = [
  { a: "agree", label: "Sim", stamp: "Concordo" },
  { a: "depends", label: "Depende", stamp: "Depende" },
  { a: "disagree", label: "Não", stamp: "Discordo" },
];

/**
 * Uma afirmação do teste direto na home: um toque e a pessoa já começou.
 * A resposta vai para o mesmo lugar do teste (só neste navegador) e conta
 * para o indicador; depois, o convite para seguir.
 */
export function QuickQuestion({ statements, total }: { statements: Q[]; total: number }) {
  const { answers } = useJourney();
  const [ready, setReady] = useState(false);
  const [just, setJust] = useState<{ key: string; a: Answer } | null>(null);
  useEffect(() => setReady(true), []);

  const answered = ready ? Object.keys(answers).length : 0;
  const pending = statements.filter((s) => !(ready && answers[s.key]));
  const q = just ? statements.find((s) => s.key === just.key) : pending[0];

  function answer(a: Answer) {
    if (!q) return;
    haptic("tap");
    setAnswer(q.key, a);
    setJust({ key: q.key, a });
  }

  // já respondeu as primeiras: só o convite para continuar
  if (!q) {
    return (
      <div className="border border-line bg-graphite-2 p-6 md:p-8">
        <p className="font-display text-2xl tracking-tight md:text-3xl">Você já começou o teste.</p>
        <p className="mt-2 text-paper/75">
          {answered} de {total} afirmações respondidas.
        </p>
        <Link href="/afinidades" className="btn btn-solid mt-6">
          Continuar de onde parei <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const stamp = just && OPTIONS.find((o) => o.a === just.a)?.stamp;
  return (
    <div className="relative overflow-hidden border border-line bg-graphite-2 p-6 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="kicker text-ash">Tema: {q.dimensionName}</p>
        <span className="h-10 w-16 text-paper/70">
          <Vignette key={q.key} name={q.dimensionKey} className="h-10 w-16" />
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={q.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-tight tracking-tight"
        >
          “{q.text}”
        </m.p>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {!just ? (
          <m.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-7">
            <p className="text-paper/75">Você concorda?</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:max-w-md">
              {OPTIONS.map((o) => (
                <m.button
                  key={o.a}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => answer(o.a)}
                  className={`min-h-14 border font-display text-lg transition-colors ${o.a === "depends" ? "border-paper/30 text-paper/85 hover:border-paper" : "border-paper/60 hover:bg-paper hover:text-graphite"}`}
                >
                  {o.label}
                </m.button>
              ))}
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ash">
              <Lock aria-hidden className="h-3.5 w-3.5" /> Sua resposta fica só neste navegador.
            </p>
          </m.div>
        ) : (
          <m.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-7">
            <m.span
              initial={{ scale: 1.6, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: -4, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="inline-block border-2 border-paper px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.2em]"
            >
              {stamp}
            </m.span>
            <p className="mt-4 max-w-xl text-lg text-paper/85">
              Anotado: isso já conta para o seu indicador. Faltam {Math.max(0, total - answered)} afirmações para descobrir com que lado você se identifica mais.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/afinidades" className="btn btn-solid">
                Continuar o teste <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              {pending.length > 0 && (
                <button type="button" onClick={() => setJust(null)} className="btn btn-ghost">
                  <RotateCcw aria-hidden className="h-4 w-4" /> Outra pergunta
                </button>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

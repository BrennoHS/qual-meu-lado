"use client";

import { Check, ChevronRight, Pointer } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { StatementView } from "@/lib/content/queries";
import type { Answer } from "@/lib/affinity/score";
import { answerLabel } from "@/lib/labels";
import { setAnswer, useJourney } from "@/lib/journey/store";
import { haptic } from "@/lib/haptics";

/** Glossário em cartões que viram: a palavra na frente, o significado atrás. */
export function Glossary({ title, items }: { title?: string; items: { term: string; definition: string }[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <section aria-label={title ?? "Glossário"}>
      {title && <h2 className="h-section mb-2">{title}</h2>}
      <p className="mb-5 text-sm text-ash">Toque em uma palavra para ver o significado.</p>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((it, i) => {
          const on = !!flipped[i];
          return (
            <li key={it.term} className="[perspective:900px]">
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setFlipped((f) => ({ ...f, [i]: !on }))}
                className="relative block h-40 w-full text-left [transform-style:preserve-3d]"
              >
                <m.span
                  className="absolute inset-0 block [transform-style:preserve-3d]"
                  animate={{ rotateY: on ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="card absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden]">
                    <span className="kicker text-ash">Palavra</span>
                    <span className="font-display text-2xl tracking-tight">{it.term}</span>
                    <span aria-hidden className="inline-flex items-center gap-1 self-end text-ash">
                      <m.span className="inline-flex" animate={{ scale: [1, 0.85, 1] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}>
                        <Pointer className="h-3.5 w-3.5" strokeWidth={2} />
                      </m.span>
                    </span>
                  </span>
                  <span className="absolute inset-0 flex items-center bg-paper p-4 text-[0.95rem] leading-snug text-graphite [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {it.definition}
                  </span>
                </m.span>
                <span className="sr-only">{on ? it.definition : ""}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Pergunta rápida no meio da leitura: um toque, e ela entra no seu mapa. */
export function Pulse({ statement, prompt }: { statement: StatementView; prompt?: string }) {
  const { answers } = useJourney();
  const current = answers[statement.key];
  const [burst, setBurst] = useState(0);
  const [why, setWhy] = useState(false);
  const pick = (a: Answer) => {
    haptic("choose");
    setAnswer(statement.key, current === a ? null : a);
    setBurst((b) => b + 1);
  };
  const opts: { a: Answer; label: string }[] = [
    { a: "agree", label: "Sim" },
    { a: "disagree", label: "Não" },
    { a: "depends", label: "Depende" },
  ];
  return (
    <section className="relative overflow-hidden border border-paper/25 bg-gradient-to-br from-graphite-2 to-graphite p-5 md:p-8" aria-label="Pergunta rápida">
      <p className="kicker text-[var(--accent-ink)]">{prompt ?? "E você?"}</p>
      <p className="mt-3 max-w-3xl font-display text-2xl leading-snug md:text-3xl">“{statement.text}”</p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {opts.map(({ a, label }) => (
          <m.button
            key={a}
            type="button"
            whileTap={{ scale: 0.92 }}
            aria-pressed={current === a}
            onClick={() => pick(a)}
            className={`relative min-h-12 min-w-24 rounded-full border px-6 font-display text-lg transition-colors ${current === a ? "border-paper bg-paper text-graphite" : "border-line hover:border-paper"}`}
          >
            {label}
          </m.button>
        ))}
        <AnimatePresence mode="wait">
          {current && (
            <m.span
              key={`${current}-${burst}`}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="ml-2 inline-flex items-center gap-2 font-mono text-sm text-ev-pro"
              role="status"
            >
              <span aria-hidden><Check aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span> {answerLabel[current]} — conta para o seu indicador de afinidade
            </m.span>
          )}
        </AnimatePresence>
      </div>
      {current && (
        <button type="button" aria-expanded={why} onClick={() => setWhy((v) => !v)} className="kicker mt-4 inline-flex min-h-10 items-center gap-2 text-paper/80 hover:text-paper">
          <span aria-hidden className={`inline-flex transition-transform ${why ? "rotate-90" : ""}`}><ChevronRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> Por que as pessoas pensam diferente?
        </button>
      )}
      {current && why && (
        <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
          <div className="mt-5 grid gap-4 border-t border-line pt-4 text-sm text-paper/85 md:grid-cols-2">
            <p><span className="kicker mb-1 block">Quem concorda costuma dizer</span>{statement.argumentsAgree.replace(/^Quem concorda costuma argumentar que /, "")}</p>
            <p><span className="kicker mb-1 block">Quem discorda costuma dizer</span>{statement.argumentsDisagree.replace(/^Quem discorda costuma argumentar que /, "")}</p>
          </div>
        </m.div>
      )}
      {/* micro-animação: ondas a cada resposta */}
      <AnimatePresence>
        {burst > 0 && (
          <m.span
            key={burst}
            aria-hidden
            className="pointer-events-none absolute right-8 top-8 h-24 w-24 rounded-full border-2 border-paper"
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export function ExampleCard({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <aside className="relative border-l-4 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent-deep)_35%,transparent)] p-5 md:p-7" aria-label={title}>
      <p className="kicker text-[var(--accent-ink)]">{title}</p>
      <div className="mt-3 max-w-3xl text-lg leading-relaxed">{body}</div>
    </aside>
  );
}

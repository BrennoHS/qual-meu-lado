"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { CounterpointItem } from "@/lib/content/blocks";
import type { ClaimView } from "@/lib/content/queries";
import { SourceButton } from "@/components/evidence/source-panel";

export function Counterpoints({
  items,
  claims,
  thisSideName,
  otherSideName,
}: {
  items: CounterpointItem[];
  claims: Record<string, ClaimView>;
  thisSideName: string;
  otherSideName: string;
}) {
  const [view, setView] = useState<Record<string, "this" | "other">>({});
  return (
    <ol className="space-y-8">
      {items.map((it, i) => {
        const v = view[it.id] ?? "this";
        return (
          <li key={it.id} className="card p-5 md:p-7">
            <p className="font-mono text-xs text-ash">QUESTÃO {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-display text-xl leading-snug md:text-2xl">{it.prompt}</h3>

            <div role="radiogroup" aria-label="Escolha a perspectiva" className="mt-5 grid grid-cols-2 border border-line">
              {(["this", "other"] as const).map((k) => (
                <button
                  key={k}
                  role="radio"
                  type="button"
                  aria-checked={v === k}
                  onClick={() => setView((s) => ({ ...s, [it.id]: k }))}
                  className={`min-h-12 px-3 font-mono text-[0.72rem] uppercase tracking-[0.1em] transition-colors ${
                    v === k ? (k === "this" ? "bg-[var(--accent)] text-paper" : "bg-paper text-graphite") : "text-ash hover:text-paper"
                  }`}
                >
                  {k === "this" ? `Argumento (${thisSideName})` : `Resposta (${otherSideName})`}
                </button>
              ))}
            </div>

            <div className="relative mt-5 min-h-[6rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <m.p
                  key={v}
                  initial={{ opacity: 0, x: v === "this" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-lg leading-relaxed"
                >
                  {v === "this" ? it.thisSide : it.otherSide}
                </m.p>
              </AnimatePresence>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <p className="kicker mb-1">O que a evidência permite dizer</p>
              <p className="text-paper/85">{it.evidence}</p>
              <div className="mt-2 flex flex-wrap gap-x-5">
                {it.claimKeys.map((k) => (
                  <SourceButton key={k} claim={claims[k]} />
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

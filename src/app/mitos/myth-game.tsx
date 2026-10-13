"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import type { ClaimView } from "@/lib/content/queries";
import { verdictLabel } from "@/lib/labels";
import { SourceButton } from "@/components/evidence/source-panel";

type Myth = { slug: string; statement: string; verdict: string; explanation: string; claimKeys: string[] };
const VERDICTS = ["CONFIRMED", "FALSE", "PARTIAL", "CONTEXT_DEPENDENT", "INSUFFICIENT_EVIDENCE"] as const;

/** Mitos e realidades: o visitante tenta classificar antes de ver a explicação. Nada é pontuado nem enviado. */
export function MythGame({ myths, claims }: { myths: Myth[]; claims: Record<string, ClaimView> }) {
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  return (
    <ol className="grid gap-6 lg:grid-cols-2">
      {myths.map((myth, i) => {
        const guess = guesses[myth.slug];
        const revealed = !!guess;
        return (
          <li key={myth.slug} className="card flex flex-col p-5 md:p-7">
            <p className="font-mono text-xs text-ash">AFIRMAÇÃO {String(i + 1).padStart(2, "0")}</p>
            <p className="mt-3 font-display text-xl leading-snug md:text-2xl">“{myth.statement}”</p>
            {!revealed ? (
              <fieldset className="mt-6">
                <legend className="kicker mb-3">Como você classificaria?</legend>
                <div className="flex flex-wrap gap-2">
                  {VERDICTS.map((v) => (
                    <button key={v} type="button" className="chip" onClick={() => setGuesses((g) => ({ ...g, [myth.slug]: v }))}>
                      {verdictLabel[v]}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex flex-1 flex-col" aria-live="polite">
                <p className="flex flex-wrap items-center gap-3">
                  <span className="border border-paper px-2 py-1 font-mono text-xs uppercase tracking-[0.12em]">{verdictLabel[myth.verdict]}</span>
                  <span className="font-mono text-xs text-ash">
                    {guess === myth.verdict ? "Você classificou igual." : `Você escolheu: ${verdictLabel[guess]}.`}
                  </span>
                </p>
                <p className="mt-4 leading-relaxed text-paper/85">{myth.explanation}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-4">
                  {myth.claimKeys.map((k) => <SourceButton key={k} claim={claims[k]} />)}
                  <button type="button" className="kicker min-h-9 text-ash hover:text-paper" onClick={() => setGuesses((g) => { const n = { ...g }; delete n[myth.slug]; return n; })}>
                    Tentar de novo
                  </button>
                </div>
              </m.div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

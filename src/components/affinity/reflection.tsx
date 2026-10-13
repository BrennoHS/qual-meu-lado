"use client";

import Link from "next/link";
import type { StatementView } from "@/lib/content/queries";
import type { Answer } from "@/lib/affinity/score";
import { answerLabel } from "@/lib/labels";
import { setAnswer, useJourney } from "@/lib/journey/store";

const OPTIONS: Answer[] = ["agree", "disagree", "depends", "unknown"];

/** Perguntas de reflexão (Capítulo 7). Respostas ficam só no navegador. */
export function Reflection({ statements }: { statements: StatementView[] }) {
  const { answers } = useJourney();
  const answered = statements.filter((s) => answers[s.key]).length;

  return (
    <div>
      <p className="font-mono text-xs text-ash" aria-live="polite">
        {answered} de {statements.length} respondidas · salvas apenas neste navegador
      </p>
      <ol className="mt-5 space-y-6">
        {statements.map((s, i) => {
          const a = answers[s.key];
          return (
            <li key={s.key} className="card p-5 md:p-7">
              <fieldset>
                <legend className="w-full">
                  <span className="font-mono text-xs text-ash">{String(i + 1).padStart(2, "0")} · {s.dimensionName}</span>
                  <span className="mt-2 block font-display text-xl leading-snug md:text-2xl">{s.text}</span>
                </legend>
                <p className="mt-2 text-sm text-ash">{s.context}</p>
                <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {OPTIONS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={a === o}
                      onClick={() => setAnswer(s.key, a === o ? null : o)}
                      className="chip min-h-12 justify-center"
                    >
                      {answerLabel[o]}
                    </button>
                  ))}
                </div>
              </fieldset>
              {a && (
                <div className="mt-5 grid gap-4 border-t border-line pt-4 text-sm md:grid-cols-2">
                  <p><span className="kicker mb-1 block">Quem concorda</span>{s.argumentsAgree}</p>
                  <p><span className="kicker mb-1 block">Quem discorda</span>{s.argumentsDisagree}</p>
                  {s.whyDepends && <p className="md:col-span-2 text-ash"><span className="kicker mr-2">Por que pode depender</span>{s.whyDepends}</p>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-sm text-ash">
        Uma resposta isolada não torna ninguém de esquerda ou de direita.{" "}
        <Link href="/afinidades" className="link-u text-paper">Responder todas as 24 afirmações</Link> ou{" "}
        <Link href="/afinidades/resultado" className="link-u text-paper">ver o mapa com o que já respondi</Link>.
      </p>
    </div>
  );
}

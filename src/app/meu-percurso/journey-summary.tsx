"use client";

import Link from "next/link";
import { useState } from "react";
import { clearJourney, useJourney } from "@/lib/journey/store";
import type { StatementView } from "@/lib/content/queries";
import { answerLabel } from "@/lib/labels";

type Chapter = { slug: string; number: number; kicker: string; title: string };
type Side = { slug: string; name: string; chapters: Chapter[] };

/** "Seu mapa de ideias": o que foi explorado e respondido — sem pontuações. */
export function JourneySummary({ sides, statements }: { sides: Side[]; statements: StatementView[] }) {
  const { visited, answers } = useJourney();
  const [confirm, setConfirm] = useState(false);
  const answered = statements.filter((s) => answers[s.key]);
  const byDim = new Map<string, StatementView[]>();
  answered.forEach((s) => byDim.set(s.dimensionName, [...(byDim.get(s.dimensionName) ?? []), s]));

  return (
    <div className="space-y-16">
      <section aria-labelledby="explorado">
        <h2 id="explorado" className="h-section">O que você explorou</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {sides.map((side) => {
            const seen = side.chapters.filter((c) => visited.some((v) => v.side === side.slug && v.chapter === c.slug));
            return (
              <div key={side.slug} data-side={side.slug} className="card p-5 md:p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{side.name}</h3>
                  <span className="font-mono text-xs text-ash">{seen.length}/{side.chapters.length} capítulos</span>
                </div>
                <div className="mt-3 flex gap-1" aria-hidden>
                  {side.chapters.map((c) => (
                    <span key={c.slug} className={`h-1 flex-1 ${seen.includes(c) ? "bg-[var(--accent-ink)]" : "bg-line"}`} />
                  ))}
                </div>
                <ul className="mt-4 space-y-1 text-sm">
                  {side.chapters.map((c) => {
                    const ok = seen.includes(c);
                    return (
                      <li key={c.slug}>
                        <Link href={`/explorar/${side.slug}/${c.slug}`} className="flex min-h-9 items-center gap-3 hover:underline">
                          <span aria-hidden className={ok ? "text-[var(--accent-ink)]" : "text-ash"}>{ok ? "●" : "○"}</span>
                          <span className={ok ? "" : "text-ash"}>{c.number}. {c.kicker}</span>
                          <span className="sr-only">{ok ? "(visitado)" : "(não visitado)"}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="respostas">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="respostas" className="h-section">Suas respostas</h2>
          <span className="font-mono text-xs text-ash">{answered.length} de {statements.length}</span>
        </div>
        {answered.length === 0 ? (
          <p className="mt-4 text-ash">Você ainda não respondeu nenhuma afirmação. <Link href="/afinidades" className="link-u text-paper">Começar</Link>.</p>
        ) : (
          <div className="mt-6 space-y-8">
            {[...byDim.entries()].map(([dim, list]) => (
              <div key={dim}>
                <p className="kicker mb-2">{dim}</p>
                <ul className="divide-y divide-line border-y border-line">
                  {list.map((s) => (
                    <li key={s.key} className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
                      <span className="text-paper/85">{s.text}</span>
                      <span className="flex shrink-0 items-center gap-4 font-mono text-xs">
                        {answerLabel[answers[s.key]!]}
                        <Link className="link-u text-ash" href={`/afinidades?revisar=${s.key}`}>revisar</Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/afinidades/resultado" className="btn btn-solid">Ver mapa de afinidades</Link>
          {confirm ? (
            <>
              <button type="button" className="btn" onClick={() => { clearJourney(); setConfirm(false); }}>Confirmar: apagar tudo</button>
              <button type="button" className="kicker min-h-11 px-2" onClick={() => setConfirm(false)}>Cancelar</button>
            </>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setConfirm(true)}>Apagar meu percurso e respostas</button>
          )}
        </div>
        <p className="mt-4 text-sm text-ash">Tudo nesta página está guardado apenas no armazenamento local deste navegador.</p>
      </section>
    </div>
  );
}

"use client";

import * as m from "motion/react-m";
import { ModeToggle } from "@/components/site/hud";

/** Abertura do capítulo: título que sobe palavra a palavra + "Em 30 segundos". */
export function ChapterHero({
  sideName,
  number,
  total,
  kicker,
  title,
  summary,
  keyPoints,
  entry,
  outdated,
}: {
  sideName: string;
  number: number;
  total: number;
  kicker: string;
  title: string;
  summary: string;
  keyPoints: string[];
  entry?: boolean;
  outdated?: boolean;
}) {
  const words = title.split(" ");
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(90% 120% at 0% 0%, var(--accent-deep), transparent 62%)" }} />
      <m.span
        aria-hidden
        className="display pointer-events-none absolute -right-[3vw] top-[2vh] select-none text-[38vw] leading-none text-transparent md:text-[26vw]"
        style={{ WebkitTextStroke: "1px var(--accent-ink)" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.16, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {number}
      </m.span>
      <div className="wrap relative pb-12 pt-12 md:pb-20 md:pt-20">
        {entry && (
          <m.p
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-paper/30 px-3 py-1.5 text-sm text-paper/85"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Você escolheu começar pela {sideName.toLowerCase()}. Pode trocar de lado quando quiser.
          </m.p>
        )}
        <m.p className="kicker text-[var(--accent-ink)]" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {sideName} · Capítulo {number} de {total} · {kicker}
        </m.p>
        <h1 className="display mt-5 max-w-5xl text-[clamp(2.6rem,9vw,7rem)]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-top">
              <m.span className="inline-block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                {w}
              </m.span>
            </span>
          ))}
        </h1>
        <m.p className="mt-6 max-w-2xl text-lg text-paper/80 md:text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {summary}
        </m.p>

        {keyPoints.length > 0 && (
          <m.section
            aria-labelledby="em-30s"
            className="mt-10 max-w-3xl border border-line bg-graphite/70 p-5 backdrop-blur-sm md:p-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="em-30s" className="kicker text-paper">Em 30 segundos</h2>
              <ModeToggle />
            </div>
            <ol className="mt-4 space-y-3">
              {keyPoints.map((k, i) => (
                <m.li key={i} className="flex gap-3 text-[1.05rem] leading-snug" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 + i * 0.15 }}>
                  <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-ink)]" aria-hidden fill="none" stroke="currentColor" strokeWidth={2}>
                    <m.path d="M4 10.5l4 4 8-9" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.15, duration: 0.4 }} />
                  </svg>
                  <span>{k}</span>
                </m.li>
              ))}
            </ol>
          </m.section>
        )}
        {outdated && (
          <p role="note" className="mt-6 max-w-2xl border border-dashed border-ev-critique p-3 text-sm text-ev-critique">
            Este capítulo foi marcado como desatualizado e está em revisão editorial.
          </p>
        )}
      </div>
    </header>
  );
}

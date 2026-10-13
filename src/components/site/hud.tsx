"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { BallotBox, Scale } from "@/components/art/illustrations";
import { daysUntil, SECOND_ROUND_DATE } from "@/lib/election";
import { useJourney } from "@/lib/journey/store";
import { setReadingMode, useReadingMode } from "@/lib/journey/mode";

/** Indicador de distância de leitura: linha fina sob o menu que acompanha o scroll. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] bg-line/40" aria-hidden>
      <m.div className="h-full origin-left bg-[var(--accent-ink)]" style={{ scaleX }} />
    </div>
  );
}

/** Selo do 2º turno com contagem regressiva (calculada no navegador). */
export function ElectionPill({ compact = false }: { compact?: boolean }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysUntil(SECOND_ROUND_DATE)), []);
  const label = days === null ? "2º turno" : days > 1 ? `Faltam ${days} dias` : days === 1 ? "É amanhã" : days === 0 ? "É hoje" : "2º turno";
  return (
    <Link
      href="/segundo-turno"
      className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full border border-paper/70 bg-paper/5 pl-2.5 pr-3 text-paper transition-colors hover:bg-paper hover:text-graphite"
      aria-label={`Eleições 2026, 2º turno: compare as propostas. ${label}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ev-pro opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ev-pro" />
      </span>
      <BallotBox className="h-4 w-4" />
      <span className="font-mono text-[0.78rem] uppercase tracking-[0.08em]">
        {compact ? "2º turno" : <>Propostas 2º turno <span className="opacity-70">· {label}</span></>}
      </span>
    </Link>
  );
}

/** Balança da jornada: quanto você já explorou de cada lado. Nada é pontuado. */
export function BalanceMeter({ total = 7 }: { total?: number }) {
  const { visited } = useJourney();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const esq = mounted ? visited.filter((v) => v.side === "esquerda").length : 0;
  const dir = mounted ? visited.filter((v) => v.side === "direita").length : 0;
  const tilt = (dir - esq) / total;
  return (
    <Link href="/meu-percurso" className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 text-ash hover:text-paper md:inline-flex" aria-label={`Seu percurso: ${esq} capítulos da esquerda e ${dir} da direita`}>
      <span className="font-mono text-xs text-[var(--color-esq-ink)]">{esq}</span>
      <Scale tilt={tilt} className="h-5 w-6 text-paper" />
      <span className="font-mono text-xs text-[var(--color-dir-ink)]">{dir}</span>
    </Link>
  );
}

/** Alterna entre a camada essencial e a aprofundada. */
export function ModeToggle({ className = "" }: { className?: string }) {
  const mode = useReadingMode();
  const pillId = useId();
  return (
    <div role="radiogroup" aria-label="Modo de leitura" className={`inline-flex h-9 items-center rounded-full border border-line p-0.5 ${className}`}>
      {(["essencial", "aprofundado"] as const).map((m2) => (
        <button
          key={m2}
          type="button"
          role="radio"
          aria-checked={mode === m2}
          onClick={() => setReadingMode(m2)}
          className={`relative h-8 rounded-full px-3 font-mono text-[0.78rem] uppercase tracking-[0.08em] transition-colors ${mode === m2 ? "text-graphite" : "text-ash hover:text-paper"}`}
        >
          {mode === m2 && <m.span layoutId={`mode-pill-${pillId}`} className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
          <span className="relative">{m2 === "essencial" ? "Essencial" : "Aprofundado"}</span>
        </button>
      ))}
    </div>
  );
}

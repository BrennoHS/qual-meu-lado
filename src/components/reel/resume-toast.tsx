"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { latestUnfinished, type ReelProgress } from "@/lib/reel/progress";
import { TLink } from "@/components/transition/transition-provider";

/**
 * Na home: se a pessoa parou um reel no meio, um atalho discreto para voltar
 * ao mesmo ponto (dados só deste navegador).
 */
export function ResumeLink({ className = "" }: { className?: string }) {
  const [p, setP] = useState<(ReelProgress & { id: string }) | null>(null);
  useEffect(() => setP(latestUnfinished()), []);
  if (!p) return null;
  const tone = p.id === "esquerda" ? "esquerda" : p.id === "direita" ? "direita" : "neutral";
  const pct = Math.round(((p.index + 1) / p.total) * 100);
  return (
    <m.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className={className}>
      <TLink
        href={p.href}
        scene={{ label: p.label.split(" · ")[0], sub: "Continuando de onde você parou", tone }}
        className="group inline-flex max-w-[min(26rem,calc(100vw-2rem))] items-center gap-2 rounded-full border border-paper/30 bg-graphite/70 py-1.5 pl-3 pr-1.5 text-left text-xs text-paper/90 backdrop-blur hover:border-paper"
        data-side={tone === "neutral" ? undefined : tone}
      >
        <span aria-hidden className="relative grid h-6 w-6 shrink-0 place-items-center">
          <svg viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2.5} />
            <circle cx="12" cy="12" r="10" fill="none" stroke="var(--accent-ink)" strokeWidth={2.5} strokeDasharray={`${(pct / 100) * 62.8} 62.8`} strokeLinecap="round" />
          </svg>
          <span className="text-[0.6rem]"><RotateCcw aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span>
        </span>
        <span className="min-w-0 truncate">
          <span className="text-ash">Continuar: </span>
          {p.label}
        </span>
        <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-graphite">Ir →</span>
      </TLink>
    </m.span>
  );
}

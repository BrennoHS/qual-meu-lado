"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { readProgress, type ReelProgress } from "@/lib/reel/progress";
import { useReel } from "./reel";

/** No começo do reel: "Você parou em … — continuar". Some sozinho quando a pessoa avança. */
export function ResumePill({ reelId, keys, skip, atStart = true }: { reelId: string; keys: string[]; skip: boolean; atStart?: boolean }) {
  const { goToKey } = useReel();
  const [saved, setSaved] = useState<ReelProgress | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Chegou por link direto (#tela, ?cap=, ?tema=)? Então já está onde queria.
    const q = new URLSearchParams(window.location.search);
    if (skip || window.location.hash || q.has("cap") || q.has("tema")) return;
    const p = readProgress()[reelId];
    if (p && p.index > 1 && p.index < p.total - 1 && keys.includes(p.key)) setSaved(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reelId, skip]);

  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setHidden(true), 12000);
    return () => window.clearTimeout(t);
  }, [saved]);

  const show = !!saved && !hidden && atStart;
  return (
    <AnimatePresence>
      {show && saved && (
        <m.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.8, type: "spring", stiffness: 300, damping: 24 } }}
          exit={{ opacity: 0, y: -12 }}
          className="absolute left-1/2 top-[4.6rem] z-30 flex w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-full border border-paper/30 bg-graphite/90 py-1.5 pl-4 pr-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur"
          role="status"
        >
          <span className="min-w-0 flex-1 truncate text-sm">
            <span className="text-ash">Você parou em </span>
            {saved.label}
          </span>
          <button
            type="button"
            onClick={() => {
              goToKey(saved.key);
              setHidden(true);
            }}
            className="shrink-0 rounded-full bg-paper px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-graphite"
          >
            Continuar
          </button>
          <button type="button" onClick={() => setHidden(true)} aria-label="Começar do início" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ash hover:text-paper">
            <X aria-hidden className="inline-block h-4 w-4" strokeWidth={2} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}

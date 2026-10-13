"use client";

import Link from "next/link";
import * as m from "motion/react-m";
import { setReadingMode, useReadingMode } from "@/lib/journey/mode";

/** Sai do reel (volta ao início). */
export function ReelClose({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} aria-label="Sair e voltar ao início" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-paper/30 text-paper hover:bg-paper hover:text-graphite">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </Link>
  );
}

/** Interruptor compacto do modo aprofundado (mesma preferência do resto do site). */
export function DeepSwitch() {
  const mode = useReadingMode();
  const on = mode === "aprofundado";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setReadingMode(on ? "essencial" : "aprofundado")}
      className={`inline-flex h-9 items-center gap-2 rounded-full border pl-3 pr-1 font-mono text-[0.72rem] uppercase tracking-[0.08em] transition-colors ${on ? "border-paper bg-paper text-graphite" : "border-paper/40 text-paper"}`}
      title="Mostra telas extras com mais detalhes, fontes e debates"
    >
      Aprofundar
      <span className={`relative h-7 w-11 rounded-full ${on ? "bg-graphite" : "bg-paper/15"}`}>
        <m.span
          className={`absolute top-1 h-5 w-5 rounded-full ${on ? "bg-paper" : "bg-paper/70"}`}
          animate={{ left: on ? 22 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  );
}

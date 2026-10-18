"use client";

import Link from "next/link";
import { useRef } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight } from "lucide-react";
import { ROUNDS } from "@/lib/election";
import { ThemeArt } from "@/components/art/dimension-art";

/**
 * Os 8 temas do 2º turno como portas de entrada: cada cartão abre a comparação
 * direto naquele tema. Ilustrações neutras (sem cores de lado), desenhadas
 * quando a grade aparece na tela.
 */
export function ProposalThemes({ newTab = false, compact = false }: { newTab?: boolean; compact?: boolean } = {}) {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <ul ref={ref} className={compact ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"}>
      {ROUNDS.map((r, i) => (
        <m.li key={r.slug} initial={{ opacity: 0, y: 14 }} animate={seen ? { opacity: 1, y: 0 } : undefined} transition={{ delay: i * 0.05 }}>
          <Link
            href={`/segundo-turno?tema=${r.slug}`}
            {...(newTab ? { target: "_blank", rel: "noopener" } : {})}
            className={`group flex h-full flex-col justify-between gap-3 border border-line bg-graphite p-4 transition-colors hover:border-paper/60 hover:bg-graphite-3 ${compact ? "min-h-28" : "min-h-32 md:min-h-40 md:p-5"}`}
          >
            <span className="h-10 w-16 text-paper/75 transition-colors group-hover:text-paper">{seen && <ThemeArt theme={r.slug} className="h-10 w-16" />}</span>
            <span>
              <span className={`block font-display leading-tight tracking-tight ${compact ? "text-base" : "text-lg md:text-xl"}`}>{r.label}</span>
              {!compact && <span className="mt-1 hidden text-sm leading-snug text-paper/65 md:block">{r.question}</span>}
              <span className="mt-2 inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ash group-hover:text-paper">
                Comparar <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        </m.li>
      ))}
    </ul>
  );
}

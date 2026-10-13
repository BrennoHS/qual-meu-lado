"use client";

import { ArrowLeftRight } from "lucide-react";
import { useEffect, useState } from "react";
import { TLink } from "@/components/transition/transition-provider";
import { useJourney } from "@/lib/journey/store";

type ChapterLink = { number: number; slug: string; title: string; kicker: string };

/** Indicador de capítulos (desktop) + troca de perspectiva no mesmo capítulo. */
export function ChapterProgress({ side, otherSide, otherName, chapters, current }: { side: string; otherSide: string; otherName: string; chapters: ChapterLink[]; current: string }) {
  const { visited } = useJourney();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const idx = chapters.findIndex((c) => c.slug === current);
  const tone = side === "esquerda" ? "esquerda" : "direita";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <nav aria-label="Capítulos" className="hidden items-center gap-1 lg:flex">
        {chapters.map((c) => {
          const seen = mounted && visited.some((v) => v.side === side && v.chapter === c.slug);
          const active = c.slug === current;
          return (
            <TLink
              key={c.slug}
              href={`/explorar/${side}/${c.slug}`}
              scene={{ label: c.kicker, sub: `Capítulo ${c.number}`, tone, number: String(c.number) }}
              aria-current={active ? "step" : undefined}
              aria-label={`Capítulo ${c.number}: ${c.kicker}${seen ? " (visitado)" : ""}`}
              title={`${c.number}. ${c.kicker}`}
              className="group flex h-11 items-center px-[3px]"
            >
              <span className={`block h-[3px] transition-all ${active ? "w-9 bg-[var(--accent-ink)]" : seen ? "w-5 bg-paper/60" : "w-5 bg-line group-hover:bg-ash"}`} />
            </TLink>
          );
        })}
      </nav>
      <span className="font-mono text-sm text-ash lg:hidden" aria-label={`Capítulo ${idx + 1} de ${chapters.length}`}>
        {idx + 1}/{chapters.length}
      </span>
      <TLink
        href={`/explorar/${otherSide}/${current}`}
        scene={{ label: otherName === "esquerda" ? "Esquerda" : "Direita", sub: chapters[idx]?.kicker, tone: otherSide === "esquerda" ? "esquerda" : "direita", from: side === "esquerda" ? "right" : "left" }}
        className="kicker hidden h-9 items-center whitespace-nowrap rounded-full border border-line px-3 text-paper hover:border-paper xl:flex"
      >
        Ver na {otherName} <ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} />
      </TLink>
    </div>
  );
}

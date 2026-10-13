"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { ClaimView } from "@/lib/content/queries";
import { SourceButton } from "@/components/evidence/source-panel";

export type ThemeItem = {
  slug: string;
  name: string;
  description: string;
  position: { summary: string; points: string[]; nuances: string; claimKeys: string[] } | null;
};

/** Abas acessíveis (padrão WAI-ARIA tabs) com navegação por setas. */
export function ThemesExplorer({ themes, claims }: { themes: ThemeItem[]; claims: Record<string, ClaimView> }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const t = themes[active];

  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + themes.length) % themes.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Temas" className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 scroll-strip" onKeyDown={onKey}>
        {themes.map((th, i) => (
          <button
            key={th.slug}
            id={`${base}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className="chip shrink-0 whitespace-nowrap"
          >
            {th.name}
          </button>
        ))}
      </div>

      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active}`} className="mt-6 min-h-[18rem]">
        <AnimatePresence mode="wait">
          <m.div key={t.slug} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
            <p className="kicker">{t.description}</p>
            {t.position ? (
              <>
                <p className="mt-3 font-display text-2xl leading-snug md:text-3xl">{t.position.summary}</p>
                <ul className="mt-6 grid gap-3 md:grid-cols-3">
                  {t.position.points.map((p, i) => (
                    <li key={p} className="card p-4">
                      <span className="font-mono text-xs text-[var(--accent-ink)]">{String(i + 1).padStart(2, "0")}</span>
                      <p className="mt-2 leading-snug">{p}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-l-2 border-ev-critique/70 pl-4">
                  <p className="kicker mb-1 text-ev-critique">Ressalvas</p>
                  <p className="text-paper/85">{t.position.nuances}</p>
                </div>
                {t.position.claimKeys.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-5">
                    {t.position.claimKeys.map((k) => (
                      <SourceButton key={k} claim={claims[k]} label={claims[k] ? "Ver fonte" : "Em apuração"} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 text-ash">Conteúdo deste tema em revisão editorial.</p>
            )}
            <Link href={`/temas/${t.slug}`} className="kicker link-u mt-6 inline-block text-paper">
              Comparar os dois lados neste tema →
            </Link>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

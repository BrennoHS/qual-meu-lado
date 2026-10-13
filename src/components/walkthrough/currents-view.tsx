"use client";

import { useState } from "react";

export type CurrentItem = {
  slug: string;
  name: string;
  family: string;
  summary: string;
  keyIdeas: string[];
  thinkers: string[];
  inBrazil: string | null;
};

export function CurrentsView({ items }: { items: CurrentItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.slug ?? null);
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((c, i) => {
        const isOpen = open === c.slug;
        const panelId = `corrente-${c.slug}`;
        return (
          <li key={c.slug}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : c.slug)}
              className="flex min-h-16 w-full items-center gap-4 py-4 text-left"
            >
              <span className="font-mono text-xs text-ash">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-display text-xl tracking-tight md:text-2xl">{c.name}</span>
              <span aria-hidden className={`text-2xl text-[var(--accent-ink)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div id={panelId} hidden={!isOpen} className="pb-6 pl-8 md:pl-10">
              <p className="max-w-2xl text-paper/85">{c.summary}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="kicker mb-2">Ideias-chave</p>
                  <ul className="space-y-1 text-sm">
                    {c.keyIdeas.map((k) => (
                      <li key={k} className="flex gap-2"><span aria-hidden className="text-[var(--accent-ink)]">—</span>{k}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker mb-2">Referências</p>
                  <p className="text-sm text-ash">{c.thinkers.join(" · ")}</p>
                </div>
              </div>
              {c.inBrazil && (
                <p className="mt-4 border-l border-line pl-3 text-sm text-paper/80">
                  <span className="kicker mr-2">No Brasil</span>
                  {c.inBrazil}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

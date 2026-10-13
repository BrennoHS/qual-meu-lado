"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { ClaimView } from "@/lib/content/queries";
import { SourceButton } from "@/components/evidence/source-panel";

export type TimelineItem = {
  slug: string;
  year: number;
  dateLabel: string;
  title: string;
  body: string;
  scope: "BRAZIL" | "INTERNATIONAL";
  tags: string[];
  claimKey: string | null;
};

const TAGS: { key: string; label: string }[] = [
  { key: "esquerda", label: "Esquerda" },
  { key: "direita", label: "Direita" },
  { key: "centro", label: "Centro" },
  { key: "economia", label: "Economia" },
  { key: "instituicoes", label: "Instituições" },
];

export function TimelineView({
  events,
  claims,
  initialTags = [],
  initialScope = "ALL",
  showFilters = true,
}: {
  events: TimelineItem[];
  claims: Record<string, ClaimView>;
  initialTags?: string[];
  initialScope?: "ALL" | "BRAZIL" | "INTERNATIONAL";
  showFilters?: boolean;
}) {
  const [scope, setScope] = useState(initialScope);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(
    () => events.filter((e) => (scope === "ALL" || e.scope === scope) && (tags.length === 0 || e.tags.some((t) => tags.includes(t)))),
    [events, scope, tags],
  );

  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <div>
      {showFilters && (
        <div className="mb-8 space-y-3">
          <div role="group" aria-label="Abrangência" className="flex flex-wrap gap-2">
            {(["ALL", "BRAZIL", "INTERNATIONAL"] as const).map((s) => (
              <button key={s} type="button" className="chip" aria-pressed={scope === s} onClick={() => setScope(s)}>
                {s === "ALL" ? "Brasil e mundo" : s === "BRAZIL" ? "Brasil" : "Mundo"}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Filtrar por tema" className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button key={t.key} type="button" className="chip" aria-pressed={tags.includes(t.key)} onClick={() => toggleTag(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-ash" aria-live="polite">{list.length} eventos</p>
        </div>
      )}

      <ol className="relative border-l border-line pl-6 md:pl-10">
        {list.map((e) => {
          const isOpen = open === e.slug;
          return (
            <li key={e.slug} className="relative pb-6 last:pb-0">
              <span aria-hidden className={`absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full md:-left-[45px] ${e.scope === "BRAZIL" ? "bg-paper" : "border border-paper bg-graphite"}`} />
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : e.slug)}
                className="group grid w-full grid-cols-[5.5rem_1fr] items-baseline gap-3 text-left md:grid-cols-[7rem_1fr]"
              >
                <span className="font-mono text-sm text-ash">{e.dateLabel}</span>
                <span>
                  <span className="font-display text-lg leading-tight group-hover:underline md:text-xl">{e.title}</span>
                  <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-widest text-ash">{e.scope === "BRAZIL" ? "BR" : "Mundo"}</span>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[6.25rem] pt-2 md:ml-[7.75rem]">
                      <p className="text-paper/85">{e.body}</p>
                      {e.claimKey && <SourceButton claim={claims[e.claimKey]} className="mt-2" />}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ArgumentItem } from "@/lib/content/blocks";
import { argumentCategories, critiqueCategories } from "@/lib/content/categories";
import type { ClaimView } from "@/lib/content/queries";
import { EvidenceBadge } from "@/components/evidence/evidence-badge";
import { SourceButton } from "@/components/evidence/source-panel";

export function ArgumentsList({ kind, items, claims }: { kind: "PRO" | "CRITIQUE"; items: ArgumentItem[]; claims: Record<string, ClaimView> }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const cats: Record<string, string> = kind === "PRO" ? argumentCategories : critiqueCategories;
  const followLabel = kind === "PRO" ? "Limites reconhecidos" : "Resposta de quem defende a posição criticada";

  return (
    <ol className="space-y-5">
      {items.map((a, i) => {
        const follow = kind === "PRO" ? a.limits : a.response;
        const isOpen = !!open[a.id];
        return (
          <li key={a.id} id={a.id} className="card relative overflow-hidden">
            <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)]" />
            <div className="p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-ash">{String(i + 1).padStart(2, "0")}</span>
                <EvidenceBadge kind={kind === "PRO" ? "pro" : "critique"} />
                {a.category && <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">{cats[a.category] ?? a.category}</span>}
              </div>
              <h3 className="mt-4 font-display text-2xl leading-tight tracking-tight md:text-[1.75rem]">{a.title}</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-paper/85">{a.body}</p>
              {a.evidenceNote && (
                <p className="mt-4 max-w-3xl border-l border-line pl-3 text-sm text-ash">
                  <span className="kicker mr-2 text-paper/70">Como ler a evidência</span>
                  {a.evidenceNote}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
                {a.claimKeys.map((k) => (
                  <SourceButton key={k} claim={claims[k]} label={claims[k] ? "Ver fonte" : "Em apuração"} />
                ))}
              </div>
              {follow && (
                <div className="mt-5 border-t border-line pt-4">
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [a.id]: !isOpen }))} className="kicker flex min-h-11 items-center gap-2 text-paper">
                    <span aria-hidden className={`inline-block transition-transform ${isOpen ? "rotate-90" : ""}`}><ChevronRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span>
                    {followLabel}
                  </button>
                  {isOpen && <p className="mt-2 max-w-3xl leading-relaxed text-paper/85">{follow}</p>}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import { criteriaLabels, formatDate, proposalStatusLabel } from "@/lib/labels";
import { EvidenceBadge } from "@/components/evidence/evidence-badge";

export type ProposalView = {
  id: string;
  themeSlug: string;
  themeName: string;
  title: string;
  plainSummary: string;
  originalExcerpt: string;
  problem: string;
  instruments: string;
  claimedBenefits: string;
  critiques: string;
  costs: string | null;
  implementationStatus: string;
  sourceLocator: string | null;
  infoDate: string;
  featured: boolean;
  isDemo: boolean;
  criteria: Record<string, number> | null;
  source: { title: string; url: string | null; institution: string; isDemo: boolean } | null;
};

/** Proposta com os dez campos editoriais. Promessa nunca aparece como política implementada. */
export function ProposalCard({ p, defaultOpen = false }: { p: ProposalView; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const rows: [string, string | null][] = [
    [`2 · O que consta na fonte original${p.sourceLocator ? ` (${p.sourceLocator})` : ""}`, p.originalExcerpt],
    ["3 · Problema que pretende enfrentar", p.problem],
    ["4 · Instrumentos necessários", p.instruments],
    ["5 · Benefícios alegados ou documentados", p.claimedBenefits],
    ["6 · Críticas fundamentadas e obstáculos", p.critiques],
    ["7 · Custos ou impactos estimados", p.costs ?? "Sem estimativa confiável disponível."],
  ];
  return (
    <article className="card relative">
      {p.isDemo && <span className="absolute right-3 top-3 border border-dashed border-ev-critique px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-widest text-ev-critique">Fictícia</span>}
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 pr-16">
          <EvidenceBadge kind="proposal" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">{p.themeName}</span>
        </div>
        <h3 className="mt-3 font-display text-xl leading-snug md:text-2xl">{p.title}</h3>
        <p className="mt-2 text-paper/85"><span className="kicker mr-2">1 · Em linguagem simples</span>{p.plainSummary}</p>
        <p className="mt-3 font-mono text-xs text-ash">
          8 · Situação: <span className="text-paper">{proposalStatusLabel[p.implementationStatus]}</span> · 10 · Informação de {formatDate(p.infoDate)}
        </p>
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="kicker mt-4 inline-flex min-h-11 items-center gap-2 text-paper">
          <span aria-hidden className={`inline-flex transition-transform ${open ? "rotate-90" : ""}`}><ChevronRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> {open ? "Recolher detalhes" : "Ver todos os campos"}
        </button>
        {open && (
          <div className="mt-2 space-y-4 border-t border-line pt-4">
            {rows.map(([k, v]) => (
              <div key={k}>
                <p className="kicker mb-1">{k}</p>
                <p className="text-sm leading-relaxed text-paper/85">{v}</p>
              </div>
            ))}
            <div>
              <p className="kicker mb-1">9 · Fonte original</p>
              {p.source ? (
                <p className="text-sm">
                  {p.source.url ? (
                    <a href={p.source.url} target="_blank" rel="noopener noreferrer" className="link-u">{p.source.title} <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></a>
                  ) : (
                    p.source.title
                  )}
                  <span className="text-ash"> — {p.source.institution}</span>
                </p>
              ) : (
                <p className="text-sm text-ash">Sem fonte registrada — esta proposta não deveria estar publicada.</p>
              )}
            </div>
            {p.criteria && (
              <div>
                <p className="kicker mb-2">Critérios de destaque (0–2, iguais para todas as candidaturas)</p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs md:grid-cols-3">
                  {Object.entries(criteriaLabels).map(([key, label]) => (
                    <div key={key} className="flex justify-between gap-2 border-b border-line py-1">
                      <dt className="text-ash">{label}</dt>
                      <dd>{p.criteria?.[key] ?? "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

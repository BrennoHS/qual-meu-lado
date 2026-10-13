"use client";

import { ArrowUpRight, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { ClaimView } from "@/lib/content/queries";
import { claimTypeLabel, evidenceKindForClaim, formatDate, linkStatusLabel, sourceKindLabel } from "@/lib/labels";
import { EvidenceBadge } from "./evidence-badge";

/**
 * Componente universal "Ver fonte". Abre um painel lateral (inferior no
 * celular) com a afirmação, sua classificação, contexto, limitações e cada
 * fonte com instituição, data, estado do link e acesso ao material completo.
 */
export function SourceButton({ claim, label = "Ver fonte", className = "" }: { claim?: ClaimView; label?: string; className?: string }) {
  if (!claim) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ash ${className}`}>
        <EvidenceBadge kind="unconfirmed" />
      </span>
    );
  }
  const n = claim.sources.length;
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={`inline-flex min-h-9 items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-paper/80 underline decoration-paper/30 underline-offset-4 hover:text-paper hover:decoration-paper ${className}`}
        aria-label={`${label}: ${n} ${n === 1 ? "fonte" : "fontes"}`}
      >
        <span aria-hidden><ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> {label} <span className="text-ash">({n})</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[88svh] overflow-y-auto border-t border-line bg-graphite-2 p-[var(--gutter)] pb-10 focus:outline-none md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:border-l md:border-t-0">
          <div className="flex items-start justify-between gap-4">
            <EvidenceBadge kind={evidenceKindForClaim(claim.type, claim.status)} />
            <Dialog.Close className="kicker -mr-2 -mt-2 h-11 px-2 text-paper">Fechar <X aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></Dialog.Close>
          </div>
          <Dialog.Title className="mt-4 font-display text-xl leading-snug">{claim.text}</Dialog.Title>
          <Dialog.Description className="sr-only">Origem e contexto desta informação</Dialog.Description>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs text-ash">
            <dt>Classificação</dt>
            <dd className="text-paper">{claimTypeLabel[claim.type] ?? claim.type}</dd>
            <dt>Verificado em</dt>
            <dd className="text-paper">{formatDate(claim.verifiedAt)}</dd>
            <dt>Identificador</dt>
            <dd className="break-all text-paper">{claim.key}</dd>
          </dl>

          {claim.status === "OUTDATED" && (
            <p className="mt-4 border border-dashed border-ev-critique p-3 text-sm text-ev-critique">Esta informação foi marcada como desatualizada e está em revisão.</p>
          )}
          {claim.excerpt && (
            <blockquote className="mt-5 border-l-2 border-paper/40 pl-4 text-sm italic text-paper/85">{claim.excerpt}</blockquote>
          )}
          {claim.context && (
            <section className="mt-5">
              <h3 className="kicker mb-1">Contexto</h3>
              <p className="text-sm leading-relaxed text-paper/85">{claim.context}</p>
            </section>
          )}
          {claim.limitations && (
            <section className="mt-4">
              <h3 className="kicker mb-1">Limitações</h3>
              <p className="text-sm leading-relaxed text-paper/85">{claim.limitations}</p>
            </section>
          )}

          <h3 className="kicker mb-3 mt-7">{n === 1 ? "Fonte" : `Fontes (${n})`}</h3>
          <ol className="space-y-3">
            {claim.sources.map((s) => (
              <li key={s.slug} className="border border-line bg-graphite p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
                  {sourceKindLabel[s.kind] ?? s.kind}
                  {s.publishedLabel ? ` · ${s.publishedLabel}` : ""}
                </p>
                <p className="mt-1 font-medium leading-snug">{s.title}</p>
                <p className="mt-1 text-sm text-ash">
                  {s.author ? `${s.author} — ` : ""}
                  {s.institution}
                  {s.locator ? ` · ${s.locator}` : ""}
                </p>
                {s.notes && <p className="mt-2 text-xs leading-relaxed text-ash">{s.notes}</p>}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[0.68rem] text-ash">{linkStatusLabel[s.linkStatus]}{s.linkCheckedAt ? ` · ${formatDate(s.linkCheckedAt)}` : ""}</span>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-10 px-3 py-2 text-[0.7rem]">
                      Abrir material <span aria-hidden><ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span>
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  ) : (
                    <span className="font-mono text-[0.68rem] text-ash">Referência bibliográfica</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs text-ash">
            Encontrou um problema nesta informação? <a className="link-u" href={`/contato?ref=${encodeURIComponent(claim.key)}`}>Reporte aqui</a>.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

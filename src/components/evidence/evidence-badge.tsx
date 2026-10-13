import { evidenceLabel, type EvidenceKind } from "@/lib/labels";

/** Cor + forma + texto: a etiqueta nunca depende só da cor (WCAG 1.4.1). */
const style: Record<EvidenceKind, { color: string; shape: string }> = {
  fact: { color: "var(--color-ev-fact)", shape: "■" },
  pro: { color: "var(--color-ev-pro)", shape: "▲" },
  critique: { color: "var(--color-ev-critique)", shape: "◆" },
  interpretation: { color: "var(--color-ev-interp)", shape: "●" },
  proposal: { color: "var(--color-ev-proposal)", shape: "▸" },
  prediction: { color: "var(--color-ev-proposal)", shape: "◇" },
  opinion: { color: "var(--color-ev-interp)", shape: "○" },
  unconfirmed: { color: "var(--color-ev-unconfirmed)", shape: "?" },
};

export function EvidenceBadge({ kind, className = "" }: { kind: EvidenceKind; className?: string }) {
  const s = style[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] ${kind === "unconfirmed" ? "border-dashed" : ""} ${className}`}
      style={{ color: s.color, borderColor: `color-mix(in srgb, ${s.color} 45%, transparent)` }}
    >
      <span aria-hidden>{s.shape}</span>
      {evidenceLabel[kind]}
    </span>
  );
}

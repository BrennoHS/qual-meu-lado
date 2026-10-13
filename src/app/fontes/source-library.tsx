"use client";

import { ArrowUpRight } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { formatDate, linkStatusLabel, sourceKindLabel } from "@/lib/labels";

type Src = {
  slug: string;
  title: string;
  url: string | null;
  institution: string;
  author: string | null;
  kind: string;
  publishedLabel: string | null;
  linkStatus: string;
  linkCheckedAt: string | null;
  isDemo: boolean;
  uses: number;
};

export function SourceLibrary({ sources }: { sources: Src[] }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("ALL");
  const dq = useDeferredValue(q);
  const kinds = useMemo(() => [...new Set(sources.map((s) => s.kind))], [sources]);
  const list = useMemo(() => {
    const term = dq.trim().toLowerCase();
    return sources.filter(
      (s) => (kind === "ALL" || s.kind === kind) && (!term || `${s.title} ${s.institution} ${s.author ?? ""}`.toLowerCase().includes(term)),
    );
  }, [sources, dq, kind]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <label className="flex-1">
          <span className="kicker mb-2 block">Buscar</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Título, instituição ou autoria"
            className="h-12 w-full border border-line bg-graphite-2 px-4 text-paper placeholder:text-ash focus:border-paper focus:outline-none"
          />
        </label>
        <label>
          <span className="kicker mb-2 block">Tipo</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="h-12 w-full border border-line bg-graphite-2 px-3 text-paper md:w-64">
            <option value="ALL">Todos</option>
            {kinds.map((k) => <option key={k} value={k}>{sourceKindLabel[k] ?? k}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-4 font-mono text-xs text-ash" aria-live="polite">{list.length} fontes</p>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {list.map((s) => (
          <li key={s.slug} id={s.slug} className="grid gap-2 py-5 md:grid-cols-[1fr_auto] md:gap-8">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ash">
                {sourceKindLabel[s.kind] ?? s.kind}
                {s.publishedLabel ? ` · ${s.publishedLabel}` : ""}
                {s.isDemo ? " · FICTÍCIA" : ""}
              </p>
              <p className="mt-1 font-medium">{s.title}</p>
              <p className="text-sm text-ash">{s.author ? `${s.author} — ` : ""}{s.institution}</p>
            </div>
            <div className="flex flex-col items-start gap-1 md:items-end">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-u text-sm">Abrir <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /><span className="sr-only"> (nova aba)</span></a>
              ) : (
                <span className="text-sm text-ash">Referência bibliográfica</span>
              )}
              <span className="font-mono text-[0.68rem] text-ash">{linkStatusLabel[s.linkStatus]}{s.linkCheckedAt ? ` · ${formatDate(s.linkCheckedAt)}` : ""}</span>
              <span className="font-mono text-[0.68rem] text-ash">Sustenta {s.uses} afirmação(ões)</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

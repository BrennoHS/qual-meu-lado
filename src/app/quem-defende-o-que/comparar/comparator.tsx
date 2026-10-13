"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ProposalView } from "@/components/candidates/proposal-card";
import { ProposalCard } from "@/components/candidates/proposal-card";

type Cand = { slug: string; ballotName: string; partyAcronym: string; isDemo: boolean; proposals: ProposalView[] };
const MAX = 4;

export function Comparator({ candidates, themes, initial }: { candidates: Cand[]; themes: { slug: string; name: string }[]; initial: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<string[]>(initial);
  const [theme, setTheme] = useState<string>("todos");

  function toggle(slug: string) {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : selected.length < MAX ? [...selected, slug] : selected;
    setSelected(next);
    router.replace(next.length ? `${pathname}?c=${next.join(",")}` : pathname, { scroll: false });
  }

  const chosen = selected.map((s) => candidates.find((c) => c.slug === s)!).filter(Boolean);
  const usedThemes = useMemo(() => {
    const set = new Set(chosen.flatMap((c) => c.proposals.map((p) => p.themeSlug)));
    return themes.filter((t) => set.has(t.slug));
  }, [chosen, themes]);
  const rows = theme === "todos" ? usedThemes : usedThemes.filter((t) => t.slug === theme);

  return (
    <div>
      <fieldset>
        <legend className="kicker mb-3">Escolha de 2 a {MAX} candidaturas</legend>
        <div className="flex flex-wrap gap-2">
          {candidates.map((c) => (
            <button key={c.slug} type="button" aria-pressed={selected.includes(c.slug)} onClick={() => toggle(c.slug)} className="chip min-h-12">
              {c.ballotName} <span className="font-mono text-xs opacity-70">{c.partyAcronym}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-xs text-ash" aria-live="polite">{selected.length} selecionada(s)</p>
      </fieldset>

      {chosen.length < 2 ? (
        <p role="status" className="mt-10 border border-dashed border-line p-8 text-center text-ash">Selecione pelo menos duas candidaturas para comparar.</p>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tema">
            <button type="button" className="chip" aria-pressed={theme === "todos"} onClick={() => setTheme("todos")}>Todos os temas</button>
            {usedThemes.map((t) => (
              <button key={t.slug} type="button" className="chip" aria-pressed={theme === t.slug} onClick={() => setTheme(t.slug)}>{t.name}</button>
            ))}
          </div>

          <div className="mt-8 space-y-12">
            {rows.map((t) => (
              <section key={t.slug} aria-labelledby={`t-${t.slug}`}>
                <h2 id={`t-${t.slug}`} className="h-section border-b border-line pb-3">{t.name}</h2>
                {/* No celular, rolagem horizontal com colunas de largura legível; no desktop, grade. */}
                <div className="-mx-[var(--gutter)] mt-5 overflow-x-auto px-[var(--gutter)] pb-2">
                  <div className="grid min-w-full gap-4" style={{ gridTemplateColumns: `repeat(${chosen.length}, minmax(min(82vw, 320px), 1fr))` }}>
                    {chosen.map((c) => {
                      const ps = c.proposals.filter((p) => p.themeSlug === t.slug);
                      return (
                        <div key={c.slug}>
                          <p className="kicker mb-3">
                            <Link href={`/quem-defende-o-que/${c.slug}`} className="hover:underline">{c.ballotName}</Link> · {c.partyAcronym}
                          </p>
                          {ps.length ? (
                            <div className="space-y-3">{ps.map((p) => <ProposalCard key={p.id} p={p} />)}</div>
                          ) : (
                            <p className="border border-dashed border-line p-4 text-sm text-ash">Nenhuma proposta documentada neste tema.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

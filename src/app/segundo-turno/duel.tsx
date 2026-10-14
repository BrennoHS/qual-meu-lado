"use client";

import { ArrowLeftRight, ArrowUpRight, Check, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, type PanInfo } from "motion/react";
import * as m from "motion/react-m";
import type { ProposalView } from "@/components/candidates/proposal-card";
import { ThemeIcon } from "@/components/art/icons";
import { CANDIDATE_PHOTOS, ROUNDS } from "@/lib/election";
import { useReadingMode } from "@/lib/journey/mode";
import { ModeToggle } from "@/components/site/hud";
import { proposalStatusLabel } from "@/lib/labels";
import { Gloss } from "@/lib/glossary";
import { Kinetic } from "@/components/reel/reel";
import { haptic } from "@/lib/haptics";

export type DuelCandidate = {
  slug: string;
  ballotName: string;
  name: string;
  party: string;
  partyAcronym: string;
  number: number | null;
  runningMate: string | null;
  proposals: ProposalView[];
};

/**
 * Comparar lado a lado: 8 rodadas temáticas, as duas candidaturas frente a frente.
 * Cores neutras (nunca vermelho/azul), mesma posição da home, com "Inverter lados".
 * Deslize (celular) ou use ← → para trocar de rodada.
 */
export function Duel({ candidates }: { candidates: DuelCandidate[] }) {
  const [order, setOrder] = useState<DuelCandidate[]>(candidates);
  const [round, setRound] = useState(0);
  const [dir, setDir] = useState(1);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const [plans, setPlans] = useState(false);
  const mode = useReadingMode();

  useEffect(() => setSeen((s) => new Set(s).add(round)), [round]);
  const r = ROUNDS[round];

  function goTo(i: number, scroll = true) {
    if (i < 0 || i >= ROUNDS.length || i === round) return;
    haptic("tap");
    setDir(i > round ? 1 : -1);
    setRound(i);
    setPlans(false);
    if (scroll) document.getElementById("duelo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Link direto para um tema (ex.: /segundo-turno?tema=saude, usado pela home).
  useEffect(() => {
    const tema = new URLSearchParams(window.location.search).get("tema");
    const i = ROUNDS.findIndex((x) => x.slug === tema);
    if (i <= 0) return;
    setRound(i);
    window.setTimeout(() => document.getElementById("duelo")?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  }, []);

  // ← → trocam de rodada (fora de campos de texto).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, [role=dialog]")) return;
      if (e.key === "ArrowRight") goTo(round + 1, false);
      if (e.key === "ArrowLeft") goTo(round - 1, false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -80 || info.velocity.x < -500) goTo(round + 1, false);
    else if (info.offset.x > 80 || info.velocity.x > 500) goTo(round - 1, false);
  }

  return (
    <div>
      {/* Frente a frente */}
      <div className="relative grid grid-cols-2 overflow-hidden border border-line bg-graphite-2">
        {order.map((c, i) => {
          const photo = CANDIDATE_PHOTOS[c.slug];
          const left = i === 0;
          return (
            <m.div
              key={c.slug}
              layout
              initial={{ opacity: 0, x: left ? -60 : 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 + i * 0.1 }}
              className={`relative min-h-56 overflow-hidden md:min-h-72 ${left ? "" : "text-right"}`}
            >
              {photo && (
                <div className={`pointer-events-none absolute bottom-0 h-[92%] w-[70%] opacity-30 ${left ? "left-0" : "right-0"}`}>
                  <Image src={photo.src} alt="" fill sizes="(min-width: 768px) 30vw, 45vw" className={`object-contain ${left ? "object-left-bottom" : "object-right-bottom"}`} />
                </div>
              )}
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,26,33,0.95),rgba(23,26,33,0.2)_60%)]" />
              <Link href={`/segundo-turno/${c.slug}`} className={`group relative flex h-full flex-col justify-end p-4 md:p-8 ${left ? "items-start" : "items-end"}`}>
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-ash">{c.partyAcronym}</span>
                <span className="display mt-1 block text-[clamp(2.6rem,9vw,5.5rem)] leading-none text-transparent" style={{ WebkitTextStroke: "1.2px var(--color-paper)" }}>
                  {c.number ?? "—"}
                </span>
                <span className="mt-2 block font-display text-xl tracking-tight group-hover:underline md:text-3xl">{c.ballotName}</span>
                <span className="mt-1 block text-xs text-ash md:text-sm">{c.runningMate ? `Vice: ${c.runningMate}` : c.party}</span>
                <span className="kicker mt-3 text-paper/80 group-hover:text-paper">Ver em sequência →</span>
              </Link>
            </m.div>
          );
        })}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-paper/40" />
        <m.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper bg-graphite font-display text-base font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          VS
          <m.span
            className="absolute inset-0 rounded-full border border-paper/60"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
          />
        </m.span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-ash">Mesma posição da página inicial. As cores são neutras e a ordem não indica preferência.</p>
        <button type="button" onClick={() => setOrder((o) => [...o].reverse())} className="kicker inline-flex min-h-9 items-center gap-2 text-paper hover:underline">
          <ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /> Inverter lados
        </button>
      </div>

      {/* Rodadas */}
      <section id="duelo" className="mt-14 scroll-mt-20" aria-labelledby="rodada-titulo">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="kicker">Deslize ou use ← → para trocar de rodada</p>
          <ModeToggle />
        </div>
        <div role="tablist" aria-label="Rodadas temáticas" className="scroll-strip -mx-[var(--gutter)] mt-4 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2">
          {ROUNDS.map((x, i) => (
            <button key={x.slug} role="tab" type="button" aria-selected={i === round} onClick={() => goTo(i)} className="chip shrink-0 gap-2 whitespace-nowrap">
              <ThemeIcon name={x.icon} className="h-4 w-4" />
              {x.label}
              {seen.has(i) && i !== round && <span aria-label="vista" className="text-ev-pro"><Check aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span>}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {ROUNDS.map((x, i) => (
            <span key={x.slug} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
              <m.span className="block h-full bg-paper" initial={false} animate={{ scaleX: seen.has(i) ? 1 : 0 }} style={{ originX: 0 }} transition={{ type: "spring", stiffness: 140, damping: 22 }} />
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <m.div
            key={r.slug}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 60 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 * dir }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="touch-pan-y"
          >
            <div className="mt-10 flex items-start gap-4">
              <m.span
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line bg-graphite-2"
              >
                <ThemeIcon name={r.icon} className="h-7 w-7" />
              </m.span>
              <div className="min-w-0">
                <p className="kicker">
                  <span className="display mr-2 text-2xl leading-none text-paper">{String(round + 1).padStart(2, "0")}</span>
                  <span className="text-ash">/ {String(ROUNDS.length).padStart(2, "0")} · </span>
                  {r.label}
                </p>
                <h2 id="rodada-titulo" className="mt-2 font-display text-[clamp(1.6rem,4.5vw,3rem)] leading-tight tracking-tight">
                  <Kinetic text={r.question} active step={0.035} delay={0.1} gloss />
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <m.button
                type="button"
                whileTap={{ scale: 0.95 }}
                aria-pressed={plans}
                onClick={() => {
                  haptic("tap");
                  setPlans((v) => !v);
                }}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] transition-colors ${plans ? "border-paper bg-paper text-graphite" : "border-paper/40 text-paper hover:border-paper"}`}
              >
                <span aria-hidden><Quote aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> {plans ? "Voltar aos resumos" : "Ver os trechos dos dois planos"}
              </m.button>
            </div>

            <div className="relative mt-6 grid gap-4 md:grid-cols-2">
              {order.map((c, ci) => {
                const ps = c.proposals.filter((p) => p.themeSlug === r.slug);
                const headline = ps.find((p) => p.featured) ?? ps[0];
                const others = ps.filter((p) => p !== headline);
                const left = ci === 0;
                return (
                  <m.article
                    key={c.slug}
                    initial={{ opacity: 0, x: left ? -50 : 50, rotate: left ? -1.5 : 1.5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 130, damping: 18, delay: 0.15 + ci * 0.1 }}
                    className="flex flex-col [perspective:1400px]"
                    aria-label={`${c.ballotName}: ${r.label}`}
                  >
                    <m.div
                      className="relative grid flex-1 [transform-style:preserve-3d]"
                      animate={{ rotateY: plans ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: ci * 0.08 }}
                    >
                      {/* frente: resumo */}
                      <div className="col-start-1 row-start-1 flex flex-col border border-line bg-graphite-2 [backface-visibility:hidden]" aria-hidden={plans}>
                        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
                          <span className="font-display text-lg">{c.ballotName}</span>
                          <span className="font-mono text-xs text-ash">
                            {c.partyAcronym} · {c.number}
                          </span>
                        </header>
                        {headline ? <HeadlineProposal p={headline} deep={mode === "aprofundado"} /> : <p className="p-5 text-sm text-ash">O plano registrado não traz proposta destacada neste tema.</p>}
                        {others.length > 0 && (
                          <details className="group border-t border-line px-5 py-3" open={mode === "aprofundado"}>
                            <summary className="kicker cursor-pointer list-none text-paper">
                              <span className="inline-block transition-transform group-open:rotate-90"><ChevronRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> Mais {others.length} proposta(s) neste tema
                            </summary>
                            <ul className="mt-3 space-y-2">
                              {others.map((p) => (
                                <li key={p.id} className="border-l-2 border-paper/30 pl-3">
                                  <span className="font-display">{p.title}</span>
                                  <span className="block text-sm text-paper/75">{p.plainSummary}</span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                      {/* verso: trecho literal do plano */}
                      <div className="col-start-1 row-start-1 flex flex-col bg-paper p-5 text-graphite [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-6" aria-hidden={!plans}>
                        <p className="kicker text-graphite/60">
                          {c.ballotName} · plano registrado no TSE{headline?.sourceLocator ? ` · ${headline.sourceLocator}` : ""}
                        </p>
                        {headline ? (
                          <>
                            <blockquote className="mt-3 font-display text-[1.05rem] leading-snug md:text-lg">“{headline.originalExcerpt}”</blockquote>
                            {headline.source?.url && (
                              <a href={headline.source.url} target="_blank" rel="noopener noreferrer" tabIndex={plans ? 0 : -1} className="kicker mt-auto pt-4 text-graphite underline underline-offset-4">
                                Abrir o plano oficial <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} />
                              </a>
                            )}
                          </>
                        ) : (
                          <p className="mt-3 text-sm">Sem proposta destacada neste tema.</p>
                        )}
                      </div>
                    </m.div>
                  </m.article>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button type="button" onClick={() => goTo(round - 1)} disabled={round === 0} className="btn btn-ghost disabled:opacity-30">
                ← Anterior
              </button>
              {round < ROUNDS.length - 1 ? (
                <m.button type="button" whileTap={{ scale: 0.96 }} onClick={() => goTo(round + 1)} className="btn btn-solid">
                  Próxima rodada: {ROUNDS[round + 1].label} →
                </m.button>
              ) : (
                <Link href="/afinidades" className="btn btn-afinidade">
                  Você viu as 8 rodadas. Descobrir minha afinidade →
                </Link>
              )}
            </div>
          </m.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

function HeadlineProposal({ p, deep }: { p: ProposalView; deep: boolean }) {
  const [crit, setCrit] = useState(false);
  return (
    <div className="flex flex-1 flex-col p-5 md:p-6">
      <h3 className="font-display text-2xl leading-snug tracking-tight">{p.title}</h3>
      <p className="mt-3 text-[1.05rem] leading-relaxed text-paper/90">
        <Gloss text={p.plainSummary} />
      </p>
      <p className="mt-3 font-mono text-xs text-ash">{proposalStatusLabel[p.implementationStatus]}</p>
      <div className="mt-5 space-y-2 border-t border-line pt-4">
        <button type="button" aria-expanded={crit || deep} onClick={() => setCrit((v) => !v)} className="kicker flex min-h-10 w-full items-center gap-2 text-left text-paper">
          <span aria-hidden className={`inline-flex transition-transform ${crit || deep ? "rotate-90" : ""}`}><ChevronRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span>
          Pontos de atenção e críticas
        </button>
        <AnimatePresence initial={false}>
          {(crit || deep) && (
            <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="border-l-4 border-ev-critique pb-3 pl-3 text-sm leading-relaxed text-paper/85">
                <Gloss text={p.critiques} />
              </p>
            </m.div>
          )}
        </AnimatePresence>
        {deep && (
          <dl className="grid gap-3 pt-2 text-sm">
            <div>
              <dt className="kicker">Problema que quer resolver</dt>
              <dd className="text-paper/85">{p.problem}</dd>
            </div>
            <div>
              <dt className="kicker">Como seria feito</dt>
              <dd className="text-paper/85">{p.instruments}</dd>
            </div>
            <div>
              <dt className="kicker">Benefícios alegados</dt>
              <dd className="text-paper/85">{p.claimedBenefits}</dd>
            </div>
            <div>
              <dt className="kicker">Custo estimado</dt>
              <dd className="text-paper/85">{p.costs ?? "Sem estimativa confiável disponível."}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}

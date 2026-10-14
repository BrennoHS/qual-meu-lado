"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useJourney } from "@/lib/journey/store";
import { readProgress } from "@/lib/reel/progress";
import { Vignette } from "@/components/art/dimension-art";

/** Vinheta de cada passo, desenhada quando o cartão aparece na tela. */
const STEP_ART: Record<number, string> = { 1: "assentos-esquerda", 2: "assentos-direita", 3: "balanca", 4: "urna" };
function StepArt({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span ref={ref} aria-hidden className="ml-auto h-10 w-[3.75rem] text-paper/70">
      {seen && <Vignette name={STEP_ART[n]} className="h-10 w-[3.75rem]" />}
    </span>
  );
}

/**
 * O caminho do site em 4 passos — para ninguém se perder.
 * O estado vem só deste navegador (capítulos vistos, respostas, reels abertos).
 */
const TOTAL_CHAPTERS = 7;
const TOTAL_STATEMENTS = 24;

type Step = { n: number; title: string; hint: string; href: string; done: boolean; progress: string | null; resume?: string | null; tone?: "esquerda" | "direita" };

export function useJourneySteps(): { steps: Step[]; next: Step | null; ready: boolean } {
  const { visited, answers } = useJourney();
  const [ready, setReady] = useState(false);
  const [sawProposals, setSawProposals] = useState(false);
  const [resume, setResume] = useState<Record<string, { href: string; label: string }>>({});
  useEffect(() => {
    setReady(true);
    const all = readProgress();
    setSawProposals(Object.entries(all).some(([id, p]) => id.startsWith("cand:") && p.index > 0));
    // "Continuar de onde parei" mora aqui (e não no hero): leva ao ponto exato do reel.
    const r: Record<string, { href: string; label: string }> = {};
    for (const side of ["esquerda", "direita"]) {
      const p = all[side];
      const cap = p?.label.match(/Cap\. (\d+)/)?.[1];
      if (p && p.index > 0 && p.index < p.total - 1) r[side] = { href: p.href, label: cap ? `Continuar do cap. ${cap}` : "Continuar de onde parei" };
    }
    setResume(r);
  }, []);
  const chapters = (side: string) => new Set(visited.filter((v) => v.side === side).map((v) => v.chapter)).size;
  const esq = ready ? chapters("esquerda") : 0;
  const dir = ready ? chapters("direita") : 0;
  const ans = ready ? Object.keys(answers).length : 0;
  const steps: Step[] = [
    { n: 1, title: "Conhecer a esquerda", hint: "O que defende, os melhores argumentos e as críticas.", href: resume.esquerda?.href ?? "/explorar/esquerda", done: esq >= TOTAL_CHAPTERS, progress: esq > 0 && esq < TOTAL_CHAPTERS ? `${esq}/${TOTAL_CHAPTERS}` : null, resume: esq < TOTAL_CHAPTERS ? resume.esquerda?.label : null, tone: "esquerda" },
    { n: 2, title: "Conhecer a direita", hint: "As mesmas perguntas, pelo outro lado — com o mesmo peso.", href: resume.direita?.href ?? "/explorar/direita", done: dir >= TOTAL_CHAPTERS, progress: dir > 0 && dir < TOTAL_CHAPTERS ? `${dir}/${TOTAL_CHAPTERS}` : null, resume: dir < TOTAL_CHAPTERS ? resume.direita?.label : null, tone: "direita" },
    { n: 3, title: "Descobrir sua afinidade", hint: "24 afirmações rápidas: com que lado você se identifica mais.", href: "/afinidades", done: ans >= TOTAL_STATEMENTS, progress: ans > 0 && ans < TOTAL_STATEMENTS ? `${ans}/${TOTAL_STATEMENTS}` : null },
    { n: 4, title: "Ver as propostas do 2º turno", hint: "O que cada candidatura promete, tema por tema, com o trecho do plano.", href: "/segundo-turno", done: sawProposals, progress: null },
  ];
  return { steps, next: steps.find((s) => !s.done) ?? null, ready };
}

/** Versão completa (home): os 4 passos, com o próximo em destaque. */
export function JourneySteps({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { steps, next } = useJourneySteps();
  return (
    <ol className={compact ? "space-y-1" : "grid gap-3 md:grid-cols-4"}>
      {steps.map((s, i) => {
        const isNext = next?.n === s.n;
        return (
          <m.li key={s.n} initial={{ opacity: 0, y: compact ? 0 : 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
            <Link
              href={s.href}
              onClick={onNavigate}
              data-side={s.tone}
              aria-current={isNext ? "step" : undefined}
              className={`group relative flex h-full gap-3 border transition-colors ${compact ? "items-center px-3 py-2.5" : "flex-col p-5"} ${
                isNext ? "border-paper bg-paper/[0.06]" : "border-line hover:border-paper/60"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-sm ${s.done ? "border-transparent bg-paper text-graphite" : isNext ? "border-paper text-paper" : "border-line text-ash"}`}
                >
                  {s.done ? <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} /> : s.n}
                </span>
                {!compact && isNext && <span className="kicker text-paper">Próximo passo</span>}
                {!compact && s.done && <span className="kicker text-ash">Feito</span>}
                {!compact && <StepArt n={s.n} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-display tracking-tight ${compact ? "text-base" : "mt-1 text-xl"} ${s.done ? "text-paper/70" : "text-paper"}`}>
                  {s.title}
                  {s.progress && <span className="ml-2 font-mono text-xs text-ash">{s.progress}</span>}
                </span>
                {s.resume ? (
                  <span className={`mt-1 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-[var(--accent-ink)]`}>
                    <RotateCcw aria-hidden className="h-3 w-3" /> {s.resume}
                  </span>
                ) : (
                  !compact && <span className="mt-1 block text-sm text-paper/70">{s.hint}</span>
                )}
              </span>
              {s.tone && <span aria-hidden className={`absolute bottom-0 left-0 top-0 w-[3px] ${s.tone === "esquerda" ? "bg-esq" : "bg-dir"}`} />}
              <ArrowRight aria-hidden className={`h-4 w-4 shrink-0 text-ash transition-transform group-hover:translate-x-1 ${compact ? "" : "mt-auto self-end"}`} />
            </Link>
          </m.li>
        );
      })}
    </ol>
  );
}

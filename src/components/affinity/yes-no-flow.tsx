"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, useIsPresent, useReducedMotion, type TargetAndTransition } from "motion/react";
import * as m from "motion/react-m";
import { ArrowLeft, ArrowRight, ChevronRight, CircleCheck, Hand, Lock, Scale as ScaleIcon, Timer } from "lucide-react";
import type { ClaimView, StatementView } from "@/lib/content/queries";
import type { Answer } from "@/lib/affinity/score";
import { setAnswer, useJourney } from "@/lib/journey/store";
import { SourceButton } from "@/components/evidence/source-panel";
import { useTransitionNav } from "@/components/transition/transition-provider";
import { DimensionArt } from "@/components/art/dimension-art";
import { Scale } from "@/components/art/illustrations";
import { Gloss } from "@/lib/glossary";
import { haptic } from "@/lib/haptics";

const STAMP: Record<Answer, string> = { agree: "SIM", disagree: "NÃO", depends: "DEPENDE", unknown: "NÃO SEI" };

/** Para onde a carta "voa" ao responder. Sim sobe, Não desce — nunca esquerda/direita (não sugere lado). */
const EXIT: Record<Answer | "skip", TargetAndTransition> = {
  agree: { y: -260, rotate: 6, opacity: 0, scale: 0.9 },
  disagree: { y: 260, rotate: -6, opacity: 0, scale: 0.9 },
  depends: { scale: 0.7, opacity: 0 },
  unknown: { scale: 0.8, opacity: 0, filter: "blur(6px)" },
  skip: { x: -120, opacity: 0 },
};

type Toast = { id: number; text: string; icon: "round" | "done" };

/**
 * Questionário em cartas, em 3 rodadas (cada rodada passa uma vez por cada tema).
 * Sim = "Concordo", Não = "Discordo"; "Depende", "Não sei" e "Entender melhor"
 * têm sempre o mesmo acesso. SIM e NÃO têm peso visual idêntico e cores neutras.
 * Responder já leva à próxima — sem tela intermediária.
 */
export function YesNoFlow({ statements, claims, startKey }: { statements: StatementView[]; claims: Record<string, ClaimView>; startKey?: string }) {
  const { answers } = useJourney();
  const reduce = useReducedMotion();
  const { go: navigate } = useTransitionNav();
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(!!startKey);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [stamp, setStamp] = useState<Answer | null>(null);
  const [exitAs, setExitAs] = useState<Answer | "skip">("skip");
  const [toast, setToast] = useState<Toast | null>(null);
  const busy = useRef(false);

  const total = statements.length;
  const perRound = useMemo(() => new Set(statements.map((s) => s.dimensionKey)).size || 8, [statements]);
  const rounds = Math.ceil(total / perRound);
  const answeredCount = useMemo(() => statements.filter((x) => answers[x.key]).length, [statements, answers]);

  // Retoma da primeira afirmação sem resposta (ou da pedida em ?revisar=).
  useEffect(() => {
    setMounted(true);
    const byKey = startKey ? statements.findIndex((s) => s.key === startKey) : -1;
    const firstOpen = statements.findIndex((s) => !answers[s.key]);
    setIndex(byKey >= 0 ? byKey : firstOpen >= 0 ? firstOpen : 0);
    // Só no carregamento inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1900);
    return () => window.clearTimeout(t);
  }, [toast]);

  const s = statements[index];
  const round = Math.floor(index / perRound);

  const finish = useCallback(() => navigate("/afinidades/resultado", { label: "Sua afinidade", sub: "Pesando suas respostas", tone: "neutral" }), [navigate]);

  const goTo = useCallback(
    (next: number, as: Answer | "skip" = "skip") => {
      setExitAs(as);
      setExpanded(false);
      setStamp(null);
      if (next >= total) return finish();
      setIndex(Math.max(0, next));
    },
    [total, finish],
  );

  const answer = useCallback(
    (a: Answer) => {
      if (!s || busy.current) return;
      busy.current = true;
      haptic(a === "agree" || a === "disagree" ? "choose" : "tap");
      const wasAnswered = !!answers[s.key];
      setAnswer(s.key, a);
      setStamp(a);
      const after = answeredCount + (wasAnswered ? 0 : 1);
      // Fechou a rodada? Avisa sem parar a pessoa.
      const roundKeys = statements.slice(round * perRound, (round + 1) * perRound).map((x) => x.key);
      const roundDone = roundKeys.every((k) => k === s.key || answers[k]);
      const roundWasDone = roundKeys.every((k) => answers[k]);
      if (after >= total) setToast({ id: Date.now(), text: "Pronto! Vamos ver sua afinidade", icon: "done" });
      else if (roundDone && !roundWasDone) setToast({ id: Date.now(), text: `Rodada ${round + 1} de ${rounds} concluída`, icon: "round" });
      window.setTimeout(
        () => {
          busy.current = false;
          if (after >= total) return goTo(total, a);
          const nextOpen = statements.findIndex((x, i) => i > index && !answers[x.key] && x.key !== s.key);
          const anyOpen = statements.findIndex((x) => !answers[x.key] && x.key !== s.key);
          goTo(nextOpen >= 0 ? nextOpen : anyOpen >= 0 ? anyOpen : index + 1, a);
        },
        reduce ? 120 : 520,
      );
    },
    [s, answers, answeredCount, statements, round, perRound, total, rounds, index, goTo, reduce],
  );

  // Atalhos: S = sim, N = não, D = depende.
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, [role=dialog]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "s") answer("agree");
      if (k === "n") answer("disagree");
      if (k === "d") answer("depends");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, started]);

  if (!s) return null;
  if (!started) return <Intro answered={mounted ? answeredCount : 0} total={total} rounds={rounds} perRound={perRound} onStart={() => setStarted(true)} />;
  const current = answers[s.key];

  return (
    <div className="relative flex h-[calc(100svh-3.5rem-1px)] flex-col overflow-hidden">
      {/* brilho de fundo que pulsa a cada resposta */}
      <AnimatePresence>
        {stamp && (
          <m.div
            key={`${s.key}-${stamp}`}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.7 }}
            style={{ background: "radial-gradient(60% 50% at 50% 45%, rgba(245,243,238,0.18), transparent 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* Progresso em rodadas */}
      <div className="wrap relative shrink-0 pt-3 md:pt-5">
        <div className="flex items-center justify-between gap-4 font-mono text-xs text-ash">
          <span className="flex items-center gap-2">
            <span className="text-paper">
              Rodada {round + 1} de {rounds}
            </span>
            <span aria-hidden>·</span>
            <m.span key={answeredCount} initial={{ scale: 1.5, color: "#f5f3ee" }} animate={{ scale: 1, color: "#a8abb4" }} className="inline-block tabular-nums">
              {answeredCount}
            </m.span>
            de {total}
          </span>
          <span className="flex items-center gap-3">
            <span className="hidden items-center gap-1 lg:inline-flex"><Lock aria-hidden className="h-3 w-3" /> só neste navegador</span>
            <Link href="/afinidades/resultado" className="link-u text-paper">
              {answeredCount === total ? "Ver minha afinidade" : "Ver indicador parcial"}
            </Link>
          </span>
        </div>
        <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${rounds}, minmax(0, 1fr))` }} aria-hidden>
          {Array.from({ length: rounds }).map((_, r) => (
            <div key={r} className="flex gap-[3px]">
              {statements.slice(r * perRound, (r + 1) * perRound).map((x, j) => {
                const i = r * perRound + j;
                return (
                  <span key={x.key} className="relative h-[4px] flex-1 overflow-hidden rounded-full bg-line">
                    <m.span className="absolute inset-0 origin-left bg-paper" initial={false} animate={{ scaleX: answers[x.key] ? 1 : 0, opacity: i === index ? 1 : 0.55 }} transition={{ type: "spring", stiffness: 200, damping: 24 }} />
                    {i === index && <m.span layoutId="yn-cursor" className="absolute inset-0 rounded-full ring-1 ring-paper" />}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* avisos de rodada (ícone, nunca emoji) */}
      <AnimatePresence>
        {toast && (
          <m.p
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 top-16 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-paper py-2 pl-3 pr-5 font-display text-base text-graphite shadow-[0_10px_40px_rgba(0,0,0,0.4)] md:text-lg"
            role="status"
          >
            {toast.icon === "done" ? <ScaleIcon aria-hidden className="h-5 w-5" /> : <CircleCheck aria-hidden className="h-5 w-5" />}
            {toast.text}
          </m.p>
        )}
      </AnimatePresence>

      {/* Baralho de afirmações */}
      <div className="wrap relative flex min-h-0 flex-1 flex-col justify-center py-3 md:py-6">
        <div className="relative mx-auto flex max-h-full w-full max-w-4xl">
          {[2, 1].map((d) => (
            <span key={d} aria-hidden className="absolute inset-0 rounded-2xl border border-line bg-graphite-2" style={{ transform: `translateY(${d * 10}px) scale(${1 - d * 0.03})`, opacity: 0.5 - d * 0.15 }} />
          ))}
          <AnimatePresence mode="popLayout" custom={exitAs}>
            <m.section
              key={s.key}
              custom={exitAs}
              variants={{ exit: (as: Answer | "skip") => EXIT[as] }}
              initial={{ opacity: 0, y: 40, scale: 0.94, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit="exit"
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="relative max-h-full w-full overflow-y-auto overscroll-contain rounded-2xl border border-paper/25 bg-graphite-2 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:p-8 [@media(min-width:768px)_and_(max-height:800px)]:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-paper/80">
                  Tema: {s.dimensionName}
                </span>
                <DimensionArt dimension={s.dimensionKey} className="h-12 w-[4.5rem] shrink-0 text-paper/75 md:h-20 md:w-28 [@media(min-width:768px)_and_(max-height:800px)]:h-12 [@media(min-width:768px)_and_(max-height:800px)]:w-[4.5rem]" />
              </div>
              <p className="kicker mt-3">Você concorda?</p>
              <CardTitle className="mt-1.5 font-display text-[clamp(1.3rem,4.4vw,2.6rem)] md:text-[clamp(1.3rem,min(4.4vw,5vh),2.6rem)] font-semibold leading-[1.12] tracking-tight">
                “<Gloss text={s.text} />”
              </CardTitle>
              <p className="mt-3 max-w-2xl text-[0.95rem] text-paper/70 md:text-base">
                <Gloss text={s.context} />
              </p>
              <button type="button" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)} className="kicker mt-3 inline-flex min-h-10 w-fit items-center gap-2 text-paper">
                <span aria-hidden className={`inline-flex transition-transform ${expanded ? "rotate-90" : ""}`}>
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                Entender melhor antes de responder
              </button>
              <AnimatePresence initial={false}>{expanded && <Arguments s={s} claims={claims} />}</AnimatePresence>
              {current && !stamp && <p className="mt-4 font-mono text-xs text-ash">Sua resposta atual: {STAMP[current]} — pode mudar.</p>}

              {/* carimbo */}
              <AnimatePresence>
                {stamp && (
                  <m.span
                    initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
                    animate={{ scale: 1, opacity: 1, rotate: -10 }}
                    transition={{ type: "spring", stiffness: 420, damping: 18 }}
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border-4 border-paper bg-graphite/85 px-5 py-1 font-display text-4xl font-bold tracking-wider text-paper shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:text-6xl"
                    aria-hidden
                  >
                    {STAMP[stamp]}
                  </m.span>
                )}
              </AnimatePresence>
            </m.section>
          </AnimatePresence>
        </div>
      </div>

      {/* Respostas */}
      <div className="z-10 shrink-0 bg-graphite/95 backdrop-blur-sm">
        <div className="relative grid grid-cols-2 border-t border-line">
          {(["agree", "disagree"] as const).map((a) => {
            const on = stamp === a || (!stamp && current === a);
            return (
              <m.button
                key={a}
                type="button"
                onClick={() => answer(a)}
                aria-pressed={current === a}
                whileTap={{ scale: 0.96 }}
                animate={stamp ? { opacity: stamp === a ? 1 : 0.3 } : { opacity: 1 }}
                className={`group relative flex h-[13svh] min-h-[4.5rem] max-h-32 flex-col items-center justify-center gap-1 overflow-hidden transition-colors ${on ? "bg-paper text-graphite" : "hover:bg-graphite-2"}`}
              >
                <span className="display text-[clamp(2.2rem,9vw,4.8rem)] md:text-[clamp(2rem,min(9vw,8vh),4.8rem)]">{a === "agree" ? "Sim" : "Não"}</span>
                <span className="kicker" style={{ color: "inherit", opacity: 0.75 }}>
                  {a === "agree" ? "Concordo" : "Discordo"} <span className="hidden md:inline">· tecla {a === "agree" ? "S" : "N"}</span>
                </span>
              </m.button>
            );
          })}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-paper/80 shadow-[0_0_20px_2px_rgba(245,243,238,0.25)]" />
        </div>
        <div className="grid grid-cols-4 border-t border-line">
          <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="chip min-h-12 justify-center gap-1.5 border-0 border-r disabled:opacity-30">
            <ArrowLeft aria-hidden className="h-4 w-4" /> Voltar
          </button>
          {(["depends", "unknown"] as const).map((a) => (
            <button key={a} type="button" onClick={() => answer(a)} aria-pressed={current === a} className="chip min-h-12 justify-center border-0 border-r">
              {a === "depends" ? "Depende" : "Não sei"}
            </button>
          ))}
          <button type="button" onClick={() => goTo(index + 1)} disabled={index === total - 1} className="chip min-h-12 justify-center gap-1.5 border-0 disabled:opacity-40">
            Pular <ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Abertura: o que é, quanto tempo leva, e que nada sai do celular. */
function Intro({ answered, total, rounds, perRound, onStart }: { answered: number; total: number; rounds: number; perRound: number; onStart: () => void }) {
  const items = [
    { icon: Hand, text: "Toque em Sim ou Não. Se não tiver certeza, use Depende ou Não sei." },
    { icon: Timer, text: `${rounds} rodadas de ${perRound} perguntas — uns 4 minutos.` },
    { icon: ScaleIcon, text: "Não existe resposta certa. No fim, você vê com que lado suas respostas combinam mais." },
    { icon: Lock, text: "Fica só no seu celular. Ninguém vê suas respostas — nem nós." },
  ];
  const all = answered >= total;
  return (
    <div className="wrap flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-10">
      <m.div initial={{ rotate: -10 }} animate={{ rotate: [-10, 8, -4, 0] }} transition={{ duration: 1.6 }} className="w-fit">
        <Scale className="h-16 w-20 text-paper" />
      </m.div>
      <p className="kicker mt-6">Indicador de afinidade</p>
      <h1 className="display mt-3 max-w-4xl text-[clamp(2.2rem,7vw,5rem)]">Com que lado você se identifica mais?</h1>
      <ul className="mt-8 grid max-w-3xl gap-3 md:grid-cols-2">
        {items.map(({ icon: Icon, text }, i) => (
          <m.li key={text} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="flex gap-3 border border-paper/15 bg-graphite-2 p-4">
            <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-paper/80" />
            <span className="text-[0.98rem] leading-snug text-paper/90">{text}</span>
          </m.li>
        ))}
      </ul>
      {answered > 0 && !all && (
        <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 flex items-center gap-2 text-paper/85">
          <CircleCheck aria-hidden className="h-5 w-5 text-ev-pro" />
          Você já respondeu {answered} durante a leitura — elas já contam. Faltam {total - answered}.
        </m.p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <m.button type="button" whileTap={{ scale: 0.96 }} onClick={onStart} className="btn btn-solid">
          {answered > 0 && !all ? "Continuar" : all ? "Revisar minhas respostas" : "Começar"} <ArrowRight aria-hidden className="h-4 w-4" />
        </m.button>
        {all && (
          <Link href="/afinidades/resultado" className="btn">
            Ver minha afinidade
          </Link>
        )}
      </div>
    </div>
  );
}

/** Título da carta: só a carta presente tem o id (a que está saindo vira decorativa). */
function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  const present = useIsPresent();
  return present ? (
    <h2 id="afirmacao" className={className}>
      {children}
    </h2>
  ) : (
    <p aria-hidden className={className}>
      {children}
    </p>
  );
}

function Arguments({ s, claims }: { s: StatementView; claims: Record<string, ClaimView> }) {
  return (
    <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="mt-4 grid gap-px border border-line bg-line md:grid-cols-2">
        <div className="bg-graphite p-4">
          <p className="kicker mb-2">Quem concorda</p>
          <p className="text-sm leading-relaxed text-paper/85">{s.argumentsAgree}</p>
        </div>
        <div className="bg-graphite p-4">
          <p className="kicker mb-2">Quem discorda</p>
          <p className="text-sm leading-relaxed text-paper/85">{s.argumentsDisagree}</p>
        </div>
        {s.whyDepends && (
          <div className="bg-graphite p-4 md:col-span-2">
            <p className="kicker mb-2">Por que pode depender</p>
            <p className="text-sm leading-relaxed text-paper/85">{s.whyDepends}</p>
          </div>
        )}
      </div>
      {s.claimKeys.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-5">
          {s.claimKeys.map((k) => (
            <SourceButton key={k} claim={claims[k]} />
          ))}
        </div>
      )}
    </m.div>
  );
}

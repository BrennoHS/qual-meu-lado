"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { setChoice, useJourney, type Choice } from "@/lib/journey/store";
import { Scale } from "@/components/art/illustrations";
import { TLink } from "@/components/transition/transition-provider";
import { ShareChip } from "@/components/reel/share-chip";
import { CHOICE_SHARE } from "@/lib/choice";
import { haptic } from "@/lib/haptics";

const OPTIONS: { value: Choice; title: string; hint: string; side?: string }[] = [
  { value: "esquerda", title: "Mais perto da esquerda", hint: "As ideias sobre igualdade e papel do Estado fizeram mais sentido para mim.", side: "esquerda" },
  { value: "direita", title: "Mais perto da direita", hint: "As ideias sobre liberdade, ordem e mercado fizeram mais sentido para mim.", side: "direita" },
  { value: "ambos", title: "Um pouco de cada", hint: "Concordo com um lado em alguns temas e com o outro em outros." },
  { value: "indeciso", title: "Ainda não sei", hint: "Preciso pensar mais — e tudo bem." },
];

const RESPONSES: Record<Choice, { title: string; body: string }> = {
  esquerda: {
    title: "Você se sente mais perto da esquerda.",
    body: "Isso não quer dizer que você concorda com tudo que a esquerda defende — nem com todo político de esquerda. Vale olhar com calma as críticas ao campo e conferir as propostas concretas de quem disputa a eleição.",
  },
  direita: {
    title: "Você se sente mais perto da direita.",
    body: "Isso não quer dizer que você concorda com tudo que a direita defende — nem com todo político de direita. Vale olhar com calma as críticas ao campo e conferir as propostas concretas de quem disputa a eleição.",
  },
  ambos: {
    title: "Você é um pouco de cada — como muita gente.",
    body: "Concordar com lados diferentes em temas diferentes não é indecisão: é ter opinião própria. Comparar propostas tema por tema costuma ajudar mais do que escolher um rótulo.",
  },
  indeciso: {
    title: "Ainda não sabe? Tudo bem.",
    body: "Política é complicada mesmo. Uma boa forma de avançar é responder às afirmações do mapa e comparar o que cada candidatura propõe nos temas que mais importam para você.",
  },
};

export function ChoiceExperience() {
  const { visited, answers, choice } = useJourney();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const esq = mounted ? new Set(visited.filter((v) => v.side === "esquerda").map((v) => v.chapter)).size : 0;
  const dir = mounted ? new Set(visited.filter((v) => v.side === "direita").map((v) => v.chapter)).size : 0;
  const answered = mounted ? Object.keys(answers).length : 0;
  const current = mounted ? choice : undefined;
  const unbalanced = esq === 0 || dir === 0;

  return (
    <div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {[
          { k: "Capítulos da esquerda", v: esq, of: 7 },
          { k: "Capítulos da direita", v: dir, of: 7 },
          { k: "Afirmações respondidas", v: answered, of: 24 },
        ].map((s) => (
          <div key={s.k} className="bg-graphite p-5">
            <p className="kicker">{s.k}</p>
            <p className="mt-1 font-display text-5xl font-bold">{s.v}<span className="text-2xl text-ash">/{s.of}</span></p>
          </div>
        ))}
      </div>

      {mounted && unbalanced && (
        <div className="mt-6 flex flex-col gap-4 border border-ev-critique/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-paper/90">
            {esq === 0 && dir === 0
              ? "Você ainda não explorou nenhum dos lados. Que tal começar antes de escolher?"
              : `Você ainda não viu a ${esq === 0 ? "esquerda" : "direita"}. Escolher conhecendo um lado só é escolher pela metade.`}
          </p>
          {esq === 0 ? (
            <TLink href="/explorar/esquerda" scene={{ label: "Esquerda", sub: "Capítulo 1", tone: "esquerda", number: "1" }} className="btn shrink-0" data-side="esquerda">Ver a esquerda</TLink>
          ) : (
            <TLink href="/explorar/direita" scene={{ label: "Direita", sub: "Capítulo 1", tone: "direita", number: "1", from: "right" }} className="btn shrink-0" data-side="direita">Ver a direita</TLink>
          )}
        </div>
      )}

      <fieldset className="mt-12">
        <legend className="display text-[clamp(2rem,6vw,4rem)]">Qual frase combina mais com você?</legend>
        <p className="mt-3 max-w-xl text-paper/75">Sua resposta fica só neste navegador. Ninguém mais vê — nem nós. Você pode mudar quando quiser.</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {OPTIONS.map((o, i) => {
            const on = current === o.value;
            return (
              <m.button
                key={o.value}
                type="button"
                data-side={o.side}
                aria-pressed={on}
                onClick={() => setChoice(on ? null : o.value)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden border p-6 text-left transition-colors ${on ? "border-paper bg-paper text-graphite" : "border-line hover:border-paper"}`}
              >
                {o.side && <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${on ? "bg-graphite" : "bg-[var(--accent)]"}`} />}
                <span className="block font-display text-2xl tracking-tight">{o.title}</span>
                <span className={`mt-2 block text-sm ${on ? "text-graphite/75" : "text-ash"}`}>{o.hint}</span>
              </m.button>
            );
          })}
        </div>
      </fieldset>

      <AnimatePresence mode="wait">
        {current && (
          <m.section key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-[auto_1fr]" aria-live="polite">
            <Scale tilt={current === "esquerda" ? -0.8 : current === "direita" ? 0.8 : 0} className="h-24 w-28 text-paper" />
            <div>
              <h2 className="display text-[clamp(1.8rem,4.5vw,3.2rem)]">{RESPONSES[current].title}</h2>
              <p className="mt-4 max-w-2xl text-lg text-paper/80">{RESPONSES[current].body}</p>
              <ShareCard choice={current} />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/segundo-turno" className="btn btn-solid">Comparar as propostas do 2º turno</Link>
                <Link href="/afinidades" className="btn btn-afinidade">Fazer o teste de afinidade</Link>
                <Link href="/temas" className="btn btn-ghost">Comparar tema por tema</Link>
              </div>
              <p className="mt-6 text-sm text-ash">
                Lembrete: o voto é secreto e é seu. Este site não recomenda candidaturas e não guarda sua escolha.
              </p>
            </div>
          </m.section>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A frase de quem acredita mais neste lado — pronta para compartilhar, se a pessoa quiser. */
function ShareCard({ choice }: { choice: Choice }) {
  const c = CHOICE_SHARE[choice];
  const side = c.tone === "esquerda" || c.tone === "direita" ? c.tone : undefined;
  return (
    <m.div
      data-side={side}
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.15 }}
      className="relative mt-8 overflow-hidden border border-[var(--accent)] p-6 md:p-8"
      style={{ background: c.tone === "ambos" ? "linear-gradient(90deg, color-mix(in srgb, var(--color-esq-deep) 70%, transparent), transparent 50%, color-mix(in srgb, var(--color-dir-deep) 70%, transparent))" : "color-mix(in srgb, var(--accent-deep) 65%, var(--color-graphite))" }}
    >
      <p className="kicker text-[var(--accent-ink)]">{c.headline}</p>
      <p className="mt-3 max-w-2xl font-display text-[clamp(1.4rem,3.6vw,2.2rem)] leading-snug">“{c.belief}”</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <ShareChip path={`/eu/${choice}`} title={`${c.headline} · DOIS LADOS`} text={`${c.headline}: “${c.belief}” E você? Conheça os dois lados:`} label="Compartilhar minha frase" />
        <a
          href={`/og/escolha/${choice}?formato=story`}
          download={`dois-lados-${choice}.png`}
          onClick={() => haptic("tap")}
          className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-paper/85 hover:text-paper"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M12 4v11M7 10l5 5 5-5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Baixar imagem para stories
        </a>
      </div>
      <p className="mt-4 text-xs text-paper/60">Compartilhar mostra sua opinião para quem receber — faça só se quiser. O link leva só esta frase; nós não guardamos sua escolha.</p>
    </m.div>
  );
}

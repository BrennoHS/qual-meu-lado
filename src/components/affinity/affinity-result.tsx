"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import * as m from "motion/react-m";
import type { DimensionView, StatementView } from "@/lib/content/queries";
import { BALANCE_BAND, CENTER_BAND, MIN_DECISIVE, MIN_DIMENSIONS_FOR_SIDE, overallSide, scoreAffinity, type DimensionResult } from "@/lib/affinity/score";
import { SideReveal } from "./side-reveal";
import { answerLabel } from "@/lib/labels";
import { clearJourney, useJourney } from "@/lib/journey/store";

const relationText: Record<DimensionResult["relation"], (r: DimensionResult) => string> = {
  CONVENTIONAL: (r) => `Associação convencional: “${r.leftPole === "A" ? r.poleA : r.poleB}” costuma ser associado à esquerda; “${r.leftPole === "A" ? r.poleB : r.poleA}”, à direita.`,
  WEAK: () => "Associação fraca com esquerda/direita — categoria em parte didática.",
  NONE: () => "Sem associação com esquerda ou direita — categoria didática.",
};

export function AffinityResult({ dimensions, statements }: { dimensions: DimensionView[]; statements: StatementView[] }) {
  const { answers } = useJourney();
  const summary = useMemo(
    () => scoreAffinity(dimensions, statements.map((s) => ({ key: s.key, dimensionKey: s.dimensionKey, direction: s.direction, text: s.text })), answers),
    [dimensions, statements, answers],
  );
  const [confirmClear, setConfirmClear] = useState(false);

  if (summary.answeredCount === 0) {
    return (
      <div className="wrap py-24 text-center">
        <p className="kicker">Seu mapa de afinidades</p>
        <h1 className="display mt-4 text-[clamp(2.2rem,7vw,5rem)]">Ainda não há respostas.</h1>
        <p className="mx-auto mt-6 max-w-lg text-paper/75">O mapa é calculado no seu navegador a partir das afirmações que você responder. Nada é enviado ao servidor.</p>
        <Link href="/afinidades" className="btn btn-afinidade mt-10">Começar o teste</Link>
      </div>
    );
  }

  const overall = overallSide(summary);
  // Com resultado, o título principal (h1) é o lado; sem ele, é este bloco.
  const Heading = overall ? "h2" : "h1";
  const { conventional } = summary;
  const mixed = [conventional.towardLeft, conventional.towardRight, conventional.balanced].filter((n) => n > 0).length > 1;

  return (
    <div>
      {overall && <SideReveal result={overall} total={summary.totalCount} answered={summary.answeredCount} />}
      {!overall && (
        <section className="border-b border-line bg-graphite-2">
          <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8">
            <p className="max-w-xl text-lg">
              <strong className="font-display">Quase lá.</strong> Para mostrar com que lado você se identifica mais, precisamos de respostas “Sim” ou “Não” em pelo menos {MIN_DIMENSIONS_FOR_SIDE} temas.
            </p>
            <Link href="/afinidades" className="btn btn-afinidade">Continuar respondendo</Link>
          </div>
        </section>
      )}
      <section className="border-b border-line">
        <div className="wrap py-14 md:py-24">
          <p className="kicker">Tema por tema · calculado neste navegador</p>
          <Heading className="display mt-5 max-w-5xl text-[clamp(2.2rem,7vw,5.6rem)]">
            {mixed || summary.determinate > 1 ? "Sua visão política tem mais nuances do que apenas dois lados." : "Seus padrões, tema por tema."}
          </Heading>
          <dl className="mt-12 grid grid-cols-3 gap-px border border-line bg-line">
            {[
              { k: "Afirmações respondidas", v: `${summary.answeredCount}`, s: `de ${summary.totalCount}` },
              { k: "Dimensões com padrão", v: `${summary.determinate}`, s: `de ${summary.dimensions.length}` },
              { k: "Indeterminadas", v: `${summary.indeterminate.length}`, s: "respostas insuficientes" },
            ].map((x, i) => (
              <div key={x.k} className="bg-graphite p-4 md:p-6">
                <dt className="kicker text-[0.65rem] md:text-xs">{x.k}</dt>
                <m.dd className="mt-2 font-display text-5xl font-bold tracking-tight md:text-7xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>{x.v}</m.dd>
                <dd className="font-mono text-xs text-ash">{x.s}</dd>
              </div>
            ))}
          </dl>
          {summary.determinate > 0 && (
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/85">
              Nas dimensões em que existe associação convencional com esquerda e direita, suas respostas ficaram mais próximas do polo associado à esquerda em{" "}
              <strong>{conventional.towardLeft}</strong>, do polo associado à direita em <strong>{conventional.towardRight}</strong> e em equilíbrio em{" "}
              <strong>{conventional.balanced}</strong>. Isso descreve padrões nas suas respostas a {summary.answeredCount} afirmações — não define quem você é.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="dimensoes" className="wrap py-14 md:py-20">
        <h2 id="dimensoes" className="h-section">Dimensão por dimensão</h2>
        <ol className="mt-10 space-y-12">
          {summary.dimensions.map((r, i) => (
            <DimensionStrip key={r.key} r={r} i={i} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="metodo" className="border-t border-line bg-graphite-2">
        <div className="wrap grid gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 id="metodo" className="h-section">Como cada indicador foi calculado</h2>
            <ol className="rt mt-6">
              <li>Cada resposta vira um valor: Concordo = +1, Discordo = −1, Depende = 0. “Não sei” não entra no cálculo.</li>
              <li>O valor é ajustado pela direção da afirmação (algumas foram escritas para que concordar aproxime de um polo; outras, do polo oposto — isso reduz o efeito de quem tende a concordar com tudo).</li>
              <li>A posição é a média dos valores, de −1 a +1. A proximidade é convertida em porcentagem: 50% = equilíbrio exato.</li>
              <li>Com menos de {MIN_DECISIVE} respostas “Concordo” ou “Discordo”, a dimensão fica indeterminada e nenhum percentual é exibido.</li>
              <li>Posições entre ±{Math.round(BALANCE_BAND * 100) / 100} são descritas como equilíbrio.</li>
              <li>O lado geral (esquerda, centro ou direita) é a média das dimensões com associação convencional (peso 1) ou fraca (peso 0,5); as dimensões didáticas nunca entram. Médias entre ±{CENTER_BAND} são “centro”. São necessárias ao menos {MIN_DIMENSIONS_FOR_SIDE} dimensões com padrão.</li>
            </ol>
          </div>
          <div>
            <h2 className="h-section">Limitações</h2>
            <ul className="rt mt-6">
              <li>São apenas 3 afirmações por dimensão: os percentuais são aproximações grosseiras, não medições.</li>
              <li>A escolha e a redação das afirmações são decisões editoriais e influenciam o resultado.</li>
              <li>As dimensões são simplificações. Algumas seguem classificações da ciência política; outras são didáticas (indicadas em cada uma).</li>
              <li>O mesmo conjunto de respostas sempre gera o mesmo resultado, mas o resultado não tem validação estatística como instrumento de pesquisa.</li>
            </ul>
            {summary.indeterminate.length > 0 && (
              <p className="mt-6 text-sm text-ash">Ficaram indeterminadas: {summary.indeterminate.join(", ")}.</p>
            )}
          </div>
        </div>
      </section>

      <section className="wrap flex flex-wrap items-center gap-3 py-12">
        <Link href="/afinidades" className="btn btn-solid">Revisar respostas</Link>
        <Link href="/meu-percurso" className="btn">Ver meu percurso</Link>
        <Link href="/como-construimos#mapa" className="btn btn-ghost">Metodologia completa</Link>
        {confirmClear ? (
          <span className="flex items-center gap-2">
            <button type="button" className="btn" onClick={() => { clearJourney(); setConfirmClear(false); }}>Confirmar: apagar tudo</button>
            <button type="button" className="kicker min-h-11 px-2" onClick={() => setConfirmClear(false)}>Cancelar</button>
          </span>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmClear(true)}>Apagar minhas respostas</button>
        )}
        <p className="w-full pt-4 text-sm text-ash">
          Seu resultado é calculado e guardado só neste navegador. Compartilhar é opcional: o link e a imagem levam apenas o lado e a posição no trilho — nunca suas respostas.
        </p>
      </section>
    </div>
  );
}

function DimensionStrip({ r, i }: { r: DimensionResult; i: number }) {
  const [open, setOpen] = useState(false);
  const pct = r.poleAPercent;
  // Marcador: polo A à esquerda do trilho (0%), polo B à direita (100%).
  const markerLeft = r.position === null ? null : ((1 - r.position) / 2) * 100;
  return (
    <li>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl tracking-tight md:text-3xl">
          <span className="mr-3 font-mono text-sm text-ash">{String(i + 1).padStart(2, "0")}</span>
          {r.name}
        </h3>
        <p className="font-mono text-xs text-ash">
          {r.status === "indeterminate" ? "Indeterminada" : `Baseado em ${r.answered} de ${r.total} afirmações`}
        </p>
      </div>

      <div className="mt-5">
        <div className="relative h-14">
          <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
          <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-ash/60" />
          {[0, 100].map((p) => (
            <div key={p} className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-ash" style={{ left: `${p}%` }} />
          ))}
          {markerLeft !== null ? (
            <m.div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ left: "50%", opacity: 0 }}
              whileInView={{ left: `${markerLeft}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.1 }}
            >
              <span className="block h-6 w-6 rounded-full border-2 border-graphite bg-paper shadow-[0_0_0_6px_rgba(245,243,238,0.12)]" />
            </m.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-graphite px-3 font-mono text-xs text-ash">Respostas insuficientes</span>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-6 text-sm">
          <span className="max-w-[45%]">{r.poleA}</span>
          <span className="max-w-[45%] text-right">{r.poleB}</span>
        </div>
      </div>

      {pct !== null && (
        <p className="mt-4 text-paper/85">
          <span className="font-display text-4xl font-bold tracking-tight">≈{r.lean === "B" ? 100 - pct : pct}%</span>
          {r.lean === "balanced" ? (
            <span className="ml-2">— equilíbrio entre os polos</span>
          ) : (
            <span className="ml-2">de proximidade com “{r.lean === "B" ? r.poleB : r.poleA}”</span>
          )}
        </p>
      )}
      <p className="mt-2 text-sm text-ash">{relationText[r.relation](r)}</p>

      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="kicker mt-3 inline-flex min-h-11 items-center gap-2 text-paper">
        <span aria-hidden className={`inline-flex transition-transform ${open ? "rotate-90" : ""}`}><ChevronRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> Quais respostas contribuíram
      </button>
      {open && (
        <ul className="mt-2 divide-y divide-line border-y border-line text-sm">
          {r.contributions.map((c) => (
            <li key={c.statementKey} className="grid gap-2 py-3 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-6">
              <span className="text-paper/85">{c.text}</span>
              <span className="font-mono text-xs">{c.answer ? answerLabel[c.answer] : "Sem resposta"}</span>
              <span className="flex items-center gap-4 font-mono text-xs text-ash">
                {c.value === null ? "fora do cálculo" : `valor ${c.value > 0 ? "+" : ""}${c.value}`}
                <Link href={`/afinidades?revisar=${c.statementKey}`} className="link-u text-paper">revisar</Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

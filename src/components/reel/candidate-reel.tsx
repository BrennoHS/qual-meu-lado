"use client";

import { ArrowLeftRight, ArrowUpRight, Layers, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { CandidateReelData, CandidateSlide, CandidateSummary } from "@/lib/reel/types";
import { CANDIDATE_PHOTOS, ROUNDS } from "@/lib/election";
import { useReadingMode } from "@/lib/journey/mode";
import { proposalStatusLabel } from "@/lib/labels";
import { ThemeIcon } from "@/components/art/icons";
import { Gloss } from "@/lib/glossary";
import { TLink } from "@/components/transition/transition-provider";
import { Kinetic, Reel, pop, rise, stage, useReel } from "./reel";
import { DeepSwitch, ReelClose } from "./controls";
import { ResumePill } from "./resume-pill";
import { ShareChip } from "./share-chip";
import { candidateSlideSpeech, INTERACTIVE_KINDS } from "@/lib/reel/speech";
import { saveProgress } from "@/lib/reel/progress";
import { haptic } from "@/lib/haptics";
import { trackDepth } from "@/lib/metrics/client";

/**
 * As propostas de uma candidatura como reel: capa, 8 rodadas temáticas
 * (as mesmas, na mesma ordem, para as duas) e um fim que leva à outra.
 * Cores neutras: nenhuma candidatura herda o vermelho ou o azul dos lados.
 */
export function CandidateReel({ data }: { data: CandidateReelData }) {
  const mode = useReadingMode();
  const slides = useMemo(() => (mode === "aprofundado" ? data.slides : data.slides.filter((s) => s.layer === "surface")), [data.slides, mode]);
  const keys = useMemo(() => slides.map((s) => s.key), [slides]);
  const segs = useMemo(() => slides.map((s) => s.seg), [slides]);
  const [startKey, setStartKey] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const { candidate: c, rival } = data;

  // Ponto de partida: #tela (voltar/retomar) ou ?tema=… (links compartilhados).
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    const tema = new URLSearchParams(window.location.search).get("tema");
    if (h) setStartKey(h);
    else if (tema) setStartKey(`r-${tema}`);
  }, []);

  const onActive = useCallback(
    (i: number) => {
      setActive(i);
      const s = slides[i];
      if (!s) return;
      if (i > 0) window.history.replaceState(window.history.state, "", `#${s.key}`);
      // Só o tema, nunca a candidatura (ver src/lib/metrics/schema.ts).
      trackDepth("segundo-turno", i, s.key.replace(/-inside$/, ""));
      saveProgress(`cand:${c.slug}`, {
        key: s.key,
        index: i,
        total: slides.length,
        label: `Propostas de ${c.ballotName} · ${ROUNDS[s.seg]?.label ?? ""}`,
        href: `/segundo-turno/${c.slug}#${s.key}`,
      });
    },
    [slides, c.slug, c.ballotName],
  );

  const round = ROUNDS[slides[active]?.seg ?? 0];
  const photo = CANDIDATE_PHOTOS[c.slug];

  return (
    <div>
      <h1 className="sr-only">Propostas de {c.ballotName} para o 2º turno</h1>
      <Reel
        keys={keys}
        segs={segs}
        segments={ROUNDS.map((r) => r.label)}
        label={`Propostas de ${c.ballotName}, tema por tema`}
        startKey={startKey}
        onActive={onActive}
        speech={(i) => (slides[i] ? candidateSlideSpeech(slides[i], c, rival) : "")}
        interactive={(i) => INTERACTIVE_KINDS.has(slides[i]?.kind ?? "")}
        secs={slides.map((s) => s.secs ?? 0)}
        overlay={<ResumePill reelId={`cand:${c.slug}`} keys={keys} skip={!!startKey} atStart={active === 0} />}
        ambient={(i) => <CandidateAmbient src={photo?.src} cover={slides[i]?.kind === "cover" || slides[i]?.kind === "end"} />}
        topLeft={
          <>
            <ReelClose href="/?ver=propostas" />
            <span className="min-w-0 truncate">
              <span className="kicker block text-paper"><span className="sm:hidden">{c.ballotName.split(" ")[0]}</span><span className="hidden sm:inline">{c.ballotName}</span> · {c.number}</span>
              <span className="block truncate font-display text-sm text-paper/75">{round?.label}</span>
            </span>
          </>
        }
        topRight={
          <>
            <TLink
              href={`/segundo-turno/${rival.slug}#r-${round?.slug ?? ROUNDS[0].slug}`}
              scene={{ label: rival.ballotName, sub: `Propostas · ${round?.label ?? ""}`, tone: "neutral", number: rival.number ? String(rival.number) : undefined }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-paper/40 px-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-graphite"
              aria-label={`Ver este tema nas propostas de ${rival.ballotName}`}
            >
              <span aria-hidden><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span> <span className="max-w-[7rem] truncate">{rival.ballotName.split(" ")[0]}</span>
            </TLink>
            <DeepSwitch />
          </>
        }
        render={(i, isActive) => <CandidateSlideView slide={slides[i]} active={isActive} data={data} />}
      />
    </div>
  );
}

/**
 * Fundo das propostas: o retrato fica parado (não pisca a cada tema), alinhado
 * à base da tela e à borda direita da coluna de conteúdo no computador, e
 * centralizado embaixo no celular. Esmaece em direção ao texto para não
 * competir com a leitura; fica mais presente só na capa e no fim.
 */
function CandidateAmbient({ src, cover }: { src?: string; cover: boolean }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 72% 100%, #2a3040, transparent 70%), linear-gradient(180deg, #14171e, #111318)" }} />
      {src && (
        <m.div
          className="absolute bottom-0 left-1/2 h-[64svh] w-[min(100vw,52svh)] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent,#000_40%)] md:left-auto md:right-[max(0px,calc(50vw-32rem))] md:h-[90svh] md:w-[72svh] md:translate-x-0 md:[mask-image:linear-gradient(to_right,transparent,#000_35%)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: cover ? 0.36 : 0.15, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={src} alt="" fill priority sizes="(min-width: 768px) 72vh, 100vw" className="object-contain object-bottom" />
        </m.div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_45%,rgba(17,19,24,0.55))]" />
    </>
  );
}

function Stage({ active, children, className = "" }: { active: boolean; children: React.ReactNode; className?: string }) {
  return (
    <m.div variants={stage} initial="hidden" animate={active ? "show" : "hidden"} className={className}>
      {children}
    </m.div>
  );
}

function CandidateSlideView({ slide, active, data }: { slide: CandidateSlide; active: boolean; data: CandidateReelData }) {
  switch (slide.kind) {
    case "cover":
      return <Cover c={data.candidate} planUrl={data.planUrl} active={active} />;
    case "proposal":
      return <ProposalSlide slide={slide} active={active} data={data} />;
    case "inside":
      return <InsideSlide slide={slide} active={active} />;
    case "end":
      return <End data={data} active={active} />;
  }
}

function Cover({ c, planUrl, active }: { c: CandidateSummary; planUrl: string | null; active: boolean }) {
  const { next } = useReel();
  return (
    <Stage active={active} className="relative">
      <m.p variants={rise} className="kicker text-ev-pro">Eleições 2026 · 2º turno · 25 de outubro</m.p>
      <div className="mt-4 flex items-end gap-5">
        <m.span variants={pop} className="display text-[clamp(5rem,18vw,11rem)] leading-[0.8] text-transparent" style={{ WebkitTextStroke: "1.5px var(--color-paper)" }}>
          {c.number}
        </m.span>
      </div>
      <h2 className="display mt-5 text-[clamp(2.4rem,8vw,5.5rem)]">
        <Kinetic text={c.ballotName} active={active} step={0.09} delay={0.15} />
      </h2>
      <m.p variants={rise} className="mt-3 text-lg text-paper/85">
        {c.party} ({c.partyAcronym}){c.runningMate ? ` · Vice: ${c.runningMate}` : ""}
      </m.p>
      {c.coalition && <m.p variants={rise} className="mt-1 text-sm text-ash">Coligação “{c.coalition}”</m.p>}
      <m.p variants={rise} className="mt-7 max-w-xl text-lg leading-relaxed text-paper/85">
        Nas próximas telas, a principal proposta de {c.ballotName.split(" ")[0]} em <strong className="text-paper">8 temas</strong> — com o trecho exato do plano registrado no
        TSE e os pontos de atenção.
      </m.p>
      <m.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={next} className="btn btn-solid">Começar ↓</button>
        {planUrl && (
          <a href={planUrl} target="_blank" rel="noopener noreferrer" className="kicker link-u text-paper/80">Plano de governo oficial (PDF, TSE) <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></a>
        )}
      </m.div>
    </Stage>
  );
}

type Face = "front" | "plan" | "rival";

function ProposalSlide({ slide, active, data }: { slide: Extract<CandidateSlide, { kind: "proposal" }>; active: boolean; data: CandidateReelData }) {
  const [face, setFace] = useState<Face>("front");
  const [crit, setCrit] = useState(false);
  const mode = useReadingMode();
  useEffect(() => {
    if (!active) {
      setFace("front");
      setCrit(false);
    }
  }, [active]);
  const { round, p, rival } = slide;
  const idx = ROUNDS.findIndex((r) => r.slug === round.slug);

  return (
    <Stage active={active}>
      <m.div variants={rise} className="flex items-center gap-3">
        <m.span variants={pop} className="grid h-12 w-12 place-items-center rounded-full border border-paper/40 bg-graphite/70">
          <ThemeIcon name={round.icon} className="h-6 w-6" />
        </m.span>
        <p className="kicker">Rodada {idx + 1} de {ROUNDS.length} · {round.label}</p>
      </m.div>
      <h2 className="mt-3 font-display text-[clamp(1.4rem,5vw,3.2rem)] font-semibold leading-[1.08] tracking-tight">
        <Kinetic text={round.question} active={active} step={0.04} delay={0.15} gloss />
      </h2>

      <div className="mt-5 [perspective:1600px] md:mt-7">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={face}
            initial={{ rotateY: -80, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {face === "front" && (
              <article className="border border-paper/25 bg-graphite-2/90 p-4 backdrop-blur md:p-8" aria-label={`Proposta de ${data.candidate.ballotName}`}>
                {p ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <span className="kicker text-ev-proposal">{data.candidate.ballotName} propõe</span>
                      <span className="font-mono text-[0.7rem] text-ash">{proposalStatusLabel[p.implementationStatus]}</span>
                    </div>
                    <h3 className="mt-2 font-display text-[clamp(1.2rem,3.5vw,2.2rem)] leading-tight tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-[0.98rem] leading-relaxed text-paper/90 md:text-lg"><Gloss text={p.plainSummary} /></p>
                    <AnimatePresence initial={false}>
                      {crit && (
                        <m.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-5 border-l-4 border-ev-critique pl-4">
                            <p className="kicker text-ev-critique">Pontos de atenção</p>
                            <p className="mt-2 leading-relaxed text-paper/88"><Gloss text={p.critiques} /></p>
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <p className="text-lg text-paper/80">O plano registrado não traz uma proposta destacada neste tema.</p>
                )}
              </article>
            )}
            {face === "plan" && p && (
              <article className="bg-paper p-5 text-graphite md:p-8" aria-label="Trecho do plano registrado">
                <p className="kicker text-graphite/60">O que diz o plano registrado no TSE{p.sourceLocator ? ` · ${p.sourceLocator}` : ""}</p>
                <blockquote className="mt-4 font-display text-[clamp(1.1rem,2.8vw,1.6rem)] leading-snug">“{p.originalExcerpt}”</blockquote>
                {p.source?.url && (
                  <a href={p.source.url} target="_blank" rel="noopener noreferrer" className="kicker mt-5 inline-block text-graphite underline underline-offset-4">
                    Abrir o plano oficial <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} />
                  </a>
                )}
              </article>
            )}
            {face === "rival" && (
              <article className="border border-dashed border-paper/40 bg-graphite/85 p-5 backdrop-blur md:p-8" aria-label={`No mesmo tema, ${data.rival.ballotName}`}>
                <div className="flex items-center gap-3">
                  <RivalAvatar c={data.rival} />
                  <p className="kicker">No mesmo tema, {data.rival.ballotName} propõe</p>
                </div>
                {rival ? (
                  <>
                    <h3 className="mt-3 font-display text-[clamp(1.3rem,3.2vw,2rem)] leading-tight tracking-tight">{rival.title}</h3>
                    <p className="mt-3 leading-relaxed text-paper/88"><Gloss text={rival.plainSummary} /></p>
                  </>
                ) : (
                  <p className="mt-3 text-paper/80">O plano registrado não traz uma proposta destacada neste tema.</p>
                )}
                <TLink
                  href={`/segundo-turno/${data.rival.slug}#r-${round.slug}`}
                  scene={{ label: data.rival.ballotName, sub: `Propostas · ${round.label}`, tone: "neutral", number: data.rival.number ? String(data.rival.number) : undefined }}
                  className="kicker link-u mt-5 inline-block text-paper"
                >
                  Ver em detalhes nas propostas de {data.rival.ballotName} →
                </TLink>
              </article>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      {p && (
        <m.div variants={rise} className="mt-4 flex flex-wrap gap-2">
          <FaceButton on={face === "plan"} onClick={() => setFace(face === "plan" ? "front" : "plan")}>
            <span aria-hidden><Quote aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> {face === "plan" ? "Voltar ao resumo" : `O que diz o plano${p.sourceLocator ? ` (${p.sourceLocator})` : ""}`}
          </FaceButton>
          <FaceButton on={crit && face === "front"} onClick={() => { setFace("front"); setCrit((v) => !v); }}>
            <span aria-hidden>!</span> Pontos de atenção
          </FaceButton>
          <FaceButton on={face === "rival"} onClick={() => setFace(face === "rival" ? "front" : "rival")}>
            <span aria-hidden><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span> {face === "rival" ? "Voltar" : `E ${data.rival.ballotName.split(" ")[0]}?`}
          </FaceButton>
        </m.div>
      )}
      <m.div variants={rise} className="mt-2 flex flex-wrap items-center justify-between gap-x-4">
        {slide.more > 0 && mode === "essencial" ? (
          <span className="text-xs text-ash">+ {slide.more} {slide.more === 1 ? "proposta" : "propostas"} no modo Aprofundar</span>
        ) : (
          <span />
        )}
        <ShareChip
          path={`/segundo-turno/${data.candidate.slug}?tema=${round.slug}`}
          title={`${round.label}: o que propõem os dois candidatos · DOIS LADOS`}
          text={`${round.label}: compare o que cada candidatura propõe, com o trecho do plano registrado no TSE:`}
          label="Compartilhar este tema"
          className="text-[0.7rem] text-ash"
        />
      </m.div>
    </Stage>
  );
}

function FaceButton({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <m.button
      type="button"
      onClick={() => {
        haptic("tap");
        onClick();
      }}
      aria-pressed={on}
      whileTap={{ scale: 0.94 }}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] transition-colors ${on ? "border-paper bg-paper text-graphite" : "border-paper/35 text-paper hover:border-paper"}`}
    >
      {children}
    </m.button>
  );
}

function RivalAvatar({ c }: { c: CandidateSummary }) {
  const photo = CANDIDATE_PHOTOS[c.slug];
  return (
    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-paper/40 bg-graphite-3">
      {photo && <Image src={photo.src} alt="" fill sizes="40px" className="object-cover object-top" />}
    </span>
  );
}

function InsideSlide({ slide, active }: { slide: Extract<CandidateSlide, { kind: "inside" }>; active: boolean }) {
  const { p, others, round } = slide;
  const rows: [string, string][] = [
    ["Problema que quer resolver", p.problem],
    ["Como seria feito", p.instruments],
    ["Benefícios alegados", p.claimedBenefits],
    ["Custo estimado", p.costs ?? "Sem estimativa confiável disponível."],
  ];
  return (
    <Stage active={active}>
      <m.span variants={rise} className="kicker mb-4 inline-flex items-center gap-2 rounded-full border border-dashed border-paper/40 px-3 py-1 text-paper/80">
        <span aria-hidden><Layers aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> Aprofundando · {round.label}
      </m.span>
      <m.h2 variants={rise} className="h-section">Por dentro: {p.title}</m.h2>
      <m.dl variants={stage} className="mt-6 grid gap-3 md:grid-cols-2">
        {rows.map(([k, v]) => (
          <m.div key={k} variants={rise} className="border border-paper/15 bg-graphite/70 p-3 backdrop-blur md:p-4">
            <dt className="kicker">{k}</dt>
            <dd className="mt-1 text-[0.9rem] leading-snug text-paper/88 md:text-[0.98rem] md:leading-relaxed"><Gloss text={v} /></dd>
          </m.div>
        ))}
      </m.dl>
      {others.length > 0 && (
        <m.div variants={rise} className="mt-6">
          <p className="kicker">Outras propostas neste tema</p>
          <ul className="mt-3 space-y-2">
            {others.map((o) => (
              <li key={o.id} className="border-l-2 border-paper/30 pl-3">
                <span className="font-display text-lg">{o.title}</span>
                <span className="block text-sm text-paper/75">{o.plainSummary}</span>
              </li>
            ))}
          </ul>
        </m.div>
      )}
    </Stage>
  );
}

function End({ data, active }: { data: CandidateReelData; active: boolean }) {
  const { candidate: c, rival } = data;
  return (
    <Stage active={active} className="text-center">
      <m.p variants={rise} className="kicker">Você viu as 8 rodadas de {c.ballotName}</m.p>
      <h2 className="display mt-4 text-[clamp(2.2rem,7vw,5rem)]">
        <Kinetic text="Agora, a outra proposta de país." active={active} step={0.07} />
      </h2>
      <m.p variants={rise} className="mx-auto mt-5 max-w-xl text-lg text-paper/85">
        Comparar é o melhor jeito de decidir. Veja o que {rival.ballotName} propõe nos mesmos 8 temas, na mesma ordem.
      </m.p>
      <m.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
        <TLink
          href={`/segundo-turno/${rival.slug}`}
          scene={{ label: rival.ballotName, sub: "Propostas · 2º turno", tone: "neutral", number: rival.number ? String(rival.number) : undefined }}
          className="btn btn-solid"
        >
          Ver as propostas de {rival.ballotName} →
        </TLink>
        <Link href="/segundo-turno" className="btn">Comparar lado a lado</Link>
        <Link href="/afinidades" className="btn btn-afinidade">Descobrir minha afinidade</Link>
      </m.div>
      <m.p variants={rise} className="mx-auto mt-8 max-w-md text-sm text-ash">
        O voto é secreto e é seu. Este site não recomenda candidaturas e não guarda o que você vê.
      </m.p>
      <m.p variants={rise} className="mt-4 text-xs text-ash">
        <Link href="/creditos" className="underline decoration-ash/40 hover:text-paper">Créditos das fotos</Link>
      </m.p>
    </Stage>
  );
}


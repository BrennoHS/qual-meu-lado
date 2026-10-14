"use client";

import { ArrowLeftRight, BookOpen, Check, ChevronDown, CopyCheck, ChevronLeft, ChevronRight, Layers, LayoutGrid, Pause, Play, Pointer, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, useAnimationControls } from "motion/react";
import * as m from "motion/react-m";
import type { SideReelData, SideSlide } from "@/lib/reel/types";
import { RichText } from "@/lib/richtext";
import { Gloss } from "@/lib/glossary";
import { markVisited, useJourney } from "@/lib/journey/store";
import { useReadingMode } from "@/lib/journey/mode";
import { SourceButton } from "@/components/evidence/source-panel";
import { Glossary, Pulse } from "@/components/walkthrough/micro";
import { Illustration, Scale } from "@/components/art/illustrations";
import { ChapterArt } from "@/components/art/chapter-art";
import { ThemeArt, Vignette } from "@/components/art/dimension-art";
import { TLink } from "@/components/transition/transition-provider";
import { Kinetic, Reel, pop, rise, stage, useReel } from "./reel";
import { DeepSwitch, ReelClose } from "./controls";
import { ResumePill } from "./resume-pill";
import { ShareChip } from "./share-chip";
import { INTERACTIVE_KINDS, sideSlideSpeech } from "@/lib/reel/speech";
import { saveProgress } from "@/lib/reel/progress";
import { haptic } from "@/lib/haptics";
import { trackDepth } from "@/lib/metrics/client";

type Props = { data: SideReelData; sponsor?: React.ReactNode };

/** Capítulos que a pessoa já percorreu do outro lado (para não repetir o que é igual). */
function useSeenOnOtherSide(data: SideReelData) {
  const { visited } = useJourney();
  return useMemo(() => new Set(visited.filter((v) => v.side === data.other.slug).map((v) => v.chapter)), [visited, data.other.slug]);
}

/** O lado inteiro como um reel contínuo. Sem menu de categorias: a pessoa é levada adiante. */
export function SideReel({ data, sponsor }: Props) {
  const mode = useReadingMode();
  const seenOther = useSeenOnOtherSide(data);
  const slides = useMemo(() => {
    const byMode = mode === "aprofundado" ? data.slides : data.slides.filter((s) => s.layer === "surface");
    // o que é igual ao mesmo capítulo do outro lado, e a pessoa já viu lá, não se repete aqui
    return byMode.filter((s) => !(s.shared && seenOther.has(data.chapters[s.seg]?.slug ?? "")));
  }, [data.slides, data.chapters, mode, seenOther]);
  const keys = useMemo(() => slides.map((s) => s.key), [slides]);
  const segs = useMemo(() => slides.map((s) => s.seg), [slides]);
  const [startKey, setStartKey] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const lastSeg = useRef(0);
  const [flash, setFlash] = useState<{ done: string; next: string; id: number } | null>(null);
  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 1800);
    return () => window.clearTimeout(t);
  }, [flash]);

  // Ponto de partida: #tela (voltar/retomar) ou ?cap=capítulo (links compartilhados).
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    const cap = new URLSearchParams(window.location.search).get("cap");
    if (h) setStartKey(h);
    else if (cap) setStartKey(`${cap}-cover`);
  }, []);

  const onActive = useCallback(
    (i: number) => {
      setActive(i);
      const s = slides[i];
      if (!s) return;
      // Troca de capítulo: marca o anterior como visto e avisa (sem tela de "concluído").
      const prev = lastSeg.current;
      if (s.seg > prev) {
        for (let k = prev; k < s.seg; k++) if (data.chapters[k]) markVisited(data.side, data.chapters[k].slug);
        const done = data.chapters[s.seg - 1];
        const next = data.chapters[s.seg];
        if (done && next) {
          setFlash({ done: `Cap. ${done.number} lido`, next: next.title, id: Date.now() });
          haptic("success");
        }
      }
      lastSeg.current = s.seg;
      if (s.kind === "end") {
        const last = data.chapters[data.chapters.length - 1];
        if (last) markVisited(data.side, last.slug);
      }
      // Mantém o endereço apontando para a tela atual (para voltar ou compartilhar).
      if (i > 0) window.history.replaceState(window.history.state, "", `#${s.key}`);
      trackDepth(data.side, i, s.key);
      const ch = data.chapters[s.seg];
      saveProgress(data.side, {
        key: s.key,
        index: i,
        total: slides.length,
        label: ch ? `${data.sideName} · Cap. ${ch.number}: ${ch.title}` : data.sideName,
        href: `/explorar/${data.side}#${s.key}`,
      });
    },
    [slides, data.side, data.sideName, data.chapters],
  );

  const current = slides[active];
  const chapter = data.chapters[current?.seg ?? 0];
  const otherTarget = chapter ? `/explorar/${data.other.slug}#${chapter.slug}-cover` : `/explorar/${data.other.slug}`;

  return (
    <div data-side={data.side}>
      <h1 className="sr-only">{data.sideName}: a jornada em telas curtas</h1>
      <Reel
        keys={keys}
        segs={segs}
        segments={data.chapters.map((c) => c.title)}
        label={`${data.sideName}, capítulo por capítulo`}
        startKey={startKey}
        onActive={onActive}
        backdrop={(seg) => <SideBackdrop number={data.chapters[seg]?.number ?? seg + 1} />}
        topLeft={
          <>
            <ReelClose />
            <span className="min-w-0 truncate">
              <span className="kicker block text-[var(--accent-ink)]">{data.sideName}</span>
              <span className="relative block h-5 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {flash ? (
                    <m.span
                      key={`done-${flash.id}`}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-1 truncate font-display text-sm text-paper"
                      role="status"
                    >
                      <Check aria-hidden className="h-3.5 w-3.5 shrink-0 text-[var(--accent-ink)]" strokeWidth={3} />
                      {flash.done}
                    </m.span>
                  ) : (
                    <m.span key="ch" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }} className="block truncate font-display text-sm text-paper/80">
                      {chapter ? `${chapter.number}. ${chapter.kicker}` : ""}
                    </m.span>
                  )}
                </AnimatePresence>
              </span>
            </span>
          </>
        }
        topRight={
          <>
            <TLink
              href={otherTarget}
              scene={{ label: data.other.name, sub: chapter ? `Capítulo ${chapter.number} · ${chapter.kicker}` : undefined, tone: data.other.slug, number: chapter ? String(chapter.number) : undefined, from: data.other.slug === "direita" ? "right" : "left" }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-paper/40 px-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-graphite"
              data-side={data.other.slug}
              aria-label={`Ver este capítulo pela ${data.other.name.toLowerCase()}`}
            >
              <span aria-hidden><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span> {data.other.name}
            </TLink>
            <DeepSwitch />
          </>
        }
        speech={(i) => (slides[i] ? sideSlideSpeech(slides[i], { sideName: data.sideName, otherName: data.other.name }) : "")}
        interactive={(i) => INTERACTIVE_KINDS.has(slides[i]?.kind ?? "")}
        secs={slides.map((s) => s.secs ?? 0)}
        overlay={
          <>
            <ResumePill reelId={data.side} keys={keys} skip={!!startKey} atStart={active === 0} />
          </>
        }
        render={(i, isActive) => <SideSlideView slide={slides[i]} active={isActive} data={data} sponsor={sponsor} />}
      />
    </div>
  );
}

function SideBackdrop({ number }: { number: number }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 85% 100%, var(--accent-deep), transparent 70%), radial-gradient(60% 50% at 0% 0%, color-mix(in srgb, var(--accent-deep) 55%, transparent), transparent 70%)" }} />
      <span
        className="display absolute -bottom-[8vh] -right-[4vw] select-none text-[62vh] leading-none text-transparent opacity-[0.16]"
        style={{ WebkitTextStroke: "1.5px var(--accent-ink)" }}
      >
        {number}
      </span>
    </>
  );
}

function DeepTag({ layer }: { layer: "surface" | "deep" }) {
  if (layer !== "deep") return null;
  return (
    <m.span variants={rise} className="kicker mb-4 inline-flex items-center gap-2 rounded-full border border-dashed border-paper/40 px-3 py-1 text-paper/80">
      <span aria-hidden><Layers aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} /></span> Aprofundando
    </m.span>
  );
}

function Stage({ active, children, className = "" }: { active: boolean; children: React.ReactNode; className?: string }) {
  return (
    <m.div variants={stage} initial="hidden" animate={active ? "show" : "hidden"} className={className}>
      {children}
    </m.div>
  );
}

function SideSlideView({ slide, active, data, sponsor }: { slide: SideSlide; active: boolean; data: SideReelData; sponsor?: React.ReactNode }) {
  switch (slide.kind) {
    case "cover":
      return <CoverSlide slide={slide} active={active} data={data} />;
    case "lead":
      return (
        <Stage active={active}>
          <DeepTag layer={slide.layer} />
          <p className="font-display text-[clamp(1.7rem,5vw,3.4rem)] font-medium leading-[1.12] tracking-tight md:text-[clamp(1.7rem,min(5vw,6.4vh),3.4rem)]">
            <Kinetic text={slide.text} active={active} step={0.028} gloss />
          </p>
        </Stage>
      );
    case "text":
      return slide.steps ? <StepSlide slide={slide} active={active} /> : <TextSlide slide={slide} active={active} />;
    case "illustration":
      return (
        <Stage active={active} className="text-center">
          {slide.title && <m.p variants={rise} className="kicker mb-6 text-[var(--accent-ink)]">{slide.title}</m.p>}
          <m.div variants={rise} className="mx-auto max-w-2xl">
            {active && <Illustration name={slide.name} />}
          </m.div>
          {slide.caption && <m.p variants={rise} className="mx-auto mt-6 max-w-xl text-lg text-paper/85">{slide.caption}</m.p>}
        </Stage>
      );
    case "glossary":
      return (
        <Stage active={active}>
          <DeepTag layer={slide.layer} />
          <div className="mb-2 h-12 w-[4.5rem] text-[var(--accent-ink)]">{active && <Vignette name="glossario" className="h-12 w-[4.5rem]" />}</div>
          <m.div variants={rise}>
            <Glossary title={slide.title ?? "Palavras que vão aparecer"} items={slide.items} />
          </m.div>
        </Stage>
      );
    case "fact":
      return (
        <Stage active={active} className="max-w-3xl">
          <DeepTag layer={slide.layer} />
          <div className="flex items-center gap-4">
            <m.span variants={pop} className="inline-block -rotate-3 border-2 border-ev-fact px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.2em] text-ev-fact">
              Fato com fonte
            </m.span>
            <span className="h-12 w-[4.5rem] text-ev-fact">{active && <Vignette name="fato" className="h-12 w-[4.5rem]" />}</span>
          </div>
          {slide.title && <m.p variants={rise} className="kicker mt-6">{slide.title}</m.p>}
          <m.p variants={rise} className="mt-4 font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-tight tracking-tight">
            <Gloss text={slide.claim?.text ?? "Informação em verificação editorial."} />
          </m.p>
          <m.div variants={rise} className="mt-6">
            <SourceButton claim={slide.claim ?? undefined} />
          </m.div>
        </Stage>
      );
    case "curiosity":
      return (
        <Stage active={active} className="relative max-w-3xl">
          <m.span
            aria-hidden
            className="absolute -right-2 -top-24 font-display text-[11rem] font-bold leading-none text-[var(--accent)] md:-top-32 md:text-[16rem]"
            initial={{ opacity: 0, rotate: -30, scale: 0.4 }}
            animate={active ? { opacity: 0.35, rotate: [-30, 12, -6, 0], scale: 1 } : { opacity: 0, rotate: -30, scale: 0.4 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            ?
          </m.span>
          <DeepTag layer={slide.layer} />
          <m.p variants={rise} className="kicker text-[var(--accent-ink)]">Você sabia?</m.p>
          <m.p variants={rise} className="relative mt-4 font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-tight tracking-tight">
            <Gloss text={slide.text} />
          </m.p>
          {slide.claim && (
            <m.div variants={rise} className="mt-5">
              <SourceButton claim={slide.claim} />
            </m.div>
          )}
        </Stage>
      );
    case "example":
      return (
        <Stage active={active} className="max-w-3xl">
          <DeepTag layer={slide.layer} />
          <m.div variants={rise} className="flex items-center gap-3">
            {slide.art ? (
              <span className="h-16 w-24 shrink-0 text-[var(--accent-ink)]">{active && <Vignette key={slide.key} name={slide.art} className="h-16 w-24" />}</span>
            ) : (
              <PeopleIcon active={active} />
            )}
            <p className="kicker text-[var(--accent-ink)]">{slide.title}</p>
          </m.div>
          <m.div variants={rise} className="mt-5 border-l-4 border-[var(--accent)] pl-5">
            <RichText text={slide.body} gloss className="rt reel-rt space-y-3 text-[1.15rem] md:text-[1.3rem]" />
          </m.div>
        </Stage>
      );
    case "pulse":
      return (
        <Stage active={active}>
          <DeepTag layer={slide.layer} />
          <m.div variants={rise}>
            <Pulse statement={slide.statement} prompt={slide.prompt} />
          </m.div>
        </Stage>
      );
    case "conflict":
      return <ConflictSlide slide={slide} active={active} />;
    case "argument":
      return <ArgumentSlide slide={slide} active={active} />;
    case "counterpoint":
      return <CounterpointSlide slide={slide} active={active} data={data} />;
    case "themes":
      return <ThemesSlide slide={slide} active={active} data={data} />;
    case "explore":
      return (
        <Stage active={active}>
          <DeepTag layer={slide.layer} />
          <m.h2 variants={rise} className="h-section">{slide.title}</m.h2>
          {slide.intro && <m.p variants={rise} className="mt-3 max-w-2xl text-lg text-paper/80">{slide.intro}</m.p>}
          {slide.chips.length > 0 && (
            <m.ul variants={stage} className="mt-7 flex flex-wrap gap-2">
              {slide.chips.map((c) => (
                <m.li key={c} variants={pop} className="rounded-full border border-paper/30 bg-graphite/50 px-4 py-2 text-sm backdrop-blur">
                  {c}
                </m.li>
              ))}
            </m.ul>
          )}
          <m.div variants={rise} className="mt-8">
            <Link href={slide.href} className="btn">{slide.label} →</Link>
          </m.div>
        </Stage>
      );
    case "checkpoint":
      return <CheckpointSlide slide={slide} active={active} data={data} sponsor={slide.number === 4 ? sponsor : undefined} />;
    case "end":
      return <EndSlide active={active} data={data} sponsor={sponsor} />;
  }
}

function CoverSlide({ slide, active, data }: { slide: Extract<SideSlide, { kind: "cover" }>; active: boolean; data: SideReelData }) {
  const seenOther = useSeenOnOtherSide(data);
  const chapterSlug = data.chapters[slide.seg]?.slug ?? "";
  const skipping = seenOther.has(chapterSlug) && (!!slide.sharedPoints?.length || data.slides.some((s) => s.seg === slide.seg && s.shared));
  const points = skipping ? slide.keyPoints.filter((_, i) => !slide.sharedPoints?.includes(i)) : slide.keyPoints;
  return (
    <Stage active={active}>
      {/* uma linha só: em que capítulo estamos + atalhos discretos (o progresso geral já está no topo) */}
      <m.div variants={rise} className="flex items-center justify-between gap-3">
        <p className="kicker min-w-0 truncate text-[var(--accent-ink)]">
          {slide.number}/{data.chapters.length} · {slide.kicker}
          {skipping && (
            <span className="ml-2 text-ash" title={`Pulamos o que é igual ao que você já viu na ${data.other.name.toLowerCase()}`}>
              <CopyCheck aria-hidden className="mb-0.5 mr-1 inline h-3.5 w-3.5" />
              sem repetir
            </span>
          )}
        </p>
        <span className="flex shrink-0 items-center">
          <TLink
            href={slide.fullHref}
            scene={{ label: slide.title, sub: `Leitura completa · Capítulo ${slide.number}`, tone: data.side, number: String(slide.number) }}
            className="grid h-11 w-11 place-items-center rounded-full text-ash hover:text-paper"
            aria-label="Ler o capítulo completo"
          >
            <BookOpen aria-hidden className="h-4 w-4" />
          </TLink>
          <ShareChip
            path={`/explorar/${data.side}?cap=${chapterSlug}`}
            title={`${slide.title} · DOIS LADOS`}
            text={`“${slide.title}”: o que a ${data.sideName.toLowerCase()} pensa — e o que a ${data.other.name.toLowerCase()} responde. Veja os dois lados:`}
            className="h-11 w-11 justify-center text-ash"
            iconOnly
          />
        </span>
      </m.div>

      <div className="mt-4 grid items-end gap-3 md:grid-cols-[1fr_auto] md:gap-4">
        <h2 className="display text-[clamp(2.3rem,8.5vw,4.8rem)]">
          <Kinetic text={slide.title} active={active} step={0.07} delay={0.1} />
        </h2>
        <div className="order-first text-[var(--accent-ink)] md:order-none">
          {active && <ChapterArt key={slide.key} chapter={chapterSlug} className="h-20 w-40 md:h-32 md:w-64" />}
        </div>
      </div>

      {/* as ideias-chave, uma de cada vez (como um story) */}
      {points.length > 0 && <KeyPointsStory points={points} active={active} />}
    </Stage>
  );
}


/**
 * Os pontos do capítulo, um por vez (como um story): 12 s cada.
 * Tudo numa linha só acima do texto — ‹ barras › e pausa —, e o próprio texto
 * responde ao toque: lateral esquerda volta, o resto adianta, segurar pausa.
 * A dica de uso aparece só na primeira vez (fica salva neste navegador).
 */
const POINT_MS = 12_000;
const TICK_MS = 100;
const HINT_KEY = "doislados:dica-story";

function KeyPointsStory({ points, active }: { points: string[]; active: boolean }) {
  const [i, setI] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hint, setHint] = useState(false);
  const press = useRef<{ timer: number | null; hold: boolean } | null>(null);
  const last = points.length - 1;
  const stopped = !active || held || paused;

  useEffect(() => {
    if (active) return;
    setI(0);
    setElapsed(0);
    setPaused(false);
    setHeld(false);
  }, [active]);

  // dica só na primeira capa vista
  useEffect(() => {
    if (!active) return;
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen) return;
    setHint(true);
    const t = window.setTimeout(() => {
      setHint(false);
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {}
    }, 7000);
    return () => window.clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (stopped) return;
    const id = window.setInterval(() => setElapsed((e) => Math.min(e + TICK_MS, POINT_MS)), TICK_MS);
    return () => window.clearInterval(id);
  }, [stopped]);

  useEffect(() => {
    if (elapsed < POINT_MS || i >= last) return;
    setI((v) => v + 1);
    setElapsed(0);
  }, [elapsed, i, last]);

  function go(n: number) {
    if (n < 0 || n > last) return;
    haptic("tap");
    setI(n);
    setElapsed(0);
  }

  function endPress() {
    const p = press.current;
    press.current = null;
    if (p?.timer) window.clearTimeout(p.timer);
    if (p?.hold) setHeld(false);
    return p;
  }

  const frozen = held || paused;
  const edge = "grid h-8 w-8 shrink-0 place-items-center rounded-full text-paper/60 transition-colors hover:text-paper disabled:opacity-20";

  return (
    <m.div initial={{ opacity: 0, y: 14 }} animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ delay: active ? 0.6 : 0 }} className="mt-6 max-w-2xl">
      {/* ‹ barras › ⏸ */}
      <div className="-mx-2 flex items-center gap-1">
        <button type="button" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Ponto anterior" className={edge}>
          <ChevronLeft aria-hidden className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {points.map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-paper/15">
              <span
                className="block h-full bg-[var(--accent-ink)] transition-[width] duration-100 ease-linear"
                style={{ width: `${k < i ? 100 : k === i ? (elapsed / POINT_MS) * 100 : 0}%` }}
              />
            </span>
          ))}
        </div>
        <button type="button" onClick={() => go(i + 1)} disabled={i === last} aria-label="Próximo ponto" className={edge}>
          <ChevronRight aria-hidden className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? "Continuar" : "Pausar"} aria-pressed={paused} className={edge}>
          {paused ? <Play aria-hidden className="h-3.5 w-3.5" /> : <Pause aria-hidden className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div
        onPointerDown={(e) => {
          // palavra do glossário abre a explicação; não conta como toque no story
          if ((e.target as HTMLElement).closest(".gloss, button, a")) return;
          const p = { timer: null as number | null, hold: false };
          p.timer = window.setTimeout(() => {
            p.hold = true;
            setHeld(true);
          }, 260);
          press.current = p;
        }}
        onPointerUp={(e) => {
          const p = endPress();
          if (!p || p.hold) return;
          // toque curto: lateral esquerda volta, o resto adianta
          const r = e.currentTarget.getBoundingClientRect();
          go(e.clientX - r.left < r.width * 0.3 ? i - 1 : i + 1);
        }}
        onPointerLeave={endPress}
        onPointerCancel={endPress}
        onContextMenu={(e) => e.preventDefault()}
        className="mt-3 block w-full cursor-pointer select-none text-left [-webkit-touch-callout:none]"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={i}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[4.5rem] gap-3 font-display text-[1.15rem] leading-snug md:text-[1.35rem]"
          >
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-mono text-xs font-bold text-paper">{i + 1}</span>
            <span>
              <Gloss text={points[i]} limit={1} />
            </span>
          </m.p>
        </AnimatePresence>
      </div>

      {/* só aparece quando ajuda: na primeira vez, ou enquanto está pausado */}
      <AnimatePresence initial={false}>
        {(hint || frozen) && (
          <m.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-ash"
            aria-live="polite"
          >
            {frozen ? <span className="text-paper">Pausado{held ? " · solte para seguir" : ""}</span> : "Toque nos lados para trocar · segure para ler"}
          </m.p>
        )}
      </AnimatePresence>
    </m.div>
  );
}


type TextSlideData = Extract<SideSlide, { kind: "text" }>;

/**
 * Uma história em passos ("Primeiro…", "Depois…", "No século 20…") numa tela
 * só: tocar avança (no último, volta ao primeiro). A linha do tempo no topo
 * mostra onde se está; o dedinho indica o toque até a pessoa ver todos, e aí
 * a setinha para baixo indica que dá para seguir.
 */
function StepSlide({ slide, active }: { slide: TextSlideData; active: boolean }) {
  const steps = slide.steps!;
  const n = steps.length;
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(1);
  const { next } = useReel();
  useEffect(() => {
    if (active) return;
    setI(0);
    setSeen(1);
  }, [active]);
  const done = seen >= n;
  const cur = steps[i];
  const pct = (k: number) => (n > 1 ? (k / (n - 1)) * 100 : 0);

  function go(k: number) {
    haptic("tap");
    const to = (k + n) % n;
    setI(to);
    setSeen((s) => Math.max(s, to + 1));
  }
  function onTap(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest(".gloss, a, button")) return;
    go(i + 1);
  }

  return (
    <Stage active={active} className="max-w-3xl">
      {/* a tela toda responde ao toque (menos links, botões e palavras do glossário) */}
      <div onClick={onTap} className="-m-6 cursor-pointer select-none p-6">
        <DeepTag layer={slide.layer} />
        {slide.title && (
          <m.p variants={rise} className="kicker text-[var(--accent-ink)]">
            {slide.title}
          </m.p>
        )}
        {/* linha do tempo: cada passo é tocável; a linha cresce até o atual */}
        <m.div variants={rise} className="mt-5">
          <div className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            <div className="absolute top-[7px] h-[2px] bg-paper/15" style={{ left: `${50 / n}%`, right: `${50 / n}%` }}>
              <m.div className="h-full bg-[var(--accent-ink)]" animate={{ width: `${pct(i)}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            {steps.map((st, k) => (
              <button
                key={st.label}
                type="button"
                onClick={() => go(k)}
                aria-label={`Passo ${k + 1}: ${st.label}`}
                aria-current={k === i ? "step" : undefined}
                className="relative flex flex-col items-center gap-2 text-center"
              >
                <span className={`relative grid h-4 w-4 place-items-center rounded-full border-2 transition-colors ${k <= i ? "border-[var(--accent-ink)] bg-[var(--accent-ink)]" : "border-paper/30 bg-graphite"}`}>
                  {k === i && active && (
                    <m.span className="absolute inset-0 rounded-full border-2 border-[var(--accent-ink)]" animate={{ scale: [1, 2.2], opacity: [0.8, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.6 }} />
                  )}
                </span>
                <span className={`font-mono text-[0.62rem] uppercase leading-tight tracking-[0.08em] md:text-[0.7rem] ${k === i ? "text-paper" : "text-ash"}`}>{st.label}</span>
              </button>
            ))}
          </div>
        </m.div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid items-center gap-4 md:mt-10 md:grid-cols-[auto_1fr] md:gap-8"
            aria-live="polite"
          >
            {cur.art && <div className="h-16 w-24 text-[var(--accent-ink)] md:h-24 md:w-36">{active && <Vignette name={cur.art} className="h-16 w-24 md:h-24 md:w-36" />}</div>}
            <div>
              <h2 className="display text-[clamp(2.1rem,6vw,3.6rem)]">
                <Kinetic text={cur.label} active={active} step={0.06} delay={0.1} />
              </h2>
              <div className="mt-3">
                <RichText text={cur.body} gloss className="rt reel-rt text-[1.15rem] md:text-[1.3rem]" />
              </div>
            </div>
          </m.div>
        </AnimatePresence>

      {/* indicador: toque para avançar até ver todos; depois, siga para baixo */}
      <div className="mt-8 flex min-h-12 items-center">
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <m.button
              key="tap"
              type="button"
              onClick={() => go(i + 1)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-paper/80"
            >
              <span className="relative grid h-10 w-10 place-items-center">
                <m.span className="absolute inset-0 rounded-full border border-paper/50" animate={{ scale: [0.6, 1.3], opacity: [0.8, 0] }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }} />
                <m.span animate={{ y: [0, 3, 0], scale: [1, 0.9, 1] }} transition={{ duration: 1.3, repeat: Infinity }}>
                  <Pointer aria-hidden className="h-5 w-5" />
                </m.span>
              </span>
              Toque para avançar · {i + 1}/{n}
            </m.button>
          ) : (
            <m.button
              key="down"
              type="button"
              onClick={() => next()}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-paper/80"
            >
              <m.span className="grid h-10 w-10 place-items-center rounded-full border border-paper/40" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <ChevronDown aria-hidden className="h-5 w-5" />
              </m.span>
              Pronto · role para continuar
            </m.button>
          )}
        </AnimatePresence>
      </div>
      </div>
    </Stage>
  );
}

/** Texto comum (ou uma parte de um texto longo, com o indicador de partes). */
function TextSlide({ slide, active }: { slide: TextSlideData; active: boolean }) {
  const cont = !!slide.part && slide.part.i > 0;
  return (
    <Stage active={active} className="max-w-2xl">
      <DeepTag layer={slide.layer} />
      {slide.title &&
        (cont ? (
          <m.p variants={rise} className="kicker mb-5 text-[var(--accent-ink)]">
            {slide.title} · continua
          </m.p>
        ) : (
          <m.h2 variants={rise} className="h-section mb-6">
            {slide.title}
          </m.h2>
        ))}
      {slide.art && <div className="mb-4 h-14 w-[5.25rem] text-[var(--accent-ink)]">{active && <Vignette key={slide.key} name={slide.art} className="h-14 w-[5.25rem]" />}</div>}
      <m.div variants={rise}>
        <StepText body={slide.body} active={active} />
      </m.div>
      {slide.part && (
        <m.div variants={rise} className="mt-6 flex items-center gap-1.5" aria-label={`Parte ${slide.part.i + 1} de ${slide.part.n}`}>
          {Array.from({ length: slide.part.n }).map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all ${k === slide.part!.i ? "w-6 bg-[var(--accent-ink)]" : k < slide.part!.i ? "w-1.5 bg-paper/60" : "w-1.5 bg-paper/20"}`} />
          ))}
        </m.div>
      )}
    </Stage>
  );
}

/**
 * Texto longo sem cara de bloco: cada parágrafo entra sozinho, um depois do
 * outro, quando a tela fica ativa (sem botão, sem toque). O espaço já fica
 * reservado, então nada "pula" enquanto entram.
 */
function StepText({ body, active }: { body: string; active: boolean }) {
  const parts = useMemo(() => body.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean), [body]);
  return (
    <div className="space-y-4">
      {parts.map((t, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={active ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(4px)" }}
          transition={active ? { duration: 0.55, delay: 0.25 + i * 0.45, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
        >
          <RichText text={t} gloss className="rt reel-rt text-[1.12rem] md:text-[1.2rem]" />
        </m.div>
      ))}
    </div>
  );
}

function CheckMark({ active, delay = 0, className = "h-6 w-6" }: { active: boolean; delay?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`mt-0.5 shrink-0 ${className}`} aria-hidden>
      <m.circle cx="12" cy="12" r="10" fill="none" stroke="var(--accent-ink)" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ delay: active ? delay : 0, duration: 0.5 }} />
      <m.path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--color-paper)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ delay: active ? delay + 0.3 : 0, duration: 0.35 }} />
    </svg>
  );
}

function PeopleIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 24" className="h-7 w-14 text-[var(--accent-ink)]" aria-hidden>
      {[10, 24, 38].map((x, i) => (
        <m.g key={x} initial={{ y: 8, opacity: 0 }} animate={active ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }} transition={{ delay: active ? 0.2 + i * 0.12 : 0, type: "spring", stiffness: 300, damping: 14 }}>
          <circle cx={x} cy={7} r={3.5} fill="currentColor" />
          <path d={`M${x - 6} 22c0-4 2.7-7 6-7s6 3 6 7`} fill="currentColor" />
        </m.g>
      ))}
    </svg>
  );
}

/** Conflito de valores como cabo de guerra: a pessoa puxa para o lado que pesa mais. Nada é salvo. */
function ConflictSlide({ slide, active }: { slide: Extract<SideSlide, { kind: "conflict" }>; active: boolean }) {
  const [v, setV] = useState(50);
  const lean = v < 42 ? slide.values[0] : v > 58 ? slide.values[1] : null;
  useEffect(() => {
    if (lean) haptic("tick");
  }, [lean]);
  return (
    <Stage active={active}>
      <DeepTag layer={slide.layer} />
      <m.p variants={rise} className="kicker text-[var(--accent-ink)]">Conflito de valores</m.p>
      <m.h2 variants={rise} className="h-section mt-2">{slide.title}</m.h2>
      <m.p variants={rise} className="mt-4 max-w-2xl text-lg text-paper/85"><span className="kicker mr-2">Situação</span><Gloss text={slide.scenario} /></m.p>
      <m.div variants={rise} className="mt-8">
        <div className="flex items-end justify-between gap-4 font-display text-xl md:text-3xl">
          <m.span animate={{ scale: v < 50 ? 1 + (50 - v) / 120 : 1, opacity: v > 58 ? 0.5 : 1 }} className="origin-left">{slide.values[0]}</m.span>
          <m.span animate={{ scale: v > 50 ? 1 + (v - 50) / 120 : 1, opacity: v < 42 ? 0.5 : 1 }} className="origin-right text-right">{slide.values[1]}</m.span>
        </div>
        <div className="relative mt-4 h-12">
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-3 w-full -translate-y-1/2" aria-hidden>
            <path d="M0 5 Q 25 3 50 5 T 100 5" stroke="var(--color-paper)" strokeOpacity={0.5} strokeWidth={1.4} fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="3 2" />
          </svg>
          <m.span aria-hidden className="absolute top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-[var(--accent)] shadow-[0_0_30px_rgba(245,243,238,0.35)]" animate={{ left: `${v}%` }} transition={{ type: "spring", stiffness: 300, damping: 22 }} />
          <input
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
            aria-label={`Puxe para o valor que pesa mais para você: ${slide.values[0]} ou ${slide.values[1]}`}
            className="absolute inset-0 h-full w-full cursor-grab opacity-0"
          />
        </div>
        <p className="mt-3 min-h-7 text-center font-mono text-sm text-paper/80" aria-live="polite">
          {lean ? <>Para você, aqui pesa mais: <strong className="text-paper">{lean}</strong></> : "Arraste a bolinha: o que pesa mais para você?"}
        </p>
      </m.div>
      <m.p variants={rise} className="mt-6 max-w-2xl text-paper/80"><Gloss text={slide.tension} /></m.p>
      <m.p variants={rise} className="mt-2 text-xs text-ash">Isso é só para você pensar — não é salvo nem entra no mapa.</m.p>
    </Stage>
  );
}

/** Argumento ou crítica como carta de um baralho: vira para mostrar limites ou a resposta. */
function ArgumentSlide({ slide, active }: { slide: Extract<SideSlide, { kind: "argument" }>; active: boolean }) {
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (!active) setFlip(false);
  }, [active]);
  const pro = slide.argKind === "PRO";
  const back = pro ? slide.limits : slide.response;
  const backLabel = pro ? "E os limites?" : "O que respondem os defensores?";
  return (
    <Stage active={active}>
      <DeepTag layer={slide.layer} />
      <m.div variants={rise} className="mb-5 flex items-center justify-between gap-3">
        <span className={`flex items-center gap-2 ${pro ? "text-ev-pro" : "text-ev-critique"}`}>
          <span className="h-16 w-24 shrink-0">{active && <Vignette key={slide.key} name={slide.art ?? (pro ? "lampada" : "lupa")} className="h-16 w-24" />}</span>
          <span className="kicker">{pro ? "Argumento a favor" : "Crítica"}</span>
        </span>
        <span className="flex gap-1.5" aria-label={`${slide.n} de ${slide.total}`}>
          {Array.from({ length: slide.total }).map((_, i) => (
            <span key={i} className={`h-1.5 w-5 rounded-full ${i < slide.n ? (pro ? "bg-ev-pro" : "bg-ev-critique") : "bg-paper/20"}`} />
          ))}
        </span>
      </m.div>
      <div className="relative [perspective:1400px]">
        {/* cartas por baixo: sensação de baralho */}
        {Array.from({ length: Math.min(2, slide.total - slide.n) }).map((_, i) => (
          <span key={i} aria-hidden className="absolute inset-0 border border-line bg-graphite-2" style={{ transform: `translate(${(i + 1) * 8}px, ${(i + 1) * 8}px)`, opacity: 0.6 - i * 0.25 }} />
        ))}
        <m.div
          initial={{ x: 120, rotate: 6, opacity: 0 }}
          animate={active ? { x: 0, rotate: 0, opacity: 1, rotateY: flip ? 180 : 0 } : { x: 120, rotate: 6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="relative grid [transform-style:preserve-3d]"
        >
          <div className={`col-start-1 row-start-1 border bg-graphite-2 p-6 [backface-visibility:hidden] md:p-9 ${pro ? "border-ev-pro/50" : "border-ev-critique/50"}`}>
            <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-tight tracking-tight">{slide.title}</h2>
            <p className="mt-4 text-[1.08rem] leading-relaxed text-paper/88 md:text-lg"><Gloss text={slide.body} /></p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {back && (
                <button type="button" onClick={() => setFlip(true)} className="btn">
                  <span aria-hidden><RotateCcw aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></span> {backLabel}
                </button>
              )}
              {slide.claim && <SourceButton claim={slide.claim} />}
            </div>
          </div>
          <div className="col-start-1 row-start-1 flex flex-col justify-center bg-paper p-6 text-graphite [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-9" aria-hidden={!flip}>
            <p className="kicker text-graphite/60">{backLabel.replace("?", "")}</p>
            <p className="mt-3 font-display text-[clamp(1.2rem,3vw,1.8rem)] leading-snug">{back}</p>
            <button type="button" onClick={() => setFlip(false)} className="kicker mt-6 self-start text-graphite underline underline-offset-4" tabIndex={flip ? 0 : -1}>
              <RotateCcw aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /> Voltar
            </button>
          </div>
        </m.div>
      </div>
    </Stage>
  );
}

function CounterpointSlide({ slide, active, data }: { slide: Extract<SideSlide, { kind: "counterpoint" }>; active: boolean; data: SideReelData }) {
  const [view, setView] = useState<"this" | "other">("this");
  useEffect(() => {
    if (!active) setView("this");
  }, [active]);
  const side = view === "this" ? data.side : data.other.slug;
  return (
    <Stage active={active}>
      <DeepTag layer={slide.layer} />
      <m.p variants={rise} className="kicker">Questão {slide.n} de {slide.total}</m.p>
      <m.h2 variants={rise} className="mt-3 font-display text-[clamp(1.4rem,3.6vw,2.4rem)] leading-tight tracking-tight">{slide.prompt}</m.h2>
      <m.div variants={rise} role="radiogroup" aria-label="Escolha a perspectiva" className="mt-6 inline-grid grid-cols-2 rounded-full border border-paper/30 p-1">
        {(["this", "other"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={view === k}
            onClick={() => setView(k)}
            data-side={k === "this" ? data.side : data.other.slug}
            className={`relative h-10 rounded-full px-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] ${view === k ? "text-paper" : "text-ash"}`}
          >
            {view === k && <m.span layoutId={`cp-pill-${slide.key}`} className="absolute inset-0 rounded-full bg-[var(--accent)]" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="relative">{k === "this" ? `${data.sideName} diz` : `${data.other.name} responde`}</span>
          </button>
        ))}
      </m.div>
      <m.div variants={rise} className="relative mt-6 min-h-40" data-side={side} aria-live="polite">
        <AnimatePresence mode="wait">
          <m.blockquote
            key={view}
            initial={{ opacity: 0, x: view === "this" ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === "this" ? 40 : -40 }}
            transition={{ duration: 0.3 }}
            className="border-l-4 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent-deep)_45%,transparent)] p-5 font-display text-[clamp(1.2rem,3vw,1.9rem)] leading-snug md:p-7"
          >
            <Gloss text={view === "this" ? slide.thisSide : slide.otherSide} />
          </m.blockquote>
        </AnimatePresence>
      </m.div>
      {view === "this" && <p className="mt-3 text-sm text-ash">Toque em “{data.other.name} responde” para ver o contra-argumento.</p>}
    </Stage>
  );
}

/**
 * Tema por tema como um carrossel: um cartão por tema, deslizando para o lado
 * (arrastar no celular; setas e ← → no computador). O próximo cartão aparece
 * na borda, convidando a deslizar. Cada cartão: vinheta desenhada, o conflito
 * de valores como um "cabo de guerra", a posição deste lado e, num toque, a
 * do outro — com o mesmo peso.
 */
function ThemesSlide({ slide, active, data }: { slide: Extract<SideSlide, { kind: "themes" }>; active: boolean; data: SideReelData }) {
  const total = slide.items.length;
  const [index, setIndex] = useState(0);
  const [other, setOther] = useState(false);
  const [nuance, setNuance] = useState(false);
  const [width, setWidth] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardW = width ? (width < 640 ? width * 0.86 : Math.min(width * 0.8, 720)) : 0;
  const stepW = cardW + 12;

  useEffect(() => {
    if (stepW > 12) controls.start({ x: -index * stepW, transition: { type: "spring", stiffness: 260, damping: 32 } });
  }, [index, stepW, controls]);

  function go(i: number) {
    const n = Math.max(0, Math.min(total - 1, i));
    if (n === index) {
      controls.start({ x: -index * stepW, transition: { type: "spring", stiffness: 260, damping: 32 } });
      return;
    }
    haptic("tap");
    setIndex(n);
    setOther(false);
    setNuance(false);
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    e.stopPropagation();
    go(index + (e.key === "ArrowRight" ? 1 : -1));
  }

  const arrow = "grid h-10 w-10 place-items-center rounded-full border border-paper/30 text-paper/85 transition-colors hover:border-paper disabled:opacity-25";
  return (
    <Stage active={active}>
      <DeepTag layer={slide.layer} />
      <div className="flex items-end justify-between gap-4">
        <div>
          <m.h2 variants={rise} className="font-display text-[clamp(1.5rem,4vw,2.2rem)] font-semibold tracking-tight">
            {slide.title}
          </m.h2>
          <m.p variants={rise} className="kicker mt-1 text-ash">
            {total} temas · deslize para o lado
          </m.p>
        </div>
        <span className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Tema anterior" className={arrow}>
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => go(index + 1)} disabled={index === total - 1} aria-label="Próximo tema" className={arrow}>
            <ChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </span>
      </div>

      <div
        ref={frame}
        tabIndex={0}
        onKeyDown={onKey}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Temas"
        className="relative mt-4 overflow-hidden outline-none max-md:-mx-[var(--gutter)] max-md:px-[var(--gutter)]"
      >
        <m.div
          className="flex items-start gap-3"
          style={{ touchAction: "pan-y" }}
          drag="x"
          dragConstraints={{ left: -(total - 1) * stepW, right: 0 }}
          dragElastic={0.14}
          animate={controls}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={(_, info) => {
            window.setTimeout(() => (dragging.current = false), 0);
            const far = stepW * 0.18;
            if (info.offset.x < -far || info.velocity.x < -450) go(index + 1);
            else if (info.offset.x > far || info.velocity.x > 450) go(index - 1);
            else go(index);
          }}
        >
          {slide.items.map((t, k) => {
            const current = k === index;
            const near = Math.abs(k - index) <= 1;
            const pos = current ? (other ? t.other : t.mine) : t.mine;
            const [va, vb] = (t.conflict ?? "").replace(/\.$/, "").split("×").map((x) => x.trim());
            return (
              <m.article
                key={t.slug}
                aria-roledescription="tema"
                aria-label={`${k + 1} de ${total}: ${t.name}`}
                aria-hidden={!current}
                onClick={() => !current && !dragging.current && go(k)}
                animate={{ opacity: current ? 1 : 0.4, scale: current ? 1 : 0.96 }}
                transition={{ duration: 0.3 }}
                style={{ width: cardW || "86%", flexShrink: 0 }}
                className={`border bg-graphite-2/95 p-5 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-[auto_auto_1fr] md:gap-x-6 md:p-6 ${current ? "border-paper/30" : "cursor-pointer border-line"}`}
              >
                <div className="flex items-start justify-between gap-3 md:col-start-1 md:flex-col md:justify-start md:gap-2">
                  <div className="min-w-0 md:order-2">
                    <p className="kicker text-ash">
                      {k + 1}/{total}
                    </p>
                    <h3 lang="pt-BR" className="mt-1 font-display text-[clamp(1.35rem,3.6vw,2rem)] font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] hyphens-auto md:text-[1.6rem]">{t.name}</h3>
                  </div>
                  <span className="h-14 w-[5.25rem] shrink-0 text-paper/80 md:order-1 md:h-14 md:w-[5.25rem]">
                    {near && active && <ThemeArt key={`${t.slug}-${current}`} theme={t.slug} className="h-14 w-[5.25rem]" />}
                  </span>
                </div>

                {/* o conflito de valores como um cabo de guerra */}
                {va && vb && (
                  <div className="mt-3 md:col-start-1" aria-label={`Conflito de valores: ${va} ou ${vb}`}>
                    <div className="flex justify-between gap-4 text-[0.72rem] leading-tight text-paper/70 md:text-xs">
                      <span className="max-w-[45%]">{va}</span>
                      <span className="max-w-[45%] text-right">{vb}</span>
                    </div>
                    <div className="relative mt-1.5 h-3">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/30" />
                      <m.span
                        className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full border-2 border-paper bg-graphite"
                        animate={current && active ? { x: [0, -18, 14, -8, 0] } : { x: 0 }}
                        transition={{ duration: 3.2, repeat: current && active ? Infinity : 0, repeatDelay: 0.6, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* lado: este × outro, com a pílula deslizando */}
                {current && t.other && (
                  <div role="tablist" aria-label="Lado" className="mt-4 inline-flex w-fit self-start rounded-full border border-paper/25 p-1 md:col-start-1">
                    {[
                      { key: false, slug: data.side, name: data.sideName },
                      { key: true, slug: data.other.slug, name: data.other.name },
                    ].map((s) => (
                      <button
                        key={String(s.key)}
                        type="button"
                        role="tab"
                        aria-selected={other === s.key}
                        data-side={s.slug}
                        onClick={() => {
                          haptic("tap");
                          setOther(s.key);
                          setNuance(false);
                        }}
                        className={`relative rounded-full px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] transition-colors ${other === s.key ? "text-paper" : "text-ash hover:text-paper"}`}
                      >
                        {other === s.key && (
                          <m.span
                            key={String(s.key)}
                            className="absolute inset-0 rounded-full bg-[var(--accent)]"
                            initial={{ scaleX: 0.4, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 420, damping: 30 }}
                          />
                        )}
                        <span className="relative">{s.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={`${t.slug}-${current && other}`}
                    data-side={current && other ? data.other.slug : data.side}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="mt-3 border-l-4 border-[var(--accent)] pl-4 md:col-start-2 md:row-span-3 md:row-start-1 md:mt-0"
                    aria-live={current ? "polite" : undefined}
                  >
                    {pos ? (
                      <>
                        <p className="font-display text-[clamp(1.02rem,2.4vw,1.35rem)] leading-snug">
                          <Gloss text={pos.summary} />
                        </p>
                        {current && (
                          <ul className="mt-3 flex flex-wrap gap-1.5">
                            {pos.points.map((p, i) => (
                              <m.li
                                key={p}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 320, damping: 22 }}
                                className="inline-flex items-start gap-1.5 rounded-2xl border border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-graphite/40 px-3 py-1.5 text-[0.82rem] leading-snug text-paper/90"
                              >
                                <Check aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-ink)]" strokeWidth={2.5} />
                                {p}
                              </m.li>
                            ))}
                          </ul>
                        )}
                        {current && pos.nuances && (
                          <div className="mt-2">
                            <button type="button" onClick={() => setNuance((v) => !v)} aria-expanded={nuance} className="inline-flex min-h-8 items-center gap-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ev-critique hover:underline">
                              Ressalva <ChevronDown aria-hidden className={`h-3.5 w-3.5 transition-transform ${nuance ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence initial={false}>
                              {nuance && (
                                <m.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-[0.8rem] leading-snug text-paper/70">
                                  {pos.nuances}
                                </m.p>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-ash">Conteúdo deste tema em revisão editorial.</p>
                    )}
                  </m.div>
                </AnimatePresence>
              </m.article>
            );
          })}
        </m.div>
      </div>

      {/* pontos: onde estou no carrossel (toque para pular) */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex flex-wrap items-center gap-1.5">
          {slide.items.map((t, k) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => go(k)}
              aria-label={`Ir para ${t.name}`}
              aria-current={k === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${k === index ? "w-6 bg-paper" : "w-2 bg-paper/25 hover:bg-paper/50"}`}
            />
          ))}
        </span>
        <Link href={slide.fullHref} className="inline-flex min-h-10 shrink-0 items-center font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ash underline underline-offset-4 hover:text-paper">
          Ver com fontes
        </Link>
      </div>
    </Stage>
  );
}


const CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  return { x: Math.round(Math.cos(a) * (90 + (i % 3) * 40)), y: Math.round(Math.sin(a) * (70 + (i % 4) * 30)), c: i % 3 === 0 ? "var(--color-esq)" : i % 3 === 1 ? "var(--color-dir)" : "var(--color-paper)", r: (i * 47) % 360 };
});

function CheckpointSlide({ slide, active, sponsor, data }: { slide: Extract<SideSlide, { kind: "checkpoint" }>; active: boolean; sponsor?: React.ReactNode; data: SideReelData }) {
  const { next } = useReel();
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => haptic("success"), 550);
    return () => window.clearTimeout(t);
  }, [active]);
  return (
    <Stage active={active} className="text-center">
      <div className="relative mx-auto h-28 w-28">
        {CONFETTI.map((p, i) => (
          <m.span
            key={i}
            aria-hidden
            className="absolute left-1/2 top-1/2 h-2.5 w-1.5"
            style={{ background: p.c }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
            animate={active ? { x: p.x, y: p.y, opacity: [0, 1, 0], rotate: p.r } : { x: 0, y: 0, opacity: 0 }}
            transition={{ delay: active ? 0.55 : 0, duration: 1.1, ease: "easeOut" }}
          />
        ))}
        <CheckMark active={active} delay={0.1} className="h-28 w-28" />
      </div>
      <m.p variants={rise} className="kicker mt-6 text-[var(--accent-ink)]">Capítulo {slide.number} concluído</m.p>
      <m.h2 variants={rise} className="display mt-3 text-[clamp(2rem,6vw,4rem)]">{slide.title}</m.h2>
      <m.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
        {slide.nextTitle && (
          <button type="button" onClick={next} className="btn btn-solid">
            Continuar: {slide.nextTitle} ↓
          </button>
        )}
        <Link href={slide.fullHref} className="btn btn-ghost">Aprofundar: ler o capítulo completo</Link>
      </m.div>
      <m.div variants={rise} className="mt-4 flex justify-center">
        <ShareChip
          path={`/explorar/${data.side}?cap=${slide.chapterSlug}`}
          title={`${slide.title} · DOIS LADOS`}
          text={`Acabei de ver “${slide.title}”, pelos dois lados. Veja também:`}
          label="Compartilhar este capítulo"
        />
      </m.div>
      {sponsor && <m.div variants={rise} className="mx-auto mt-10 hidden max-w-2xl text-left md:block">{sponsor}</m.div>}
    </Stage>
  );
}

function EndSlide({ active, data, sponsor }: { active: boolean; data: SideReelData; sponsor?: React.ReactNode }) {
  const other = data.other;
  const { visited } = useJourney();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Já passou pelo outro lado? Então o próximo passo é descobrir o próprio lado.
  const sawOther = mounted && visited.some((v) => v.side === other.slug);

  if (sawOther) {
    return (
      <Stage active={active} className="text-center">
        <m.div variants={pop} className="mx-auto w-fit">
          <Scale tilt={0} className="h-24 w-28 text-paper" />
        </m.div>
        <m.p variants={rise} className="kicker mt-6">Você viu os dois lados</m.p>
        <h2 className="display mt-3 text-[clamp(2.2rem,7vw,5rem)]">
          <Kinetic text="Agora, descubra o seu." active={active} step={0.08} />
        </h2>
        <m.p variants={rise} className="mx-auto mt-5 max-w-xl text-lg text-paper/85">
          24 afirmações rápidas, sim ou não. No fim, você vê se está mais perto da esquerda, do centro ou da direita — calculado só no seu celular.
        </m.p>
        <m.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
          <TLink href="/afinidades" scene={{ label: "Sua afinidade", sub: "24 afirmações · sim ou não", tone: "neutral" }} className="btn btn-afinidade">
            <span aria-hidden className="inline-flex h-3 w-5 overflow-hidden">
              <span className="h-full w-1/2 bg-esq" />
              <span className="h-full w-1/2 bg-dir" />
            </span>
            Descobrir minha afinidade →
          </TLink>
          <Link href="/?ver=propostas" className="btn">Ver as propostas do 2º turno</Link>
        </m.div>
        {sponsor && <m.div variants={rise} className="mx-auto mt-10 hidden max-w-2xl text-left md:block">{sponsor}</m.div>}
      </Stage>
    );
  }

  return (
    <Stage active={active} className="text-center">
      <m.div variants={pop} className="mx-auto w-fit">
        <Scale tilt={0} className="h-24 w-28 text-paper" />
      </m.div>
      <m.p variants={rise} className="kicker mt-6">Fim da {data.sideName.toLowerCase()}</m.p>
      <h2 className="display mt-3 text-[clamp(2.2rem,7vw,5rem)]">
        <Kinetic text="Agora, o outro lado." active={active} step={0.08} />
      </h2>
      <m.p variants={rise} className="mx-auto mt-5 max-w-xl text-lg text-paper/85">
        Você conheceu as ideias, os melhores argumentos e as críticas da {data.sideName.toLowerCase()}. Para escolher de verdade, falta ouvir a {other.name.toLowerCase()}.
      </m.p>
      <m.div variants={rise} className="mt-8 flex flex-wrap justify-center gap-3">
        <TLink
          href={`/explorar/${other.slug}`}
          scene={{ label: other.name, sub: "Capítulo 1 · De onde veio?", tone: other.slug, number: "1", from: other.slug === "direita" ? "right" : "left" }}
          className="btn btn-solid"
          data-side={other.slug}
        >
          Conhecer a {other.name.toLowerCase()} →
        </TLink>
        <Link href="/afinidades" className="btn btn-afinidade">Já quero descobrir minha afinidade</Link>
      </m.div>
      {sponsor && <m.div variants={rise} className="mx-auto mt-10 hidden max-w-2xl text-left md:block">{sponsor}</m.div>}
    </Stage>
  );
}


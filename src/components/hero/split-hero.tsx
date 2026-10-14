"use client";

import Image from "next/image";
import Link from "next/link";
import { Columns2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useMediaQuery } from "@/lib/use-media-query";
import { useTransitionNav } from "@/components/transition/transition-provider";
import { CANDIDATE_PHOTOS, daysUntil, SECOND_ROUND_DATE } from "@/lib/election";

type SideInfo = { href: string; name: string; tagline: string; description: string };
export type HeroCandidate = { slug: string; ballotName: string; number: number | null; partyAcronym: string; runningMate: string | null };
type Props = { question: string; subtitle: string; left: SideInfo; right: SideInfo; candidates: HeroCandidate[] };
type Which = "left" | "right";
type Mode = "ideias" | "propostas";

/** Linhas de contorno geradas deterministicamente — o mesmo desenho, espelhado, nos dois lados. */
function useContourPaths(count = 26) {
  return useMemo(() => {
    const paths: string[] = [];
    for (let i = 0; i < count; i++) {
      const y = (i / count) * 200;
      const amp = 4 + ((i * 37) % 11);
      const phase = (i * 0.61) % (Math.PI * 2);
      let d = `M -10 ${y.toFixed(1)}`;
      for (let x = 0; x <= 110; x += 5) {
        const yy = y + Math.sin(x / 14 + phase) * amp * Math.sin((x + i * 7) / 40);
        d += ` L ${x} ${yy.toFixed(2)}`;
      }
      paths.push(d);
    }
    return paths;
  }, [count]);
}

function Universe({ tone, neutral }: { tone: Which; neutral: boolean }) {
  const paths = useContourPaths();
  const ink = neutral ? "var(--color-paper)" : tone === "left" ? "var(--color-esq-ink)" : "var(--color-dir-ink)";
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={tone === "right" ? { transform: "scaleX(-1)" } : undefined}>
      <div className="drift absolute inset-x-0 top-0 h-[200%]">
        <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="h-full w-full">
          {paths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={ink} strokeWidth={0.12} vectorEffect="non-scaling-stroke" opacity={(neutral ? 0.1 : 0.18) + (i % 5) * 0.05} style={{ transition: "stroke .8s" }} />
          ))}
        </svg>
      </div>
    </div>
  );
}


export function SplitHero({ question, subtitle, left, right, candidates }: Props) {
  const router = useRouter();
  const { go } = useTransitionNav();
  const reduce = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover)", false);
  const wide = useMediaQuery("(min-width: 768px)", false);
  const [hover, setHover] = useState<Which | null>(null);
  const [chosen, setChosen] = useState<Which | null>(null);
  const [mode, setMode] = useState<Mode>("ideias");
  const hasCandidates = candidates.length >= 2;
  const props = mode === "propostas" && hasCandidates;

  const split = useSpring(50, { stiffness: 140, damping: 24, mass: 0.9 });

  // ?ver=propostas abre direto no modo de propostas (links do site e compartilhamento).
  useEffect(() => {
    if (hasCandidates && new URLSearchParams(window.location.search).get("ver") === "propostas") setMode("propostas");
  }, [hasCandidates]);

  useEffect(() => {
    router.prefetch(left.href);
    router.prefetch(right.href);
    candidates.forEach((c) => router.prefetch(`/segundo-turno/${c.slug}`));
  }, [router, left.href, right.href, candidates]);

  useEffect(() => {
    const target = chosen === "left" ? 100 : chosen === "right" ? 0 : hover === "left" ? 56 : hover === "right" ? 44 : 50;
    split.set(target);
  }, [hover, chosen, split]);

  function toggle(next: Mode) {
    setMode(next);
    setHover(null);
    const url = next === "propostas" ? "/?ver=propostas" : "/";
    window.history.replaceState(window.history.state, "", url);
    // Um "respiro" na divisão para marcar a troca.
    if (!reduce) {
      split.set(next === "propostas" ? 47 : 53);
      window.setTimeout(() => split.set(50), 260);
    }
  }

  function choose(which: Which, href: string, scene: Parameters<typeof go>[1]) {
    return (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      if (reduce) return router.push(href);
      setChosen(which);
      window.setTimeout(() => go(href, scene), 560);
    };
  }

  const showDesc = (w: Which) => !canHover || hover === w;
  const fade = chosen ? { opacity: 0, transition: { duration: 0.25 } } : { opacity: 1 };

  const half = (which: Which) => {
    const isLeft = which === "left";
    const side = isLeft ? left : right;
    const cand = candidates[isLeft ? 0 : 1];
    const photo = cand ? CANDIDATE_PHOTOS[cand.slug] : undefined;
    const href = props && cand ? `/segundo-turno/${cand.slug}` : side.href;
    const scene = props && cand
      ? { label: cand.ballotName, sub: "Propostas · 2º turno", tone: "neutral" as const, number: cand.number ? String(cand.number) : undefined, from: isLeft ? ("left" as const) : ("right" as const) }
      : { label: side.name, sub: "Capítulo 1 · De onde veio?", tone: isLeft ? ("esquerda" as const) : ("direita" as const), number: "1", from: isLeft ? ("left" as const) : ("right" as const) };
    const lit = hover === which || chosen === which;

    return (
      <m.div
        className={isLeft ? "hero-clip-left" : "hero-clip-right"}
        style={{ background: isLeft ? "linear-gradient(160deg, var(--color-esq-deep) 0%, #2a1217 55%, var(--color-graphite) 100%)" : "linear-gradient(200deg, var(--color-dir-deep) 0%, #111c33 55%, var(--color-graphite) 100%)" }}
      >
        {/* Camada neutra do modo propostas: as candidaturas não herdam o vermelho/azul dos lados. */}
        <m.div
          aria-hidden
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: props ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(${isLeft ? 160 : 200}deg, #2b303c 0%, #1a1d25 55%, var(--color-graphite) 100%)` }}
        />
        <Universe tone={which} neutral={props} />

        {/* Retrato: opaco o suficiente para reconhecer, sob as cores. */}
        <AnimatePresence>
          {props && photo && (
            <m.div
              key="photo"
              aria-hidden
              className={`pointer-events-none absolute ${
                // Lula (metade esquerda/de cima) sempre com a foto à ESQUERDA; Flávio (direita/de baixo) sempre à DIREITA.
                isLeft ? "left-0 top-0 h-1/2 w-[62%] md:bottom-0 md:left-[3%] md:top-auto md:h-[86%] md:w-[46%]" : "bottom-0 right-0 h-1/2 w-[62%] md:right-[3%] md:h-[86%] md:w-[46%]"
              }`}
              initial={{ opacity: 0, y: 40, scale: 1.06 }}
              animate={{ opacity: lit ? 0.62 : 0.42, y: 0, scale: chosen === which ? 1.06 : 1 }}
              exit={{ opacity: 0, y: 30, transition: { duration: 0.35 } }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={photo.src} alt="" fill priority sizes="(min-width: 768px) 46vw, 62vw" className="object-contain object-bottom" />
            </m.div>
          )}
        </AnimatePresence>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(17,19,24,0.85),transparent_55%)] md:bg-[linear-gradient(to_top,rgba(17,19,24,0.9),transparent_45%)]" />

        <m.div
          aria-hidden
          className="absolute inset-0"
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: props
              ? `radial-gradient(70% 60% at ${isLeft ? "30%" : "70%"} 60%, rgba(245,243,238,0.08), transparent 70%)`
              : `radial-gradient(70% 60% at ${isLeft ? "30%" : "70%"} 60%, color-mix(in srgb, var(--color-${isLeft ? "esq" : "dir"}) 38%, transparent), transparent 70%)`,
          }}
        />
        <Link
          href={href}
          onClick={choose(which, href, scene)}
          onMouseEnter={() => canHover && setHover(which)}
          onMouseLeave={() => canHover && setHover(null)}
          onFocus={() => setHover(which)}
          onBlur={() => setHover(null)}
          aria-label={props && cand ? `Ver as propostas de ${cand.ballotName}` : `Explorar a ${side.name.toLowerCase()}: ${side.tagline}`}
          className={`group absolute flex flex-col justify-end p-[var(--gutter)] pb-10 outline-offset-[-6px] md:pb-[12vh] ${
            isLeft ? "inset-x-0 top-0 h-1/2 md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-1/2" : "inset-x-0 bottom-0 h-1/2 items-end text-right md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-1/2"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={props ? `c-${cand?.slug}` : "ideia"}
              className={`flex flex-col ${isLeft ? "items-start" : "items-end"}`}
              initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: isLeft ? 0 : 0.08 }}
            >
              {/* Ao escolher, rótulo e linha de apoio saem antes de o nome crescer (nada se sobrepõe). */}
              <m.span className="kicker mb-3 text-paper/70" animate={{ opacity: chosen ? 0 : 1, y: chosen ? -8 : 0 }} transition={{ duration: 0.18 }}>
                {props ? (isLeft ? "← Ver propostas" : "Ver propostas →") : isLeft ? "← Explorar" : "Explorar →"}
              </m.span>
              <m.span
                className={`display block ${props ? "text-[clamp(2.3rem,10vw,6.4rem)] md:text-[clamp(2.4rem,min(5.4vw,10.8vh),6.4rem)]" : "text-[clamp(3.2rem,15vw,10rem)] md:text-[clamp(3.6rem,min(8.6vw,16.9vh),10rem)]"} ${isLeft ? "origin-bottom-left" : "origin-bottom-right"}`}
                animate={chosen ? { y: chosen === which && wide ? -24 : 0, scale: chosen === which ? (wide ? 1.14 : 1.06) : 0.9, opacity: chosen === which ? 1 : 0 } : { y: hover === which ? -8 : 0, scale: hover === which ? 1.02 : 1, opacity: 1 }}
                transition={chosen && chosen !== which ? { duration: 0.15 } : { type: "spring", stiffness: 200, damping: 20, delay: chosen ? 0.12 : 0 }}
              >
                {props && cand ? cand.ballotName : side.name}
              </m.span>
              <m.span className="mt-2 font-display text-base text-paper/85 md:text-xl" animate={{ opacity: chosen ? 0 : 1 }} transition={{ duration: 0.18 }}>
                {props && cand ? (
                  <>
                    <span className="font-mono tabular-nums">{cand.number}</span> · {cand.partyAcronym}
                    {cand.runningMate ? <span className="text-paper/65"> · Vice: {cand.runningMate}</span> : null}
                  </>
                ) : (
                  side.tagline
                )}
              </m.span>
              <m.span
                className="mt-3 hidden max-w-md text-base leading-relaxed text-paper/75 md:block"
                initial={false}
                animate={{ opacity: showDesc(which) && !chosen ? 1 : 0, y: showDesc(which) ? 0 : 8 }}
                transition={{ duration: 0.35 }}
              >
                {props ? "As propostas principais em 8 temas, com o trecho exato do plano de governo registrado no TSE." : side.description}
              </m.span>
            </m.span>
          </AnimatePresence>
        </Link>
      </m.div>
    );
  };

  const heading = props
    ? { q: "Duas propostas de país.", s: "2º turno em 25 de outubro. Veja o que cada candidatura promete, tema por tema — sem torcida e sem ranking." }
    : { q: question, s: subtitle };

  return (
    <m.section
      aria-labelledby="hero-question"
      style={{ "--split": split } as unknown as React.CSSProperties}
      className="grain relative flex h-svh min-h-[600px] flex-col overflow-hidden bg-graphite"
    >
      {/* Pergunta central: no celular fica numa faixa neutra; no desktop atravessa a divisão. */}
      <m.div animate={fade} className="relative z-20 px-[var(--gutter)] pb-4 pt-[4.5rem] text-center md:pointer-events-none md:absolute md:inset-x-0 md:top-[12vh] md:pt-0">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={props ? "p" : "i"} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
            <h1 id="hero-question" className="display mx-auto max-w-5xl md:max-w-[10em] text-[clamp(2.1rem,8.6vw,6.4rem)] md:text-[clamp(2.1rem,min(8.6vw,10.8vh),6.4rem)] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              {heading.q}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-paper/80 md:text-lg">{heading.s}</p>
          </m.div>
        </AnimatePresence>
        {hasCandidates && (
          <div className="mt-4 flex justify-center md:hidden">
            <ModeSwitch mode={mode} onChange={toggle} />
          </div>
        )}
      </m.div>

      <div className="relative flex-1">
        {half("left")}
        {half("right")}

        {/* A linha que separa dois mundos */}
        <m.div
          aria-hidden
          className="hero-divider pointer-events-none z-10 bg-paper"
          animate={chosen ? { opacity: [1, 1, 0], scale: [1, 1.6, 1] } : { opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <span className="pulse-line absolute inset-0 shadow-[0_0_28px_4px_rgba(245,243,238,0.35)]" />
        </m.div>

        {/* Terceiro caminho: sobre a própria linha, entre os dois lados */}
        <m.div animate={fade} className="hero-cta z-20 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {props ? (
              <m.span key="cmp" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Link href="/segundo-turno" className="btn btn-solid whitespace-nowrap shadow-[0_8px_40px_rgba(0,0,0,0.5)]" onMouseEnter={() => setHover(null)}>
                  <Columns2 aria-hidden className="h-4 w-4" /> Comparar lado a lado
                </Link>
              </m.span>
            ) : (
              <m.span key="af" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Link href="/afinidades" className="btn btn-afinidade whitespace-nowrap" onMouseEnter={() => setHover(null)}>
                  <span aria-hidden className="inline-flex h-3 w-5 overflow-hidden">
                    <span className="h-full w-1/2 bg-esq" />
                    <span className="h-full w-1/2 bg-dir" />
                  </span>
                  Descobrir minha afinidade
                </Link>
              </m.span>
            )}
          </AnimatePresence>
          {hasCandidates && (
            <span className="hidden md:inline-flex" onMouseEnter={() => setHover(null)}>
              <ModeSwitch mode={mode} onChange={toggle} />
            </span>
          )}
        </m.div>
      </div>
    </m.section>
  );
}

/** Alterna a home entre as ideias (esquerda × direita) e as propostas do 2º turno. */
function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  // Há duas cópias (celular e computador): cada uma precisa da sua própria "pílula".
  const pillId = useId();
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysUntil(SECOND_ROUND_DATE)), []);
  const opts: { v: Mode; label: React.ReactNode }[] = [
    { v: "ideias", label: "Esquerda × Direita" },
    {
      v: "propostas",
      label: (
        <>
          <span className="relative mr-1.5 inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ev-pro opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ev-pro" />
          </span>
          Ver propostas{days !== null && days > 0 ? <span className="ml-1 opacity-70">· {days}d</span> : null}
        </>
      ),
    },
  ];
  return (
    <div role="radiogroup" aria-label="O que você quer ver" className="inline-flex h-11 items-center rounded-full border border-paper/40 bg-graphite/70 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={mode === o.v}
          onClick={() => onChange(o.v)}
          className={`relative inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 font-mono text-[0.78rem] uppercase tracking-[0.08em] transition-colors ${mode === o.v ? "text-graphite" : "text-paper/80 hover:text-paper"}`}
        >
          {mode === o.v && <m.span layoutId={`hero-mode-pill-${pillId}`} className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
          <span className="relative inline-flex items-center">{o.label}</span>
        </button>
      ))}
    </div>
  );
}


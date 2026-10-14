"use client";

import { createContext, Fragment, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { glossCtx, glossSegments } from "@/lib/glossary";
import { GlossTerm } from "@/components/glossary/gloss-term";
import { useSpeech } from "@/lib/reel/use-speech";
import { VoiceSettings } from "./voice-settings";

/**
 * Moldura do "reel": telas cheias com encaixe vertical (deslize no celular,
 * rolagem/setas no computador), barra de progresso segmentada no topo e
 * navegação por teclado. Cada tela sabe se está ativa para disparar suas
 * próprias animações — como num story, só que para aprender.
 */

type ReelCtx = { next: () => void; prev: () => void; goToKey: (key: string) => void };
const Ctx = createContext<ReelCtx>({ next: () => {}, prev: () => {}, goToKey: () => {} });
export const useReel = () => useContext(Ctx);

export type ReelProps = {
  keys: string[];
  /** Índice do segmento (capítulo/rodada) de cada tela. */
  segs: number[];
  segments: string[];
  label: string;
  render: (index: number, active: boolean) => React.ReactNode;
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  /** Fundo que muda por segmento (número gigante, ilustração…). */
  backdrop?: (seg: number) => React.ReactNode;
  /** Camada de fundo persistente (não troca a cada segmento), ex.: o retrato da candidatura. */
  ambient?: (index: number) => React.ReactNode;
  onActive?: (index: number) => void;
  /** Chave inicial (ex.: vinda do #hash). */
  startKey?: string | null;
  /** Texto falado de cada tela (botão "Ouvir"). */
  speech?: (index: number) => string;
  /** Telas que pedem uma ação: o modo ouvir para e espera. */
  interactive?: (index: number) => boolean;
  /** Segundos estimados de cada tela (para "faltam ~X min"). */
  secs?: number[];
  /** Elementos flutuantes extras (ex.: "continuar de onde parou"). */
  overlay?: React.ReactNode;
};

export function Reel({ keys, segs, segments, label, render, topLeft, topRight, backdrop, ambient, onActive, startKey, speech, interactive, secs, overlay }: ReelProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const slideEls = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeKey = useRef<string | null>(null);

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const el = slideEls.current[Math.max(0, Math.min(i, keys.length - 1))];
    el?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }, [keys.length]);

  const next = useCallback(() => scrollToIndex(active + 1), [active, scrollToIndex]);
  const prev = useCallback(() => scrollToIndex(active - 1), [active, scrollToIndex]);
  const goToKey = useCallback((key: string) => {
    const i = keys.indexOf(key);
    if (i >= 0) scrollToIndex(i);
  }, [keys, scrollToIndex]);

  // Tela ativa = a que cobre a linha do meio da tela. Duas fontes, para não
  // falhar no iPhone (no Safari, a rolagem com inércia atrasa ou pula avisos do
  // IntersectionObserver, e a tela não "ativava" de novo — sem animação):
  //  1) o IntersectionObserver, rápido onde funciona bem;
  //  2) a própria rolagem: a cada quadro em que rola (e quando para), mede
  //     qual tela está no meio.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          setActive(i);
        }
      },
      { root, rootMargin: "-49% 0px -49% 0px", threshold: 0 },
    );
    slideEls.current.forEach((el) => el && io.observe(el));

    let frame = 0;
    let settle = 0;
    const measure = () => {
      frame = 0;
      const box = root.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      const els = slideEls.current;
      for (let i = 0; i < els.length; i++) {
        const r = els[i]?.getBoundingClientRect();
        if (r && r.top <= mid && r.bottom > mid) {
          setActive(i);
          return;
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
      window.clearTimeout(settle);
      settle = window.setTimeout(measure, 140); // quando a inércia termina
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      io.disconnect();
      root.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [keys]);

  useEffect(() => {
    activeKey.current = keys[active] ?? null;
    onActive?.(active);
  }, [active, keys, onActive]);

  // Quando a lista muda (ex.: modo aprofundado), mantém a pessoa na mesma tela.
  useLayoutEffect(() => {
    const k = activeKey.current;
    if (!k) return;
    const i = keys.indexOf(k);
    if (i >= 0 && i !== active) {
      slideEls.current[i]?.scrollIntoView({ behavior: "auto", block: "start" });
      setActive(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  // Começa no ponto pedido (#cap-…, #r-…).
  useEffect(() => {
    if (!startKey) return;
    const i = keys.indexOf(startKey);
    if (i > 0) requestAnimationFrame(() => scrollToIndex(i, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey]);

  // Teclado: ↓/↑, PageDown/PageUp, J/K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("input, textarea, select, [role=dialog]") || e.altKey || e.metaKey || e.ctrlKey)) return;
      if (["ArrowDown", "PageDown", "j"].includes(e.key)) { e.preventDefault(); next(); }
      if (["ArrowUp", "PageUp", "k"].includes(e.key)) { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Modo ouvir: lê a tela ativa e segue sozinho (menos nas telas que pedem resposta).
  const voice = useSpeech();
  const [listening, setListening] = useState(false);
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    if (!listening || !speech) return;
    setWaiting(false);
    let t: number | undefined;
    voice.speak(speech(active), () => {
      if (interactive?.(active)) return setWaiting(true);
      if (active >= keys.length - 1) return setListening(false);
      t = window.setTimeout(next, 650);
    });
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, active]);
  useEffect(() => {
    if (!listening) voice.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const seg = segs[active] ?? 0;
  // Ao trocar de segmento (capítulo/rodada), a barrinha recém-completada pulsa.
  const prevSegRef = useRef(seg);
  const [pulse, setPulse] = useState<{ i: number; id: number } | null>(null);
  useEffect(() => {
    if (seg > prevSegRef.current) setPulse({ i: prevSegRef.current, id: Date.now() });
    prevSegRef.current = seg;
  }, [seg]);
  // Progresso dentro de cada segmento.
  const fill = segments.map((_, s) => {
    const idx = segs.map((v, i) => (v === s ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) return 0;
    if (active > idx[idx.length - 1]) return 1;
    if (active < idx[0]) return 0;
    return (active - idx[0] + 1) / idx.length;
  });

  return (
    <Ctx.Provider value={{ next, prev, goToKey }}>
      <div className="fixed inset-0 z-0 overflow-hidden bg-graphite">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {ambient?.(active)}
          <AnimatePresence mode="popLayout">
            <m.div
              key={seg}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {backdrop?.(seg)}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Barra superior: progresso segmentado + controles */}
        <div className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-graphite via-graphite/80 to-transparent pb-6">
          <div className="mx-auto flex max-w-5xl gap-1 px-[var(--gutter)] pt-3" aria-hidden>
            {segments.map((s, i) => (
              <m.div
                key={pulse?.i === i ? `${i}-${pulse.id}` : i}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-paper/15"
                title={s}
                initial={pulse?.i === i ? { scaleY: 3.5, boxShadow: "0 0 14px rgba(245,243,238,0.9)" } : false}
                animate={{ scaleY: 1, boxShadow: "0 0 0px rgba(245,243,238,0)" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <m.div className="h-full origin-left bg-paper" animate={{ scaleX: fill[i] }} initial={false} transition={{ type: "spring", stiffness: 160, damping: 26 }} />
              </m.div>
            ))}
          </div>
          <div className="mx-auto mt-2 flex max-w-5xl items-center justify-between gap-2 px-[var(--gutter)]">
            <div className="flex min-w-0 items-center gap-3">{topLeft}</div>
            <div className="flex items-center gap-2">{topRight}</div>
          </div>
        </div>

        <div
          ref={scroller}
          className="reel-scroller relative z-10 h-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-contain"
          role="region"
          aria-roledescription="sequência de telas"
          aria-label={label}
        >
          {keys.map((k, i) => (
            <section
              key={k}
              id={k}
              ref={(el) => { slideEls.current[i] = el; }}
              data-index={i}
              data-active={i === active}
              aria-roledescription="tela"
              aria-label={`${i + 1} de ${keys.length}`}
              className="relative flex min-h-svh snap-start snap-always items-center overflow-x-clip"
            >
              <FitBox className="mx-auto w-full max-w-4xl px-[var(--gutter)] pb-24 pt-[4.75rem] md:pb-24 md:pt-24">{render(i, Math.abs(i - active) <= 0)}</FitBox>
            </section>
          ))}
        </div>

        {/* Ouvir + tempo restante */}
        <div className="absolute bottom-5 left-16 z-30 flex items-center gap-3">
          {voice.supported && speech && (
            <button
              type="button"
              onClick={() => setListening((v) => !v)}
              aria-pressed={listening}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 font-mono text-[0.75rem] uppercase tracking-[0.08em] backdrop-blur transition-colors ${listening ? "border-paper bg-paper text-graphite" : "border-paper/40 bg-graphite/60 text-paper hover:border-paper"}`}
            >
              {listening ? <SoundBars /> : <SpeakerIcon />}
              {listening ? "Parar" : "Ouvir"}
            </button>
          )}
          {speech && <VoiceSettings voice={voice} />}
        </div>
        <AnimatePresence>
          {listening && waiting && (
            <m.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="kicker absolute bottom-24 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-4 py-2 text-graphite" role="status">
              Sua vez: responda e toque ↓ para seguir
            </m.p>
          )}
        </AnimatePresence>
        {overlay}

        {/* Navegação lateral (computador) e contador */}
        <div className="absolute bottom-5 right-[var(--gutter)] z-30 flex flex-col items-center gap-2">
          <button type="button" onClick={prev} disabled={active === 0} aria-label="Tela anterior" className="hidden h-11 w-11 md:grid place-items-center rounded-full border border-paper/30 bg-graphite/60 text-paper backdrop-blur transition hover:bg-paper hover:text-graphite disabled:opacity-25">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 15l6-6 6 6" /></svg>
          </button>
          <span className="hidden font-mono text-[0.7rem] tabular-nums text-ash md:inline" aria-live="polite">{active + 1}/{keys.length}</span>
          <m.button
            type="button"
            onClick={next}
            disabled={active === keys.length - 1}
            aria-label="Próxima tela"
            className="grid h-14 w-14 place-items-center rounded-full bg-paper text-graphite shadow-[0_10px_40px_rgba(0,0,0,0.5)] disabled:opacity-25"
            animate={active === 0 ? { y: [0, -6, 0] } : { y: 0 }}
            transition={active === 0 ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>
          </m.button>
        </div>

        <AnimatePresence>
          {active === 0 && (
            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.6 } }}
              exit={{ opacity: 0 }}
              className="kicker pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-paper/70 md:bottom-7"
            >
              <span className="md:hidden">Deslize para cima</span>
              <span className="hidden md:inline">Role ou use ↓</span>
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

/** Variantes compartilhadas: o conteúdo de cada tela entra em sequência quando ela fica ativa. */
export const stage: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};
export const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -6 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 16 } },
};

/** Texto que entra palavra por palavra (tipografia cinética). Com gloss, palavras difíceis viram "toque para entender". */
/** Menor encolhimento aceito: abaixo disso, a tela rola (letra pequena demais não ajuda). */
const MIN_FIT = 0.72;

/**
 * "Uma tela = uma coisa": se o conteúdo de uma tela passar da altura visível
 * (notebook baixo, celular pequeno), encolhe tudo por igual (zoom) até caber.
 * Mede sem o zoom a cada mudança de tamanho (fonte carregada, ressalva aberta,
 * janela redimensionada); só grava quando o valor muda, para não entrar em laço.
 */
function FitBox({ className, children }: { className: string; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const box = outer.current;
    const el = inner.current;
    if (!box || !el) return;
    let frame = 0;
    let current = "";
    const fit = () => {
      frame = 0;
      const prev = el.style.zoom;
      el.style.zoom = "";
      const cs = getComputedStyle(box);
      const viewport = box.closest<HTMLElement>(".reel-scroller")?.clientHeight ?? window.innerHeight;
      const avail = viewport - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const need = el.scrollHeight;
      const next = need > avail + 2 ? String(Math.max(MIN_FIT, Math.floor((avail / need) * 100) / 100)) : "";
      el.style.zoom = next === current ? prev : next;
      current = next;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(fit);
    };
    fit();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener("resize", schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={outer} className={className}>
      <div ref={inner}>{children}</div>
    </div>
  );
}

export function Kinetic({ text, active, className = "", delay = 0, step = 0.035, gloss = false }: { text: string; active: boolean; className?: string; delay?: number; step?: number; gloss?: boolean }) {
  const segs = gloss ? glossSegments(text, glossCtx(2)) : [{ text }];
  let wi = 0;
  const word = (w: string, key: number, inGloss = false) => {
    const i = wi++;
    return (
      <span key={key} aria-hidden={gloss ? undefined : true} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        <m.span
          className={inGloss ? "gloss-word inline-block" : "inline-block"}
          initial={{ y: "105%", opacity: 0 }}
          animate={active ? { y: "0%", opacity: 1 } : { y: "105%", opacity: 0 }}
          transition={{ delay: active ? delay + i * step : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </m.span>
      </span>
    );
  };
  return (
    <span className={className} aria-label={gloss ? undefined : text}>
      {segs.map((seg, si) => {
        const isGloss = "entry" in seg && !!seg.entry;
        const parts = seg.text.split(/(\s+)/).map((w, j) => (w === "" ? null : /^\s+$/.test(w) ? " " : word(w, j, isGloss)));
        return "entry" in seg && seg.entry ? (
          <GlossTerm key={si} term={seg.entry.term} definition={seg.entry.definition}>
            {parts}
          </GlossTerm>
        ) : (
          <Fragment key={si}>{parts}</Fragment>
        );
      })}
    </span>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      <path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11" strokeLinecap="round" />
    </svg>
  );
}

function SoundBars() {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <m.span key={i} className="w-[3px] rounded-full bg-current" animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </span>
  );
}

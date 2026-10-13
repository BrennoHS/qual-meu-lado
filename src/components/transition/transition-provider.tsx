"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

/**
 * Transições entre telas: uma "cortina" na cor do destino cobre a tela, o
 * nome do destino entra letra a letra, a rota muda por baixo e a cortina sai
 * pelo lado oposto revelando a nova página. Só transform/opacity/clip-path.
 * Com movimento reduzido, a navegação é imediata.
 */

export type Tone = "esquerda" | "direita" | "neutral";
export type Scene = { label: string; sub?: string; tone?: Tone; number?: string; from?: "left" | "right" };

type Phase = "idle" | "cover" | "hold" | "reveal";
type Ctx = { go: (href: string, scene?: Scene) => void; busy: boolean };

const TransitionCtx = createContext<Ctx>({ go: () => {}, busy: false });
export const useTransitionNav = () => useContext(TransitionCtx);

const bg: Record<Tone, string> = {
  esquerda: "linear-gradient(135deg, var(--color-esq-deep) 0%, #2a1217 60%, var(--color-graphite) 100%)",
  direita: "linear-gradient(225deg, var(--color-dir-deep) 0%, #111c33 60%, var(--color-graphite) 100%)",
  neutral: "linear-gradient(180deg, #1b1e26 0%, var(--color-graphite) 100%)",
};
const ink: Record<Tone, string> = { esquerda: "var(--color-esq-ink)", direita: "var(--color-dir-ink)", neutral: "var(--color-paper)" };

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scene, setScene] = useState<Scene | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const startPath = useRef<string>(pathname);

  const go = useCallback(
    (href: string, s?: Scene) => {
      const dest = href.split("#")[0].split("?")[0];
      if (reduce || !s || dest === pathname) {
        router.push(href);
        return;
      }
      target.current = href;
      startPath.current = pathname;
      setScene(s);
      setPhase("cover");
    },
    [pathname, reduce, router],
  );

  // A rota mudou por baixo da cortina: hora de revelar.
  useEffect(() => {
    if (phase === "hold" && pathname !== startPath.current) {
      window.scrollTo(0, 0);
      const t = window.setTimeout(() => setPhase("reveal"), 120);
      return () => window.clearTimeout(t);
    }
  }, [pathname, phase]);

  // Segurança: nunca deixar a cortina presa (rota lenta, aba em segundo plano…).
  useEffect(() => {
    if (phase !== "hold" && phase !== "reveal") return;
    const t = window.setTimeout(
      () => {
        if (phase === "hold") return setPhase("reveal");
        setPhase("idle");
        setScene(null);
      },
      phase === "hold" ? 4000 : 1500,
    );
    return () => window.clearTimeout(t);
  }, [phase]);

  const tone = scene?.tone ?? "neutral";
  const fromLeft = (scene?.from ?? "left") === "left";
  const covered = "inset(0% 0% 0% 0%)";
  const hiddenStart = fromLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
  const hiddenEnd = fromLeft ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

  return (
    <TransitionCtx.Provider value={{ go, busy: phase !== "idle" }}>
      {children}
      <AnimatePresence>
        {phase !== "idle" && scene && (
          <m.div
            key="curtain"
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[90] overflow-hidden"
            style={{ background: bg[tone] }}
            initial={{ clipPath: hiddenStart }}
            animate={{ clipPath: phase === "reveal" ? hiddenEnd : covered }}
            transition={{ duration: phase === "reveal" ? 0.75 : 0.6, ease: [0.77, 0, 0.18, 1] }}
            onAnimationComplete={() => {
              if (phase === "cover") {
                setPhase("hold");
                if (target.current) router.push(target.current);
              } else if (phase === "reveal") {
                setPhase("idle");
                setScene(null);
              }
            }}
          >
            <span className="sr-only">Carregando {scene.label}</span>
            {/* Linha divisória que conduz a cortina */}
            <m.span
              aria-hidden
              className="absolute inset-y-0 w-[2px] bg-paper shadow-[0_0_40px_6px_rgba(245,243,238,0.45)]"
              style={{ left: fromLeft ? "auto" : 0, right: fromLeft ? 0 : "auto" }}
              animate={{ opacity: phase === "hold" ? 0.25 : 1 }}
            />
            {scene.number && (
              <m.span
                aria-hidden
                className="display pointer-events-none absolute -bottom-[6vw] right-[-2vw] select-none text-[42vw] leading-none text-transparent"
                style={{ WebkitTextStroke: `1px ${ink[tone]}`, opacity: 0.35 }}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 0.35 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {scene.number}
              </m.span>
            )}
            <div className="absolute inset-0 flex flex-col items-start justify-center px-[var(--gutter)] md:px-[8vw]">
              {scene.sub && (
                <m.p
                  className="kicker mb-4"
                  style={{ color: ink[tone] }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: phase === "reveal" ? 0 : 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  {scene.sub}
                </m.p>
              )}
              <h2 className="display flex flex-wrap gap-x-[0.25em] text-[clamp(3rem,13vw,11rem)]" aria-hidden>
                {scene.label.split(" ").map((word, wi, words) => {
                  const offset = words.slice(0, wi).join(" ").length + (wi ? 1 : 0);
                  return (
                    <span key={wi} className="inline-flex whitespace-nowrap">
                      {word.split("").map((ch, ci) => {
                        const i = offset + ci;
                        return (
                          <span key={ci} className="inline-block overflow-hidden pb-[0.08em]">
                            <m.span
                              className="inline-block"
                              initial={{ y: "110%" }}
                              animate={{ y: phase === "reveal" ? "-110%" : "0%" }}
                              transition={{ delay: phase === "reveal" ? i * 0.012 : 0.18 + i * 0.03, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {ch}
                            </m.span>
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </h2>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </TransitionCtx.Provider>
  );
}

/** Link que usa a transição cinematográfica (cliques com Ctrl/Cmd abrem normalmente). */
export function TLink({
  href,
  scene,
  className,
  children,
  ...rest
}: { href: string; scene: Scene; className?: string; children: React.ReactNode } & Omit<React.ComponentProps<typeof Link>, "href" | "onClick">) {
  const { go } = useTransitionNav();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href, scene);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

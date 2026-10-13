"use client";

import * as m from "motion/react-m";

/**
 * Vinhetas das capas de capítulo (reel). Traço fino desenhado na tela, na cor
 * do lado (currentColor = --accent-ink). Os dois lados usam a MESMA vinheta
 * em cada capítulo — só a cor muda.
 */

const D = (delay = 0, dur = 1) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: dur, delay, ease: [0.22, 1, 0.36, 1] as const },
});
const P = (delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { delay, type: "spring" as const, stiffness: 260, damping: 15 },
  style: { transformBox: "fill-box" as const, transformOrigin: "center" },
});
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Plenário em miniatura: cadeiras que se acendem. */
function Origens() {
  const seats: { x: number; y: number; d: number }[] = [];
  for (const [r, n] of [
    [34, 7],
    [50, 9],
    [66, 11],
  ] as const) {
    for (let i = 0; i < n; i++) {
      const a = Math.PI - (i / (n - 1)) * Math.PI;
      seats.push({ x: Math.round((100 + r * Math.cos(a)) * 10) / 10, y: Math.round((88 - r * Math.sin(a)) * 10) / 10, d: i / n });
    }
  }
  return (
    <>
      {seats.map((s, i) => (
        <m.circle key={i} cx={s.x} cy={s.y} r={3.2} fill="currentColor" {...P(0.2 + s.d * 0.8)} />
      ))}
      <m.path d="M80 92 H120" {...S} {...D(0.1)} />
    </>
  );
}

/** Bússola: a agulha procura o norte. */
function Bussola() {
  return (
    <>
      <m.circle cx={100} cy={52} r={38} {...S} {...D(0)} />
      <m.circle cx={100} cy={52} r={3} fill="currentColor" {...P(0.5)} />
      <m.g initial={{ rotate: -120 }} animate={{ rotate: [-120, 30, -12, 6, 0] }} transition={{ duration: 2, delay: 0.4 }} style={{ transformBox: "view-box", transformOrigin: "100px 52px" }}>
        <path d="M100 52 L94 52 L100 20 L106 52 Z" fill="currentColor" />
        <path d="M100 52 L94 52 L100 84 L106 52 Z" {...S} />
      </m.g>
      <m.path d="M100 8 v6 M100 90 v6 M56 52 h6 M138 52 h6" {...S} {...D(0.3)} />
    </>
  );
}

/** Megafone: o argumento ganha voz. */
function Megafone() {
  return (
    <>
      <m.path d="M60 44 L120 22 V82 L60 60 Z" {...S} {...D(0)} />
      <m.path d="M60 44 H48 V60 H60 M58 60 L66 82 H76 L70 62" {...S} {...D(0.3)} />
      {[0, 1, 2].map((i) => (
        <m.path key={i} d={`M${132 + i * 10} ${40 - i * 6} q${8 + i * 4} ${12 + i * 6} 0 ${24 + i * 12}`} {...S} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.6, delay: 0.8 + i * 0.25, repeat: Infinity, repeatDelay: 0.6 }} />
      ))}
    </>
  );
}

/** Lupa sobre um documento: olhar as críticas de perto. */
function Lupa() {
  return (
    <>
      <m.path d="M56 14 H112 L128 30 V92 H56 Z M112 14 V30 H128" {...S} {...D(0)} />
      <m.path d="M68 44 H114 M68 56 H108 M68 68 H100" {...S} strokeOpacity={0.55} {...D(0.3)} />
      <m.g initial={{ x: -20, y: 10 }} animate={{ x: [-20, 6, 0], y: [10, -4, 0] }} transition={{ duration: 1.6, delay: 0.5 }}>
        <circle cx={112} cy={60} r={18} {...S} strokeWidth={2.2} />
        <path d="M125 73 L142 90" {...S} strokeWidth={3} />
      </m.g>
    </>
  );
}

/** Congresso em miniatura: no Brasil, governar é negociar. */
function Congresso() {
  return (
    <>
      <m.path d="M30 88 H170" {...S} {...D(0)} />
      <m.path d="M44 74 H156 V88" {...S} {...D(0.1)} />
      <m.path d="M92 74 V18 h7 v56 M101 74 V18 h7 v56 M92 46 h16" {...S} {...D(0.3)} />
      <m.path d="M52 74 a22 16 0 0 1 32 0" {...S} {...D(0.6)} />
      <m.path d="M118 60 a24 14 0 0 0 32 0 l-4 14 h-24 z" {...S} {...D(0.7)} />
    </>
  );
}

/** Dois balões: ouvir antes de responder. */
function Dialogo() {
  return (
    <>
      <m.path d="M40 16 h70 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-46 l-14 12 v-12 h-10 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10 z" {...S} {...D(0)} />
      <m.path d="M160 44 h-70 a10 10 0 0 0 -10 10 v22 a10 10 0 0 0 10 10 h46 l14 12 v-12 h10 a10 10 0 0 0 10 -10 v-22 a10 10 0 0 0 -10 -10 z" {...S} strokeOpacity={0.6} {...D(0.4)} />
      {[0, 1, 2].map((i) => (
        <m.circle key={i} cx={64 + i * 12} cy={37} r={3} fill="currentColor" initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 + i * 0.18, repeatDelay: 0.8 }} />
      ))}
    </>
  );
}

/** Encruzilhada: agora é com você. */
function Encruzilhada() {
  return (
    <>
      <m.path d="M100 96 V62" {...S} strokeWidth={2} {...D(0)} />
      <m.path d="M100 62 C100 40 70 34 48 10" {...S} strokeWidth={2} {...D(0.4)} />
      <m.path d="M100 62 C100 40 130 34 152 10" {...S} strokeWidth={2} {...D(0.4)} />
      <m.circle cx={100} cy={62} r={5} fill="currentColor" {...P(0.3)} />
      <m.circle cx={100} cy={96} r={4} fill="currentColor" initial={{ y: 0 }} animate={{ y: [0, -34, -34] }} transition={{ duration: 1.6, delay: 1.2, repeat: Infinity, repeatDelay: 1 }} />
    </>
  );
}

const ART: Record<string, () => React.ReactNode> = {
  origens: Origens,
  "o-que-defende": Bussola,
  argumentos: Megafone,
  criticas: Lupa,
  "no-brasil": Congresso,
  "o-outro-lado": Dialogo,
  "o-que-voce-pensa": Encruzilhada,
};

export function ChapterArt({ chapter, className = "h-28 w-56" }: { chapter: string; className?: string }) {
  const Art = ART[chapter];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden>
      <Art />
    </svg>
  );
}

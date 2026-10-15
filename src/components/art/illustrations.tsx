"use client";

import { useMemo } from "react";
import * as m from "motion/react-m";
import { Dialogue, Ladder, Market, Paycheck, Powers, Taxes } from "./chapter-illustrations";

/**
 * Ilustrações políticas em SVG (linha fina, cores neutras + os dois tons
 * dos lados em peso igual). Animações só em opacity/transform/pathLength.
 */

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Plenário de 1789: as cadeiras se enchem de um lado e do outro, a partir do centro. */
export function Hemicycle() {
  const seats = useMemo(() => {
    const rows = [
      { r: 70, n: 9 },
      { r: 98, n: 13 },
      { r: 126, n: 17 },
      { r: 154, n: 21 },
    ];
    const out: { x: number; y: number; side: "esq" | "dir" | "mid"; d: number }[] = [];
    for (const { r, n } of rows) {
      for (let i = 0; i < n; i++) {
        const a = Math.PI - (i / (n - 1)) * Math.PI;
        // Arredonda para evitar divergência de ponto flutuante entre servidor e navegador.
        const x = Math.round((200 + r * Math.cos(a)) * 100) / 100;
        const y = Math.round((190 - r * Math.sin(a)) * 100) / 100;
        const side = x < 196 ? "esq" : x > 204 ? "dir" : "mid";
        out.push({ x, y, side, d: Math.abs(x - 200) / 160 });
      }
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 400 230" className="h-auto w-full" role="img" aria-labelledby="hemi-t hemi-d">
      <title id="hemi-t">Plenário da Assembleia Nacional francesa, 1789</title>
      <desc id="hemi-d">Assentos em semicírculo. À esquerda do presidente, os deputados que queriam limitar o rei; à direita, os que queriam preservar seus poderes.</desc>
      {seats.map((s, i) => (
        <m.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={5.2}
          fill={s.side === "esq" ? "var(--color-esq)" : s.side === "dir" ? "var(--color-dir)" : "var(--color-ash)"}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
         
          transition={{ delay: 0.15 + s.d * 0.9, type: "spring", stiffness: 260, damping: 16 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
      {/* Mesa do presidente da sessão */}
      <m.rect x={178} y={196} width={44} height={12} rx={2} fill="none" stroke="var(--color-paper)" strokeWidth={1.2} {...draw(0)} />
      <m.line x1={200} y1={20} x2={200} y2={186} stroke="var(--color-paper)" strokeWidth={1} strokeDasharray="3 4" {...draw(0.3)} />
      <g fontFamily="var(--font-mono)" fontSize="12" letterSpacing="1.5" fontWeight={600}>
        <text x={40} y={222} fill="var(--color-esq-ink)">← ESQUERDA</text>
        <text x={360} y={222} textAnchor="end" fill="var(--color-dir-ink)">DIREITA →</text>
        <text x={200} y={222} textAnchor="middle" fill="var(--color-ash)" fontSize="10">PRESIDÊNCIA</text>
      </g>
    </svg>
  );
}

/** Congresso Nacional (silhueta): duas torres, a cúpula e a bacia. */
export function Congress() {
  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full" role="img" aria-labelledby="cong-t">
      <title id="cong-t">Silhueta do Congresso Nacional, em Brasília</title>
      <m.line x1={10} y1={170} x2={390} y2={170} stroke="var(--color-ash)" strokeWidth={1.2} {...draw(0)} />
      <m.rect x={40} y={140} width={320} height={30} fill="none" stroke="var(--color-paper)" strokeWidth={1.4} {...draw(0.1)} />
      {/* Torres */}
      <m.rect x={184} y={20} width={14} height={120} fill="none" stroke="var(--color-paper)" strokeWidth={1.4} {...draw(0.3)} />
      <m.rect x={202} y={20} width={14} height={120} fill="none" stroke="var(--color-paper)" strokeWidth={1.4} {...draw(0.35)} />
      <m.line x1={184} y1={78} x2={216} y2={78} stroke="var(--color-paper)" strokeWidth={1.4} {...draw(0.6)} />
      {/* Cúpula (Senado) e bacia (Câmara) — cada uma com um dos tons, em peso igual */}
      <m.path d="M 80 140 A 42 32 0 0 1 164 140" fill="none" stroke="var(--color-esq-ink)" strokeWidth={2} {...draw(0.5)} />
      <m.path d="M 232 112 A 48 28 0 0 0 328 112 L 316 140 L 244 140 Z" fill="none" stroke="var(--color-dir-ink)" strokeWidth={2} {...draw(0.55)} />
      <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.5" fill="var(--color-ash)" fontWeight={600}>
        <text x={122} y={188} textAnchor="middle">SENADO</text>
        <text x={280} y={188} textAnchor="middle">CÂMARA</text>
      </g>
    </svg>
  );
}

/** Urna eletrônica (ícone/ilustração). */
export function BallotBox({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
      <rect x="3" y="8" width="26" height="18" rx="2" />
      <rect x="6" y="11" width="11" height="7" rx="1" />
      <g strokeWidth={1.4}>
        <path d="M21 12h2M25 12h1M21 15h2M25 15h1M21 18h2M25 18h1" />
      </g>
      <path d="M6 22h20" />
    </svg>
  );
}

/** Balança: inclina conforme o "peso" de cada lado explorado (-1 … +1). */
export function Scale({ tilt = 0, className = "h-6 w-6" }: { tilt?: number; className?: string }) {
  const deg = Math.max(-1, Math.min(1, tilt)) * 14;
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M20 4v24M13 28h14" />
      <m.g animate={{ rotate: deg }} transition={{ type: "spring", stiffness: 120, damping: 10 }} style={{ originX: "20px", originY: "8px", transformBox: "view-box" }}>
        <path d="M5 8h30" />
        <path d="M5 8l-3 8h6z" stroke="var(--color-esq-ink)" />
        <path d="M35 8l-3 8h6z" stroke="var(--color-dir-ink)" />
      </m.g>
    </svg>
  );
}

/** Encruzilhada: dois caminhos que partem do mesmo ponto. */
export function Crossroads() {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-labelledby="cross-t">
      <title id="cross-t">Um caminho que se divide em dois</title>
      <m.path d="M200 210 L200 130" stroke="var(--color-paper)" strokeWidth={2} fill="none" {...draw(0)} />
      <m.path d="M200 130 C 200 90, 120 80, 70 30" stroke="var(--color-esq-ink)" strokeWidth={2} fill="none" {...draw(0.4)} />
      <m.path d="M200 130 C 200 90, 280 80, 330 30" stroke="var(--color-dir-ink)" strokeWidth={2} fill="none" {...draw(0.4)} />
      <m.circle cx={200} cy={130} r={6} fill="var(--color-paper)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
    </svg>
  );
}

export type IllustrationKey = "hemicycle" | "congress" | "ballot" | "scale" | "crossroads" | "ladder" | "market" | "taxes" | "paycheck" | "powers" | "dialogue";

export function Illustration({ name }: { name: IllustrationKey }) {
  switch (name) {
    case "hemicycle":
      return <Hemicycle />;
    case "congress":
      return <Congress />;
    case "crossroads":
      return <Crossroads />;
    case "ballot":
      return <BallotBox className="mx-auto h-40 w-40 text-paper" />;
    case "ladder":
      return <Ladder />;
    case "market":
      return <Market />;
    case "taxes":
      return <Taxes />;
    case "paycheck":
      return <Paycheck />;
    case "powers":
      return <Powers />;
    case "dialogue":
      return <Dialogue />;
    default:
      // Balança grande: oscila e se equilibra (capítulo das críticas).
      return (
        <m.div className="mx-auto w-fit" initial={{ rotate: -6 }} animate={{ rotate: [-6, 5, -3, 1, 0] }} transition={{ duration: 2.2, delay: 0.3 }}>
          <Scale className="mx-auto h-40 w-48 text-paper" />
        </m.div>
      );
  }
}

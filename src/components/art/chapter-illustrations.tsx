"use client";

import { ArrowLeftRight } from "lucide-react";
import * as m from "motion/react-m";

/**
 * Ilustrações dos capítulos (v3). Mesma linguagem das anteriores: traço fino
 * desenhado na tela, papel + os dois tons em peso igual, animações leves
 * (só pathLength, opacity e transform).
 */

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const pop = (delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: { once: true, margin: "-10%" },
  transition: { delay, type: "spring" as const, stiffness: 260, damping: 16 },
  style: { transformBox: "fill-box" as const, transformOrigin: "center" },
});

const LABEL = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5, fontWeight: 600 } as const;

/** Bonequinho simples (cabeça + corpo). */
function Person({ x, y, color, delay = 0 }: { x: number; y: number; color: string; delay?: number }) {
  return (
    <m.g {...pop(delay)}>
      <circle cx={x} cy={y - 26} r={6} fill={color} />
      <path d={`M${x - 9} ${y} c0-12 4-18 9-18 s9 6 9 18`} fill={color} />
    </m.g>
  );
}

/** Largadas diferentes: uma escada; uma pessoa começa embaixo, outra já começa no alto. */
export function Ladder() {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-labelledby="lad-t">
      <title id="lad-t">Uma escada: uma pessoa começa no primeiro degrau, outra já começa perto do topo</title>
      <m.path d="M20 200 H110 V170 H170 V140 H230 V110 H290 V80 H350 V50 H385" fill="none" stroke="var(--color-paper)" strokeWidth={1.6} {...draw(0)} />
      <Person x={70} y={200} color="var(--color-esq-ink)" delay={0.9} />
      <Person x={320} y={80} color="var(--color-ash)" delay={1.1} />
      {/* o empurrão que ajuda quem larga atrás */}
      <m.path d="M88 186 C 120 150, 150 140, 168 128" fill="none" stroke="var(--color-esq-ink)" strokeWidth={2} strokeDasharray="5 5" {...draw(1.4)} />
      <m.path d="M160 122 L170 127 L162 135" fill="none" stroke="var(--color-esq-ink)" strokeWidth={2} {...draw(2)} />
      <g {...LABEL} fill="var(--color-ash)">
        <text x={70} y={216} textAnchor="middle">QUEM NASCE COM MENOS</text>
        <text x={320} y={38} textAnchor="middle">QUEM NASCE COM MAIS</text>
      </g>
    </svg>
  );
}

/** Trocas livres: duas barracas trocando mercadoria por dinheiro; a etiqueta de preço sobe e desce. */
export function Market() {
  const stall = (x: number, d: number) => (
    <g>
      <m.path d={`M${x} 90 h110 l-10 -30 h-90 z`} fill="none" stroke="var(--color-paper)" strokeWidth={1.5} {...draw(d)} />
      <m.path d={`M${x} 90 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 18 0 q9 12 20 0`} fill="none" stroke="var(--color-dir-ink)" strokeWidth={1.5} {...draw(d + 0.3)} />
      <m.path d={`M${x + 8} 92 V175 M${x + 102} 92 V175 M${x} 150 H${x + 110}`} fill="none" stroke="var(--color-paper)" strokeWidth={1.5} {...draw(d + 0.2)} />
    </g>
  );
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-labelledby="mkt-t">
      <title id="mkt-t">Duas barracas de feira trocando mercadoria e dinheiro; a etiqueta de preço sobe e desce</title>
      <m.line x1={10} y1={176} x2={390} y2={176} stroke="var(--color-ash)" strokeWidth={1.2} {...draw(0)} />
      {stall(30, 0.1)}
      {stall(260, 0.25)}
      {/* a moeda vai, a caixa volta */}
      <m.circle cx={160} cy={118} r={8} fill="none" stroke="var(--color-dir-ink)" strokeWidth={2} initial={{ x: 0, opacity: 0 }} whileInView={{ x: [0, 80, 80], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.4, delay: 1.2 }} />
      <m.rect x={226} y={128} width={16} height={14} fill="none" stroke="var(--color-paper)" strokeWidth={2} initial={{ x: 0, opacity: 0 }} whileInView={{ x: [0, -80, -80], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.4, delay: 1.6 }} />
      {/* etiqueta de preço */}
      <m.g initial={{ y: 0, opacity: 0 }} whileInView={{ y: [0, -8, 4, 0], opacity: 1 }} transition={{ duration: 2.6, repeat: Infinity, delay: 1 }}>
        <path d="M182 30 h36 l10 10 l-10 10 h-36 z" fill="none" stroke="var(--color-paper)" strokeWidth={1.5} />
        <text x={200} y={44} textAnchor="middle" {...LABEL} fill="var(--color-paper)">R$ ↕</text>
      </m.g>
      <g {...LABEL} fill="var(--color-ash)">
        <text x={85} y={196} textAnchor="middle">QUEM VENDE</text>
        <text x={315} y={196} textAnchor="middle">QUEM COMPRA</text>
      </g>
    </svg>
  );
}

/** Para onde vai o imposto: moedas entram num cofre comum e saem como escola, saúde e renda. */
export function Taxes() {
  const outs = [
    { y: 50, label: "ESCOLA", icon: "M318 58 v-14 l12 -8 l12 8 v14 z M330 36 v-10 h8" },
    { y: 110, label: "SAÚDE", icon: "M326 102 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 z" },
    { y: 170, label: "RENDA", icon: "M322 170 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M330 164 v12" },
  ];
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-labelledby="tax-t">
      <title id="tax-t">Moedas entram num cofre comum e saem como escola, saúde e renda</title>
      {[50, 110, 170].map((y, i) => (
        <m.circle key={`c${y}`} cx={40} cy={y} r={9} fill="none" stroke="var(--color-paper)" strokeWidth={1.8} {...pop(0.1 + i * 0.12)} />
      ))}
      {[50, 110, 170].map((y, i) => (
        <m.path key={`p${y}`} d={`M52 ${y} C 100 ${y}, 120 110, 160 110`} fill="none" stroke="var(--color-ash)" strokeWidth={1.2} {...draw(0.4 + i * 0.1)} />
      ))}
      <m.rect x={160} y={80} width={70} height={60} rx={6} fill="none" stroke="var(--color-paper)" strokeWidth={1.8} {...draw(0.7)} />
      <m.line x1={182} y1={92} x2={208} y2={92} stroke="var(--color-paper)" strokeWidth={2.5} {...draw(0.9)} />
      <text x={195} y={124} textAnchor="middle" {...LABEL} fill="var(--color-paper)">IMPOSTOS</text>
      {outs.map((o, i) => (
        <g key={o.label}>
          <m.path d={`M230 110 C 270 110, 280 ${o.y}, 312 ${o.y}`} fill="none" stroke="var(--color-esq-ink)" strokeWidth={1.6} {...draw(1.1 + i * 0.15)} />
          <m.path d={o.icon} fill="none" stroke="var(--color-esq-ink)" strokeWidth={1.8} {...draw(1.5 + i * 0.15)} />
          <text x={352} y={o.y + 4} {...LABEL} fill="var(--color-ash)">{o.label}</text>
        </g>
      ))}
      {/* uma moedinha percorre o caminho */}
      <m.circle cx={52} cy={110} r={4} fill="var(--color-esq-ink)" initial={{ x: 0, opacity: 0 }} whileInView={{ x: [0, 143, 260], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.6, delay: 2 }} />
    </svg>
  );
}

/** O que é seu: o salário como uma barra; a maior parte fica com você, uma parte vira imposto. */
export function Paycheck() {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full" role="img" aria-labelledby="pay-t">
      <title id="pay-t">Uma barra representando o salário: uma parte fica com a pessoa, outra parte vai para impostos</title>
      <Person x={44} y={120} color="var(--color-dir-ink)" delay={0.1} />
      <text x={84} y={58} {...LABEL} fill="var(--color-ash)">SEU SALÁRIO</text>
      <m.rect x={84} y={66} width={290} height={34} rx={4} fill="none" stroke="var(--color-paper)" strokeWidth={1.6} {...draw(0.2)} />
      <m.rect x={86} y={68} width={200} height={30} rx={3} fill="var(--color-dir-ink)" fillOpacity={0.85} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }} style={{ transformBox: "fill-box", transformOrigin: "left center" }} />
      <m.rect x={288} y={68} width={84} height={30} rx={3} fill="var(--color-ash)" fillOpacity={0.45} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 1.5, duration: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }} />
      <g {...LABEL}>
        <m.text x={186} y={122} textAnchor="middle" fill="var(--color-dir-ink)" {...pop(1.6)}>FICA COM VOCÊ</m.text>
        <m.text x={330} y={122} textAnchor="middle" fill="var(--color-ash)" {...pop(1.9)}>IMPOSTOS</m.text>
      </g>
      {/* o que fazer com o que é seu */}
      {["CASA", "ESTUDO", "NEGÓCIO"].map((t, i) => (
        <m.g key={t} {...pop(2.2 + i * 0.15)}>
          <rect x={96 + i * 64} y={150} width={56} height={26} rx={13} fill="none" stroke="var(--color-dir-ink)" strokeWidth={1.4} />
          <text x={124 + i * 64} y={167} textAnchor="middle" {...LABEL} fontSize={9} fill="var(--color-paper)">{t}</text>
        </m.g>
      ))}
      <m.path d="M124 104 v42" stroke="var(--color-dir-ink)" strokeWidth={1.4} strokeDasharray="3 4" fill="none" {...draw(2)} />
    </svg>
  );
}

/** Os Três Poderes: três prédios que se controlam (freios e contrapesos). */
export function Powers() {
  const items = [
    { x: 70, label: "EXECUTIVO", sub: "governa", d: "M30 150 h80 M34 150 v-30 h72 v30 M46 120 v30 M60 120 v30 M74 120 v30 M88 120 v30 M30 120 h80" },
    { x: 200, label: "LEGISLATIVO", sub: "faz as leis", d: "M188 150 v-80 h10 v80 M202 150 v-80 h10 v80 M188 105 h24 M160 150 h80" },
    { x: 330, label: "JUDICIÁRIO", sub: "julga", d: "M290 150 h80 M298 150 v-26 M312 150 v-26 M326 150 v-26 M340 150 v-26 M354 150 v-26 M290 124 h80 l-40 -18 z" },
  ];
  return (
    <svg viewBox="0 0 400 230" className="h-auto w-full" role="img" aria-labelledby="pow-t">
      <title id="pow-t">Executivo, Legislativo e Judiciário, ligados por setas: cada poder controla os outros</title>
      {items.map((it, i) => (
        <g key={it.label}>
          <m.path d={it.d} fill="none" stroke="var(--color-paper)" strokeWidth={1.5} {...draw(0.15 * i)} />
          <text x={it.x} y={172} textAnchor="middle" {...LABEL} fill="var(--color-paper)">{it.label}</text>
          <text x={it.x} y={186} textAnchor="middle" {...LABEL} fontSize={9} fill="var(--color-ash)">{it.sub}</text>
        </g>
      ))}
      {/* freios e contrapesos */}
      <m.path d="M70 100 C 110 40, 160 36, 194 60" fill="none" stroke="var(--color-esq-ink)" strokeWidth={1.6} {...draw(1)} />
      <m.path d="M206 60 C 240 36, 290 40, 330 100" fill="none" stroke="var(--color-dir-ink)" strokeWidth={1.6} {...draw(1.15)} />
      <m.path d="M330 198 C 260 226, 140 226, 70 198" fill="none" stroke="var(--color-ash)" strokeWidth={1.4} strokeDasharray="4 4" {...draw(1.3)} />
      <m.text x={200} y={24} textAnchor="middle" {...LABEL} fill="var(--color-ash)" {...pop(1.6)}>FREIOS E CONTRAPESOS</m.text>
    </svg>
  );
}

/** Ouvir antes de responder: dois balões de fala que se revezam. */
export function Dialogue() {
  const dots = (cx: number, cy: number, color: string, delay: number) =>
    [0, 1, 2].map((i) => (
      <m.circle
        key={i}
        cx={cx + i * 14}
        cy={cy}
        r={4}
        fill={color}
        initial={{ opacity: 0.2 }}
        whileInView={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: delay + i * 0.18, repeatDelay: 1.2 }}
      />
    ));
  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full" role="img" aria-labelledby="dia-t">
      <title id="dia-t">Dois balões de fala, um de cada lado, que se revezam</title>
      <m.path d="M30 30 h150 a12 12 0 0 1 12 12 v44 a12 12 0 0 1 -12 12 h-110 l-22 18 v-18 h-18 a12 12 0 0 1 -12 -12 v-44 a12 12 0 0 1 12 -12 z" fill="none" stroke="var(--color-esq-ink)" strokeWidth={1.8} {...draw(0.1)} />
      {dots(90, 64, "var(--color-esq-ink)", 0.8)}
      <m.path d="M370 100 h-150 a12 12 0 0 0 -12 12 v44 a12 12 0 0 0 12 12 h110 l22 18 v-18 h18 a12 12 0 0 0 12 -12 v-44 a12 12 0 0 0 -12 -12 z" fill="none" stroke="var(--color-dir-ink)" strokeWidth={1.8} {...draw(0.4)} />
      {dots(268, 134, "var(--color-dir-ink)", 2)}
      <m.text x={200} y={100} textAnchor="middle" fontFamily="var(--font-display)" fontSize={26} fill="var(--color-paper)" {...pop(1.2)}><ArrowLeftRight aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /></m.text>
    </svg>
  );
}

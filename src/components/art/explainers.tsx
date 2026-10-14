"use client";

import * as m from "motion/react-m";

/**
 * Vinhetas explicativas (120×80): pequenas cenas que traduzem a ideia de uma
 * tela — o argumento, a crítica, o passo da história. Mesmo traço das demais
 * (linha fina desenhada na tela, cor herdada do texto) e regras de equilíbrio:
 *  - cada lado tem o mesmo número de vinhetas, nos mesmos lugares;
 *  - críticas equivalentes usam o MESMO desenho nos dois lados (ex.: "grade",
 *    para regimes autoritários) ou desenhos com a mesma metáfora ("rachadura");
 *  - nada de caricatura: o desenho mostra a ideia como seus defensores (ou
 *    críticos) a descreveriam.
 * Usadas por <Vignette name="…" /> (dimension-art.tsx).
 */

const D = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});
const P = (delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { delay, type: "spring" as const, stiffness: 280, damping: 16 },
  style: { transformBox: "fill-box" as const, transformOrigin: "center" },
});
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const T = { fontFamily: "var(--font-mono)", fontWeight: 600, fill: "currentColor" } as const;

/** Bonequinho (cabeça + corpo), preenchido com a cor do texto. */
function Kid({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) {
  return (
    <m.g {...P(delay)}>
      <circle cx={x} cy={y - 13 * s} r={3.4 * s} fill="currentColor" />
      <path d={`M${x - 5 * s} ${y} c0 -6 ${2 * s} -9 ${5 * s} -9 s${5 * s} 3 ${5 * s} 9`} fill="currentColor" />
    </m.g>
  );
}

export const EXPLAINERS: Record<string, React.ReactNode> = {
  // ── Origens ─────────────────────────────────────────────────────
  // Coroa: o poder do rei (contra ou a favor — o mesmo desenho nos dois lados)
  coroa: (
    <>
      <m.path d="M30 54 L34 24 L48 40 L60 16 L72 40 L86 24 L90 54 Z" {...S} {...D(0)} />
      <m.path d="M30 54 H90 V62 H30 Z" {...S} {...D(0.35)} />
      <m.circle cx={60} cy={16} r={2.6} fill="currentColor" {...P(0.8)} />
      <m.circle cx={34} cy={24} r={2.2} fill="currentColor" {...P(0.9)} />
      <m.circle cx={86} cy={24} r={2.2} fill="currentColor" {...P(1)} />
    </>
  ),
  // Fábrica do século 19 e o relógio da jornada de 14 horas
  fabrica: (
    <>
      <m.path d="M8 70 V44 l15 9 V44 l15 9 V30 h12 V70 Z" {...S} {...D(0)} />
      <m.path d="M4 70 H64" {...S} {...D(0.2)} />
      <m.path d="M44 24 q4 -8 0 -14" {...S} strokeOpacity={0.6} {...D(0.5)} />
      <m.circle cx={92} cy={38} r={16} {...S} {...P(0.5)} />
      <m.path d="M92 28 V38 l7 5" {...S} {...D(0.8)} />
      <m.text x={92} y={72} textAnchor="middle" fontSize={10} {...T} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        14h
      </m.text>
    </>
  ),
  // Feira: comprar, vender e empreender
  feira: (
    <>
      <m.path d="M16 34 h70 l-7 -14 h-56 z" {...S} {...D(0)} />
      <m.path d="M16 34 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q5 7 10 0" {...S} {...D(0.3)} />
      <m.path d="M22 38 V70 M80 38 V70 M16 56 H86" {...S} {...D(0.2)} />
      <m.g initial={{ y: 0 }} animate={{ y: [0, -4, 0] }} transition={{ delay: 1, duration: 1.6, repeat: Infinity }}>
        <m.circle cx={104} cy={46} r={9} {...S} {...P(0.6)} />
        <m.path d="M104 41 v10" {...S} {...D(0.9)} />
      </m.g>
    </>
  ),
  // Dois caminhos: um pelo voto, outro pelo partido único (o mesmo desenho nos dois lados)
  bifurcacao: (
    <>
      <m.path d="M6 40 H42" {...S} {...D(0)} />
      <m.path d="M42 40 C56 40 60 18 78 18" {...S} {...D(0.3)} />
      <m.path d="M42 40 C56 40 60 62 78 62" {...S} {...D(0.3)} />
      <m.rect x={84} y={8} width={28} height={20} rx={2} {...S} {...P(0.8)} />
      <m.path d="M91 13 H105" {...S} strokeWidth={2.2} {...D(1)} />
      <m.rect x={84} y={50} width={28} height={22} rx={1} {...S} {...P(0.9)} />
      <m.path d="M91 50 V72 M98 50 V72 M105 50 V72" {...S} {...D(1.1)} />
    </>
  ),

  // ── No dia a dia ────────────────────────────────────────────────
  // Duas crianças nascem no mesmo dia, em casas diferentes
  "mesmo-dia": (
    <>
      <m.circle cx={60} cy={12} r={6} {...S} {...P(0)} />
      <m.path d="M60 1 V3 M49 12 H51 M69 12 H71 M52 5 l1.5 1.5 M68 5 l-1.5 1.5" {...S} {...D(0.3)} />
      <m.path d="M8 70 V40 l18 -14 l18 14 V70 Z" {...S} {...D(0.2)} />
      <m.path d="M14 48 h8 v8 h-8 z M30 48 h8 v8 h-8 z" {...S} {...D(0.6)} />
      <m.path d="M84 70 V54 l10 -8 l10 8 V70 Z" {...S} {...D(0.4)} />
      <Kid x={26} y={78} s={0.8} delay={0.9} />
      <Kid x={94} y={78} s={0.8} delay={1} />
      <m.path d="M4 70 H116" {...S} strokeOpacity={0.5} {...D(0.1)} />
    </>
  ),
  // A padaria: licenças e impostos se empilham antes de abrir
  padaria: (
    <>
      <m.path d="M14 70 V34 H62 V70" {...S} {...D(0)} />
      <m.path d="M10 34 h56 l-6 -10 h-44 z" {...S} {...D(0.2)} />
      <m.path d="M32 70 V52 h12 V70" {...S} {...D(0.35)} />
      <m.path d="M4 70 H116" {...S} strokeOpacity={0.5} {...D(0.1)} />
      {[0, 1, 2].map((i) => (
        <m.g key={i} {...P(0.7 + i * 0.25)}>
          <rect x={78 + i * 4} y={22 + i * 12} width={26} height={30} rx={1.5} {...S} fill="var(--color-graphite)" />
          <path d={`M${83 + i * 4} ${30 + i * 12} h14 M${83 + i * 4} ${36 + i * 12} h10`} {...S} strokeOpacity={0.6} />
        </m.g>
      ))}
      <m.circle cx={100} cy={64} r={7} {...S} strokeWidth={2} {...P(1.5)} />
    </>
  ),

  // ── Argumentos: esquerda ───────────────────────────────────────
  // Ninguém escolhe onde nasce: largadas em pontos diferentes; um empurrão para quem larga atrás
  largada: (
    <>
      <m.path d="M4 34 H116 M4 64 H116" {...S} strokeOpacity={0.45} {...D(0)} />
      <m.path d="M62 22 V40 M14 52 V70" {...S} {...D(0.25)} />
      <Kid x={70} y={34} delay={0.5} />
      <Kid x={22} y={64} delay={0.6} />
      <m.path d="M108 12 V40 M108 12 h9 l-3 4 l3 4 h-9" {...S} {...D(0.7)} />
      <m.path d="M30 58 H54 M48 54 l6 4 l-6 4" {...S} strokeDasharray="4 4" strokeWidth={2} {...D(1.1)} />
    </>
  ),
  // Tem coisa que o lucro não resolve: o cano que leva esgoto e água a uma vila pequena
  saneamento: (
    <>
      <m.path d="M74 70 V46 l16 -12 l16 12 V70 Z" {...S} {...D(0)} />
      <m.path d="M86 70 V58 h8 V70" {...S} {...D(0.25)} />
      <m.path d="M4 62 H44 V54 H74" {...S} strokeWidth={3} {...D(0.4)} />
      <m.circle cx={8} cy={62} r={2.2} fill="currentColor" initial={{ x: 0, opacity: 0 }} animate={{ x: [0, 34], opacity: [0, 1, 0] }} transition={{ delay: 1.2, duration: 1.6, repeat: Infinity, repeatDelay: 0.4 }} />
      <m.circle cx={28} cy={24} r={11} {...S} {...P(0.6)} />
      <m.path d="M28 18 v12" {...S} {...D(0.9)} />
      <m.path d="M19 15 L37 33" {...S} strokeWidth={2.2} {...D(1.1)} />
    </>
  ),
  // Dar renda direto: um valor por mês chega à família, com escola e vacina em dia
  renda: (
    <>
      <m.path d="M34 70 V46 l18 -14 l18 14 V70 Z" {...S} {...D(0)} />
      <m.circle cx={52} cy={8} r={6} {...S} initial={{ y: -6, opacity: 0 }} animate={{ y: [-6, 30], opacity: [0, 1, 0] }} transition={{ delay: 0.6, duration: 1.4, repeat: Infinity, repeatDelay: 0.8 }} />
      <m.path d="M84 22 h20 v14 h-20 z M94 22 v14" {...S} {...D(0.5)} />
      <m.path d="M91 44 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 v-6 h6 z" {...S} {...D(0.7)} />
      <m.path d="M108 26 l3 3 l5 -6" {...S} strokeWidth={2} {...D(1.1)} />
      <m.path d="M108 52 l3 3 l5 -6" {...S} strokeWidth={2} {...D(1.3)} />
      <m.path d="M4 70 H76" {...S} strokeOpacity={0.5} {...D(0.1)} />
    </>
  ),

  // ── Argumentos: direita ────────────────────────────────────────
  // O que é seu é seu: o fruto do trabalho entra e fica na carteira
  carteira: (
    <>
      <m.rect x={24} y={30} width={64} height={40} rx={6} {...S} {...D(0)} />
      <m.path d="M24 44 H88" {...S} {...D(0.25)} />
      <m.rect x={72} y={46} width={20} height={12} rx={3} {...S} {...D(0.4)} />
      <m.circle cx={82} cy={52} r={2} fill="currentColor" {...P(0.7)} />
      <m.circle cx={56} cy={10} r={6} {...S} initial={{ y: -4, opacity: 0 }} animate={{ y: [-4, 26], opacity: [0, 1, 0] }} transition={{ delay: 0.8, duration: 1.3, repeat: Infinity, repeatDelay: 0.9 }} />
    </>
  ),
  // Contas em ordem: preços que disparavam até 1994 e depois se acalmaram
  inflacao: (
    <>
      <m.path d="M10 70 H112 M10 70 V8" {...S} strokeOpacity={0.5} {...D(0)} />
      <m.path d="M12 66 C28 64 38 46 52 12" {...S} strokeWidth={2} {...D(0.3)} />
      <m.path d="M56 8 V70" {...S} strokeDasharray="3 4" strokeOpacity={0.6} {...D(0.9)} />
      <m.path d="M56 50 C70 46 90 46 110 44" {...S} strokeWidth={2} {...D(1.1)} />
      <m.text x={58} y={78} fontSize={8} {...T} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1.3 }}>
        1994
      </m.text>
    </>
  ),
  // Sem segurança, não há liberdade: a casa protegida
  "casa-segura": (
    <>
      <m.path d="M14 70 V44 l22 -18 l22 18 V70 Z" {...S} {...D(0)} />
      <m.path d="M30 70 V56 h12 V70" {...S} {...D(0.25)} />
      <m.path d="M4 70 H64" {...S} strokeOpacity={0.5} {...D(0.1)} />
      <m.path d="M92 12 l18 6 v14 c0 12 -8 20 -18 24 c-10 -4 -18 -12 -18 -24 v-14 Z" {...S} {...D(0.5)} />
      <m.path d="M85 34 l5 5 l10 -10" {...S} strokeWidth={2.2} {...D(1)} />
    </>
  ),

  // ── Críticas (equivalentes nos dois lados) ─────────────────────
  // Regimes autoritários: grades e a fala silenciada (o MESMO desenho para os dois lados)
  grade: (
    <>
      <m.rect x={44} y={10} width={52} height={58} rx={2} {...S} {...D(0)} />
      <m.path d="M57 10 V68 M70 10 V68 M83 10 V68" {...S} {...D(0.3)} />
      <m.path d="M8 18 h26 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-14 l-6 6 v-6 h-6 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4 z" {...S} {...D(0.6)} />
      <m.path d="M15 23 l12 10 M27 23 l-12 10" {...S} strokeWidth={2} {...D(1)} />
    </>
  ),
  // Gastar demais gera crise (crítica à esquerda): o gasto sobe e a economia cai
  crise: (
    <>
      <m.path d="M8 70 H112" {...S} strokeOpacity={0.5} {...D(0)} />
      {[0, 1, 2, 3].map((i) => (
        <m.rect key={i} x={14 + i * 16} y={56 - i * 9} width={10} height={14 + i * 9} rx={1} {...S} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
      ))}
      <m.path d="M14 22 C40 18 64 18 78 26 C88 32 94 56 112 62" {...S} strokeWidth={2.2} strokeDasharray="5 4" {...D(1)} />
      <m.path d="M106 56 l6 6 l-8 2" {...S} strokeWidth={2} {...D(1.6)} />
    </>
  ),
  // Mercado sem correção concentra renda (crítica à direita): uma barra enorme, muitas pequenas
  concentracao: (
    <>
      <m.path d="M8 70 H112" {...S} strokeOpacity={0.5} {...D(0)} />
      {[0, 1, 2, 3, 4].map((i) => (
        <m.rect key={i} x={12 + i * 14} y={60 - i} width={9} height={10 + i} rx={1} {...S} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
      ))}
      <m.rect x={92} y={8} width={14} height={62} rx={1} {...S} strokeWidth={2} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
      <m.circle cx={40} cy={44} r={2.4} fill="currentColor" initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 56], y: [0, -26], opacity: [0, 1, 0] }} transition={{ delay: 1.6, duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }} />
    </>
  ),
  // Discurso × prática (crítica à esquerda): o balão da ética racha
  discurso: (
    <>
      <m.path d="M16 10 H94 a8 8 0 0 1 8 8 V44 a8 8 0 0 1 -8 8 H46 L32 66 V52 H16 a8 8 0 0 1 -8 -8 V18 a8 8 0 0 1 8 -8 Z" {...S} {...D(0)} />
      <m.path d="M36 30 l8 8 l18 -18" {...S} strokeWidth={2.2} {...D(0.5)} />
      <m.path d="M76 10 l-6 10 l8 8 l-6 10 l5 14" {...S} strokeWidth={2.2} {...D(1.1)} />
    </>
  ),
  // Ordem × ataques às instituições (crítica à direita): o prédio das instituições racha
  rachadura: (
    <>
      <m.path d="M20 26 L60 8 L100 26 Z M22 28 H98" {...S} {...D(0)} />
      <m.path d="M30 30 V64 M46 30 V64 M60 30 V64 M74 30 V64 M90 30 V64" {...S} {...D(0.25)} />
      <m.path d="M16 68 H104" {...S} {...D(0.4)} />
      <m.path d="M66 8 l-6 12 l8 10 l-6 12 l6 14" {...S} strokeWidth={2.2} {...D(1.1)} />
    </>
  ),

  // ── No Brasil, em uma frase ────────────────────────────────────
  // Presidencialismo de coalizão: o presidente no centro, ligado a vários partidos aliados
  coalizao: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.round((60 + Math.cos(a) * 30) * 10) / 10;
        const y = Math.round((40 + Math.sin(a) * 28) * 10) / 10;
        return (
          <g key={i}>
            <m.path d={`M60 40 L${x} ${y}`} {...S} strokeOpacity={0.5} {...D(0.3 + i * 0.08)} />
            <m.circle cx={x} cy={y} r={6} {...S} {...P(0.6 + i * 0.08)} />
          </g>
        );
      })}
      <m.circle cx={60} cy={40} r={9} fill="currentColor" {...P(0)} />
      <m.circle cx={60} cy={40} r={2.2} fill="currentColor" initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 26], y: [0, -14], opacity: [0, 1, 0] }} transition={{ delay: 1.4, duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }} />
    </>
  ),
  // Centrão: um grupo no meio que pende para governos dos dois lados
  centrao: (
    <>
      <m.path d="M12 72 V40 M108 72 V40" {...S} strokeWidth={2} {...D(0)} />
      <m.circle cx={12} cy={36} r={5} fill="var(--color-esq-ink)" {...P(0.2)} />
      <m.circle cx={108} cy={36} r={5} fill="var(--color-dir-ink)" {...P(0.3)} />
      <m.path d="M40 4 H80" {...S} {...D(0.1)} />
      <m.g style={{ transformBox: "view-box", transformOrigin: "60px 4px" }} initial={{ rotate: 0 }} animate={{ rotate: [0, -16, 16, -16] }} transition={{ delay: 0.8, duration: 4.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}>
        <m.path d="M60 4 V46" {...S} {...D(0.3)} />
        {[[-9, 0], [0, -6], [9, 0], [-5, 9], [5, 9]].map(([dx, dy], i) => (
          <m.circle key={i} cx={60 + dx} cy={54 + dy} r={4.4} fill="currentColor" {...P(0.5 + i * 0.08)} />
        ))}
      </m.g>
    </>
  ),
};

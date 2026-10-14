"use client";

import * as m from "motion/react-m";

/**
 * Vinhetas das 8 dimensões do questionário. Mesma linguagem das ilustrações
 * dos capítulos (traço fino, desenhado na tela), mas neutras: nenhuma usa as
 * cores dos lados — a pergunta não pode "puxar" a resposta.
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

const ART: Record<string, React.ReactNode> = {
  // Política econômica: fábrica + moeda
  economia: (
    <>
      <m.path d="M14 70 V44 l18 10 V44 l18 10 V30 h16 V70 Z" {...S} {...D(0)} />
      <m.path d="M6 70 H114" {...S} {...D(0.2)} />
      <m.path d="M54 24 q4 -8 0 -14 M62 22 q4 -8 0 -14" {...S} strokeOpacity={0.6} {...D(0.5)} />
      <m.circle cx={92} cy={48} r={12} {...S} {...P(0.6)} />
      <m.path d="M92 42 v12 M88 45 h6 a3 3 0 0 1 0 6 h-6" {...S} {...D(0.8)} />
    </>
  ),
  // Tamanho do Estado: prédio público com colunas
  estado: (
    <>
      <m.path d="M20 34 L60 14 L100 34 Z" {...S} {...D(0)} />
      <m.path d="M30 38 V64 M46 38 V64 M60 38 V64 M74 38 V64 M90 38 V64" {...S} {...D(0.25)} />
      <m.path d="M16 68 H104 M22 34 H98" {...S} {...D(0.5)} />
    </>
  ),
  // Liberdades individuais: cadeado aberto
  liberdades: (
    <>
      <m.rect x={40} y={36} width={40} height={32} rx={4} {...S} {...D(0)} />
      <m.path d="M48 36 V26 a12 12 0 0 1 24 0" {...S} {...D(0.3)} />
      <m.circle cx={60} cy={50} r={3} fill="currentColor" {...P(0.7)} />
      <m.path d="M60 53 v6" {...S} {...D(0.8)} />
    </>
  ),
  // Costumes e valores: casa com família
  costumes: (
    <>
      <m.path d="M24 40 L60 14 L96 40 V70 H24 Z" {...S} {...D(0)} />
      <m.circle cx={50} cy={44} r={5} {...S} {...P(0.5)} />
      <m.circle cx={70} cy={44} r={5} {...S} {...P(0.6)} />
      <m.path d="M42 68 c0 -10 4 -14 8 -14 s8 4 8 14 M62 68 c0 -10 4 -14 8 -14 s8 4 8 14" {...S} {...D(0.7)} />
    </>
  ),
  // Políticas sociais: duas pessoas e uma moeda passando de uma para outra
  social: (
    <>
      <m.circle cx={26} cy={30} r={6} {...S} {...P(0)} />
      <m.path d="M14 68 c0 -16 5 -24 12 -24 s12 8 12 24" {...S} {...D(0.15)} />
      <m.circle cx={94} cy={30} r={6} {...S} {...P(0.1)} />
      <m.path d="M82 68 c0 -16 5 -24 12 -24 s12 8 12 24" {...S} {...D(0.25)} />
      <m.path d="M42 40 C 54 28, 66 28, 78 40" {...S} strokeDasharray="3 4" {...D(0.5)} />
      <m.circle cx={60} cy={30} r={6} {...S} initial={{ x: -18, opacity: 0 }} animate={{ x: [-18, 18], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.6, delay: 0.8, repeat: Infinity, repeatDelay: 0.8 }} />
    </>
  ),
  // Segurança pública: escudo
  seguranca: (
    <>
      <m.path d="M60 10 L88 20 V40 C88 56 76 66 60 72 C44 66 32 56 32 40 V20 Z" {...S} {...D(0)} />
      <m.path d="M48 40 l8 8 l16 -16" {...S} strokeWidth={2.2} {...D(0.6)} />
    </>
  ),
  // Meio ambiente: árvore e folha
  ambiente: (
    <>
      <m.path d="M60 70 V44" {...S} {...D(0)} />
      <m.circle cx={60} cy={30} r={18} {...S} {...P(0.2)} />
      <m.path d="M60 52 l-10 -8 M60 46 l9 -7" {...S} {...D(0.5)} />
      <m.path d="M18 70 H102" {...S} {...D(0.3)} />
      <m.path d="M88 60 c6 -10 16 -12 18 -12 c0 6 -4 14 -14 16 c-2 0 -4 -2 -4 -4 Z" {...S} {...D(0.8)} />
    </>
  ),
  // Instituições: balança sobre colunas
  instituicoes: (
    <>
      <m.path d="M60 14 V60 M42 64 H78" {...S} {...D(0)} />
      <m.path d="M28 24 H92" {...S} {...D(0.25)} />
      <m.path d="M28 24 l-8 18 h16 Z M92 24 l-8 18 h16 Z" {...S} {...D(0.45)} />
    </>
  ),
  // Desigualdade: colunas de alturas muito diferentes e uma seta que tenta nivelar
  desigualdade: (
    <>
      <m.path d="M14 70 H106" {...S} {...D(0)} />
      <m.path d="M24 70 V60 M40 70 V56 M56 70 V50 M72 70 V40 M88 70 V18" {...S} strokeWidth={6} strokeLinecap="butt" {...D(0.2)} />
      <m.path d="M20 30 C 44 26, 64 26, 80 28" {...S} strokeDasharray="3 4" {...D(0.7)} />
      <m.path d="M74 23 l6 5 l-6 5" {...S} {...D(1)} />
    </>
  ),
  // Educação: livro aberto e um capelo
  educacao: (
    <>
      <m.path d="M60 36 C 50 28, 34 26, 20 28 V66 C 34 64, 50 66, 60 72 C 70 66, 86 64, 100 66 V28 C 86 26, 70 28, 60 36 Z" {...S} {...D(0)} />
      <m.path d="M60 36 V72" {...S} {...D(0.35)} />
      <m.path d="M60 6 L84 15 L60 24 L36 15 Z" {...S} {...P(0.6)} />
      <m.path d="M84 15 V25" {...S} {...D(0.9)} />
    </>
  ),
  // Saúde: coração com a linha do batimento
  saude: (
    <>
      <m.path d="M60 70 C 30 52, 18 40, 18 28 a 14 14 0 0 1 42 -6 a 14 14 0 0 1 42 6 C 102 40, 90 52, 60 70 Z" {...S} {...D(0)} />
      <m.path d="M26 42 H44 l6 -12 l8 22 l6 -10 H94" {...S} strokeWidth={2} {...D(0.6)} />
    </>
  ),
  // Trabalho e renda: maleta e relógio
  trabalho: (
    <>
      <m.rect x={22} y={34} width={58} height={36} rx={4} {...S} {...D(0)} />
      <m.path d="M42 34 V26 h18 v8 M22 48 H80" {...S} {...D(0.3)} />
      <m.circle cx={94} cy={26} r={12} {...S} {...P(0.5)} />
      <m.path d="M94 19 V26 l5 4" {...S} {...D(0.8)} />
    </>
  ),
  // Fato com fonte: documento e uma lupa que confirma
  fato: (
    <>
      <m.rect x={22} y={8} width={48} height={64} rx={3} {...S} {...D(0)} />
      <m.path d="M30 22 H62 M30 32 H62 M30 42 H54 M30 52 H58" {...S} strokeOpacity={0.6} {...D(0.25)} />
      <m.circle cx={80} cy={46} r={14} {...S} {...P(0.55)} />
      <m.path d="M90 56 L104 70" {...S} strokeWidth={2.4} {...D(0.8)} />
      <m.path d="M73 46 l5 5 l9 -10" {...S} strokeWidth={2} {...D(1)} />
    </>
  ),
  // Glossário: balão de fala com "Aa"
  glossario: (
    <>
      <m.path d="M22 12 H98 a8 8 0 0 1 8 8 V48 a8 8 0 0 1 -8 8 H52 L36 70 V56 H22 a8 8 0 0 1 -8 -8 V20 a8 8 0 0 1 8 -8 Z" {...S} {...D(0)} />
      <m.text x={60} y={44} textAnchor="middle" fontSize={24} fontWeight={700} fill="currentColor" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        Aa
      </m.text>
    </>
  ),
  // Balança: pende para um lado e para o outro, sem parar em nenhum
  balanca: (
    <>
      <m.path d="M60 14 V64 M44 68 H76" {...S} {...D(0)} />
      <m.g style={{ transformBox: "fill-box", transformOrigin: "center" }} animate={{ rotate: [0, -7, 7, -4, 0] }} transition={{ delay: 0.8, duration: 3.2, repeat: Infinity, repeatDelay: 1.2 }}>
        <m.path d="M28 22 H92" {...S} {...D(0.3)} />
        <m.path d="M28 22 l-9 18 h18 Z M92 22 l-9 18 h18 Z" {...S} {...D(0.5)} />
      </m.g>
    </>
  ),
  // Urna: um voto entra pela fenda
  urna: (
    <>
      <m.rect x={28} y={36} width={64} height={36} rx={3} {...S} {...D(0)} />
      <m.path d="M48 42 H72" {...S} strokeWidth={2.4} {...D(0.3)} />
      <m.rect x={52} y={6} width={16} height={22} rx={1.5} {...S} initial={{ y: -14, opacity: 0 }} animate={{ y: [-14, 0, 20], opacity: [0, 1, 0] }} transition={{ delay: 0.6, duration: 1.8, repeat: Infinity, repeatDelay: 1.4 }} />
    </>
  ),
};

/** Assentos do plenário em semicírculo; `lado` acende a metade correspondente. */
function Seats({ lado }: { lado: "esquerda" | "direita" }) {
  const dots: { x: number; y: number; left: boolean; i: number }[] = [];
  let i = 0;
  for (const [r, n] of [[22, 7], [34, 10], [46, 13]] as const) {
    for (let k = 0; k < n; k++) {
      const a = Math.PI - (Math.PI * k) / (n - 1);
      dots.push({ x: 60 + r * Math.cos(a), y: 70 - r * Math.sin(a), left: k < (n - 1) / 2, i: i++ });
    }
  }
  return (
    <>
      {dots.map((d) => {
        const lit = lado === "esquerda" ? d.left : d.x > 60.5;
        return (
          <m.circle
            key={d.i}
            cx={d.x}
            cy={d.y}
            r={3.2}
            fill={lit ? (lado === "esquerda" ? "var(--color-esq-ink)" : "var(--color-dir-ink)") : "currentColor"}
            fillOpacity={lit ? 1 : 0.25}
            {...P(0.03 * d.i)}
          />
        );
      })}
      <m.path d="M48 72 H72" {...S} {...D(0.5)} />
    </>
  );
}

/** Vinheta avulsa (mesmo traço): para telas do reel e para a home. */
export function Vignette({ name, className = "h-16 w-24" }: { name: string; className?: string }) {
  if (name === "assentos-esquerda" || name === "assentos-direita") {
    return (
      <svg viewBox="0 0 120 80" className={className} aria-hidden>
        <Seats lado={name === "assentos-esquerda" ? "esquerda" : "direita"} />
      </svg>
    );
  }
  return <DimensionArt dimension={name} className={className} />;
}

/** Tema (slug do conteúdo) → vinheta. */
const THEME_ART: Record<string, string> = {
  "papel-do-estado": "estado",
  economia: "economia",
  desigualdade: "desigualdade",
  liberdades: "liberdades",
  "seguranca-publica": "seguranca",
  "politicas-sociais": "social",
  educacao: "educacao",
  saude: "saude",
  "valores-e-costumes": "costumes",
  "meio-ambiente": "ambiente",
  "democracia-e-instituicoes": "instituicoes",
  trabalho: "trabalho",
};

/** Vinheta de um tema (mesmo traço das dimensões do questionário). */
export function ThemeArt({ theme, className = "h-16 w-24" }: { theme: string; className?: string }) {
  return <DimensionArt dimension={THEME_ART[theme] ?? "instituicoes"} className={className} />;
}

/** Vinheta animada da dimensão (re-desenha a cada nova pergunta via `key`). */
export function DimensionArt({ dimension, className = "h-16 w-24" }: { dimension: string; className?: string }) {
  const art = ART[dimension];
  if (!art) return null;
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      {art}
    </svg>
  );
}

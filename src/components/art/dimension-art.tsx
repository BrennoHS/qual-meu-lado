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
};

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

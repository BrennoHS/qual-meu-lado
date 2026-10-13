/**
 * Frases da escolha final ("Sua escolha"), usadas na tela, no link
 * compartilhável e na imagem. Regras: as frases dos dois lados têm a MESMA
 * estrutura e o mesmo tamanho; falam de valores, nunca de candidaturas,
 * partidos ou voto.
 */
export type ChoiceSlug = "esquerda" | "direita" | "ambos" | "indeciso";

export const CHOICE_SHARE: Record<ChoiceSlug, { headline: string; short: string; belief: string; tone: "esquerda" | "direita" | "ambos" | "neutral" }> = {
  esquerda: {
    headline: "Me identifico mais com a esquerda",
    short: "ESQUERDA",
    belief: "Acredito que uma sociedade é mais justa quando ninguém fica para trás por causa de onde nasceu.",
    tone: "esquerda",
  },
  direita: {
    headline: "Me identifico mais com a direita",
    short: "DIREITA",
    belief: "Acredito que uma sociedade é mais justa quando cada pessoa é livre para construir a própria vida.",
    tone: "direita",
  },
  ambos: {
    headline: "Me identifico um pouco com cada lado",
    short: "UM POUCO DE CADA",
    belief: "Acredito que nenhum lado tem todas as respostas — por isso penso tema por tema.",
    tone: "ambos",
  },
  indeciso: {
    headline: "Ainda estou descobrindo meu lado",
    short: "AINDA DESCOBRINDO",
    belief: "Acredito que vale ouvir os dois lados antes de decidir — e é isso que estou fazendo.",
    tone: "neutral",
  },
};

export const isChoiceSlug = (s: string): s is ChoiceSlug => s in CHOICE_SHARE;

/** Indicador de afinidade (tela final do questionário) — sempre individual: não é pesquisa nem previsão. */
export type SideSlug = "esquerda" | "centro" | "direita";
export const SIDE_SHARE: Record<SideSlug, { word: string; article: "a" | "o"; belief: string; ink: string }> = {
  esquerda: { word: "ESQUERDA", article: "a", belief: CHOICE_SHARE.esquerda.belief, ink: "#f08a91" },
  centro: { word: "CENTRO", article: "o", belief: CHOICE_SHARE.ambos.belief, ink: "#f5f3ee" },
  direita: { word: "DIREITA", article: "a", belief: CHOICE_SHARE.direita.belief, ink: "#8db0f0" },
};
/** "Eu me identifico mais com a" / "com o" */
export const identifyPrefix = (s: SideSlug) => `Eu me identifico mais com ${SIDE_SHARE[s].article}`;
/** Endereço do site para quem vê o card saber onde fazer o teste. */
export function siteHost(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(raw).host.replace(/^www\./, "");
  } catch {
    return raw;
  }
}
export const isSideSlug = (s: string): s is SideSlug => s in SIDE_SHARE;
/** Posição no trilho (0 = esquerda … 100 = direita), saneada para uso em URL. */
export const clampMeter = (v: unknown) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
};

/**
 * Títulos de capítulo no formato em que as pessoas pesquisam
 * ("o que a esquerda defende", "críticas à direita"...). Mesmo padrão para os
 * dois lados — só o nome muda.
 */
export function chapterSearchTitle(slug: string, side: "esquerda" | "direita"): string | null {
  const other = side === "esquerda" ? "direita" : "esquerda";
  const map: Record<string, string> = {
    origens: `De onde veio a ${side}? Origem dos termos esquerda e direita`,
    "o-que-defende": `O que a ${side} defende? Ideias e valores`,
    argumentos: `Os melhores argumentos da ${side}`,
    criticas: `Críticas à ${side}: as mais fortes, com resposta`,
    "no-brasil": `A ${side} no Brasil: história e governos`,
    "o-outro-lado": `O que a ${other} responde à ${side}`,
    "o-que-voce-pensa": `Você é de ${side}? Perguntas para pensar`,
  };
  return map[slug] ?? null;
}

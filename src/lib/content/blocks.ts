import { z } from "zod";

/**
 * Blocos de conteúdo dos capítulos. Ficam em Chapter.blocks (JSON) e são
 * validados aqui tanto no seed quanto no painel administrativo — o que
 * impede que um JSON malformado chegue ao site público.
 */

const id = z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, "use apenas a-z, 0-9 e hífen");
const claimKeys = z.array(z.string().min(1)).default([]);

export { critiqueCategories, argumentCategories } from "./categories";

/** Nome de uma vinheta animada (src/components/art/explainers.tsx). */
const art = z.string().min(1).max(40).regex(/^[a-z0-9-]+$/, "use apenas a-z, 0-9 e hífen");

const leadBlock = z.object({ type: z.literal("lead"), text: z.string().min(1) });

const textBlock = z.object({
  type: z.literal("text"),
  title: z.string().optional(),
  body: z.string().min(1),
  /** Uma vinheta por parágrafo (textos em passos: "Primeiro…", "Depois…"). */
  art: z.array(art).optional(),
});

const claimsBlock = z.object({
  type: z.literal("claims"),
  title: z.string().optional(),
  claimKeys: z.array(z.string()).min(1),
});

const timelineBlock = z.object({
  type: z.literal("timeline"),
  title: z.string().optional(),
  intro: z.string().optional(),
  tags: z.array(z.string()).optional(),
  scope: z.enum(["BRAZIL", "INTERNATIONAL"]).optional(),
});

const currentsBlock = z.object({
  type: z.literal("currents"),
  title: z.string().optional(),
  intro: z.string().optional(),
  slugs: z.array(z.string()).min(1),
});

const axesBlock = z.object({
  type: z.literal("axes"),
  title: z.string().optional(),
  intro: z.string().optional(),
  highlightSlugs: z.array(z.string()).optional(),
});

const themesBlock = z.object({
  type: z.literal("themes"),
  title: z.string().optional(),
  intro: z.string().optional(),
});

const argumentItem = z.object({
  id,
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.string().optional(),
  claimKeys,
  /** Para críticas: resposta de quem defende a posição criticada. */
  response: z.string().optional(),
  /** Para argumentos favoráveis: limites reconhecidos. */
  limits: z.string().optional(),
  /** Como a evidência deve ser lida (consenso, debate, lacuna). */
  evidenceNote: z.string().optional(),
  /** Vinheta animada do cartão. */
  art: art.optional(),
});

const argumentsBlock = z.object({
  type: z.literal("arguments"),
  kind: z.enum(["PRO", "CRITIQUE"]),
  title: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(argumentItem).min(1),
});

const counterpointItem = z.object({
  id,
  prompt: z.string().min(1),
  thisSide: z.string().min(1),
  otherSide: z.string().min(1),
  evidence: z.string().min(1),
  claimKeys,
});

const counterpointsBlock = z.object({
  type: z.literal("counterpoints"),
  title: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(counterpointItem).min(1),
});

const reflectionBlock = z.object({
  type: z.literal("reflection"),
  title: z.string().optional(),
  intro: z.string().optional(),
  statementKeys: z.array(z.string()).min(1),
});

const didYouKnowBlock = z.object({
  type: z.literal("didYouKnow"),
  curiositySlug: z.string().min(1),
});

const valueConflictBlock = z.object({
  type: z.literal("valueConflict"),
  title: z.string().min(1),
  values: z.tuple([z.string(), z.string()]),
  scenario: z.string().min(1),
  tension: z.string().min(1),
});

const illustrationBlock = z.object({
  type: z.literal("illustration"),
  name: z.enum(["hemicycle", "congress", "ballot", "scale", "crossroads", "ladder", "market", "taxes", "paycheck", "powers", "dialogue"]),
  title: z.string().optional(),
  caption: z.string().optional(),
});

/** Palavras difíceis explicadas em uma frase. */
const glossaryBlock = z.object({
  type: z.literal("glossary"),
  title: z.string().optional(),
  items: z.array(z.object({ term: z.string().min(1), definition: z.string().min(1) })).min(1),
});

/** Pergunta rápida no meio da leitura (alimenta o mapa de afinidades). */
const pulseBlock = z.object({
  type: z.literal("pulse"),
  statementKey: z.string().min(1),
  prompt: z.string().optional(),
});

/** "No dia a dia": exemplo concreto que traduz uma ideia abstrata. */
const exampleBlock = z.object({
  type: z.literal("example"),
  title: z.string().min(1),
  body: z.string().min(1),
  art: art.optional(),
});

/**
 * Camada de leitura. "surface" = fundamentos, em linguagem simples (sempre visível).
 * "deep" = aprofundamento, exibido no modo "Aprofundado" ou sob demanda.
 */
export const LAYERS = ["surface", "deep"] as const;
const withLayer = <T extends z.ZodRawShape>(o: z.ZodObject<T>) => o.extend({ layer: z.enum(LAYERS).default("surface") });

export const blockSchema = z.discriminatedUnion("type", [
  withLayer(leadBlock),
  withLayer(textBlock),
  withLayer(claimsBlock),
  withLayer(timelineBlock),
  withLayer(currentsBlock),
  withLayer(axesBlock),
  withLayer(themesBlock),
  withLayer(argumentsBlock),
  withLayer(counterpointsBlock),
  withLayer(reflectionBlock),
  withLayer(didYouKnowBlock),
  withLayer(valueConflictBlock),
  withLayer(illustrationBlock),
  withLayer(glossaryBlock),
  withLayer(pulseBlock),
  withLayer(exampleBlock),
]);

export const blocksSchema = z.array(blockSchema);

export type Block = z.infer<typeof blockSchema>;
export type BlockInput = z.input<typeof blockSchema>;
export type ArgumentItem = z.infer<typeof argumentItem>;
export type CounterpointItem = z.infer<typeof counterpointItem>;

/** Todas as chaves de afirmação referenciadas por um conjunto de blocos. */
export function collectClaimKeys(blocks: Block[]): string[] {
  const keys = new Set<string>();
  for (const b of blocks) {
    if (b.type === "claims") b.claimKeys.forEach((k) => keys.add(k));
    if (b.type === "arguments") b.items.forEach((i) => i.claimKeys.forEach((k) => keys.add(k)));
    if (b.type === "counterpoints") b.items.forEach((i) => i.claimKeys.forEach((k) => keys.add(k)));
  }
  return [...keys];
}

export function collectStatementKeys(blocks: Block[]): string[] {
  return blocks.flatMap((b) => (b.type === "reflection" ? b.statementKeys : b.type === "pulse" ? [b.statementKey] : []));
}

export function collectCurrentSlugs(blocks: Block[]): string[] {
  return blocks.flatMap((b) => (b.type === "currents" ? b.slugs : []));
}

export function collectCuriositySlugs(blocks: Block[]): string[] {
  return blocks.flatMap((b) => (b.type === "didYouKnow" ? [b.curiositySlug] : []));
}

import type { BlockInput } from "../../src/lib/content/blocks";

export type ChapterSeed = {
  number: number;
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  /** "Em 30 segundos": exatamente 3 ideias essenciais, em linguagem simples. */
  keyPoints: [string, string, string];
  blocks: BlockInput[];
  deepDive?: string;
};

export type PerspectiveSeed = {
  slug: string;
  side: "LEFT" | "RIGHT";
  name: string;
  tagline: string;
  heroDescription: string;
  intro: string;
  chapters: ChapterSeed[];
};

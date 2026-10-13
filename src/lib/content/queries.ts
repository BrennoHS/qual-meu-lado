import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";
import {
  blocksSchema,
  collectClaimKeys,
  collectCuriositySlugs,
  collectCurrentSlugs,
  collectStatementKeys,
  type Block,
} from "./blocks";
import type { Prisma } from "@prisma/client";

/**
 * Camada de leitura do site público. Só devolve conteúdo PUBLICADO
 * (ou DESATUALIZADO, exibido com aviso). Todos os objetos retornados são
 * serializáveis para componentes cliente (datas como string ISO).
 */
const visible = { status: { in: PUBLIC_STATUSES } } as const;

export type SourceView = {
  slug: string;
  title: string;
  url: string | null;
  institution: string;
  author: string | null;
  kind: string;
  publishedLabel: string | null;
  verifiedAt: string | null;
  linkStatus: string;
  linkCheckedAt: string | null;
  notes: string | null;
  isDemo: boolean;
  locator?: string | null;
};

export type ClaimView = {
  key: string;
  text: string;
  type: string;
  status: string;
  excerpt: string | null;
  context: string | null;
  limitations: string | null;
  verifiedAt: string | null;
  updatedAt: string;
  isDemo: boolean;
  sources: SourceView[];
};

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

const claimInclude = { sources: { include: { source: true } } } satisfies Prisma.ClaimInclude;
type ClaimRow = Prisma.ClaimGetPayload<{ include: typeof claimInclude }>;

function toSourceView(s: Prisma.SourceGetPayload<object>, locator?: string | null): SourceView {
  return {
    slug: s.slug,
    title: s.title,
    url: s.url,
    institution: s.institution,
    author: s.author,
    kind: s.kind,
    publishedLabel: s.publishedLabel,
    verifiedAt: iso(s.verifiedAt),
    linkStatus: s.linkStatus,
    linkCheckedAt: iso(s.linkCheckedAt),
    notes: s.notes,
    isDemo: s.isDemo,
    locator: locator ?? null,
  };
}

function toClaimView(c: ClaimRow): ClaimView {
  return {
    key: c.key,
    text: c.text,
    type: c.type,
    status: c.status,
    excerpt: c.excerpt,
    context: c.context,
    limitations: c.limitations,
    verifiedAt: iso(c.verifiedAt),
    updatedAt: c.updatedAt.toISOString(),
    isDemo: c.isDemo,
    sources: c.sources.map((cs) => toSourceView(cs.source, cs.locator)),
  };
}

export async function getClaims(keys: string[]): Promise<Record<string, ClaimView>> {
  if (keys.length === 0) return {};
  const rows = await db.claim.findMany({ where: { key: { in: [...new Set(keys)] }, ...visible }, include: claimInclude });
  return Object.fromEntries(rows.map((r) => [r.key, toClaimView(r)]));
}

export const getClaim = cache(async (key: string) => {
  const row = await db.claim.findFirst({ where: { key, ...visible }, include: claimInclude });
  return row ? toClaimView(row) : null;
});

// ── Site ────────────────────────────────────────────────────────

export type HeroSettings = { question: string; subtitle: string; finalPhrase: string };
export type NoticeSettings = { enabled: boolean; text: string };
export type ElectionSettings = { enabled: boolean; secondRoundDate: string; title: string; cta: string };
export type SponsorshipSettings = { enabled: boolean; label: string; placeholder: string; sponsors: { name: string; text: string; url: string }[] };

export const getSettings = cache(async () => {
  const rows = await db.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    hero: (map.hero ?? { question: "Você sabe de que lado está?", subtitle: "", finalPhrase: "" }) as HeroSettings,
    notice: (map.notice ?? { enabled: false, text: "" }) as NoticeSettings,
    election: (map.election ?? null) as ElectionSettings | null,
    sponsorship: (map.sponsorship ?? null) as SponsorshipSettings | null,
  };
});

export const getPage = cache(async (slug: string) => db.page.findFirst({ where: { slug, ...visible } }));

// ── Perspectivas e capítulos ────────────────────────────────────

export const getPerspectives = cache(async () =>
  db.perspective.findMany({
    where: visible,
    orderBy: { side: "asc" },
    include: { chapters: { where: visible, orderBy: { number: "asc" }, select: { number: true, slug: true, title: true, kicker: true, summary: true } } },
  }),
);

export const getPerspective = cache(async (slug: string) =>
  db.perspective.findFirst({
    where: { slug, ...visible },
    include: { chapters: { where: visible, orderBy: { number: "asc" }, select: { number: true, slug: true, title: true, kicker: true, summary: true, status: true } } },
  }),
);

export type CurrentView = Awaited<ReturnType<typeof getCurrents>>[number];
export const getCurrents = cache(async () => db.current.findMany({ where: visible, orderBy: { order: "asc" } }));

export type ThemeView = Awaited<ReturnType<typeof getThemes>>[number];
export const getThemes = cache(async () =>
  db.theme.findMany({ where: visible, orderBy: { order: "asc" }, include: { positions: { where: visible } } }),
);

export type TimelineView = Awaited<ReturnType<typeof getTimeline>>[number];
export const getTimeline = cache(async () => db.timelineEvent.findMany({ where: visible, orderBy: [{ year: "asc" }, { order: "asc" }] }));

export type StatementView = {
  key: string;
  text: string;
  context: string;
  dimensionKey: string;
  dimensionName: string;
  direction: number;
  argumentsAgree: string;
  argumentsDisagree: string;
  whyDepends: string | null;
  claimKeys: string[];
};

export type DimensionView = {
  key: string;
  name: string;
  description: string;
  poleA: string;
  poleB: string;
  leftPole: string | null;
  relation: "CONVENTIONAL" | "WEAK" | "NONE";
  basis: string;
};

export const getAffinityModel = cache(async () => {
  const dims = await db.dimension.findMany({
    where: visible,
    orderBy: { order: "asc" },
    include: { statements: { where: visible, orderBy: { order: "asc" } } },
  });
  const dimensions: DimensionView[] = dims.map((d) => ({
    key: d.key,
    name: d.name,
    description: d.description,
    poleA: d.poleA,
    poleB: d.poleB,
    leftPole: d.leftPole,
    relation: d.relation,
    basis: d.basis,
  }));
  const statements: StatementView[] = dims.flatMap((d) =>
    d.statements.map((s) => ({
      key: s.key,
      text: s.text,
      context: s.context,
      dimensionKey: d.key,
      dimensionName: d.name,
      direction: s.direction,
      argumentsAgree: s.argumentsAgree,
      argumentsDisagree: s.argumentsDisagree,
      whyDepends: s.whyDepends,
      claimKeys: s.claimKeys,
    })),
  );
  return { dimensions, statements };
});

/** Ordem de apresentação no fluxo SIM/NÃO: intercala dimensões (1ª de cada, 2ª de cada…). */
export function interleaveStatements(statements: StatementView[]): StatementView[] {
  const byDim = new Map<string, StatementView[]>();
  for (const s of statements) byDim.set(s.dimensionKey, [...(byDim.get(s.dimensionKey) ?? []), s]);
  const lists = [...byDim.values()];
  const out: StatementView[] = [];
  for (let i = 0; lists.some((l) => l[i]); i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

export type ChapterBundle = NonNullable<Awaited<ReturnType<typeof getChapterBundle>>>;

/** Capítulo + tudo que seus blocos referenciam, resolvido em uma ida ao banco por tipo. */
export const getChapterBundle = cache(async (sideSlug: string, chapterSlug: string) => {
  const perspective = await getPerspective(sideSlug);
  if (!perspective) return null;
  const chapter = await db.chapter.findFirst({ where: { perspectiveId: perspective.id, slug: chapterSlug, ...visible } });
  if (!chapter) return null;
  const parsed = blocksSchema.safeParse(chapter.blocks);
  const blocks: Block[] = parsed.success ? parsed.data : [];

  const timelineTags = blocks.some((b) => b.type === "timeline");
  const needsThemes = blocks.some((b) => b.type === "themes");
  const needsAxes = blocks.some((b) => b.type === "axes");
  const statementKeys = collectStatementKeys(blocks);

  const [currents, themes, timeline, curiosities, model] = await Promise.all([
    collectCurrentSlugs(blocks).length || needsAxes ? getCurrents() : Promise.resolve([]),
    needsThemes ? getThemes() : Promise.resolve([]),
    timelineTags ? getTimeline() : Promise.resolve([]),
    db.curiosity.findMany({ where: { slug: { in: collectCuriositySlugs(blocks) }, ...visible } }),
    statementKeys.length ? getAffinityModel() : Promise.resolve({ dimensions: [], statements: [] as StatementView[] }),
  ]);

  const claimKeys = [
    ...collectClaimKeys(blocks),
    ...timeline.flatMap((e) => (e.claimKey ? [e.claimKey] : [])),
    ...curiosities.flatMap((c) => (c.claimKey ? [c.claimKey] : [])),
    ...themes.flatMap((t) => t.positions.flatMap((p) => p.claimKeys)),
  ];
  const claims = await getClaims(claimKeys);

  // Mesmo capítulo do outro lado (para a comparação rápida "ver o outro lado").
  const otherSlug = perspective.side === "LEFT" ? "direita" : "esquerda";
  const other = await db.perspective.findFirst({ where: { slug: otherSlug, ...visible }, select: { name: true, slug: true } });
  const counterpartRow = other
    ? await db.chapter.findFirst({ where: { slug: chapterSlug, perspective: { slug: otherSlug }, ...visible }, select: { title: true, kicker: true, keyPoints: true, summary: true } })
    : null;

  return {
    counterpart: counterpartRow && other ? { ...counterpartRow, sideSlug: other.slug, sideName: other.name } : null,
    perspective: { slug: perspective.slug, side: perspective.side, name: perspective.name, tagline: perspective.tagline, intro: perspective.intro },
    chapters: perspective.chapters,
    chapter: { ...chapter, blocks, updatedAt: chapter.updatedAt.toISOString() },
    blocksValid: parsed.success,
    claims,
    currents,
    themes,
    timeline,
    curiosities: Object.fromEntries(curiosities.map((c) => [c.slug, c])),
    statements: model.statements.filter((s) => statementKeys.includes(s.key)),
  };
});

// ── Mitos ───────────────────────────────────────────────────────

export const getMyths = cache(async () => {
  const myths = await db.myth.findMany({ where: visible, orderBy: { order: "asc" } });
  const claims = await getClaims(myths.flatMap((m) => m.claimKeys));
  return { myths, claims };
});

export const getCuriosities = cache(async () => db.curiosity.findMany({ where: visible }));

// ── Candidaturas ────────────────────────────────────────────────

export const getCurrentElection = cache(async () =>
  db.election.findFirst({
    where: { isCurrent: true },
    include: {
      candidates: {
        where: visible,
        orderBy: { ballotName: "asc" },
        include: { proposals: { where: visible, orderBy: [{ featured: "desc" }, { order: "asc" }], include: { source: true } } },
      },
    },
  }),
);

export const getCandidate = cache(async (slug: string) =>
  db.candidate.findFirst({
    where: { slug, ...visible },
    include: {
      election: true,
      proposals: { where: visible, orderBy: [{ featured: "desc" }, { order: "asc" }], include: { source: true } },
      declarations: { where: visible, orderBy: { saidAt: "desc" }, include: { source: true } },
    },
  }),
);

// ── Fontes e transparência ──────────────────────────────────────

export const getSources = cache(async () =>
  db.source.findMany({
    where: visible,
    orderBy: [{ kind: "asc" }, { title: "asc" }],
    include: { _count: { select: { claims: true } } },
  }),
);

export const getCorrections = cache(async () => db.correction.findMany({ where: visible, orderBy: { correctedAt: "desc" } }));

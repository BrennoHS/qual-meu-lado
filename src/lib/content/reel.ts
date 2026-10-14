import "server-only";
import { blocksSchema, type Block } from "@/lib/content/blocks";
import { db } from "@/lib/db";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";
import { getChapterBundle, getCurrentElection, getPerspective, getThemes, type ChapterBundle } from "@/lib/content/queries";
import { toProposalView } from "@/lib/content/candidates";
import { ROUNDS } from "@/lib/election";
import { unstable_cache } from "next/cache";
import { candidateSlideSpeech, estimateSeconds, sideSlideSpeech } from "@/lib/reel/speech";
import type { CandidateReelData, CandidateSlide, CandidateSummary, SideReelData, SideSlide } from "@/lib/reel/types";

type Side = "esquerda" | "direita";

/** Converte um bloco editorial em uma ou mais telas do reel. */
function blockSlides(block: Block, bundle: ChapterBundle, seg: number, base: string, fullHref: string): SideSlide[] {
  const layer = block.layer;
  const k = (suffix: string | number) => `${base}-${suffix}`;
  const claim = (key?: string) => (key ? (bundle.claims[key] ?? null) : null);
  switch (block.type) {
    case "lead":
      return [{ key: k("lead"), seg, layer, kind: "lead", text: block.text }];
    case "text":
      return [{ key: k("text"), seg, layer, kind: "text", title: block.title, body: block.body }];
    case "illustration":
      return [{ key: k("ill"), seg, layer, kind: "illustration", name: block.name, title: block.title, caption: block.caption }];
    case "glossary":
      return [{ key: k("glos"), seg, layer, kind: "glossary", title: block.title, items: block.items }];
    case "claims":
      return block.claimKeys.map((ck, i) => ({ key: k(`fact-${i}`), seg, layer, kind: "fact" as const, title: block.title, claim: claim(ck) }));
    case "didYouKnow": {
      const c = bundle.curiosities[block.curiositySlug];
      return c ? [{ key: k("dyk"), seg, layer, kind: "curiosity", text: c.text, claim: claim(c.claimKey ?? undefined) }] : [];
    }
    case "example":
      return [{ key: k("ex"), seg, layer, kind: "example", title: block.title, body: block.body }];
    case "pulse": {
      const st = bundle.statements.find((s) => s.key === block.statementKey);
      return st ? [{ key: k("pulse"), seg, layer, kind: "pulse", statement: st, prompt: block.prompt }] : [];
    }
    case "reflection":
      return block.statementKeys.flatMap((sk, i) => {
        const st = bundle.statements.find((s) => s.key === sk);
        return st ? [{ key: k(`refl-${i}`), seg, layer, kind: "pulse" as const, statement: st, prompt: i === 0 ? block.intro ?? "E você?" : "E esta?" }] : [];
      });
    case "valueConflict":
      return [{ key: k("vc"), seg, layer, kind: "conflict", title: block.title, values: block.values, scenario: block.scenario, tension: block.tension }];
    case "arguments":
      return block.items.map((it, i) => ({
        key: k(`arg-${it.id}`),
        seg,
        layer,
        kind: "argument" as const,
        argKind: block.kind,
        title: it.title,
        body: it.body,
        response: it.response,
        limits: it.limits,
        claim: claim(it.claimKeys[0]),
        n: i + 1,
        total: block.items.length,
      }));
    case "counterpoints":
      return block.items.map((it, i) => ({
        key: k(`cp-${it.id}`),
        seg,
        layer,
        kind: "counterpoint" as const,
        prompt: it.prompt,
        thisSide: it.thisSide,
        otherSide: it.otherSide,
        n: i + 1,
        total: block.items.length,
      }));
    case "themes": {
      const side = bundle.perspective.side;
      const pick = (t: (typeof bundle.themes)[number], s: string) => {
        const p = t.positions.find((x) => x.side === s);
        return p ? { summary: p.summary, points: p.points, nuances: p.nuances } : null;
      };
      return [
        {
          key: k("themes"),
          seg,
          layer,
          kind: "themes",
          title: block.title ?? "Tema por tema",
          intro: block.intro,
          fullHref,
          items: bundle.themes.map((t) => ({
            slug: t.slug,
            name: t.name,
            description: t.description,
            mine: pick(t, side),
            other: pick(t, side === "LEFT" ? "RIGHT" : "LEFT"),
          })),
        },
      ];
    }
    case "timeline":
      return [
        {
          key: k("tl"),
          seg,
          layer,
          kind: "explore",
          title: block.title ?? "Linha do tempo",
          intro: block.intro,
          chips: bundle.timeline
            .filter((e) => !block.tags?.length || e.tags.some((t) => block.tags!.includes(t)))
            .filter((e) => !block.scope || e.scope === block.scope)
            .slice(0, 8)
            .map((e) => `${e.year} · ${e.title}`),
          href: fullHref,
          label: "Ver a linha do tempo completa",
        },
      ];
    case "currents":
      return [
        {
          key: k("cur"),
          seg,
          layer,
          kind: "explore",
          title: block.title ?? "As correntes",
          intro: block.intro,
          chips: block.slugs.map((s) => bundle.currents.find((c) => c.slug === s)?.name).filter((n): n is string => !!n),
          href: fullHref,
          label: "Conhecer cada corrente",
        },
      ];
    case "axes":
      return [{ key: k("axes"), seg, layer, kind: "explore", title: block.title ?? "Economia × costumes", intro: block.intro, chips: [], href: fullHref, label: "Ver o esquema completo" }];
  }
}

/** O lado inteiro como um reel contínuo: 7 capítulos, uma ideia por tela. */
/** Palavras de um texto, para reconhecer aberturas quase iguais nos dois lados. */
const words = (t: string) => new Set(t.toLowerCase().match(/[\p{L}\d]+/gu) ?? []);
function nearlySame(a: string, b: string): boolean {
  const A = words(a);
  const B = words(b);
  let common = 0;
  for (const w of A) if (B.has(w)) common++;
  return common / Math.max(A.size, B.size, 1) >= 0.8;
}

/**
 * Telas que se repetem no mesmo capítulo do outro lado (ex.: a história das
 * cadeiras de 1789). Quem já passou por lá pula essas telas aqui. Blocos
 * interativos (perguntas, temas, argumentos) nunca são pulados.
 */
const SKIPPABLE = new Set<Block["type"]>(["lead", "text", "illustration", "claims", "didYouKnow", "example"]);
function isShared(b: Block, others: Block[]): boolean {
  if (!SKIPPABLE.has(b.type)) return false;
  const json = JSON.stringify(b);
  return others.some((o) => JSON.stringify(o) === json || (b.type === "lead" && o.type === "lead" && nearlySame(b.text, o.text)));
}

async function buildSideReel(side: Side): Promise<SideReelData | null> {
  const perspective = await getPerspective(side);
  if (!perspective) return null;
  const bundles = (await Promise.all(perspective.chapters.map((c) => getChapterBundle(side, c.slug)))).filter((b): b is ChapterBundle => !!b);
  const otherSlug: Side = side === "esquerda" ? "direita" : "esquerda";
  const slides: SideSlide[] = [];
  const otherChapters = await db.chapter.findMany({
    where: { perspective: { slug: otherSlug }, status: { in: PUBLIC_STATUSES } },
    select: { slug: true, blocks: true },
  });
  const otherBlocks = new Map(
    otherChapters.map((c) => {
      const parsed = blocksSchema.safeParse(c.blocks);
      return [c.slug, parsed.success ? parsed.data : []] as const;
    }),
  );

  bundles.forEach((bundle, seg) => {
    const ch = bundle.chapter;
    const fullHref = `/explorar/${side}/${ch.slug}`;
    slides.push({
      key: `${ch.slug}-cover`,
      seg,
      layer: "surface",
      kind: "cover",
      number: ch.number,
      kicker: ch.kicker,
      title: ch.title,
      summary: ch.summary,
      keyPoints: ch.keyPoints,
      sharedPoints: ch.keyPoints.flatMap((k, i) => (bundle.counterpart?.keyPoints.includes(k) ? [i] : [])),
      fullHref,
      counterpart: bundle.counterpart
        ? { sideSlug: bundle.counterpart.sideSlug, sideName: bundle.counterpart.sideName, title: bundle.counterpart.title, keyPoints: bundle.counterpart.keyPoints }
        : null,
    });
    const others = otherBlocks.get(ch.slug) ?? [];
    ch.blocks.forEach((b, i) => {
      const made = blockSlides(b, bundle, seg, `${ch.slug}-${i}`, fullHref);
      if (isShared(b, others)) for (const s of made) s.shared = true;
      slides.push(...made);
    });
    if (ch.deepDive) slides.push({ key: `${ch.slug}-deepdive`, seg, layer: "deep", kind: "text", title: "Para ir além", body: ch.deepDive });
    // Sem tela de "capítulo concluído": a troca de capítulo é sinalizada no próprio reel (leitura contínua).
  });
  slides.push({ key: "end", seg: Math.max(0, bundles.length - 1), layer: "surface", kind: "end" });
  const otherName = otherSlug === "esquerda" ? "Esquerda" : "Direita";
  for (const s of slides) s.secs = estimateSeconds(sideSlideSpeech(s, { sideName: perspective.name, otherName }), s.kind);

  return {
    side,
    sideName: perspective.name,
    other: { slug: otherSlug, name: otherName },
    chapters: bundles.map((b) => ({ slug: b.chapter.slug, number: b.chapter.number, title: b.chapter.title, kicker: b.chapter.kicker })),
    slides,
  };
}

// ── Candidaturas ────────────────────────────────────────────────

/** As propostas de uma candidatura como reel: uma rodada temática por tela. */
async function buildCandidateReel(slug: string): Promise<CandidateReelData | null> {
  const [election, themes] = await Promise.all([getCurrentElection(), getThemes()]);
  const list = election?.candidates ?? [];
  const row = list.find((c) => c.slug === slug);
  const rivalRow = list.find((c) => c.slug !== slug);
  if (!row || !rivalRow) return null;
  const names = Object.fromEntries(themes.map((t) => [t.slug, t.name]));
  const summary = (c: typeof row): CandidateSummary => ({
    slug: c.slug,
    ballotName: c.ballotName,
    name: c.name,
    party: c.party,
    partyAcronym: c.partyAcronym,
    number: c.number,
    runningMate: c.runningMate,
    coalition: c.coalition,
  });
  const mine = row.proposals.map((p) => toProposalView(p, names));
  const theirs = rivalRow.proposals.map((p) => toProposalView(p, names));
  const headline = (ps: typeof mine, round: string) => {
    const inRound = ps.filter((p) => p.themeSlug === round);
    return inRound.find((p) => p.featured) ?? inRound[0] ?? null;
  };

  const slides: CandidateSlide[] = [{ key: "cover", seg: 0, layer: "surface", kind: "cover" }];
  ROUNDS.forEach((round, seg) => {
    const p = headline(mine, round.slug);
    const others = mine.filter((x) => x.themeSlug === round.slug && x !== p);
    slides.push({ key: `r-${round.slug}`, seg, layer: "surface", kind: "proposal", round, p, rival: headline(theirs, round.slug), more: others.length });
    if (p) slides.push({ key: `r-${round.slug}-inside`, seg, layer: "deep", kind: "inside", round, p, others });
  });
  slides.push({ key: "end", seg: ROUNDS.length - 1, layer: "surface", kind: "end" });

  const me = summary(row);
  const them = summary(rivalRow);
  for (const s of slides) s.secs = estimateSeconds(candidateSlideSpeech(s, me, them), s.kind);
  return { candidate: me, rival: them, planUrl: row.planUrl, slides };
}

/**
 * Versões em cache (5 min, e invalidadas pela tag "content" quando o painel publica algo):
 * o reel junta muitos capítulos, e páginas com parâmetros de compartilhamento são dinâmicas.
 */
export const getSideReel = (side: Side) => unstable_cache(() => buildSideReel(side), ["side-reel", side, "v5"], { revalidate: 300, tags: ["content"] })();
export const getCandidateReel = (slug: string) => unstable_cache(() => buildCandidateReel(slug), ["candidate-reel", slug, "v4"], { revalidate: 300, tags: ["content"] })();

/** Soma do tempo estimado da camada essencial. */
export function essentialSeconds(slides: { layer: string; secs?: number }[]): number {
  return slides.filter((s) => s.layer === "surface").reduce((a, s) => a + (s.secs ?? 0), 0);
}

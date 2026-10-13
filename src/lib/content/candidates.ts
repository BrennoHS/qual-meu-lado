import "server-only";
import type { Prisma } from "@prisma/client";
import type { ProposalView } from "@/components/candidates/proposal-card";
import { roundLabel } from "@/lib/election";

type ProposalRow = Prisma.ProposalGetPayload<{ include: { source: true } }>;

export function toProposalView(p: ProposalRow, themeNames: Record<string, string>): ProposalView {
  return {
    id: p.id,
    themeSlug: p.themeSlug,
    themeName: themeNames[p.themeSlug] ?? roundLabel(p.themeSlug),
    title: p.title,
    plainSummary: p.plainSummary,
    originalExcerpt: p.originalExcerpt,
    problem: p.problem,
    instruments: p.instruments,
    claimedBenefits: p.claimedBenefits,
    critiques: p.critiques,
    costs: p.costs,
    implementationStatus: p.implementationStatus,
    sourceLocator: p.sourceLocator,
    infoDate: p.infoDate.toISOString(),
    featured: p.featured,
    isDemo: p.isDemo,
    criteria: (p.criteria as Record<string, number> | null) ?? null,
    source: p.source ? { title: p.source.title, url: p.source.url, institution: p.source.institution, isDemo: p.source.isDemo } : null,
  };
}

/** Destaques: 4 a 8 propostas marcadas como destaque, na ordem editorial. */
export function featuredProposals<T extends { featured: boolean }>(list: T[]): T[] {
  const featured = list.filter((p) => p.featured).slice(0, 8);
  if (featured.length >= 4) return featured;
  return [...featured, ...list.filter((p) => !p.featured)].slice(0, Math.min(4, list.length));
}

import "server-only";
import type { Prisma, PrismaClient } from "@prisma/client";
import { blocksSchema, collectClaimKeys, collectCuriositySlugs, collectCurrentSlugs, collectStatementKeys } from "@/lib/content/blocks";
import {
  candidatePublishIssues,
  claimPublishIssues,
  proposalPublishIssues,
  referencedClaimIssues,
  referencedIssues,
  sourceIsUsable,
  type ClaimForRules,
} from "./rules";

type Client = PrismaClient | Prisma.TransactionClient;
const OK = ["VERIFIED", "PUBLISHED"] as const;

async function claimsMap(db: Client, keys: string[]): Promise<Map<string, ClaimForRules>> {
  if (!keys.length) return new Map();
  const rows = await db.claim.findMany({ where: { key: { in: [...new Set(keys)] } }, include: { sources: { include: { source: true } } } });
  return new Map(
    rows.map((c) => [
      c.key,
      {
        key: c.key,
        type: c.type,
        status: c.status,
        isDemo: c.isDemo,
        sources: c.sources.map(({ source: s }) => ({ slug: s.slug, title: s.title, url: s.url, kind: s.kind, linkStatus: s.linkStatus, isDemo: s.isDemo, status: s.status })),
      },
    ]),
  );
}

/**
 * Lista os motivos que impedem um registro de ser verificado/publicado.
 * Vazia = pode seguir. Usada no fluxo editorial e ao salvar conteúdo publicado.
 */
export async function publishIssues(db: Client, model: string, id: string): Promise<string[]> {
  switch (model) {
    case "source": {
      const s = await db.source.findUnique({ where: { id } });
      if (!s) return ["Registro não encontrado."];
      const issues: string[] = [];
      if (s.linkStatus === "BROKEN") issues.push("O link desta fonte está quebrado. Corrija a URL e verifique novamente.");
      if (!sourceIsUsable({ ...s }) && s.kind !== "DEMO") issues.push("Fontes sem URL precisam ser livros ou artigos acadêmicos com referência completa.");
      return issues;
    }
    case "claim": {
      const c = await db.claim.findUnique({ where: { id } });
      if (!c) return ["Registro não encontrado."];
      return claimPublishIssues((await claimsMap(db, [c.key])).get(c.key)!);
    }
    case "chapter": {
      const ch = await db.chapter.findUnique({ where: { id } });
      if (!ch) return ["Registro não encontrado."];
      const parsed = blocksSchema.safeParse(ch.blocks);
      if (!parsed.success) return ["Os blocos do capítulo não passam na validação do esquema."];
      const blocks = parsed.data;
      const [statements, currents, curiosities] = await Promise.all([
        db.statement.findMany({ where: { key: { in: collectStatementKeys(blocks) }, status: { in: [...OK] } }, select: { key: true } }),
        db.current.findMany({ where: { slug: { in: collectCurrentSlugs(blocks) }, status: { in: [...OK] } }, select: { slug: true } }),
        db.curiosity.findMany({ where: { slug: { in: collectCuriositySlugs(blocks) }, status: { in: [...OK] } }, select: { slug: true } }),
      ]);
      const keys = collectClaimKeys(blocks);
      return [
        ...referencedClaimIssues(keys, await claimsMap(db, keys)),
        ...referencedIssues("Afirmação do mapa", collectStatementKeys(blocks), new Set(statements.map((s) => s.key))),
        ...referencedIssues("Corrente", collectCurrentSlugs(blocks), new Set(currents.map((c) => c.slug))),
        ...referencedIssues("Curiosidade", collectCuriositySlugs(blocks), new Set(curiosities.map((c) => c.slug))),
      ];
    }
    case "themePosition":
    case "myth":
    case "statement": {
      const row = await (db as unknown as Record<string, { findUnique: (a: unknown) => Promise<{ claimKeys: string[] } | null> }>)[model].findUnique({ where: { id } });
      if (!row) return ["Registro não encontrado."];
      if (model === "myth" && row.claimKeys.length === 0) return ["Mitos precisam de ao menos uma afirmação de apoio."];
      return referencedClaimIssues(row.claimKeys, await claimsMap(db, row.claimKeys));
    }
    case "timelineEvent":
    case "curiosity": {
      const row = await (db as unknown as Record<string, { findUnique: (a: unknown) => Promise<{ claimKey: string | null } | null> }>)[model].findUnique({ where: { id } });
      if (!row) return ["Registro não encontrado."];
      if (!row.claimKey) return ["Informe a afirmação de referência (com fonte) antes de publicar."];
      return referencedClaimIssues([row.claimKey], await claimsMap(db, [row.claimKey]));
    }
    case "proposal": {
      const p = await db.proposal.findUnique({ where: { id }, include: { source: true } });
      if (!p) return ["Registro não encontrado."];
      return proposalPublishIssues({ sourceId: p.sourceId, infoDate: p.infoDate, isDemo: p.isDemo, sourceIsDemo: p.source?.isDemo });
    }
    case "declaration": {
      const d = await db.declaration.findUnique({ where: { id }, include: { source: true } });
      if (!d) return ["Registro não encontrado."];
      const issues: string[] = [];
      if (!d.sourceId) issues.push("Declarações precisam de fonte.");
      if (d.source?.isDemo && !d.isDemo) issues.push("Fonte demonstrativa não pode sustentar declaração real.");
      return issues;
    }
    case "candidate": {
      const c = await db.candidate.findUnique({ where: { id } });
      return c ? candidatePublishIssues(c) : ["Registro não encontrado."];
    }
    default:
      return [];
  }
}

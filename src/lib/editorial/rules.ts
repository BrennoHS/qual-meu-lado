/**
 * Regras de publicação. Funções puras (testadas em tests/unit/rules.test.ts)
 * usadas pelo seed e pelo painel: nenhum conteúdo com afirmação factual sem
 * fonte chega ao site público.
 */
export type SourceForRules = {
  slug: string;
  title: string;
  url: string | null;
  kind: string;
  linkStatus: string;
  isDemo: boolean;
  status: string;
};

export type ClaimForRules = {
  key: string;
  type: string;
  status: string;
  isDemo: boolean;
  sources: SourceForRules[];
};

const BIBLIOGRAPHIC = new Set(["BOOK", "ACADEMIC"]);
const OK_STATUSES = new Set(["VERIFIED", "PUBLISHED"]);

/** Uma fonte é utilizável se tem URL não quebrada ou é referência bibliográfica completa. */
export function sourceIsUsable(s: SourceForRules): boolean {
  if (s.linkStatus === "BROKEN") return false;
  if (s.url) return true;
  return BIBLIOGRAPHIC.has(s.kind);
}

export function claimPublishIssues(claim: ClaimForRules): string[] {
  const issues: string[] = [];
  if (claim.type === "OPINION") return issues;
  if (claim.sources.length === 0) {
    issues.push(`A afirmação "${claim.key}" não tem nenhuma fonte associada.`);
    return issues;
  }
  for (const s of claim.sources) {
    if (s.linkStatus === "BROKEN") issues.push(`A fonte "${s.title}" está com link quebrado.`);
    if (s.isDemo && !claim.isDemo) issues.push(`A fonte "${s.title}" é demonstrativa e não pode sustentar conteúdo real.`);
  }
  const usable = claim.sources.filter((s) => sourceIsUsable(s) && (!s.isDemo || claim.isDemo));
  if (claim.type === "FACT" && usable.length === 0) {
    issues.push(`O fato "${claim.key}" precisa de ao menos uma fonte com URL válida ou referência bibliográfica completa.`);
  }
  return issues;
}

/** Valida chaves de afirmação referenciadas por outro conteúdo (capítulo, mito, tema...). */
export function referencedClaimIssues(keys: string[], claims: Map<string, ClaimForRules>): string[] {
  const issues: string[] = [];
  for (const key of new Set(keys)) {
    const c = claims.get(key);
    if (!c) issues.push(`A afirmação "${key}" não existe.`);
    else if (!OK_STATUSES.has(c.status)) issues.push(`A afirmação "${key}" ainda não foi verificada (estado: ${c.status}).`);
  }
  return issues;
}

/** Proposta de candidatura: precisa de fonte, data e coerência com o status demonstrativo. */
export function proposalPublishIssues(p: { sourceId: string | null; infoDate: Date | null; isDemo: boolean; sourceIsDemo?: boolean }): string[] {
  const issues: string[] = [];
  if (!p.sourceId) issues.push("Toda proposta precisa de uma fonte original.");
  if (!p.infoDate) issues.push("Informe a data da informação.");
  if (p.sourceIsDemo && !p.isDemo) issues.push("Fonte demonstrativa não pode sustentar proposta real.");
  return issues;
}

export function candidatePublishIssues(c: { isDemo: boolean; officialRegistryUrl: string | null; planUrl: string | null }): string[] {
  if (c.isDemo) return [];
  return c.officialRegistryUrl || c.planUrl
    ? []
    : ["Candidaturas reais precisam de link para o registro oficial (DivulgaCandContas) ou para o programa de governo."];
}

export function referencedIssues(kind: string, keys: string[], existing: Set<string>): string[] {
  return [...new Set(keys)].filter((k) => !existing.has(k)).map((k) => `${kind} "${k}" não existe ou não está publicado(a).`);
}

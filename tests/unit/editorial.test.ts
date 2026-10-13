import { describe, expect, it } from "vitest";
import { claimPublishIssues, referencedClaimIssues, proposalPublishIssues, candidatePublishIssues, type ClaimForRules } from "@/lib/editorial/rules";
import { allowedTransitions, canTransition } from "@/lib/editorial/status";

const src = (over: Partial<ClaimForRules["sources"][number]> = {}) => ({
  slug: "s",
  title: "Fonte",
  url: "https://exemplo.gov.br",
  kind: "OFFICIAL",
  linkStatus: "OK",
  isDemo: false,
  status: "PUBLISHED",
  ...over,
});

describe("regras de publicação", () => {
  it("bloqueia fato sem fonte", () => {
    expect(claimPublishIssues({ key: "x", type: "FACT", status: "DRAFT", isDemo: false, sources: [] })).toHaveLength(1);
  });

  it("aceita livro sem URL como referência bibliográfica", () => {
    expect(claimPublishIssues({ key: "x", type: "FACT", status: "DRAFT", isDemo: false, sources: [src({ url: null, kind: "BOOK" })] })).toEqual([]);
  });

  it("bloqueia fonte com link quebrado", () => {
    const issues = claimPublishIssues({ key: "x", type: "FACT", status: "DRAFT", isDemo: false, sources: [src({ linkStatus: "BROKEN" })] });
    expect(issues.join(" ")).toMatch(/quebrado/);
  });

  it("aceita portal que bloqueia robôs (conferência manual), mas não fonte fictícia em conteúdo real", () => {
    expect(claimPublishIssues({ key: "x", type: "FACT", status: "DRAFT", isDemo: false, sources: [src({ linkStatus: "BLOCKED" })] })).toEqual([]);
    expect(claimPublishIssues({ key: "x", type: "FACT", status: "DRAFT", isDemo: false, sources: [src({ isDemo: true, kind: "DEMO", url: null })] }).length).toBeGreaterThan(0);
  });

  it("exige que afirmações referenciadas existam e estejam verificadas", () => {
    const map = new Map<string, ClaimForRules>([["a", { key: "a", type: "FACT", status: "IN_REVIEW", isDemo: false, sources: [] }]]);
    const issues = referencedClaimIssues(["a", "b"], map);
    expect(issues).toHaveLength(2);
  });

  it("propostas precisam de fonte e data; candidaturas reais precisam de registro oficial", () => {
    expect(proposalPublishIssues({ sourceId: null, infoDate: null, isDemo: false })).toHaveLength(2);
    expect(candidatePublishIssues({ isDemo: false, officialRegistryUrl: null, planUrl: null })).toHaveLength(1);
    expect(candidatePublishIssues({ isDemo: true, officialRegistryUrl: null, planUrl: null })).toEqual([]);
  });
});

describe("fluxo editorial por papel", () => {
  it("editores só enviam para revisão", () => {
    expect(allowedTransitions("EDITOR", "DRAFT")).toEqual(["IN_REVIEW"]);
    expect(canTransition("EDITOR", "VERIFIED", "PUBLISHED")).toBe(false);
    expect(canTransition("EDITOR", "PUBLISHED", "OUTDATED")).toBe(false);
  });

  it("não permite pular a verificação", () => {
    expect(canTransition("ADMIN", "DRAFT", "PUBLISHED")).toBe(false);
    expect(canTransition("ADMIN", "IN_REVIEW", "PUBLISHED")).toBe(false);
    expect(canTransition("REVIEWER", "VERIFIED", "PUBLISHED")).toBe(true);
  });
});

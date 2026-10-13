/** Rótulos editoriais exibidos ao público. */

export type EvidenceKind = "fact" | "pro" | "critique" | "interpretation" | "proposal" | "unconfirmed" | "prediction" | "opinion";

export const evidenceLabel: Record<EvidenceKind, string> = {
  fact: "Fato documentado",
  pro: "Argumento favorável",
  critique: "Crítica fundamentada",
  interpretation: "Interpretação",
  proposal: "Proposta",
  unconfirmed: "Informação não confirmada",
  prediction: "Previsão",
  opinion: "Opinião",
};

export function evidenceKindForClaim(type: string, status: string): EvidenceKind {
  if (status !== "PUBLISHED" && status !== "VERIFIED" && status !== "OUTDATED") return "unconfirmed";
  switch (type) {
    case "FACT":
      return "fact";
    case "PROPOSAL":
      return "proposal";
    case "PREDICTION":
      return "prediction";
    case "OPINION":
      return "opinion";
    default:
      return "interpretation";
  }
}

export const claimTypeLabel: Record<string, string> = {
  FACT: "Fato",
  INTERPRETATION: "Interpretação",
  PROPOSAL: "Proposta",
  PREDICTION: "Previsão",
  OPINION: "Opinião",
};

export const sourceKindLabel: Record<string, string> = {
  OFFICIAL: "Fonte oficial",
  LEGISLATION: "Legislação",
  DATA: "Dados públicos",
  ACADEMIC: "Acadêmica",
  BOOK: "Livro",
  JOURNALISM: "Jornalismo",
  FACT_CHECK: "Checagem",
  CAMPAIGN: "Documento de campanha",
  DEMO: "Demonstrativa (fictícia)",
  OTHER: "Outra",
};

export const linkStatusLabel: Record<string, string> = {
  UNKNOWN: "Link ainda não verificado",
  OK: "Link verificado",
  BLOCKED: "Portal bloqueia verificação automática — conferência manual",
  BROKEN: "Link quebrado",
};

export const verdictLabel: Record<string, string> = {
  CONFIRMED: "Confirmado",
  FALSE: "Falso",
  PARTIAL: "Parcialmente verdadeiro",
  CONTEXT_DEPENDENT: "Depende do contexto",
  INSUFFICIENT_EVIDENCE: "Sem evidências suficientes",
};

export const proposalStatusLabel: Record<string, string> = {
  PROMISE: "Promessa de campanha",
  IN_LEGISLATIVE_PROCESS: "Em tramitação",
  PARTIALLY_IMPLEMENTED: "Parcialmente implementada",
  IMPLEMENTED: "Implementada",
  ABANDONED: "Abandonada",
  UNKNOWN: "Situação não apurada",
};

export const answerLabel = {
  agree: "Concordo",
  disagree: "Discordo",
  depends: "Depende",
  unknown: "Não sei o suficiente",
} as const;

export const sideSlug = { LEFT: "esquerda", RIGHT: "direita" } as const;
export const sideName = { LEFT: "Esquerda", RIGHT: "Direita" } as const;

export const criteriaLabels: Record<string, string> = {
  centralidade: "Centralidade no plano",
  impacto: "Impacto potencial",
  relevanciaNacional: "Relevância nacional",
  especificidade: "Especificidade",
  interessePublico: "Interesse público",
  documentacao: "Documentação verificável",
};

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });
}

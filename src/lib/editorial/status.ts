export const STATUSES = ["DRAFT", "IN_REVIEW", "VERIFIED", "PUBLISHED", "OUTDATED"] as const;
export type Status = (typeof STATUSES)[number];
export type RoleName = "ADMIN" | "REVIEWER" | "EDITOR";

export const statusLabel: Record<Status, string> = {
  DRAFT: "Rascunho",
  IN_REVIEW: "Em revisão",
  VERIFIED: "Verificado",
  PUBLISHED: "Publicado",
  OUTDATED: "Desatualizado",
};

/** Estados visíveis no site público. OUTDATED aparece com aviso. */
export const PUBLIC_STATUSES: Status[] = ["PUBLISHED", "OUTDATED"];

/** Transições permitidas no fluxo Rascunho → Em revisão → Verificado → Publicado → Desatualizado. */
const graph: Record<Status, Status[]> = {
  DRAFT: ["IN_REVIEW"],
  IN_REVIEW: ["DRAFT", "VERIFIED"],
  VERIFIED: ["PUBLISHED", "IN_REVIEW"],
  PUBLISHED: ["OUTDATED", "IN_REVIEW"],
  OUTDATED: ["IN_REVIEW", "DRAFT"],
};

/** Quem pode realizar cada transição. Editores só enviam para revisão. */
const roleCan: Record<RoleName, (from: Status, to: Status) => boolean> = {
  ADMIN: () => true,
  REVIEWER: () => true,
  EDITOR: (from, to) =>
    (from === "DRAFT" && to === "IN_REVIEW") || (from === "IN_REVIEW" && to === "DRAFT") || (from === "OUTDATED" && to === "DRAFT"),
};

export function allowedTransitions(role: RoleName, from: Status): Status[] {
  return graph[from].filter((to) => roleCan[role](from, to));
}

export function canTransition(role: RoleName, from: Status, to: Status): boolean {
  return graph[from].includes(to) && roleCan[role](from, to);
}

/** Transições que exigem checagem das regras de publicação. */
export function requiresPublishChecks(to: Status): boolean {
  return to === "VERIFIED" || to === "PUBLISHED";
}

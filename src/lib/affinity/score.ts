/**
 * Cálculo do mapa de afinidades — executado SOMENTE no navegador.
 * Função pura e determinística: as mesmas respostas sempre produzem o
 * mesmo resultado (testado em tests/unit/score.test.ts).
 *
 * Metodologia (também exibida em /como-construimos e na tela de resultado):
 *  1. Cada resposta vira um valor: Concordo = +1, Discordo = −1, Depende = 0.
 *     "Não sei" é EXCLUÍDA do cálculo (não é tratada como opinião neutra).
 *  2. O valor é multiplicado pela direção da afirmação (+1 se concordar
 *     aproxima do polo A; −1 se aproxima do polo B).
 *  3. A posição na dimensão é a média desses valores: de −1 (polo B) a +1 (polo A).
 *  4. A proximidade com o polo A é (posição + 1) / 2, em %.
 *  5. Se houver menos de 2 respostas "Concordo"/"Discordo" na dimensão,
 *     ela é marcada como INDETERMINADA e nenhum percentual é exibido.
 *  6. Lado geral (overallSide): média ponderada só das dimensões com
 *     associação convencional (peso 1) ou fraca (peso 0,5); as didáticas
 *     nunca entram. |média| ≤ 0,2 = centro. Mínimo de 3 dimensões.
 */

export type Answer = "agree" | "disagree" | "depends" | "unknown";
export const ANSWER_VALUE: Record<Exclude<Answer, "unknown">, number> = { agree: 1, disagree: -1, depends: 0 };

export const MIN_DECISIVE = 2;
/** Faixa central (|posição| < 1/3) é descrita como "equilíbrio entre os polos". */
export const BALANCE_BAND = 1 / 3;

export type DimensionDef = {
  key: string;
  name: string;
  poleA: string;
  poleB: string;
  leftPole: string | null;
  relation: "CONVENTIONAL" | "WEAK" | "NONE";
};

export type StatementDef = { key: string; dimensionKey: string; direction: number; text: string };

export type Contribution = { statementKey: string; text: string; answer: Answer | null; value: number | null };

export type DimensionResult = {
  key: string;
  name: string;
  poleA: string;
  poleB: string;
  leftPole: string | null;
  relation: DimensionDef["relation"];
  total: number;
  answered: number;
  decisive: number;
  unknown: number;
  unanswered: number;
  position: number | null;
  poleAPercent: number | null;
  lean: "A" | "B" | "balanced" | null;
  status: "indeterminate" | "partial" | "complete";
  contributions: Contribution[];
};

export type AffinitySummary = {
  dimensions: DimensionResult[];
  answeredCount: number;
  totalCount: number;
  determinate: number;
  indeterminate: string[];
  /** Apenas dimensões CONVENTIONAL entram nesta contagem descritiva. */
  conventional: { towardLeft: number; towardRight: number; balanced: number };
};

export function scoreDimension(dim: DimensionDef, statements: StatementDef[], answers: Record<string, Answer | undefined>): DimensionResult {
  const own = statements.filter((s) => s.dimensionKey === dim.key);
  const contributions: Contribution[] = own.map((s) => {
    const a = answers[s.key] ?? null;
    if (a === null || a === "unknown") return { statementKey: s.key, text: s.text, answer: a, value: null };
    return { statementKey: s.key, text: s.text, answer: a, value: ANSWER_VALUE[a] * Math.sign(s.direction) };
  });
  const counted = contributions.filter((c) => c.value !== null);
  const decisive = counted.filter((c) => c.answer === "agree" || c.answer === "disagree").length;
  const unknown = contributions.filter((c) => c.answer === "unknown").length;
  const unanswered = contributions.filter((c) => c.answer === null).length;

  let position: number | null = null;
  let poleAPercent: number | null = null;
  let lean: DimensionResult["lean"] = null;
  if (decisive >= MIN_DECISIVE) {
    const raw = counted.reduce((sum, c) => sum + (c.value ?? 0), 0) / counted.length;
    position = Math.round(raw * 1000) / 1000;
    poleAPercent = Math.round(((position + 1) / 2) * 100);
    lean = Math.abs(position) < BALANCE_BAND ? "balanced" : position > 0 ? "A" : "B";
  }

  return {
    key: dim.key,
    name: dim.name,
    poleA: dim.poleA,
    poleB: dim.poleB,
    leftPole: dim.leftPole,
    relation: dim.relation,
    total: own.length,
    answered: counted.length,
    decisive,
    unknown,
    unanswered,
    position,
    poleAPercent,
    lean,
    status: position === null ? "indeterminate" : counted.length === own.length ? "complete" : "partial",
    contributions,
  };
}

export function scoreAffinity(dimensions: DimensionDef[], statements: StatementDef[], answers: Record<string, Answer | undefined>): AffinitySummary {
  const results = dimensions.map((d) => scoreDimension(d, statements, answers));
  const conventional = { towardLeft: 0, towardRight: 0, balanced: 0 };
  for (const r of results) {
    if (r.relation !== "CONVENTIONAL" || r.lean === null || !r.leftPole) continue;
    if (r.lean === "balanced") conventional.balanced++;
    else if (r.lean === r.leftPole) conventional.towardLeft++;
    else conventional.towardRight++;
  }
  const keys = new Set(statements.map((s) => s.key));
  return {
    dimensions: results,
    answeredCount: Object.entries(answers).filter(([k, v]) => keys.has(k) && v !== undefined).length,
    totalCount: statements.length,
    determinate: results.filter((r) => r.position !== null).length,
    indeterminate: results.filter((r) => r.position === null).map((r) => r.name),
    conventional,
  };
}

// ── Lado geral (tela de resultado) ──────────────────────────────

export type OverallSide = "esquerda" | "centro" | "direita";
export type OverallResult = {
  side: OverallSide;
  /** −1 (direita) … +1 (esquerda), média ponderada. */
  lean: number;
  /** Posição no trilho para desenhar: 0 = extremo esquerdo, 100 = extremo direito. */
  meter: number;
  strength: "leve" | "moderada" | "forte" | null;
  basedOn: number;
};

/** Faixa central: |lean| ≤ 0,2 é "Centro". */
export const CENTER_BAND = 0.2;
/** Mínimo de dimensões com associação (convencional ou fraca) determinadas. */
export const MIN_DIMENSIONS_FOR_SIDE = 3;
const WEIGHT: Record<DimensionDef["relation"], number> = { CONVENTIONAL: 1, WEAK: 0.5, NONE: 0 };

/**
 * Resume o mapa num lado (esquerda, centro ou direita).
 *  - Só entram dimensões com associação convencional (peso 1) ou fraca (peso 0,5);
 *    as didáticas (sem associação) ficam de fora.
 *  - Em cada dimensão, a posição é orientada para que +1 = polo associado à esquerda.
 *  - Média ponderada; |média| ≤ 0,2 = centro.
 *  - Com menos de 3 dimensões determinadas, não há resultado (null).
 */
export function overallSide(summary: AffinitySummary): OverallResult | null {
  let sum = 0;
  let weight = 0;
  let basedOn = 0;
  for (const r of summary.dimensions) {
    const w = WEIGHT[r.relation];
    if (!w || r.position === null || !r.leftPole) continue;
    const towardLeft = r.leftPole === "A" ? r.position : -r.position;
    sum += towardLeft * w;
    weight += w;
    basedOn++;
  }
  if (basedOn < MIN_DIMENSIONS_FOR_SIDE || weight === 0) return null;
  const lean = Math.round((sum / weight) * 1000) / 1000;
  const side: OverallSide = Math.abs(lean) <= CENTER_BAND ? "centro" : lean > 0 ? "esquerda" : "direita";
  const abs = Math.abs(lean);
  const strength = side === "centro" ? null : abs > 0.66 ? "forte" : abs > 0.4 ? "moderada" : "leve";
  return { side, lean, meter: Math.round(((1 - lean) / 2) * 100), strength, basedOn };
}

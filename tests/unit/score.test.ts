import { describe, expect, it } from "vitest";
import { scoreAffinity, scoreDimension, type DimensionDef, type StatementDef } from "@/lib/affinity/score";

const dims: DimensionDef[] = [
  { key: "eco", name: "Economia", poleA: "Estado", poleB: "Mercado", leftPole: "A", relation: "CONVENTIONAL" },
  { key: "ins", name: "Instituições", poleA: "Freios", poleB: "Maioria", leftPole: null, relation: "NONE" },
];
const stmts: StatementDef[] = [
  { key: "e1", dimensionKey: "eco", direction: 1, text: "e1" },
  { key: "e2", dimensionKey: "eco", direction: -1, text: "e2" },
  { key: "e3", dimensionKey: "eco", direction: 1, text: "e3" },
  { key: "i1", dimensionKey: "ins", direction: 1, text: "i1" },
  { key: "i2", dimensionKey: "ins", direction: -1, text: "i2" },
];

describe("mapa de afinidades", () => {
  it("é determinístico: mesmas respostas, mesmo resultado", () => {
    const answers = { e1: "agree", e2: "disagree", e3: "depends" } as const;
    expect(scoreAffinity(dims, stmts, answers)).toEqual(scoreAffinity(dims, stmts, { ...answers }));
  });

  it("inverte o valor quando a direção da afirmação é -1", () => {
    const r = scoreDimension(dims[0], stmts, { e1: "agree", e2: "disagree", e3: "agree" });
    // e1 +1, e2 (−1 × −1) = +1, e3 +1 → posição +1 → 100% polo A
    expect(r.position).toBe(1);
    expect(r.poleAPercent).toBe(100);
    expect(r.lean).toBe("A");
  });

  it("trata 'depende' como 0 e exclui 'não sei' do cálculo", () => {
    const r = scoreDimension(dims[0], stmts, { e1: "agree", e2: "agree", e3: "unknown" });
    // e1 +1, e2 −1 → média 0 → 50%, equilíbrio
    expect(r.answered).toBe(2);
    expect(r.unknown).toBe(1);
    expect(r.poleAPercent).toBe(50);
    expect(r.lean).toBe("balanced");
    const withDepends = scoreDimension(dims[0], stmts, { e1: "agree", e2: "disagree", e3: "depends" });
    expect(withDepends.position).toBeCloseTo(0.667, 3);
  });

  it("marca a dimensão como indeterminada com menos de 2 respostas decisivas", () => {
    const r = scoreDimension(dims[0], stmts, { e1: "agree", e2: "depends", e3: "depends" });
    expect(r.status).toBe("indeterminate");
    expect(r.poleAPercent).toBeNull();
  });

  it("nunca soma dimensões sem associação convencional a um lado", () => {
    const s = scoreAffinity(dims, stmts, { e1: "agree", e2: "disagree", e3: "agree", i1: "agree", i2: "disagree" });
    expect(s.conventional).toEqual({ towardLeft: 1, towardRight: 0, balanced: 0 });
    expect(s.determinate).toBe(2);
  });

  it("não produz pontuação geral nem rótulo", () => {
    const s = scoreAffinity(dims, stmts, { e1: "agree" });
    expect(Object.keys(s)).not.toContain("label");
    expect(Object.keys(s)).not.toContain("overall");
    expect(s.indeterminate).toEqual(["Economia", "Instituições"]);
  });
});

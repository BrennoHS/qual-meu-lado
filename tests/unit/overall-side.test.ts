/** Lado geral do mapa de afinidades: transparente, determinístico e sem dimensões didáticas. */
import { describe, expect, it } from "vitest";
import { CENTER_BAND, overallSide, scoreAffinity, type Answer, type DimensionDef, type StatementDef } from "@/lib/affinity/score";
import { dimensions as dimSeed, statements as stSeed } from "../../content/affinity";

const dims: DimensionDef[] = dimSeed.map((d) => ({ key: d.key, name: d.name, poleA: d.poleA, poleB: d.poleB, leftPole: d.leftPole, relation: d.relation }));
const sts: StatementDef[] = stSeed.map((s) => ({ key: s.key, dimensionKey: s.dimension, direction: s.direction, text: s.text }));

/** Responde tudo "puxando" para um lado em todas as dimensões com associação. */
function answersToward(side: "left" | "right"): Record<string, Answer> {
  const out: Record<string, Answer> = {};
  for (const s of sts) {
    const d = dims.find((x) => x.key === s.dimensionKey)!;
    if (!d.leftPole) {
      out[s.key] = "depends";
      continue;
    }
    // concordar aproxima do polo A quando direction > 0
    const agreeGoesTo = s.direction > 0 ? "A" : "B";
    const wantPole = side === "left" ? d.leftPole : d.leftPole === "A" ? "B" : "A";
    out[s.key] = agreeGoesTo === wantPole ? "agree" : "disagree";
  }
  return out;
}

describe("overallSide", () => {
  it("respostas coerentes com um lado dão esse lado, com inclinação forte", () => {
    const l = overallSide(scoreAffinity(dims, sts, answersToward("left")))!;
    const r = overallSide(scoreAffinity(dims, sts, answersToward("right")))!;
    expect(l.side).toBe("esquerda");
    expect(r.side).toBe("direita");
    expect(l.strength).toBe("forte");
    expect(l.meter).toBeLessThan(10);
    expect(r.meter).toBeGreaterThan(90);
    // simetria: o mesmo peso para os dois lados
    expect(l.lean).toBeCloseTo(-r.lean, 5);
  });

  it("tudo 'depende' fica sem resultado (não há respostas decisivas)", () => {
    const all = Object.fromEntries(sts.map((s) => [s.key, "depends" as Answer]));
    expect(overallSide(scoreAffinity(dims, sts, all))).toBeNull();
  });

  it("respostas misturadas meio a meio ficam no centro", () => {
    const l = answersToward("left");
    const r = answersToward("right");
    const mixed: Record<string, Answer> = {};
    sts.forEach((s, i) => (mixed[s.key] = i % 2 === 0 ? l[s.key] : r[s.key]));
    const res = overallSide(scoreAffinity(dims, sts, mixed));
    expect(res).not.toBeNull();
    expect(Math.abs(res!.lean)).toBeLessThanOrEqual(CENTER_BAND);
    expect(res!.side).toBe("centro");
  });

  it("dimensões didáticas (sem associação) nunca mudam o resultado", () => {
    const base = answersToward("left");
    const none = dims.filter((d) => d.relation === "NONE").map((d) => d.key);
    const flipped = { ...base };
    for (const s of sts) if (none.includes(s.dimensionKey)) flipped[s.key] = "agree";
    expect(overallSide(scoreAffinity(dims, sts, flipped))!.lean).toBe(overallSide(scoreAffinity(dims, sts, base))!.lean);
  });
});

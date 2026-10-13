/**
 * Glossário tocável, texto falado/tempo estimado e o contrato da medição agregada.
 */
import { describe, expect, it } from "vitest";
import { glossary } from "../../content/glossary";
import { glossCtx, glossSegments } from "@/lib/glossary";
import { estimateSeconds, formatMinutes, sideSlideSpeech } from "@/lib/reel/speech";
import { metricPayload } from "@/lib/metrics/schema";

describe("glossário", () => {
  it("ids únicos, definições curtas (uma ou duas frases)", () => {
    expect(new Set(glossary.map((g) => g.id)).size).toBe(glossary.length);
    for (const g of glossary) {
      expect(g.definition.length, g.id).toBeLessThanOrEqual(200);
      expect(g.forms.length, g.id).toBeGreaterThan(0);
    }
  });

  it("marca termos com fronteira de palavra (acentos inclusos) e no máximo o limite por bloco", () => {
    const segs = glossSegments("A inflação e a dívida pública preocupam; a inflação de novo; e o PIB.", glossCtx(2));
    const marked = segs.filter((s) => s.entry).map((s) => s.text);
    expect(marked).toEqual(["inflação", "dívida pública"]);
    expect(segs.map((s) => s.text).join("")).toBe("A inflação e a dívida pública preocupam; a inflação de novo; e o PIB.");
  });

  it("não confunde pedaços de palavras nem caixa de termos exatos", () => {
    const segs = glossSegments("Os estados e o estadismo; a estatização.", glossCtx(5));
    expect(segs.some((s) => s.entry)).toBe(false); // "Estado" é exato (maiúsculo)
    expect(glossSegments("O Estado garante o SUS.", glossCtx(5)).filter((s) => s.entry).map((s) => s.text)).toEqual(["Estado", "SUS"]);
  });
});

describe("ouvir e tempo estimado", () => {
  it("texto falado tira a marcação e inclui os dois lados no contraponto", () => {
    const t = sideSlideSpeech(
      { key: "x", seg: 0, layer: "surface", kind: "counterpoint", prompt: "Pergunta?", thisSide: "A diz isso.", otherSide: "B responde aquilo.", n: 1, total: 1 },
      { sideName: "Esquerda", otherName: "Direita" },
    );
    expect(t).toContain("Esquerda diz: A diz isso.");
    expect(t).toContain("Direita responde: B responde aquilo.");
    expect(sideSlideSpeech({ key: "y", seg: 0, layer: "surface", kind: "text", body: "**Primeiro**, algo." }, { sideName: "E", otherName: "D" })).toBe("Primeiro, algo.");
  });

  it("estimativa cresce com o texto e telas interativas pedem mais tempo", () => {
    expect(estimateSeconds("um dois três", "lead")).toBeLessThan(estimateSeconds("um dois três", "pulse"));
    expect(estimateSeconds("a ".repeat(300), "text")).toBeGreaterThan(90);
    expect(formatMinutes(20)).toBe("~1 min");
    expect(formatMinutes(400)).toBe("~7 min");
  });
});

describe("medição agregada: contrato fechado", () => {
  it("aceita só chaves de tela, sem candidatura e sem texto livre", () => {
    expect(metricPayload.safeParse({ e: "reel_depth", k: "esquerda:argumentos-cover" }).success).toBe(true);
    expect(metricPayload.safeParse({ e: "reel_depth", k: "segundo-turno:r-saude" }).success).toBe(true);
    for (const k of ["cand:lula:r-saude", "lula:r-saude", "esquerda:Resposta livre", "esquerda:sim nao", "x"]) {
      expect(metricPayload.safeParse({ e: "reel_depth", k }).success, k).toBe(false);
    }
    expect(metricPayload.safeParse({ e: "answer", k: "esquerda:x" }).success).toBe(false);
  });
});

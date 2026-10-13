/**
 * Integridade e EQUILÍBRIO do acervo editorial inicial.
 * Estes testes falham se alguém quebrar referências ou desequilibrar a
 * estrutura entre as duas perspectivas.
 */
import { describe, expect, it } from "vitest";
import { sources } from "../../content/sources";
import { claims } from "../../content/claims";
import { currents } from "../../content/currents";
import { themes } from "../../content/themes";
import { timeline } from "../../content/timeline";
import { myths, curiosities } from "../../content/myths";
import { dimensions, statements } from "../../content/affinity";
import { esquerda } from "../../content/perspectives/esquerda";
import { direita } from "../../content/perspectives/direita";
import { candidates2026 } from "../../content/candidates-2026";
import { ROUNDS } from "@/lib/election";
import { blocksSchema, collectClaimKeys, collectCurrentSlugs, collectCuriositySlugs, collectStatementKeys, type Block } from "@/lib/content/blocks";

const sourceSlugs = new Set(sources.map((s) => s.slug));
const claimKeys = new Set(claims.map((c) => c.key));
const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

function chapterWords(blocks: Block[]): number {
  return blocks.reduce((sum, b) => sum + words(JSON.stringify(b)), 0);
}

describe("integridade das referências", () => {
  it("toda afirmação aponta para fontes existentes", () => {
    for (const c of claims) for (const s of c.sources) expect(sourceSlugs.has(s.slug), `${c.key} → ${s.slug}`).toBe(true);
  });

  it("identificadores são únicos", () => {
    expect(new Set(sources.map((s) => s.slug)).size).toBe(sources.length);
    expect(claimKeys.size).toBe(claims.length);
    expect(new Set(statements.map((s) => s.key)).size).toBe(statements.length);
  });

  it("nenhuma URL usa protocolo inseguro ou suspeito", () => {
    for (const s of sources) if (s.url) expect(s.url, s.slug).toMatch(/^https:\/\//);
  });

  it("capítulos validam no esquema e só referenciam itens existentes", () => {
    const st = new Set(statements.map((s) => s.key));
    const cu = new Set(currents.map((c) => c.slug));
    const cs = new Set(curiosities.map((c) => c.slug));
    for (const p of [esquerda, direita]) {
      for (const ch of p.chapters) {
        const blocks = blocksSchema.parse(ch.blocks);
        for (const k of collectClaimKeys(blocks)) expect(claimKeys.has(k), `${p.slug}/${ch.slug} → ${k}`).toBe(true);
        for (const k of collectStatementKeys(blocks)) expect(st.has(k), k).toBe(true);
        for (const k of collectCurrentSlugs(blocks)) expect(cu.has(k), k).toBe(true);
        for (const k of collectCuriositySlugs(blocks)) expect(cs.has(k), k).toBe(true);
      }
    }
  });

  it("temas, linha do tempo, mitos e afirmações do mapa referenciam afirmações existentes", () => {
    for (const t of themes) for (const k of [...(t.left.claimKeys ?? []), ...(t.right.claimKeys ?? [])]) expect(claimKeys.has(k), k).toBe(true);
    for (const e of timeline) if (e.claimKey) expect(claimKeys.has(e.claimKey), e.slug).toBe(true);
    for (const m of myths) for (const k of m.claimKeys) expect(claimKeys.has(k), k).toBe(true);
    for (const s of statements) for (const k of s.claimKeys ?? []) expect(claimKeys.has(k), k).toBe(true);
  });

  it("toda afirmação do mapa pertence a uma dimensão existente", () => {
    const d = new Set(dimensions.map((x) => x.key));
    for (const s of statements) expect(d.has(s.dimension), s.key).toBe(true);
  });
});

describe("equilíbrio estrutural entre as perspectivas", () => {
  it("mesmos capítulos, na mesma ordem", () => {
    expect(esquerda.chapters.map((c) => c.slug)).toEqual(direita.chapters.map((c) => c.slug));
    expect(esquerda.chapters.map((c) => c.kicker)).toEqual(direita.chapters.map((c) => c.kicker));
  });

  it("os dois lados têm capítulo de críticas com ao menos 5 críticas, cada uma com resposta dos defensores", () => {
    for (const p of [esquerda, direita]) {
      const ch = p.chapters.find((c) => c.slug === "criticas")!;
      const blocks = blocksSchema.parse(ch.blocks);
      const critiques = blocks.flatMap((b) => (b.type === "arguments" && b.kind === "CRITIQUE" ? b.items : []));
      expect(critiques.length, p.slug).toBeGreaterThanOrEqual(5);
      for (const c of critiques) expect(c.response, `${p.slug}/${c.id}`).toBeTruthy();
    }
  });

  it("extensão de cada capítulo é comparável entre os lados (diferença ≤ 30%)", () => {
    esquerda.chapters.forEach((ch, i) => {
      const a = chapterWords(blocksSchema.parse(ch.blocks));
      const b = chapterWords(blocksSchema.parse(direita.chapters[i].blocks));
      const ratio = Math.max(a, b) / Math.min(a, b);
      expect(ratio, `${ch.slug}: ${a} × ${b} palavras`).toBeLessThanOrEqual(1.3);
    });
  });

  it("número de argumentos favoráveis e críticas é próximo entre os lados", () => {
    const count = (p: typeof esquerda, kind: "PRO" | "CRITIQUE") =>
      p.chapters.flatMap((c) => blocksSchema.parse(c.blocks)).flatMap((b) => (b.type === "arguments" && b.kind === kind ? b.items : [])).length;
    for (const kind of ["PRO", "CRITIQUE"] as const) expect(Math.abs(count(esquerda, kind) - count(direita, kind)), kind).toBeLessThanOrEqual(1);
  });

  it("cada tema tem posição para os dois lados com a mesma estrutura", () => {
    for (const t of themes) {
      expect(t.left.points).toHaveLength(3);
      expect(t.right.points).toHaveLength(3);
      expect(t.left.nuances.length).toBeGreaterThan(20);
      expect(t.right.nuances.length).toBeGreaterThan(20);
    }
  });

  it("as reflexões finais têm o mesmo número de perguntas", () => {
    const n = (p: typeof esquerda) => collectStatementKeys(blocksSchema.parse(p.chapters.at(-1)!.blocks)).length;
    expect(n(esquerda)).toBe(n(direita));
  });
});

describe("camadas essencial × aprofundada", () => {
  it("os dois lados têm a MESMA sequência de blocos (tipo e camada) em cada capítulo", () => {
    esquerda.chapters.forEach((ch, i) => {
      const sig = (bs: unknown[]) => blocksSchema.parse(bs).map((b) => `${b.type}:${b.layer}`);
      expect(sig(ch.blocks), ch.slug).toEqual(sig(direita.chapters[i].blocks));
    });
  });

  it("todo capítulo tem exatamente 3 pontos em “Em 30 segundos”, curtos", () => {
    for (const p of [esquerda, direita]) for (const ch of p.chapters) {
      expect(ch.keyPoints, `${p.slug}/${ch.slug}`).toHaveLength(3);
      for (const k of ch.keyPoints) expect(k.length, k).toBeLessThanOrEqual(170);
    }
  });

  it("a camada essencial tem o mesmo número de argumentos e de críticas nos dois lados", () => {
    const count = (p: typeof esquerda, kind: "PRO" | "CRITIQUE") =>
      p.chapters.flatMap((c) => blocksSchema.parse(c.blocks)).flatMap((b) => (b.type === "arguments" && b.kind === kind && b.layer === "surface" ? b.items : [])).length;
    expect(count(esquerda, "PRO")).toBe(count(direita, "PRO"));
    expect(count(esquerda, "CRITIQUE")).toBe(count(direita, "CRITIQUE"));
  });
});

describe("2º turno: equilíbrio entre candidaturas", () => {
  it("cada candidatura tem exatamente uma proposta em destaque por rodada temática", () => {
    for (const c of candidates2026) {
      for (const r of ROUNDS) {
        const featured = c.proposals.filter((p) => p.themeSlug === r.slug && p.featured);
        expect(featured.length, `${c.slug}/${r.slug}`).toBe(1);
      }
    }
  });

  it("toda proposta tem trecho literal, página da fonte e crítica", () => {
    for (const c of candidates2026) for (const p of c.proposals) {
      expect(p.originalExcerpt.length, p.title).toBeGreaterThan(30);
      expect(p.sourceLocator, p.title).toMatch(/^p\. \d+/);
      expect(p.critiques.length, p.title).toBeGreaterThan(40);
      expect(p.implementationStatus).toBe("PROMISE");
    }
  });

  it("as fontes das candidaturas existem e são documentos registrados no TSE", () => {
    for (const c of candidates2026) {
      const src = sources.find((s) => s.slug === c.sourceSlug);
      expect(src?.url, c.slug).toMatch(/^https:\/\/www\.tse\.jus\.br\//);
    }
  });
});

describe("metodologia do mapa", () => {
  it("cada dimensão tem 3 afirmações com direções mistas (reduz viés de aquiescência)", () => {
    for (const d of dimensions) {
      const own = statements.filter((s) => s.dimension === d.key);
      expect(own, d.key).toHaveLength(3);
      expect(new Set(own.map((s) => s.direction)).size, d.key).toBe(2);
    }
  });

  it("dimensões didáticas não têm polo associado a nenhum lado", () => {
    for (const d of dimensions) if (d.relation === "NONE") expect(d.leftPole).toBeNull();
  });
});

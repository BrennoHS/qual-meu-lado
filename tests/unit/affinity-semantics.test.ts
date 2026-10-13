/**
 * Auditoria semântica do indicador de afinidade (não circular).
 * A tabela abaixo foi escrita LENDO O TEXTO de cada afirmação — não a partir
 * dos metadados. Se alguém trocar a direção de uma afirmação ou o polo de
 * uma dimensão, este teste falha.
 */
import { describe, expect, it } from "vitest";
import { dimensions, statements } from "../../content/affinity";
import { overallSide, scoreAffinity, type Answer } from "@/lib/affinity/score";

/** Responder SIM a esta afirmação aproxima de qual lado (na convenção usual da ciência política)? */
const SIM_APROXIMA_DE: Record<string, "esquerda" | "direita" | "nenhum"> = {
  "eco-credito-direcionado": "esquerda", // governo escolhe setores e crédito público
  "eco-impostos-empresas": "direita", // menos imposto para empresas
  "eco-estatais-estrategicas": "esquerda", // estatais em setores estratégicos
  "est-servicos-essenciais": "esquerda", // Estado mais presente nos serviços
  "est-menos-impostos": "direita", // menos imposto, menos serviço
  "est-parcerias": "direita", // gestão privada/OS de hospitais e escolas
  "cos-escolas-familias": "direita", // valores das famílias na escola
  "cos-casamento": "esquerda", // manter casamento entre pessoas do mesmo sexo
  "cos-religiao-leis": "direita", // religião como referência para leis
  "soc-tributar-ricos": "esquerda", // tributar mais quem ganha muito
  "soc-transferencias-temporarias": "direita", // benefícios temporários e mais rígidos
  "soc-cotas": "esquerda", // cotas sociais e raciais
  "seg-penas-duras": "direita", // penas mais duras
  "seg-programas-sociais": "esquerda", // prevenção com programas sociais
  "seg-maioridade": "direita", // reduzir maioridade penal
  "amb-floresta": "esquerda", // floresta acima da expansão agropecuária
  "amb-licenciamento": "direita", // licenciamento mais rápido
  "amb-petroleo": "esquerda", // limitar novas áreas de petróleo
  // Fora do indicador: mistura pautas dos dois lados ou não tem associação clássica.
  "lib-drogas": "nenhum",
  "lib-conteudo-internet": "nenhum",
  "lib-armas": "nenhum",
  "ins-tribunais": "nenhum",
  "ins-orgaos-controle": "nenhum",
  "ins-imprensa": "nenhum",
};

const dims = dimensions.map((d) => ({ key: d.key, name: d.name, poleA: d.poleA, poleB: d.poleB, leftPole: d.leftPole, relation: d.relation }));
const sts = statements.map((s) => ({ key: s.key, dimensionKey: s.dimension, direction: s.direction, text: s.text }));

describe("auditoria semântica do indicador", () => {
  it("a tabela cobre todas as afirmações", () => {
    expect(Object.keys(SIM_APROXIMA_DE).sort()).toEqual(statements.map((s) => s.key).sort());
  });

  it("metadados (direção + polo da dimensão) batem com o sentido do texto", () => {
    for (const s of statements) {
      const d = dimensions.find((x) => x.key === s.dimension)!;
      const expected = SIM_APROXIMA_DE[s.key];
      if (!d.leftPole || d.relation === "NONE") {
        expect(expected, s.key).toBe("nenhum");
        continue;
      }
      const pole = s.direction > 0 ? "A" : "B";
      expect(pole === d.leftPole ? "esquerda" : "direita", s.key).toBe(expected);
    }
  });

  for (const lado of ["esquerda", "direita"] as const) {
    it(`quem concorda com tudo que é "de ${lado}" e discorda do resto recebe ${lado}`, () => {
      const answers: Record<string, Answer> = {};
      for (const [k, v] of Object.entries(SIM_APROXIMA_DE)) answers[k] = v === "nenhum" ? "agree" : v === lado ? "agree" : "disagree";
      expect(overallSide(scoreAffinity(dims, sts, answers))?.side).toBe(lado);
    });
  }

  it("quem concorda com TUDO (viés de concordar) não vira automaticamente de um lado", () => {
    const all = Object.fromEntries(statements.map((s) => [s.key, "agree" as Answer]));
    expect(overallSide(scoreAffinity(dims, sts, all))?.side).toBe("centro");
  });
});

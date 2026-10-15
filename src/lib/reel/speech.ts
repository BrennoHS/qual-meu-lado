import { plainText } from "@/lib/richtext";
import type { CandidateSlide, CandidateSummary, SideSlide } from "./types";

/**
 * Texto falado de cada tela (para "Ouvir esta tela") e estimativa de tempo.
 * Funções puras: rodam no servidor (estimativa) e no navegador (leitura em voz alta).
 */

export function sideSlideSpeech(s: SideSlide, ctx: { sideName: string; otherName: string }): string {
  switch (s.kind) {
    case "cover":
      return `Capítulo ${s.number}: ${s.title}. Em trinta segundos: ${s.keyPoints.join(" ")}`;
    case "lead":
      return s.text;
    case "text":
      // o título só na primeira tela de um texto dividido; nos passos, o rótulo ("Depois")
      if (s.steps) return `${s.title ? `${s.title}. ` : ""}${s.steps.map((x) => `${x.label}. ${plainText(x.body)}`).join(" ")}`;
      return `${s.title && !s.part?.i ? `${s.title}. ` : ""}${plainText(s.body)}`;
    case "illustration":
      return [s.title, s.caption].filter(Boolean).join(". ");
    case "glossary":
      return `${s.title ?? "Palavras que vão aparecer"}. ${s.items.map((i) => `${i.term}: ${i.definition}`).join(" ")}`;
    case "fact":
      return `Fato com fonte: ${s.claim?.text ?? "informação em verificação."}`;
    case "curiosity":
      return `Você sabia? ${s.text}`;
    case "whose":
      return `De quem é essa ideia? Um jogo rápido: para cada frase, diga se ela é um argumento da esquerda ou da direita.`;
    case "example":
      return `${s.title}. ${plainText(s.body)}`;
    case "pulse":
      return `${s.prompt ?? "E você?"} ${s.statement.text} Responda: sim, não ou depende.`;
    case "conflict":
      return `Conflito de valores: ${s.title}. Situação: ${s.scenario} ${s.tension}`;
    case "argument":
      return `${s.argKind === "PRO" ? "Argumento a favor" : "Crítica"}: ${s.title}. ${s.body}`;
    case "counterpoint":
      return `${s.prompt} ${ctx.sideName} diz: ${s.thisSide} ${ctx.otherName} responde: ${s.otherSide}`;
    case "themes": {
      const first = s.items[0];
      return `${s.title}. Toque em um tema para ver a posição. ${first?.mine ? `${first.name}: ${first.mine.summary}` : ""}`;
    }
    case "explore":
      return `${s.title}. ${s.intro ?? ""}`;
    case "checkpoint":
      return `Capítulo ${s.number} concluído: ${s.title}.`;
    case "end":
      return `Fim da ${ctx.sideName.toLowerCase()}. Agora, o outro lado: conheça a ${ctx.otherName.toLowerCase()}.`;
  }
}

export function candidateSlideSpeech(s: CandidateSlide, c: CandidateSummary, rival: CandidateSummary): string {
  switch (s.kind) {
    case "cover":
      return `${c.ballotName}, número ${c.number ?? ""}, ${c.party}.${c.runningMate ? ` Vice: ${c.runningMate}.` : ""} Oito temas, uma proposta principal em cada.`;
    case "proposal":
      return s.p
        ? `${s.round.label}. ${s.round.question} ${c.ballotName} propõe: ${s.p.title}. ${s.p.plainSummary}`
        : `${s.round.label}. ${s.round.question} O plano registrado não traz uma proposta destacada neste tema.`;
    case "inside":
      return `Por dentro da proposta: ${s.p.title}. Problema que quer resolver: ${s.p.problem} Como seria feito: ${s.p.instruments}`;
    case "end":
      return `Você viu as oito rodadas de ${c.ballotName}. Agora, veja as propostas de ${rival.ballotName}.`;
  }
}

/** Telas em que a pessoa precisa agir: o modo "ouvir" para e espera. */
export const INTERACTIVE_KINDS = new Set(["pulse", "conflict", "themes", "whose"]);

const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

/** Segundos estimados: leitura a ~3 palavras/s + respiro; telas interativas pedem mais. */
export function estimateSeconds(text: string, kind: string): number {
  return Math.round(words(text) / 3 + 3 + (INTERACTIVE_KINDS.has(kind) || kind === "argument" || kind === "counterpoint" ? 8 : 0));
}

export function formatMinutes(seconds: number): string {
  const m = Math.max(1, Math.round(seconds / 60));
  return `~${m} min`;
}

import type { ClaimView, StatementView } from "@/lib/content/queries";
import type { ProposalView } from "@/components/candidates/proposal-card";
import type { Round } from "@/lib/election";

/**
 * Modelo do "reel": a jornada quebrada em telas curtas, uma ideia por tela.
 * Os dados são montados no servidor (a partir dos mesmos capítulos da leitura
 * completa) e renderizados no navegador. Nada é inventado aqui: cada slide
 * é um pedaço de um bloco editorial já publicado.
 */

export type IllustrationName = "hemicycle" | "congress" | "ballot" | "scale" | "crossroads" | "ladder" | "market" | "taxes" | "paycheck" | "powers" | "dialogue";

/** secs: tempo estimado da tela (leitura + interação), calculado no servidor. */
type Base = { key: string; seg: number; layer: "surface" | "deep"; secs?: number };

export type SideSlide = Base &
  (
    | {
        kind: "cover";
        number: number;
        kicker: string;
        title: string;
        summary: string;
        keyPoints: string[];
        fullHref: string;
        counterpart: { sideSlug: string; sideName: string; title: string; keyPoints: string[] } | null;
      }
    | { kind: "lead"; text: string }
    | { kind: "text"; title?: string; body: string }
    | { kind: "illustration"; name: IllustrationName; title?: string; caption?: string }
    | { kind: "glossary"; title?: string; items: { term: string; definition: string }[] }
    | { kind: "fact"; title?: string; claim: ClaimView | null }
    | { kind: "curiosity"; text: string; claim: ClaimView | null }
    | { kind: "example"; title: string; body: string }
    | { kind: "pulse"; statement: StatementView; prompt?: string }
    | { kind: "conflict"; title: string; values: [string, string]; scenario: string; tension: string }
    | {
        kind: "argument";
        argKind: "PRO" | "CRITIQUE";
        title: string;
        body: string;
        response?: string;
        limits?: string;
        claim: ClaimView | null;
        n: number;
        total: number;
      }
    | { kind: "counterpoint"; prompt: string; thisSide: string; otherSide: string; n: number; total: number }
    | {
        kind: "themes";
        title: string;
        intro?: string;
        fullHref: string;
        items: {
          slug: string;
          name: string;
          description: string;
          mine: { summary: string; points: string[]; nuances: string } | null;
          other: { summary: string; points: string[]; nuances: string } | null;
        }[];
      }
    | { kind: "explore"; title: string; intro?: string; chips: string[]; href: string; label: string }
    | { kind: "checkpoint"; number: number; chapterSlug: string; title: string; fullHref: string; nextTitle: string | null }
    | { kind: "end" }
  );

export type SideReelData = {
  side: "esquerda" | "direita";
  sideName: string;
  other: { slug: "esquerda" | "direita"; name: string };
  chapters: { slug: string; number: number; title: string; kicker: string }[];
  slides: SideSlide[];
};

export type CandidateSummary = {
  slug: string;
  ballotName: string;
  name: string;
  party: string;
  partyAcronym: string;
  number: number | null;
  runningMate: string | null;
  coalition: string | null;
};

export type CandidateSlide = Base &
  (
    | { kind: "cover" }
    | { kind: "proposal"; round: Round; p: ProposalView | null; rival: ProposalView | null; more: number }
    | { kind: "inside"; round: Round; p: ProposalView; others: ProposalView[] }
    | { kind: "end" }
  );

export type CandidateReelData = {
  candidate: CandidateSummary;
  rival: CandidateSummary;
  planUrl: string | null;
  slides: CandidateSlide[];
};

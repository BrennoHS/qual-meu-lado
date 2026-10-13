import type { Metadata } from "next";
import { getCurrentElection, getThemes } from "@/lib/content/queries";
import { toProposalView } from "@/lib/content/candidates";
import { PageFrame } from "@/components/site/page-frame";
import { DemoNotice } from "@/components/candidates/demo-notice";
import { Comparator } from "./comparator";
import { ROUNDS } from "@/lib/election";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Comparador de propostas",
  description: "Escolha manualmente duas ou mais candidaturas e compare suas propostas documentadas, tema por tema. Sem nota, sem ranking, sem recomendação.",
  alternates: { canonical: "/quem-defende-o-que/comparar" },
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const [election, themes] = await Promise.all([getCurrentElection(), getThemes()]);
  const themeNames = Object.fromEntries(themes.map((t) => [t.slug, t.name]));
  const candidates = (election?.candidates ?? []).map((cand) => ({
    slug: cand.slug,
    ballotName: cand.ballotName,
    partyAcronym: cand.partyAcronym,
    isDemo: cand.isDemo,
    proposals: cand.proposals.map((p) => toProposalView(p, themeNames)),
  }));
  const initial = (c ?? "").split(",").filter((s) => candidates.some((x) => x.slug === s));

  return (
    <PageFrame kicker="Quem defende o quê?" title="Comparador" lead="Você escolhe quem comparar. O site não atribui nota, não indica a candidatura “mais adequada” e não ordena por preferência.">
      {candidates.some((x) => x.isDemo) && <DemoNotice className="mb-10" />}
      <Comparator candidates={candidates} themes={ROUNDS.map((r) => ({ slug: r.slug, name: r.label }))} initial={initial} />
    </PageFrame>
  );
}

import type { Metadata } from "next";
import { getAffinityModel, getPerspectives } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { JourneySummary } from "./journey-summary";

export const revalidate = 300;
export const metadata: Metadata = { title: "Seu percurso", robots: { index: false } };

export default async function JourneyPage() {
  const [perspectives, { statements }] = await Promise.all([getPerspectives(), getAffinityModel()]);
  const sides = perspectives.map((p) => ({ slug: p.slug, name: p.name, chapters: p.chapters }));
  return (
    <PageFrame kicker="Seu mapa de ideias" title="Seu percurso" lead="Um resumo do que você explorou e respondeu. Sem pontuações, sem rótulos — e visível apenas para você.">
      <JourneySummary sides={sides} statements={statements} />
    </PageFrame>
  );
}

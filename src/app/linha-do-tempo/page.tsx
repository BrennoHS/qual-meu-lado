import type { Metadata } from "next";
import { getClaims, getTimeline } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { TimelineView } from "@/components/walkthrough/timeline-view";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Linha do tempo",
  description: "A evolução da esquerda, da direita e do centro, no Brasil e no mundo, de 1776 a hoje — cada evento com sua fonte.",
  alternates: { canonical: "/linha-do-tempo" },
};

export default async function TimelinePage() {
  const events = await getTimeline();
  const claims = await getClaims(events.flatMap((e) => (e.claimKey ? [e.claimKey] : [])));
  return (
    <PageFrame kicker="Linha do tempo viva" title="De 1789 a hoje" lead="Acontecimentos brasileiros e internacionais que moldaram esquerda, direita e centro. Filtre, toque em um evento e confira a fonte.">
      <div className="max-w-3xl">
        <TimelineView events={events.map((e) => ({ ...e, scope: e.scope as "BRAZIL" | "INTERNATIONAL" }))} claims={claims} />
      </div>
    </PageFrame>
  );
}

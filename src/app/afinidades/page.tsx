import type { Metadata } from "next";
import { getAffinityModel, getClaims, interleaveStatements } from "@/lib/content/queries";
import { YesNoFlow } from "@/components/affinity/yes-no-flow";
import { SiteHeader } from "@/components/site/site-header";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Teste de afinidade política",
  description: "Com que lado você se identifica mais? 24 afirmações, sim ou não, em 4 minutos. Indicador individual, calculado só no seu navegador.",
  alternates: { canonical: "/afinidades" },
};

export default async function AffinityPage({ searchParams }: { searchParams: Promise<{ revisar?: string }> }) {
  const { revisar } = await searchParams;
  const { statements } = await getAffinityModel();
  const ordered = interleaveStatements(statements);
  const claims = await getClaims(ordered.flatMap((s) => s.claimKeys));
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        {ordered.length === 0 ? (
          <p role="status" className="wrap py-20 text-ash">As afirmações estão em revisão editorial. Volte em breve.</p>
        ) : (
          <YesNoFlow statements={ordered} claims={claims} startKey={typeof revisar === "string" ? revisar : undefined} />
        )}
      </main>
    </>
  );
}

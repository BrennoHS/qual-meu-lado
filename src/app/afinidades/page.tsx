import type { Metadata } from "next";
import { getAffinityModel, getClaims, interleaveStatements } from "@/lib/content/queries";
import { YesNoFlow } from "@/components/affinity/yes-no-flow";
import { SiteHeader } from "@/components/site/site-header";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Teste político: você é de esquerda, de direita ou de centro?",
  description: "Descubra com que lado você se identifica mais: 24 afirmações rápidas (sim, não ou depende), em 4 minutos e sem cadastro. Metodologia aberta, respostas só no seu celular.",
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

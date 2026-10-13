import type { Metadata } from "next";
import { getAffinityModel } from "@/lib/content/queries";
import { AffinityResult } from "@/components/affinity/affinity-result";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Seu indicador de afinidade",
  description: "Com que lado suas respostas se identificam mais — um indicador individual, com metodologia explícita. Calculado apenas no seu navegador.",
  robots: { index: false },
};

export default async function ResultPage() {
  const { dimensions, statements } = await getAffinityModel();
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <AffinityResult dimensions={dimensions} statements={statements} />
      </main>
      <SiteFooter />
    </>
  );
}

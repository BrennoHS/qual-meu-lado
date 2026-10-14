import type { Metadata } from "next";
import { getMyths } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { MythDeck } from "@/components/myths/myth-deck";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Mitos e realidades",
  description: "Afirmações comuns sobre política: confirmadas, falsas, parcialmente verdadeiras, dependentes de contexto ou sem evidências suficientes — com fontes.",
  alternates: { canonical: "/mitos" },
};

export default async function MythsPage() {
  const { myths, claims } = await getMyths();
  return (
    <PageFrame
      kicker="Mitos e realidades"
      title="É fato?"
      lead="Uma afirmação por vez: dê seu palpite antes de ver a explicação. Não há placar — o objetivo é conferir o raciocínio e as fontes. Afirmações falsas não são tratadas como “o outro lado” de um debate."
      narrow
    >
      <MythDeck myths={myths} claims={claims} />
    </PageFrame>
  );
}

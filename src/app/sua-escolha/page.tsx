import type { Metadata } from "next";
import { PageFrame } from "@/components/site/page-frame";
import { ChoiceExperience } from "./choice";

export const metadata: Metadata = { title: "Com suas palavras", description: "Diga você mesmo com que lado se sente mais perto — independentemente do indicador. Só para você.", robots: { index: false } };

export default function ChoicePage() {
  return (
    <PageFrame kicker="Com suas palavras" title="Com que lado você se identifica?" lead="O indicador de afinidade compara suas respostas com as ideias de cada lado. Aqui é diferente: é você quem diz — mesmo que discorde do indicador.">
      <ChoiceExperience />
    </PageFrame>
  );
}

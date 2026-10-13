import type { Metadata } from "next";
import { PageFrame } from "@/components/site/page-frame";
import { ContactCards } from "@/components/site/contact-cards";
import { ReportForm } from "./report-form";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do DOIS LADOS: apoio institucional, imprensa, escolas, parcerias — ou reporte um erro de conteúdo.",
  alternates: { canonical: "/contato" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <PageFrame kicker="Contato" title="Fale com a gente" lead="Apoio institucional, imprensa, escolas e parcerias — ou um erro que você encontrou no conteúdo." narrow>
      <ContactCards />
      <section id="formulario" aria-labelledby="erro" className="mt-14 scroll-mt-20 border-t border-line pt-10">
        <h2 id="erro" className="h-section">Encontrou um erro?</h2>
        <p className="mb-6 mt-3 text-paper/80">
          Relatos são lidos pela equipe editorial. Correções relevantes são publicadas no registro de correções, com data e descrição.
        </p>
        <ReportForm refKey={typeof ref === "string" ? ref.slice(0, 120) : undefined} />
      </section>
    </PageFrame>
  );
}

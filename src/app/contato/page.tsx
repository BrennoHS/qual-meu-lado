import type { Metadata } from "next";
import { PageFrame } from "@/components/site/page-frame";
import { ReportForm } from "./report-form";

export const metadata: Metadata = { title: "Reportar erro / contato", alternates: { canonical: "/contato" } };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <PageFrame
      kicker="Revisão de informações"
      title="Encontrou um erro?"
      lead="Relatos são lidos pela equipe editorial. Correções relevantes são publicadas no registro de correções, com data e descrição."
      narrow
    >
      <ReportForm refKey={typeof ref === "string" ? ref.slice(0, 120) : undefined} />
    </PageFrame>
  );
}

import type { Metadata } from "next";
import { getSources } from "@/lib/content/queries";
import { PageFrame } from "@/components/site/page-frame";
import { SourceLibrary } from "./source-library";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Biblioteca de fontes",
  description: "Todas as fontes usadas no DOIS LADOS: legislação, dados oficiais, obras acadêmicas e jornalismo, com estado de verificação de cada link.",
  alternates: { canonical: "/fontes" },
};

export default async function SourcesPage() {
  const sources = await getSources();
  return (
    <PageFrame
      kicker="Verificabilidade"
      title="Fontes"
      lead="Priorizamos legislação e dados oficiais, depois literatura acadêmica e, como complemento, jornalismo profissional. Documentos de campanha são fonte do que foi prometido — não prova de viabilidade."
    >
      <SourceLibrary
        sources={sources.map((s) => ({
          slug: s.slug,
          title: s.title,
          url: s.url,
          institution: s.institution,
          author: s.author,
          kind: s.kind,
          publishedLabel: s.publishedLabel,
          linkStatus: s.linkStatus,
          linkCheckedAt: s.linkCheckedAt?.toISOString() ?? null,
          isDemo: s.isDemo,
          uses: s._count.claims,
        }))}
      />
    </PageFrame>
  );
}

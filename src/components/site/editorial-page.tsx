import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/content/queries";
import { RichText, plainText } from "@/lib/richtext";
import { PageFrame } from "./page-frame";
import { formatDate } from "@/lib/labels";

/** Páginas institucionais editáveis no painel (modelo Page). */
export async function editorialMetadata(slug: string): Promise<Metadata> {
  const p = await getPage(slug);
  return p ? { title: p.title, description: plainText(p.summary), alternates: { canonical: `/${slug}` } } : {};
}

export async function EditorialPage({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const page = await getPage(slug);
  if (!page) notFound();
  return (
    <PageFrame kicker="DOIS LADOS" title={page.title} lead={page.summary} narrow>
      <RichText text={page.body} />
      {children}
      <p className="mt-12 font-mono text-xs text-ash">Atualizado em {formatDate(page.updatedAt)}</p>
    </PageFrame>
  );
}

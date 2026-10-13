import type { Metadata } from "next";
import { getChapterBundle } from "@/lib/content/queries";
import { ChapterView } from "@/components/walkthrough/chapter-view";
import { JsonLd, SITE_URL, breadcrumbs } from "@/components/seo/json-ld";
import { chapterSearchTitle } from "@/lib/seo";

export const revalidate = 300;

type Params = { lado: string; capitulo: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lado, capitulo } = await params;
  const b = await getChapterBundle(lado, capitulo);
  if (!b) return {};
  const search = lado === "esquerda" || lado === "direita" ? chapterSearchTitle(capitulo, lado) : null;
  const title = search ? `${search} — ${b.chapter.title}` : `${b.perspective.name} · ${b.chapter.kicker} — ${b.chapter.title}`;
  const description = `${b.chapter.summary} Em linguagem simples, com fontes — e com a resposta do outro lado.`;
  return {
    title,
    description,
    alternates: { canonical: `/explorar/${lado}/${capitulo}` },
    openGraph: { type: "article", title, description, images: [{ url: `/og/capitulo/${capitulo}`, width: 1200, height: 630 }] },
  };
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { lado, capitulo } = await params;
  const b = await getChapterBundle(lado, capitulo);
  const search = b && (lado === "esquerda" || lado === "direita") ? chapterSearchTitle(capitulo, lado) : null;
  return (
    <>
      {b && (
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: search ?? b.chapter.title,
              alternativeHeadline: b.chapter.title,
              description: b.chapter.summary,
              inLanguage: "pt-BR",
              isAccessibleForFree: true,
              dateModified: b.chapter.updatedAt,
              mainEntityOfPage: `${SITE_URL}/explorar/${lado}/${capitulo}`,
              image: `${SITE_URL}/og/capitulo/${capitulo}`,
              author: { "@type": "Organization", name: "DOIS LADOS", url: SITE_URL },
              publisher: { "@type": "Organization", name: "DOIS LADOS", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` } },
            },
            breadcrumbs([
              { name: "DOIS LADOS", path: "/" },
              { name: b.perspective.name, path: `/explorar/${lado}` },
              { name: b.chapter.title, path: `/explorar/${lado}/${capitulo}` },
            ]),
          ]}
        />
      )}
      <ChapterView lado={lado} capitulo={capitulo} />
    </>
  );
}

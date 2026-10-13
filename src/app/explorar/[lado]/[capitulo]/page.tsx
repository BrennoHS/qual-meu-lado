import type { Metadata } from "next";
import { getChapterBundle } from "@/lib/content/queries";
import { ChapterView } from "@/components/walkthrough/chapter-view";

export const revalidate = 300;

type Params = { lado: string; capitulo: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lado, capitulo } = await params;
  const b = await getChapterBundle(lado, capitulo);
  if (!b) return {};
  const title = `${b.perspective.name} · ${b.chapter.kicker} — ${b.chapter.title}`;
  return { title, description: b.chapter.summary, alternates: { canonical: `/explorar/${lado}/${capitulo}` }, openGraph: { title, description: b.chapter.summary, images: [{ url: `/og/capitulo/${capitulo}`, width: 1200, height: 630 }] } };
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { lado, capitulo } = await params;
  return <ChapterView lado={lado} capitulo={capitulo} />;
}

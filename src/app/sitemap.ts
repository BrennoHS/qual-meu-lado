import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";

export const revalidate = 3600;

/** Portas de entrada principais (o que mais queremos que o Google mostre). */
const CORE = new Set(["", "/explorar/esquerda", "/explorar/direita", "/afinidades", "/temas", "/segundo-turno", "/glossario"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const visible = { status: { in: PUBLIC_STATUSES } };
  const [chapters, themes, candidates] = await Promise.all([
    db.chapter.findMany({ where: visible, select: { slug: true, updatedAt: true, perspective: { select: { slug: true } } } }),
    db.theme.findMany({ where: visible, select: { slug: true, updatedAt: true } }),
    db.candidate.findMany({ where: visible, select: { slug: true, updatedAt: true } }),
  ]);
  const fixed = ["", "/explorar/esquerda", "/explorar/direita", "/afinidades", "/temas", "/linha-do-tempo", "/mitos", "/glossario", "/segundo-turno", "/fontes", "/creditos", "/apoie", "/anuncie", "/como-funciona", "/como-construimos", "/politica-editorial", "/correcoes", "/privacidade", "/termos", "/contato"];
  return [
    ...fixed.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: CORE.has(p) ? 1 : 0.5 })),
    ...chapters.map((c) => ({ url: `${base}/explorar/${c.perspective.slug}/${c.slug}`, lastModified: c.updatedAt })),
    ...themes.map((t) => ({ url: `${base}/temas/${t.slug}`, lastModified: t.updatedAt })),
    ...candidates.map((c) => ({ url: `${base}/segundo-turno/${c.slug}`, lastModified: c.updatedAt })),
  ];
}

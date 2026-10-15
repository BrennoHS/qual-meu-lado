import { db } from "@/lib/db";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";
import { getClaims } from "@/lib/content/queries";
import { shareCard, sourceLine } from "@/lib/og-share";

export const revalidate = 3600;

/** Card de um "Você sabia?" (?formato=story → 1080×1920 com QR). */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return new Response("Parâmetro inválido", { status: 400 });
  const c = await db.curiosity.findFirst({ where: { slug, status: { in: PUBLIC_STATUSES } } });
  if (!c) return new Response("Não encontrado", { status: 404 });
  const claim = c.claimKey ? (await getClaims([c.claimKey]))[c.claimKey] : null;
  const story = new URL(req.url).searchParams.get("formato") === "story";
  return shareCard({ kicker: "VOCÊ SABIA?", text: c.text, foot: claim ? sourceLine(claim.sources) : null, path: `/sabia/${slug}`, story });
}

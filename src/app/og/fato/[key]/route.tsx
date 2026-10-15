import { getClaims } from "@/lib/content/queries";
import { shareCard, sourceLine } from "@/lib/og-share";

export const revalidate = 3600;

/** Card de um "Fato com fonte" (?formato=story → 1080×1920 com QR). */
export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^[a-z0-9-]{1,80}$/.test(key)) return new Response("Parâmetro inválido", { status: 400 });
  const claim = (await getClaims([key]))[key];
  if (!claim || claim.isDemo) return new Response("Não encontrado", { status: 404 });
  const story = new URL(req.url).searchParams.get("formato") === "story";
  return shareCard({ kicker: "FATO COM FONTE", text: claim.text, foot: sourceLine(claim.sources), path: `/fato/${key}`, story });
}

import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { PUBLIC_STATUSES } from "@/lib/editorial/status";
import { clip, OG_SIZE, ogFonts } from "@/lib/og";

export const revalidate = 300;

/** Prévia de compartilhamento de um capítulo: SEMPRE os dois lados, lado a lado, com o mesmo peso. */
export async function GET(_req: Request, { params }: { params: Promise<{ capitulo: string }> }) {
  const { capitulo } = await params;
  if (!/^[a-z0-9-]{1,60}$/.test(capitulo)) return new Response("Parâmetro inválido", { status: 400 });
  const rows = await db.chapter.findMany({
    where: { slug: capitulo, status: { in: PUBLIC_STATUSES } },
    select: { number: true, title: true, kicker: true, keyPoints: true, perspective: { select: { side: true, name: true } } },
  });
  const left = rows.find((r) => r.perspective.side === "LEFT");
  const right = rows.find((r) => r.perspective.side === "RIGHT");
  if (!left || !right) return new Response("Não encontrado", { status: 404 });

  const half = (r: typeof left, bg: string, ink: string, align: "flex-start" | "flex-end") => (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: align, width: "50%", height: "100%", padding: "56px 52px", background: bg, textAlign: align === "flex-start" ? "left" : "right" }}>
      <div style={{ fontSize: 22, letterSpacing: 4, color: ink, fontWeight: 700 }}>{r.perspective.name.toUpperCase()}</div>
      <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.02, marginTop: 14, color: "#f5f3ee" }}>{clip(r.title, 40)}</div>
      <div style={{ fontSize: 24, lineHeight: 1.3, marginTop: 18, color: "rgba(245,243,238,0.85)" }}>{clip(r.keyPoints[0] ?? "", 120)}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", fontFamily: "SG", background: "#111318" }}>
        {half(left, "linear-gradient(160deg, #641c27 0%, #2a1217 60%, #111318 100%)", "#f08a91", "flex-start")}
        {half(right, "linear-gradient(200deg, #142d59 0%, #111c33 60%, #111318 100%)", "#8db0f0", "flex-end")}
        <div style={{ position: "absolute", left: 599, top: 0, width: 2, height: "100%", background: "#f5f3ee" }} />
        <div style={{ position: "absolute", top: 40, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", background: "#111318", border: "1px solid rgba(245,243,238,0.4)", borderRadius: 999, color: "#f5f3ee", fontSize: 22 }}>
            <span style={{ fontWeight: 700, letterSpacing: 3 }}>DOIS LADOS</span>
            <span style={{ color: "#a8abb4" }}>· Capítulo {left.number} · {left.kicker}</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}

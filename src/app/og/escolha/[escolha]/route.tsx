import { ImageResponse } from "next/og";
import { CHOICE_SHARE, isChoiceSlug } from "@/lib/choice";
import { ogFonts } from "@/lib/og";

export const revalidate = 3600;

const BG = {
  esquerda: "linear-gradient(160deg, #641c27 0%, #2a1217 60%, #111318 100%)",
  direita: "linear-gradient(200deg, #142d59 0%, #111c33 60%, #111318 100%)",
  ambos: "linear-gradient(90deg, #4a1820 0%, #1a1d25 50%, #13254a 100%)",
  neutral: "linear-gradient(180deg, #2b303c 0%, #111318 100%)",
} as const;
const INK = { esquerda: "#f08a91", direita: "#8db0f0", ambos: "#f5f3ee", neutral: "#7cc7b2" } as const;

/**
 * Imagem que a PRÓPRIA pessoa escolhe compartilhar ("Sua escolha").
 * Só a frase do lado — nada de respostas, mapa, nome ou candidatura.
 * ?formato=story → 1080×1920 (stories); padrão 1200×630 (WhatsApp/links).
 */
export async function GET(req: Request, { params }: { params: Promise<{ escolha: string }> }) {
  const { escolha } = await params;
  if (!isChoiceSlug(escolha)) return new Response("Não encontrado", { status: 404 });
  const c = CHOICE_SHARE[escolha];
  const story = new URL(req.url).searchParams.get("formato") === "story";
  const W = story ? 1080 : 1200;
  const H = story ? 1920 : 630;
  const s = story ? 1.75 : 1;

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: `${70 * s}px ${64 * s}px`, background: BG[c.tone], fontFamily: "SG", color: "#f5f3ee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 * s }}>
          <div style={{ display: "flex", width: 26 * s, height: 26 * s, borderRadius: 999, overflow: "hidden", border: "2px solid #f5f3ee" }}>
            <div style={{ width: "50%", height: "100%", background: "#b72e38" }} />
            <div style={{ width: "50%", height: "100%", background: "#2455a4" }} />
          </div>
          <div style={{ fontSize: 24 * s, fontWeight: 700, letterSpacing: 4 }}>DOIS LADOS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26 * s, letterSpacing: 3, color: INK[c.tone], fontWeight: 700 }}>{c.headline.toUpperCase()}</div>
          <div style={{ fontSize: (story ? 50 : 52) * s, fontWeight: 700, lineHeight: 1.08, marginTop: 22 * s, maxWidth: story ? 940 : 1060 }}>{`“${c.belief}”`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: story ? "column" : "row", gap: story ? 12 : 0, justifyContent: "space-between", alignItems: story ? "flex-start" : "flex-end", fontSize: 22 * s, color: "rgba(245,243,238,0.75)" }}>
          <span>E você? Faça o teste de afinidade · DOIS LADOS</span>
          <span style={{ fontSize: 18 * s, color: "rgba(245,243,238,0.5)" }}>Os dois lados, com fontes.</span>
        </div>
      </div>
    ),
    { width: W, height: H, fonts: await ogFonts() },
  );
}

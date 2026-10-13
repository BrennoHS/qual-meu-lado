import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { clampMeter, identifyPrefix, isSideSlug, SIDE_SHARE, siteHost } from "@/lib/choice";
import { ogFonts } from "@/lib/og";

export const revalidate = 3600;

const BG = {
  esquerda: "linear-gradient(165deg, #b72e38 0%, #641c27 45%, #1a0d10 100%)",
  direita: "linear-gradient(195deg, #2455a4 0%, #142d59 45%, #0b1226 100%)",
  centro: "linear-gradient(135deg, #8e2a35 0%, #3a2742 50%, #1f3f7a 100%)",
} as const;

/**
 * Card do indicador de afinidade que a PRÓPRIA pessoa decide compartilhar:
 * com que lado ela se identifica mais, a posição no trilho e a frase.
 * Nada de respostas. É individual: não é pesquisa, nem previsão de voto.
 * Quem vê o card sabe onde fazer o teste (marca + endereço + QR code).
 * ?p=0..100 (posição) · ?formato=story → 1080×1920.
 */
export async function GET(req: Request, { params }: { params: Promise<{ lado: string }> }) {
  const { lado } = await params;
  if (!isSideSlug(lado)) return new Response("Não encontrado", { status: 404 });
  const url = new URL(req.url);
  const story = url.searchParams.get("formato") === "story";
  const meter = clampMeter(url.searchParams.get("p") ?? (lado === "esquerda" ? 20 : lado === "direita" ? 80 : 50));
  const c = SIDE_SHARE[lado];
  const host = siteHost();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;
  const qr = story ? await QRCode.toDataURL(`${siteUrl.replace(/\/$/, "")}/afinidades`, { margin: 1, width: 240, color: { dark: "#111318", light: "#f5f3ee" } }) : null;
  const W = story ? 1080 : 1200;
  const H = story ? 1920 : 630;
  const trackW = story ? 900 : 520;
  const prefix = identifyPrefix(lado).toUpperCase();

  const brand = (size: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.5 }}>
      <div style={{ display: "flex", width: size, height: size, borderRadius: 999, overflow: "hidden", border: `${Math.max(2, size / 12)}px solid #f5f3ee` }}>
        <div style={{ width: "50%", height: "100%", background: "#b72e38" }} />
        <div style={{ width: "50%", height: "100%", background: "#2455a4" }} />
      </div>
      <div style={{ display: "flex", fontSize: size * 0.95, fontWeight: 700, letterSpacing: size * 0.12 }}>DOIS LADOS</div>
    </div>
  );

  const meterBlock = (
    <div style={{ display: "flex", flexDirection: "column", width: trackW }}>
      <div style={{ display: "flex", position: "relative", width: trackW, height: story ? 22 : 14, borderRadius: 999, background: "linear-gradient(90deg, #f08a91 0%, #f5f3ee 50%, #8db0f0 100%)" }}>
        <div style={{ position: "absolute", left: (meter / 100) * trackW - (story ? 26 : 16), top: story ? -15 : -9, width: story ? 52 : 32, height: story ? 52 : 32, borderRadius: 999, background: "#111318", border: `${story ? 7 : 5}px solid #f5f3ee` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: story ? 26 : 14, fontSize: story ? 30 : 18, letterSpacing: 3, color: "rgba(245,243,238,0.8)", fontWeight: 700 }}>
        <span>ESQUERDA</span>
        <span>CENTRO</span>
        <span>DIREITA</span>
      </div>
    </div>
  );

  return new ImageResponse(
    story ? (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%", padding: "100px 90px 90px", background: BG[lado], fontFamily: "SG", color: "#f5f3ee", textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {brand(46)}
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, opacity: 0.8 }}>TESTE DE AFINIDADE POLÍTICA</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 40, letterSpacing: 6, fontWeight: 700, opacity: 0.9 }}>{prefix}</div>
          <div style={{ display: "flex", fontSize: 220, fontWeight: 700, lineHeight: 1, marginTop: 18, letterSpacing: -6 }}>{c.word}</div>
          <div style={{ display: "flex", marginTop: 80 }}>{meterBlock}</div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 700, lineHeight: 1.15, marginTop: 90, maxWidth: 900 }}>{`“${c.belief}”`}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36, padding: "26px 34px", background: "rgba(17,19,24,0.55)", borderRadius: 36, border: "2px solid rgba(245,243,238,0.35)" }}>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} width={170} height={170} style={{ borderRadius: 14 }} alt="" />
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>E você? Faça o teste</div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: c.ink, marginTop: 6 }}>{host}</div>
            <div style={{ display: "flex", fontSize: 24, opacity: 0.75, marginTop: 10 }}>Grátis · 4 minutos · nada sai do seu celular</div>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ display: "flex", width: "100%", height: "100%", padding: "52px 64px", background: BG[lado], fontFamily: "SG", color: "#f5f3ee" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {brand(26)}
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, opacity: 0.85 }}>TESTE DE AFINIDADE POLÍTICA</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, fontWeight: 700, opacity: 0.9 }}>{prefix}</div>
            <div style={{ display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>{c.word}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {meterBlock}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ display: "flex", fontSize: 24, fontWeight: 700, padding: "12px 26px", background: "#f5f3ee", color: "#111318", borderRadius: 999 }}>E você? Faça o teste</div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700, marginTop: 10 }}>{host}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts: await ogFonts() },
  );
}

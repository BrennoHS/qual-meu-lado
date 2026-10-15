import "server-only";
import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { siteHost } from "@/lib/choice";
import { clip, ogFonts } from "@/lib/og";

/**
 * Card compartilhável de um "Você sabia?" ou de um "Fato com fonte":
 * a frase em destaque, a fonte, a marca e onde ver mais (endereço; QR no
 * formato stories). Neutro: as duas cores dos lados aparecem em peso igual.
 */
export async function shareCard({ kicker, text, foot, path, story }: { kicker: string; text: string; foot: string | null; path: string; story: boolean }) {
  const host = siteHost();
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const qr = story ? await QRCode.toDataURL(`${base}${path}`, { margin: 1, width: 240, color: { dark: "#111318", light: "#f5f3ee" } }) : null;
  const body = clip(text, story ? 300 : 210);
  const size = story ? (body.length > 200 ? 54 : body.length > 120 ? 64 : 76) : body.length > 150 ? 38 : body.length > 90 ? 46 : 54;
  // cor e gradientes em campos separados (o gerador de imagens não aceita misturar)
  const bg = {
    backgroundColor: "#111318",
    backgroundImage: "radial-gradient(60% 45% at 0% 0%, rgba(183,46,56,0.55), transparent 70%), radial-gradient(60% 45% at 100% 100%, rgba(36,85,164,0.55), transparent 70%)",
  };

  const brand = (s: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: s * 0.5 }}>
      <div style={{ display: "flex", width: s, height: s, borderRadius: 999, overflow: "hidden", border: `${Math.max(2, s / 12)}px solid #f5f3ee` }}>
        <div style={{ width: "50%", height: "100%", background: "#b72e38" }} />
        <div style={{ width: "50%", height: "100%", background: "#2455a4" }} />
      </div>
      <div style={{ display: "flex", fontSize: s * 0.95, fontWeight: 700, letterSpacing: s * 0.12 }}>DOIS LADOS</div>
    </div>
  );
  const stamp = (fs: number) => (
    <div style={{ display: "flex", alignSelf: "flex-start", padding: `${fs * 0.35}px ${fs * 0.7}px`, border: `${Math.max(2, fs / 9)}px solid #f5f3ee`, fontSize: fs, fontWeight: 700, letterSpacing: fs * 0.18, transform: "rotate(-2deg)" }}>{kicker}</div>
  );

  return new ImageResponse(
    story ? (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "100px 90px 90px", ...bg, fontFamily: "SG", color: "#f5f3ee" }}>
        {brand(46)}
        <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
          {stamp(34)}
          <div style={{ display: "flex", fontSize: size, fontWeight: 700, lineHeight: 1.15 }}>{body}</div>
          {foot && <div style={{ display: "flex", fontSize: 28, opacity: 0.75 }}>{clip(foot, 90)}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36, padding: "26px 34px", background: "rgba(17,19,24,0.6)", borderRadius: 36, border: "2px solid rgba(245,243,238,0.35)" }}>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} width={170} height={170} style={{ borderRadius: 14 }} alt="" />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>Entenda os dois lados</div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 700, marginTop: 6 }}>{host}</div>
            <div style={{ display: "flex", fontSize: 24, opacity: 0.75, marginTop: 10 }}>Esquerda e direita, com fontes e sem torcida</div>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "52px 64px", ...bg, fontFamily: "SG", color: "#f5f3ee" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {brand(26)}
          {stamp(20)}
        </div>
        <div style={{ display: "flex", fontSize: size, fontWeight: 700, lineHeight: 1.18 }}>{body}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 20, opacity: 0.75, maxWidth: 720 }}>{foot ? clip(foot, 80) : ""}</div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 700 }}>{host}</div>
        </div>
      </div>
    ),
    { width: story ? 1080 : 1200, height: story ? 1920 : 630, fonts: await ogFonts() },
  );
}

export const sourceLine = (sources: { title: string; institution: string }[]) => (sources[0] ? `Fonte: ${sources[0].institution || sources[0].title}` : null);

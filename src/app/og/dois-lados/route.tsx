import { ImageResponse } from "next/og";
import QRCode from "qrcode";
import { siteHost } from "@/lib/choice";
import { ogFonts } from "@/lib/og";

export const revalidate = 86400;

/**
 * "Eu conheci os dois lados": card de conclusão (só para quem quiser postar).
 * Não revela opinião nenhuma — mostra que a pessoa ouviu os dois, com o mesmo peso.
 * ?formato=story → 1080×1920 com QR; sem o parâmetro → 1200×630.
 */
export async function GET(req: Request) {
  const story = new URL(req.url).searchParams.get("formato") === "story";
  const host = siteHost();
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const qr = story ? await QRCode.toDataURL(base, { margin: 1, width: 240, color: { dark: "#111318", light: "#f5f3ee" } }) : null;
  const bg = "linear-gradient(90deg, #641c27 0%, #2a1217 49.9%, #142d59 50.1%, #0b1226 100%)";

  const checks = (color: string, s: number) => (
    <div style={{ display: "flex", gap: s * 0.35 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ display: "flex", width: s, height: s, borderRadius: 999, background: color, alignItems: "center", justifyContent: "center" }}>
          <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#111318" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </div>
  );
  const column = (label: string, color: string, s: number, align: "flex-start" | "flex-end") => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: s * 0.5 }}>
      <div style={{ display: "flex", fontSize: s * 0.9, fontWeight: 700, letterSpacing: s * 0.08, color }}>{label}</div>
      {checks(color, s)}
      <div style={{ display: "flex", fontSize: s * 0.5, opacity: 0.8 }}>7 capítulos</div>
    </div>
  );
  const brand = (s: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: s * 0.5 }}>
      <div style={{ display: "flex", width: s, height: s, borderRadius: 999, overflow: "hidden", border: `${Math.max(2, s / 12)}px solid #f5f3ee` }}>
        <div style={{ width: "50%", height: "100%", background: "#b72e38" }} />
        <div style={{ width: "50%", height: "100%", background: "#2455a4" }} />
      </div>
      <div style={{ display: "flex", fontSize: s * 0.95, fontWeight: 700, letterSpacing: s * 0.12 }}>DOIS LADOS</div>
    </div>
  );

  return new ImageResponse(
    story ? (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%", padding: "100px 70px 90px", background: bg, fontFamily: "SG", color: "#f5f3ee", textAlign: "center" }}>
        {brand(46)}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 40, letterSpacing: 6, fontWeight: 700, opacity: 0.9 }}>EU CONHECI</div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 1, marginTop: 14, letterSpacing: -4 }}>OS DOIS</div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>LADOS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 56, marginTop: 90 }}>
            {column("ESQUERDA", "#f08a91", 64, "flex-start")}
            {column("DIREITA", "#8db0f0", 64, "flex-start")}
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginTop: 80, maxWidth: 880 }}>Antes de escolher, entendi o que cada lado defende.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36, padding: "26px 34px", background: "rgba(17,19,24,0.6)", borderRadius: 36, border: "2px solid rgba(245,243,238,0.35)", textAlign: "left" }}>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} width={170} height={170} style={{ borderRadius: 14 }} alt="" />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 42, fontWeight: 700 }}>E você? Conheça também</div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 700, marginTop: 6 }}>{host}</div>
            <div style={{ display: "flex", fontSize: 24, opacity: 0.75, marginTop: 10 }}>Esquerda e direita, com fontes e sem torcida</div>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "52px 64px", background: bg, fontFamily: "SG", color: "#f5f3ee" }}>
        {brand(26)}
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>EU CONHECI OS DOIS LADOS</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {column("ESQUERDA", "#f08a91", 34, "flex-start")}
          {column("DIREITA", "#8db0f0", 34, "flex-end")}
        </div>
      </div>
    ),
    { width: story ? 1080 : 1200, height: story ? 1920 : 630, fonts: await ogFonts() },
  );
}

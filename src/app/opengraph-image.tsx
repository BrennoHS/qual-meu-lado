import { ImageResponse } from "next/og";

export const alt = "DOIS LADOS — Dois lados. Milhões de perspectivas.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento: a mesma divisão equilibrada do hero. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#111318", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", width: "50%", height: "100%", background: "linear-gradient(160deg, #641C27, #111318)" }} />
        <div style={{ display: "flex", width: "50%", height: "100%", background: "linear-gradient(200deg, #142D59, #111318)" }} />
        <div style={{ position: "absolute", left: 599, top: 0, width: 2, height: "100%", background: "#F5F3EE" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#F5F3EE" }}>
          <div style={{ fontSize: 30, letterSpacing: 8, opacity: 0.85 }}>DOIS LADOS</div>
          <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, textAlign: "center", lineHeight: 1 }}>VOCÊ SABE DE QUE LADO ESTÁ?</div>
          <div style={{ fontSize: 30, marginTop: 28, opacity: 0.85 }}>Dois lados. Milhões de perspectivas.</div>
        </div>
      </div>
    ),
    size,
  );
}

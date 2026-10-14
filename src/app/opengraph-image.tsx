import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og";

export const alt = "DOIS LADOS — Esquerda ou direita? Entenda os dois lados e descubra o seu.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f5f3ee";
const ESQ = "#f08a91";
const DIR = "#8db0f0";

/** Prévia da home: a mesma divisão equilibrada do hero, com os dois nomes com o mesmo peso. */
export default async function OgImage() {
  const chip = (text: string) => (
    <div style={{ display: "flex", padding: "10px 20px", border: "1px solid rgba(245,243,238,0.35)", borderRadius: 999, fontSize: 22, color: "rgba(245,243,238,0.9)", background: "rgba(17,19,24,0.55)" }}>{text}</div>
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#111318", fontFamily: "SG", color: PAPER }}>
        <div style={{ display: "flex", width: "50%", height: "100%", background: "linear-gradient(160deg, #641c27 0%, #2a1217 60%, #111318 100%)" }} />
        <div style={{ display: "flex", width: "50%", height: "100%", background: "linear-gradient(200deg, #142d59 0%, #111c33 60%, #111318 100%)" }} />
        {/* linha divisória: interrompida onde passa o texto */}
        <div style={{ position: "absolute", left: 599, top: 0, width: 2, height: 230, background: PAPER }} />
        <div style={{ position: "absolute", left: 599, top: 500, width: 2, height: 130, background: PAPER }} />

        {/* marca */}
        <div style={{ position: "absolute", top: 44, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", padding: "10px 24px", background: "#111318", border: "1px solid rgba(245,243,238,0.4)", borderRadius: 999, fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>DOIS LADOS</div>
        </div>

        {/* ESQUERDA · ou · DIREITA */}
        <div style={{ position: "absolute", top: 196, left: 0, width: "100%", display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", width: "50%", justifyContent: "flex-end", paddingRight: 64, fontSize: 92, fontWeight: 700, letterSpacing: -2, color: ESQ }}>ESQUERDA</div>
          <div style={{ display: "flex", width: "50%", justifyContent: "flex-start", paddingLeft: 64, fontSize: 92, fontWeight: 700, letterSpacing: -2, color: DIR }}>DIREITA</div>
        </div>
        <div style={{ position: "absolute", top: 222, left: 564, width: 72, height: 72, borderRadius: 999, background: "#111318", border: `2px solid ${PAPER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>ou</div>

        <div style={{ position: "absolute", top: 340, left: 0, width: "100%", display: "flex", justifyContent: "center", fontSize: 40, fontWeight: 400 }}>
          Entenda os dois lados — e descubra o seu.
        </div>

        <div style={{ position: "absolute", top: 430, left: 0, width: "100%", display: "flex", justifyContent: "center", gap: 14 }}>
          {chip("Os dois lados, com fontes")}
          {chip("Teste de afinidade")}
          {chip("Propostas do 2º turno")}
        </div>

        <div style={{ position: "absolute", bottom: 40, left: 0, width: "100%", display: "flex", justifyContent: "center", fontSize: 24, letterSpacing: 2, color: "rgba(245,243,238,0.7)" }}>qualmeulado.com.br</div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}

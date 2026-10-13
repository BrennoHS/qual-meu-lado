import { ImageResponse } from "next/og";
import { getCurrentElection } from "@/lib/content/queries";
import { CANDIDATE_PHOTOS, orderForHome, ROUNDS } from "@/lib/election";
import { clip, OG_SIZE, ogFonts, ogPhoto } from "@/lib/og";

export const revalidate = 300;

/**
 * Prévia de um tema do 2º turno: as DUAS candidaturas, com o mesmo espaço,
 * a mesma cor neutra e a proposta principal de cada uma. "geral" = capa.
 * Sem números de audiência, sem "quem ganhou", sem ranking.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ tema: string }> }) {
  const { tema } = await params;
  const round = ROUNDS.find((r) => r.slug === tema);
  if (!round && tema !== "geral") return new Response("Não encontrado", { status: 404 });
  const election = await getCurrentElection();
  const cands = orderForHome(election?.candidates ?? []).slice(0, 2);
  if (cands.length < 2) return new Response("Não encontrado", { status: 404 });
  const photos = await Promise.all(cands.map((c) => ogPhoto(CANDIDATE_PHOTOS[c.slug]?.src)));

  const col = (i: number) => {
    const c = cands[i];
    const p = round ? (c.proposals.find((x) => x.themeSlug === round.slug && x.featured) ?? c.proposals.find((x) => x.themeSlug === round.slug)) : null;
    const photo = photos[i];
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "50%", height: "100%", padding: "0 48px 48px", position: "relative", alignItems: i === 0 ? "flex-start" : "flex-end", textAlign: i === 0 ? "left" : "right" }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={400} height={500} style={{ position: "absolute", bottom: 0, [i === 0 ? "left" : "right"]: 10, opacity: 0.3, objectFit: "contain" }} alt="" />
        )}
        <div style={{ display: "flex", fontSize: 26, color: "#a8abb4", letterSpacing: 2 }}>{c.number} · {c.partyAcronym}</div>
        <div style={{ display: "flex", fontSize: 50, fontWeight: 700, color: "#f5f3ee", lineHeight: 1 }}>{c.ballotName.toUpperCase()}</div>
        {p && <div style={{ display: "flex", fontSize: 25, marginTop: 16, lineHeight: 1.25, color: "rgba(245,243,238,0.9)", maxWidth: 480 }}>{clip(p.title, 90)}</div>}
      </div>
    );
  };

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", fontFamily: "SG", background: "linear-gradient(180deg, #232733 0%, #111318 100%)" }}>
        {col(0)}
        {col(1)}
        <div style={{ position: "absolute", bottom: 10, left: 0, width: "100%", display: "flex", justifyContent: "center", fontSize: 13, color: "rgba(168,171,180,0.8)" }}>
          {`Fotos: ${cands.map((c) => (CANDIDATE_PHOTOS[c.slug] ? `${CANDIDATE_PHOTOS[c.slug].credit} (${CANDIDATE_PHOTOS[c.slug].license})` : "")).filter(Boolean).join(" · ")}`}
        </div>
        <div style={{ position: "absolute", left: 599, top: 200, width: 2, height: 430, background: "#f5f3ee" }} />
        <div style={{ position: "absolute", top: 36, left: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 21, letterSpacing: 3, color: "#7cc7b2", fontWeight: 700 }}>DOIS LADOS · 2º TURNO · 25 DE OUTUBRO</div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 700, color: "#f5f3ee", marginTop: 12, textAlign: "center", maxWidth: 1000, lineHeight: 1.05 }}>
            {round ? round.question : "Duas propostas de país."}
          </div>
          <div style={{ display: "flex", fontSize: 21, color: "#a8abb4", marginTop: 10 }}>Com o trecho do plano registrado no TSE · sem ranking</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}

/** Diagnóstico: quais blocos e pontos-chave são idênticos nos dois lados, capítulo a capítulo. */
import { esquerda } from "../content/perspectives/esquerda";
import { direita } from "../content/perspectives/direita";

for (const ce of esquerda.chapters) {
  const cd = direita.chapters.find((c) => c.slug === ce.slug);
  if (!cd) continue;
  const other = new Set(cd.blocks.map((b) => JSON.stringify(b)));
  const shared = ce.blocks.filter((b) => other.has(JSON.stringify(b)));
  const kp = ce.keyPoints.filter((k) => cd.keyPoints.includes(k));
  console.log(`${ce.slug}: ${shared.length}/${ce.blocks.length} blocos iguais [${shared.map((b) => b.type).join(", ")}] · ${kp.length}/${ce.keyPoints.length} pontos-chave iguais`);
}

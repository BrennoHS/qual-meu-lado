/**
 * Verifica todas as URLs de fontes e atualiza linkStatus no banco.
 * Uso: npm run links:check   (recomendado: agendar diariamente)
 */
import { PrismaClient } from "@prisma/client";
import { checkAllSources } from "../src/lib/links/check";

const db = new PrismaClient();

async function main() {
  const results = await checkAllSources(db, { concurrency: 6 });
  const by = (s: string) => results.filter((r) => r.result.status === s);
  console.log(`✓ ${results.length} links verificados — OK: ${by("OK").length} · bloqueados: ${by("BLOCKED").length} · quebrados: ${by("BROKEN").length}`);
  for (const r of by("BROKEN")) console.log(`  ✗ [${r.result.code ?? "erro"}] ${r.title}\n     ${r.url}`);
  for (const r of by("BLOCKED")) console.log(`  ! [${r.result.code}] conferência manual: ${r.title}`);
  await db.auditLog.create({ data: { action: "links.check", summary: `Script: ${results.length} links, ${by("BROKEN").length} quebrados` } });
  if (by("BROKEN").length) process.exitCode = 2;
}

main().finally(() => db.$disconnect());

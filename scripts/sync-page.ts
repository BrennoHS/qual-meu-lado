/**
 * Atualiza UMA página editorial no banco a partir de content/pages.ts, sem
 * mexer no resto do acervo (o seed apaga e recria tudo).
 * Registra uma revisão nova, como o painel faria.
 *
 *   node --env-file=.env.supabase --import tsx scripts/sync-page.ts privacidade
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { pages } from "../content/pages";

const db = new PrismaClient();

async function main() {
  const slug = process.argv[2];
  const src = pages.find((p) => p.slug === slug);
  if (!src) throw new Error(`Página "${slug}" não existe em content/pages.ts`);
  const row = await db.page.findUnique({ where: { slug } });
  if (!row) throw new Error(`Página "${slug}" não existe no banco`);
  if (row.title === src.title && row.summary === src.summary && row.body === src.body) {
    console.log(`"${slug}" já está igual ao arquivo. Nada a fazer.`);
    return;
  }
  const version = row.version + 1;
  await db.$transaction([
    db.page.update({ where: { slug }, data: { title: src.title, summary: src.summary, body: src.body, version } }),
    db.revision.create({
      data: { entityType: "page", entityId: row.id, version, status: row.status, snapshot: src as unknown as Prisma.InputJsonValue, note: "Sincronizado de content/pages.ts" },
    }),
  ]);
  console.log(`"${slug}" atualizada para a versão ${version}.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

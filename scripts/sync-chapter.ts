/**
 * Atualiza UM capítulo no banco a partir de content/perspectives/*.ts, sem
 * mexer no resto do acervo (o seed apaga e recria tudo). Mantém o status
 * editorial atual e registra uma revisão nova, como o painel faria.
 *
 *   node --env-file=.env.supabase --import tsx scripts/sync-chapter.ts direita no-brasil
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { blocksSchema } from "../src/lib/content/blocks";
import { esquerda } from "../content/perspectives/esquerda";
import { direita } from "../content/perspectives/direita";

const db = new PrismaClient();

/** JSON com chaves em ordem (o Postgres reordena as chaves de jsonb). */
const canon = (v: unknown): string =>
  JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x));

async function main() {
  const [side, slug] = process.argv.slice(2);
  const persp = { esquerda, direita }[side as "esquerda" | "direita"];
  if (!persp) throw new Error(`Lado "${side}" inválido (use esquerda ou direita)`);
  const src = persp.chapters.find((c) => c.slug === slug);
  if (!src) throw new Error(`Capítulo "${slug}" não existe em content/perspectives/${side}.ts`);
  const row = await db.chapter.findFirst({ where: { slug, perspective: { slug: side } } });
  if (!row) throw new Error(`Capítulo "${side}/${slug}" não existe no banco`);

  const blocks = blocksSchema.parse(src.blocks);
  const data = {
    title: src.title,
    kicker: src.kicker,
    summary: src.summary,
    keyPoints: [...src.keyPoints],
    blocks: blocks as Prisma.InputJsonValue,
    deepDive: src.deepDive ?? null,
  };
  const same =
    row.title === data.title &&
    row.kicker === data.kicker &&
    row.summary === data.summary &&
    JSON.stringify(row.keyPoints) === JSON.stringify(data.keyPoints) &&
    canon(row.blocks) === canon(blocks) &&
    row.deepDive === data.deepDive;
  if (same) {
    console.log(`"${side}/${slug}" já está igual ao arquivo. Nada a fazer.`);
    return;
  }
  const version = row.version + 1;
  await db.$transaction([
    db.chapter.update({ where: { id: row.id }, data: { ...data, version } }),
    db.revision.create({
      data: { entityType: "chapter", entityId: row.id, version, status: row.status, snapshot: { ...src, blocks } as unknown as Prisma.InputJsonValue, note: "Sincronizado de content/perspectives" },
    }),
  ]);
  console.log(`"${side}/${slug}" atualizado para a versão ${version}.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

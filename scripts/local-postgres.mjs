/**
 * PostgreSQL embutido para desenvolvimento local (sem Docker).
 * Usa binários oficiais distribuídos pelo pacote `embedded-postgres`.
 * Os dados ficam em ./.pgdata e persistem entre execuções.
 *
 *   npm run db:local      → sobe o banco na porta 5433 (Ctrl+C para parar)
 */
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";

const dataDir = path.resolve(".pgdata");
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "doislados",
  password: "doislados",
  port: 5433,
  persistent: true,
  // UTF-8 explícito: no Windows o initdb herdaria o locale do sistema (WIN1252).
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

if (!existsSync(path.join(dataDir, "PG_VERSION"))) {
  console.log("› Inicializando cluster em .pgdata …");
  await pg.initialise();
}
await pg.start();
try {
  await pg.createDatabase("doislados");
  console.log("› Banco 'doislados' criado.");
} catch {
  /* já existe */
}
console.log("✓ PostgreSQL local em postgresql://doislados:***@localhost:5433/doislados");

const stop = async () => {
  console.log("\n› Encerrando PostgreSQL …");
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);

import { PrismaClient } from "@prisma/client";

/**
 * Ajusta o pool do Prisma conforme a fase, sem mexer na variável de ambiente:
 *  - no build, ~40 páginas são geradas em paralelo: 1 conexão por processo
 *    (o certo para as funções da Vercel) faz as páginas esperarem na fila e
 *    estourarem o tempo (P2024). No build usamos 5;
 *  - em qualquer fase, a espera máxima por uma conexão sobe de 10 s para 30 s.
 * Só mexe nos parâmetros depois do "?", nunca no usuário/senha.
 */
function datasourceUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  const [base, query = ""] = raw.split("?");
  const params = new URLSearchParams(query);
  if (process.env.NEXT_PHASE === "phase-production-build") params.set("connection_limit", "5");
  if (!params.has("pool_timeout")) params.set("pool_timeout", "30");
  return `${base}?${params.toString()}`;
}

/** Instância única do Prisma (evita múltiplas conexões no hot reload). */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: datasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

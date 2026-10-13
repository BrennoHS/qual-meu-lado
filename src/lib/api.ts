import "server-only";
import { z } from "zod";

/** Respostas JSON da API pública de conteúdo (somente leitura, somente publicado). */
export const slugParam = z.string().regex(/^[a-z0-9-]{1,80}$/);

export function json(data: unknown, init?: { status?: number; maxAge?: number }) {
  return Response.json(data, {
    status: init?.status ?? 200,
    headers: { "Cache-Control": `public, s-maxage=${init?.maxAge ?? 300}, stale-while-revalidate=600` },
  });
}

export function notFoundJson(message = "Não encontrado") {
  return Response.json({ error: message }, { status: 404, headers: { "Cache-Control": "no-store" } });
}

export function badRequest(message = "Parâmetro inválido") {
  return Response.json({ error: message }, { status: 400, headers: { "Cache-Control": "no-store" } });
}

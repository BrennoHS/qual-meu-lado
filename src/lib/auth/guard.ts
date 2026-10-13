import "server-only";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { getSession } from "./session";

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSession>>>["user"];

/** Para páginas do painel: redireciona ao login se não houver sessão válida. */
export async function requireUser(roles?: Role[]): Promise<SessionUser> {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  if (roles && !roles.includes(s.user.role)) redirect("/admin?erro=permissao");
  return s.user;
}

export class AuthError extends Error {}

/** Para server actions: lança erro (nunca confia apenas na UI para esconder ações). */
export async function assertUser(roles?: Role[]): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new AuthError("Sessão expirada. Entre novamente.");
  if (roles && !roles.includes(s.user.role)) throw new AuthError("Você não tem permissão para esta ação.");
  return s.user;
}

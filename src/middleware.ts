import { NextResponse, type NextRequest } from "next/server";

/**
 * Primeira barreira do painel: sem cookie de sessão, redireciona ao login.
 * A validação real (hash no banco, expiração, papel) acontece no servidor
 * em cada página e em cada server action (src/lib/auth/guard.ts).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const hasCookie = req.cookies.has("__Host-dl_session") || req.cookies.has("dl_session");
  if (!hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

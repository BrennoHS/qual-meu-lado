import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/guard";
import { RESOURCES } from "@/lib/admin/resources";
import { Brand } from "@/components/site/site-header";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Painel editorial", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const roleLabel = { ADMIN: "Administração", REVIEWER: "Revisão", EDITOR: "Edição" } as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const groups = [...new Set(RESOURCES.map((r) => r.group))];
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-graphite-2 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex h-14 items-center justify-between px-4">
          <Brand />
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ash">CMS</span>
        </div>
        <details className="group lg:open" open>
          <summary className="kicker cursor-pointer px-4 py-2 lg:hidden">Navegação</summary>
          <nav aria-label="Painel" className="px-2 pb-6 text-sm">
            <Link href="/admin" className="block rounded px-2 py-2 hover:bg-graphite-3">Visão geral</Link>
            {groups.map((g) => (
              <div key={g} className="mt-4">
                <p className="kicker px-2 pb-1 text-[0.65rem]">{g}</p>
                {RESOURCES.filter((r) => r.group === g).map((r) => (
                  <Link key={r.key} href={`/admin/${r.key}`} className="block rounded px-2 py-1.5 text-paper/85 hover:bg-graphite-3">
                    {r.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-4">
              <p className="kicker px-2 pb-1 text-[0.65rem]">Governança</p>
              <Link href="/admin/relatos" className="block rounded px-2 py-1.5 hover:bg-graphite-3">Relatos de erro</Link>
              <Link href="/admin/auditoria" className="block rounded px-2 py-1.5 hover:bg-graphite-3">Registro de auditoria</Link>
              {user.role === "ADMIN" && <Link href="/admin/usuarios" className="block rounded px-2 py-1.5 hover:bg-graphite-3">Usuários e papéis</Link>}
              <Link href="/admin/funcionalidades" className="block rounded px-2 py-1.5 hover:bg-graphite-3">Funcionalidades condicionais</Link>
              <Link href="/admin/metricas" className="block rounded px-2 py-1.5 hover:bg-graphite-3">Medição agregada</Link>
            </div>
          </nav>
        </details>
      </aside>
      <div className="min-w-0">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-line px-[var(--gutter)]">
          <p className="truncate text-sm">
            {user.name} <span className="font-mono text-xs text-ash">· {roleLabel[user.role]}</span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="kicker hover:underline" target="_blank">Ver site ↗</Link>
            <form action={logout}>
              <button type="submit" className="kicker min-h-11 hover:underline">Sair</button>
            </form>
          </div>
        </header>
        <main id="conteudo" className="px-[var(--gutter)] py-8">{children}</main>
      </div>
    </div>
  );
}

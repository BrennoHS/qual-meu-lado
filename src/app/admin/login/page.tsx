import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Brand } from "@/components/site/site-header";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar — painel editorial", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main id="conteudo" className="flex min-h-svh items-center justify-center p-[var(--gutter)]">
      <div className="w-full max-w-sm">
        <Brand />
        <h1 className="mt-10 font-display text-3xl tracking-tight">Painel editorial</h1>
        <p className="mt-2 text-sm text-ash">Acesso restrito à equipe. Tentativas são limitadas e registradas.</p>
        <LoginForm />
      </div>
    </main>
  );
}

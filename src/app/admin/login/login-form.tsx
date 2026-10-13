"use client";

import { useActionState } from "react";
import { login, type ActionState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, { ok: false, message: "" });
  const input = "h-12 w-full border border-line bg-graphite-2 px-4 text-paper focus:border-paper focus:outline-none";
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="kicker mb-2 block">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={input} />
      </div>
      <div>
        <label htmlFor="password" className="kicker mb-2 block">Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      {state.message && <p role="alert" className="text-sm text-ev-critique">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn btn-solid w-full disabled:opacity-60">{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}

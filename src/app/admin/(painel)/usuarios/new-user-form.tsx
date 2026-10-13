"use client";

import { useActionState } from "react";
import { createUser, type ActionState } from "../../actions";

export function NewUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createUser, { ok: false, message: "" });
  const input = "h-11 w-full border border-line bg-graphite-2 px-3 focus:border-paper focus:outline-none";
  return (
    <form action={action} className="card space-y-4 p-5">
      <h2 className="kicker">Novo usuário</h2>
      <label className="block">
        <span className="kicker mb-1 block">Nome</span>
        <input name="name" required className={input} />
      </label>
      <label className="block">
        <span className="kicker mb-1 block">E-mail</span>
        <input name="email" type="email" required className={input} />
      </label>
      <label className="block">
        <span className="kicker mb-1 block">Papel</span>
        <select name="role" className={input} defaultValue="EDITOR">
          <option value="EDITOR">Edição</option>
          <option value="REVIEWER">Revisão</option>
          <option value="ADMIN">Administração</option>
        </select>
      </label>
      <label className="block">
        <span className="kicker mb-1 block">Senha inicial (mín. 12 caracteres)</span>
        <input name="password" type="password" autoComplete="new-password" required className={input} />
      </label>
      {state.message && <p role="status" className={`text-sm ${state.ok ? "text-ev-pro" : "text-ev-critique"}`}>{state.message}</p>}
      <button disabled={pending} className="btn btn-solid w-full">Criar</button>
    </form>
  );
}

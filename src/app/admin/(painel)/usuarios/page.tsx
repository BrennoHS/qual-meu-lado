import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { setUserActive } from "../../actions";
import { NewUserForm } from "./new-user-form";

export default async function UsersPage() {
  const me = await requireUser(["ADMIN"]);
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, name: true, email: true, role: true, active: true } });
  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Usuários e papéis</h1>
        <ul className="mt-6 space-y-1 text-sm text-ash">
          <li><strong className="text-paper">Edição</strong>: cria e edita rascunhos; envia para revisão.</li>
          <li><strong className="text-paper">Revisão</strong>: verifica, publica, despublica e edita conteúdo publicado.</li>
          <li><strong className="text-paper">Administração</strong>: tudo, incluindo usuários, exclusões e funcionalidades condicionais.</li>
        </ul>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="font-mono text-xs uppercase text-ash">
              <tr className="border-b border-line">
                <th scope="col" className="py-2">Nome</th>
                <th scope="col">E-mail</th>
                <th scope="col">Papel</th>
                <th scope="col">Estado</th>
                <th scope="col"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td className="font-mono text-xs">{u.role}</td>
                  <td>{u.active ? "ativo" : "desativado"}</td>
                  <td className="text-right">
                    {u.id !== me.id && (
                      <form action={setUserActive.bind(null, u.id, !u.active)}>
                        <button className="kicker min-h-9 hover:underline">{u.active ? "Desativar" : "Reativar"}</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NewUserForm />
    </div>
  );
}

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";

export default async function AuditPage() {
  await requireUser(["ADMIN", "REVIEWER"]);
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300, include: { user: { select: { name: true } } } });
  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Registro de auditoria</h1>
      <p className="mt-2 text-sm text-ash">Ações administrativas, logins e mudanças de estado. Últimos 300 eventos.</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="font-mono text-xs uppercase text-ash">
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4">Quando</th>
              <th scope="col" className="py-2 pr-4">Quem</th>
              <th scope="col" className="py-2 pr-4">Ação</th>
              <th scope="col" className="py-2">Resumo</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-line align-top">
                <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{l.createdAt.toLocaleString("pt-BR")}</td>
                <td className="py-2 pr-4">{l.user?.name ?? "sistema"}</td>
                <td className="py-2 pr-4 font-mono text-xs">{l.action}</td>
                <td className="py-2">{l.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

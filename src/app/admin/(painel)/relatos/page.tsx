import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/guard";
import { deleteReport, setReportHandled } from "../../actions";

export default async function ReportsPage() {
  const user = await requireUser();
  const reports = await db.errorReport.findMany({ orderBy: [{ handled: "asc" }, { createdAt: "desc" }], take: 200 });
  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Relatos de erro</h1>
      <p className="mt-2 max-w-2xl text-sm text-ash">Enviados pelo público. Não armazenamos IP. Retenção recomendada: 180 dias — exclua relatos antigos já tratados.</p>
      <ul className="mt-8 space-y-3">
        {reports.map((r) => (
          <li key={r.id} className={`card p-4 ${r.handled ? "opacity-60" : ""}`}>
            <p className="font-mono text-xs text-ash">
              {r.createdAt.toLocaleString("pt-BR")} · {r.pageUrl || "sem página"} {r.contactEmail ? `· ${r.contactEmail}` : ""}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{r.message}</p>
            <div className="mt-3 flex gap-2">
              {user.role !== "EDITOR" && (
                <form action={setReportHandled.bind(null, r.id, !r.handled)}>
                  <button className="btn btn-ghost min-h-9 py-1 text-[0.65rem]">{r.handled ? "Reabrir" : "Marcar como tratado"}</button>
                </form>
              )}
              {user.role === "ADMIN" && (
                <form action={deleteReport.bind(null, r.id)}>
                  <button className="btn btn-ghost min-h-9 py-1 text-[0.65rem] text-ev-critique">Excluir</button>
                </form>
              )}
            </div>
          </li>
        ))}
        {reports.length === 0 && <li className="text-ash">Nenhum relato.</li>}
      </ul>
    </div>
  );
}

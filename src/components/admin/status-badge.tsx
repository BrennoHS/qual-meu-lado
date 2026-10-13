import { statusLabel, type Status } from "@/lib/editorial/status";

const tone: Record<Status, string> = {
  DRAFT: "border-line text-ash",
  IN_REVIEW: "border-ev-critique/60 text-ev-critique",
  VERIFIED: "border-ev-interp/60 text-ev-interp",
  PUBLISHED: "border-ev-pro/60 text-ev-pro",
  OUTDATED: "border-dashed border-ash text-ash",
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as Status;
  return <span className={`inline-block whitespace-nowrap border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] ${tone[s] ?? ""}`}>{statusLabel[s] ?? status}</span>;
}

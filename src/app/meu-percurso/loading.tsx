export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[70svh] items-center justify-center">
      <span className="sr-only">Carregando…</span>
      <span aria-hidden className="relative block h-16 w-[2px] overflow-hidden bg-line">
        <span className="pulse-line absolute inset-0 bg-paper" />
      </span>
    </div>
  );
}

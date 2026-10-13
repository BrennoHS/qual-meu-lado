import type { IconName } from "@/lib/election";

/** Ícones de linha para os temas (24×24, herdam a cor do texto). */
const paths: Record<string, React.ReactNode> = {
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.2c-.6-.8-1.5-1.2-2.6-1.2-1.6 0-2.6.8-2.6 1.9 0 2.7 5.4 1.4 5.4 4.2 0 1.2-1.1 2-2.8 2-1.2 0-2.2-.5-2.8-1.3M12 6.5v1.5M12 16v1.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M9 7.5V5.5h6v2M3 12.5h18" />
    </>
  ),
  shield: <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z" />,
  book: (
    <>
      <path d="M12 6.5c-2-1.5-4.8-2-8-1.5v13c3.2-.5 6 0 8 1.5 2-1.5 4.8-2 8-1.5V5c-3.2-.5-6 0-8 1.5z" />
      <path d="M12 6.5v13" />
    </>
  ),
  cross: <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" />,
  hands: (
    <>
      <path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0112 8a3.9 3.9 0 017 2.4C19 15.6 12 20 12 20z" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-13.5 14-14-.5 9-6 14-14 14z" />
      <path d="M5 19c3-4 6-6.5 9.5-8.5" />
    </>
  ),
  ballot: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M8 9V4.5h8V9M10 6.5h4" />
    </>
  ),
};

export function ThemeIcon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

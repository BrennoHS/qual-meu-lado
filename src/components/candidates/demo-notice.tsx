import { ArrowUpRight } from "lucide-react";
export function DemoNotice({ className = "" }: { className?: string }) {
  return (
    <div role="note" className={`border border-dashed border-ev-critique bg-ev-critique/5 p-4 text-sm leading-relaxed text-ev-critique ${className}`}>
      <strong className="font-mono text-xs uppercase tracking-[0.14em]">Dados demonstrativos · candidaturas fictícias</strong>
      <p className="mt-1 text-paper/85">
        Nenhuma pessoa, partido ou proposta desta área existe. Eles demonstram a estrutura editorial. Candidaturas reais são cadastradas pela equipe a partir de
        fontes primárias. Para dados oficiais, consulte o{" "}
        <a className="link-u text-paper" href="https://divulgacandcontas.tse.jus.br/divulga/" target="_blank" rel="noopener noreferrer">
          DivulgaCandContas (TSE) <ArrowUpRight aria-hidden className="inline-block h-3.5 w-3.5" strokeWidth={2} />
        </a>
        .
      </p>
    </div>
  );
}

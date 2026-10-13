import { EditorialPage, editorialMetadata } from "@/components/site/editorial-page";
import { getAffinityModel } from "@/lib/content/queries";
import { BALANCE_BAND, MIN_DECISIVE } from "@/lib/affinity/score";

export const revalidate = 300;
export const generateMetadata = () => editorialMetadata("como-construimos");

const relationLabel = { CONVENTIONAL: "Convencional", WEAK: "Fraca / parcialmente didática", NONE: "Nenhuma — didática" } as const;

export default async function MethodologyPage() {
  const { dimensions, statements } = await getAffinityModel();
  return (
    <EditorialPage slug="como-construimos">
      <section id="mapa" aria-labelledby="mapa-titulo" className="mt-16 border-t border-line pt-12">
        <p className="kicker">Gerado a partir das definições publicadas</p>
        <h2 id="mapa-titulo" className="h-section mt-2">O mapa de afinidades, por dentro</h2>
        <div className="rt mt-6">
          <p>
            São {statements.length} afirmações em {dimensions.length} dimensões. Cada resposta vira um valor (Concordo = +1, Discordo = −1, Depende = 0; “Não sei” fica
            fora do cálculo), multiplicado pela direção da afirmação. A posição em cada dimensão é a média, de −1 a +1, convertida em proximidade percentual com o polo A.
          </p>
          <p>
            Uma dimensão só recebe percentual com pelo menos {MIN_DECISIVE} respostas “Concordo” ou “Discordo”. Posições entre ±{Math.round(BALANCE_BAND * 100) / 100} são
            descritas como equilíbrio. Não existe pontuação geral, e o cálculo acontece inteiramente no navegador — o código está em <code>src/lib/affinity/score.ts</code>.
          </p>
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Dimensões do mapa de afinidades</caption>
            <thead>
              <tr className="border-b border-line font-mono text-xs uppercase tracking-[0.1em] text-ash">
                <th scope="col" className="py-3 pr-4">Dimensão</th>
                <th scope="col" className="py-3 pr-4">Polo A</th>
                <th scope="col" className="py-3 pr-4">Polo B</th>
                <th scope="col" className="py-3 pr-4">Relação com esquerda/direita</th>
                <th scope="col" className="py-3">Afirmações</th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map((d) => (
                <tr key={d.key} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">{d.name}</th>
                  <td className="py-4 pr-4">{d.poleA}</td>
                  <td className="py-4 pr-4">{d.poleB}</td>
                  <td className="py-4 pr-4">
                    <span className="font-mono text-xs">{relationLabel[d.relation]}</span>
                    <p className="mt-1 text-xs text-ash">{d.basis}</p>
                  </td>
                  <td className="py-4 font-mono text-xs">{statements.filter((s) => s.dimensionKey === d.key).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </EditorialPage>
  );
}

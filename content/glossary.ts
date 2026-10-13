/**
 * Palavras difíceis que viram "toque para entender" no meio dos textos.
 * Regras editoriais:
 *  - uma frase, linguagem do dia a dia, sem adjetivos de valor;
 *  - quando citar lei, citar o número (conferível);
 *  - termos que nomeiam correntes políticas são descritos como seus
 *    defensores e críticos reconheceriam (sem caricatura).
 * `forms` lista as variações que aparecem nos textos (singular/plural, siglas).
 * `exact` = só reconhece com a mesma caixa (ex.: "Estado" ≠ "estado de SP").
 */
export type GlossaryEntry = { id: string; term: string; definition: string; forms: string[]; exact?: boolean };

export const glossary: GlossaryEntry[] = [
  // Ideias e instituições
  { id: "ideologia", term: "Ideologia", forms: ["ideologia", "ideologias"], definition: "Um conjunto de ideias sobre como a sociedade deveria funcionar." },
  { id: "estado", term: "Estado", forms: ["Estado"], exact: true, definition: "O governo e suas instituições: escolas e hospitais públicos, polícia, tribunais." },
  { id: "mercado", term: "Mercado", forms: ["economia de mercado", "livre mercado"], definition: "Onde pessoas e empresas compram, vendem e trocam; os preços sobem ou descem conforme a procura." },
  { id: "desigualdade", term: "Desigualdade", forms: ["desigualdade social", "desigualdades"], definition: "Diferença de renda, de oportunidades ou de direitos entre as pessoas." },
  { id: "redistribuicao", term: "Redistribuição", forms: ["redistribuição", "redistribuir", "redistribuição de renda"], definition: "Usar impostos e programas públicos para transferir renda de quem tem mais para quem tem menos." },
  { id: "imposto-progressivo", term: "Imposto progressivo", forms: ["imposto progressivo", "impostos progressivos", "tributação progressiva"], definition: "Imposto cuja porcentagem aumenta conforme a renda ou o patrimônio: quem tem mais paga uma fatia maior." },
  { id: "constituicao", term: "Constituição", forms: ["Constituição"], exact: true, definition: "A lei mais importante do país; todas as outras precisam respeitá-la. A atual é de 1988." },
  { id: "congresso", term: "Congresso", forms: ["Congresso"], exact: true, definition: "A Câmara dos Deputados e o Senado juntos. É onde as leis são discutidas e votadas." },
  { id: "pec", term: "PEC", forms: ["PEC", "PECs"], exact: true, definition: "Proposta de Emenda à Constituição. Precisa de 3/5 dos votos na Câmara e no Senado, em dois turnos em cada casa." },
  { id: "coalizao", term: "Presidencialismo de coalizão", forms: ["presidencialismo de coalizão"], definition: "O jeito brasileiro de governar: como nenhum partido tem maioria sozinho, o presidente forma alianças com vários partidos no Congresso." },
  { id: "sindicato", term: "Sindicato", forms: ["sindicato", "sindicatos"], definition: "Associação que representa uma categoria de trabalhadores (ou de empresas) em negociações de salário e condições de trabalho." },

  // Correntes
  { id: "social-democracia", term: "Social-democracia", forms: ["social-democracia", "social-democratas", "social-democrata"], definition: "Corrente que aceita a economia de mercado, mas defende impostos e serviços públicos fortes para reduzir desigualdades." },
  { id: "socialismo", term: "Socialismo", forms: ["socialismo"], definition: "Ideias que defendem controle coletivo ou social da economia para reduzir desigualdades. Há versões democráticas e versões autoritárias." },
  { id: "comunismo", term: "Comunismo", forms: ["comunismo"], definition: "Ideia de uma sociedade sem classes e sem propriedade privada de fábricas e terras. Os países que se disseram comunistas tiveram partido único." },
  { id: "liberalismo", term: "Liberalismo", forms: ["liberalismo", "liberalismo econômico"], definition: "Corrente que defende liberdades individuais, mercado livre e limites ao poder do governo." },
  { id: "conservadorismo", term: "Conservadorismo", forms: ["conservadorismo"], definition: "Corrente que valoriza tradições e instituições, como a família e a religião, e prefere mudanças graduais." },

  // Economia
  { id: "inflacao", term: "Inflação", forms: ["inflação"], definition: "Quando os preços em geral sobem e o mesmo dinheiro passa a comprar menos." },
  { id: "pib", term: "PIB", forms: ["PIB"], exact: true, definition: "Produto Interno Bruto: o valor de tudo o que o país produz em um ano. Mede o tamanho e o crescimento da economia." },
  { id: "divida-publica", term: "Dívida pública", forms: ["dívida pública"], definition: "O total que o governo deve a quem lhe emprestou dinheiro — bancos, fundos e pessoas que compram títulos do Tesouro." },
  { id: "deficit-primario", term: "Déficit primário", forms: ["déficit primário"], definition: "Quando o governo gasta mais do que arrecada, sem contar os juros da dívida." },
  { id: "arcabouco", term: "Arcabouço fiscal", forms: ["arcabouço fiscal"], definition: "Regra de 2023 (Lei Complementar 200) que limita o crescimento dos gastos do governo federal, ligando-o ao aumento da arrecadação." },
  { id: "teto", term: "Teto de gastos", forms: ["teto de gastos"], definition: "Regra de 2016 (Emenda Constitucional 95) que limitava o crescimento dos gastos federais à inflação. Foi substituída pelo arcabouço fiscal em 2023." },
  { id: "reforma-tributaria", term: "Reforma tributária", forms: ["reforma tributária"], definition: "Mudança nas regras dos impostos. A de 2023 (Emenda Constitucional 132) troca cinco impostos sobre consumo por um modelo de IVA, com transição até 2033." },
  { id: "iva", term: "IVA", forms: ["IVA"], exact: true, definition: "Imposto sobre Valor Agregado: imposto sobre o consumo cobrado em cada etapa, descontando o que já foi pago nas etapas anteriores." },
  { id: "banco-central", term: "Banco Central", forms: ["Banco Central"], exact: true, definition: "Instituição que cuida da moeda e define a taxa básica de juros (Selic) para controlar a inflação." },
  { id: "selic", term: "Selic", forms: ["Selic", "taxa Selic"], definition: "A taxa básica de juros do país, definida pelo Banco Central. Influencia os juros de empréstimos, financiamentos e cartão." },
  { id: "estatal", term: "Estatal", forms: ["estatais", "estatal", "empresa estatal", "empresas estatais"], definition: "Empresa controlada pelo governo, como a Petrobras e os Correios." },
  { id: "privatizacao", term: "Privatização", forms: ["privatização", "privatizações", "privatizar"], definition: "Venda de uma empresa do governo para empresas ou investidores privados." },
  { id: "concessao", term: "Concessão", forms: ["concessão", "concessões"], definition: "Contrato em que o governo entrega a uma empresa, por um tempo, a operação de um serviço — como uma estrada ou o saneamento — que continua sendo público." },
  { id: "voucher", term: "Voucher", forms: ["voucher", "vouchers"], definition: "Vale pago pelo governo para a pessoa usar num serviço privado, como uma vaga em escola ou creche." },

  // Trabalho e políticas sociais
  { id: "clt", term: "CLT", forms: ["CLT"], exact: true, definition: "Consolidação das Leis do Trabalho (1943): as leis que garantem férias, 13º salário e jornada máxima a quem tem carteira assinada." },
  { id: "informalidade", term: "Informalidade", forms: ["informalidade", "trabalho informal"], definition: "Trabalho sem carteira assinada ou registro — em geral, sem férias remuneradas, 13º salário e FGTS." },
  { id: "sus", term: "SUS", forms: ["SUS"], exact: true, definition: "Sistema Único de Saúde: a rede pública e gratuita de saúde do Brasil, criada pela Constituição de 1988." },
  { id: "bolsa-familia", term: "Bolsa Família", forms: ["Bolsa Família"], exact: true, definition: "Programa federal que paga um valor mensal a famílias de baixa renda, com condições como manter os filhos na escola e a vacinação em dia." },
];

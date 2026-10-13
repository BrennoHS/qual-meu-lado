/**
 * Afirmações verificáveis (camada de evidências).
 * type: FACT (fato documentado), INTERPRETATION (interpretação/consenso
 * acadêmico), PROPOSAL, PREDICTION, OPINION.
 * Cada afirmação aponta para ao menos uma fonte em content/sources.ts.
 */
export type ClaimSeed = {
  key: string;
  text: string;
  type: "FACT" | "INTERPRETATION" | "PROPOSAL" | "PREDICTION" | "OPINION";
  sources: { slug: string; locator?: string }[];
  excerpt?: string;
  context?: string;
  limitations?: string;
  isDemo?: boolean;
};

export const claims: ClaimSeed[] = [
  // ── Origens e conceitos ─────────────────────────────────────────
  {
    key: "origem-assembleia-1789",
    type: "FACT",
    text: "Os termos “esquerda” e “direita” surgiram na Assembleia Nacional francesa de 1789: quem defendia limitar os poderes do rei sentava-se à esquerda do presidente da sessão; quem defendia preservar prerrogativas da monarquia, à direita.",
    sources: [{ slug: "bobbio-1994" }, { slug: "britannica-left" }],
    context: "A disposição de assentos se consolidou nas assembleias seguintes e o vocabulário se espalhou pela Europa ao longo do século XIX.",
    limitations: "A origem espacial dos termos é consensual; o conteúdo associado a cada lado mudou bastante desde então.",
  },
  {
    key: "bobbio-igualdade",
    type: "INTERPRETATION",
    text: "Para Norberto Bobbio, o critério mais persistente para distinguir esquerda e direita é a atitude diante da igualdade: a esquerda tende a considerar as desigualdades sobretudo sociais e passíveis de redução; a direita tende a vê-las como em parte naturais, inevitáveis ou até funcionais.",
    sources: [{ slug: "bobbio-1994" }],
    limitations: "É uma proposta teórica influente, não uma definição oficial. Outros autores destacam liberdade, ordem, mudança ou hierarquia como critérios.",
  },
  {
    key: "termos-variam",
    type: "INTERPRETATION",
    text: "O significado de “esquerda”, “direita” e “liberal” varia entre países e épocas. Nos Estados Unidos, “liberal” costuma designar a centro-esquerda; no Brasil e na Europa, o termo frequentemente remete ao liberalismo econômico.",
    sources: [{ slug: "sep-liberalism" }],
  },
  {
    key: "liberais-seculo-xix",
    type: "INTERPRETATION",
    text: "No século XIX, liberais que defendiam constituições, parlamentos e liberdade de imprensa costumavam ocupar a esquerda em oposição a monarquistas e defensores do Antigo Regime; com o crescimento dos movimentos socialistas, muitos liberais passaram a ser vistos como centro ou direita.",
    sources: [{ slug: "sep-liberalism" }, { slug: "hobsbawm-1994" }],
  },
  {
    key: "burke-1790",
    type: "FACT",
    text: "Em 1790, Edmund Burke publicou “Reflexões sobre a Revolução na França”, crítica à tentativa de reconstruir a sociedade a partir de princípios abstratos — obra considerada fundadora do conservadorismo moderno.",
    sources: [{ slug: "burke-1790" }, { slug: "sep-burke" }, { slug: "sep-conservatism" }],
  },
  {
    key: "smith-1776",
    type: "FACT",
    text: "“A riqueza das nações”, de Adam Smith (1776), é uma das obras de referência do liberalismo econômico, ao argumentar que a divisão do trabalho e a troca em mercados ampliam a prosperidade.",
    sources: [{ slug: "smith-1776" }, { slug: "sep-liberalism" }],
  },
  {
    key: "manifesto-1848",
    type: "FACT",
    text: "O “Manifesto do Partido Comunista”, de Karl Marx e Friedrich Engels, foi publicado em 1848 e tornou-se um dos textos mais influentes dos movimentos socialistas e comunistas.",
    sources: [{ slug: "marx-engels-1848" }, { slug: "sep-socialism" }],
  },
  {
    key: "revolucao-russa-1917",
    type: "FACT",
    text: "A Revolução Russa de 1917 levou os bolcheviques ao poder e deu origem, em 1922, à União Soviética, que se tornou referência — e objeto de disputa — para a esquerda mundial ao longo do século XX.",
    sources: [{ slug: "hobsbawm-1994" }, { slug: "sep-socialism" }],
  },
  {
    key: "keynes-1936",
    type: "FACT",
    text: "Em 1936, John Maynard Keynes publicou “A teoria geral”, que defendia a atuação do Estado para sustentar a demanda e o emprego em crises — base de políticas adotadas por governos de diferentes orientações no pós-guerra.",
    sources: [{ slug: "keynes-1936" }],
  },
  {
    key: "hayek-1944",
    type: "FACT",
    text: "Em 1944, Friedrich Hayek publicou “O caminho da servidão”, argumentando que o planejamento econômico centralizado tende a concentrar poder e ameaçar liberdades individuais.",
    sources: [{ slug: "hayek-1944" }],
  },
  {
    key: "hayek-1945-precos",
    type: "INTERPRETATION",
    text: "Hayek argumentou (1945) que os preços de mercado transmitem informações dispersas que nenhum planejador central consegue reunir — um dos argumentos teóricos mais citados em favor de mercados.",
    sources: [{ slug: "hayek-1945" }],
  },
  {
    key: "friedman-1962",
    type: "FACT",
    text: "Em “Capitalismo e liberdade” (1962), Milton Friedman defendeu que a liberdade econômica é condição para a liberdade política e propôs ideias como o imposto de renda negativo e vouchers escolares.",
    sources: [{ slug: "friedman-1962" }],
  },
  {
    key: "rawls-1971",
    type: "FACT",
    text: "Em “Uma teoria da justiça” (1971), John Rawls propôs que desigualdades só são justas se beneficiarem os menos favorecidos — referência central para o liberalismo igualitário e a centro-esquerda.",
    sources: [{ slug: "rawls-1971" }, { slug: "sep-distributive-justice" }],
  },
  {
    key: "nozick-1974",
    type: "FACT",
    text: "Em “Anarquia, Estado e utopia” (1974), Robert Nozick respondeu a Rawls defendendo um Estado mínimo e argumentando que redistribuição compulsória viola direitos individuais.",
    sources: [{ slug: "nozick-1974" }, { slug: "sep-libertarianism" }],
  },
  {
    key: "piketty-2013",
    type: "INTERPRETATION",
    text: "Thomas Piketty argumenta, com séries históricas de vários países, que sem políticas compensatórias a riqueza tende a se concentrar quando o retorno do capital supera o crescimento da economia.",
    sources: [{ slug: "piketty-2013" }],
    limitations: "A tese é influente e também contestada por economistas que questionam dados, mensuração e mecanismos propostos.",
  },
  {
    key: "kornai-escassez",
    type: "INTERPRETATION",
    text: "O economista húngaro János Kornai, que viveu e estudou economias socialistas, descreveu a escassez crônica como característica estrutural das economias de planejamento central.",
    sources: [{ slug: "kornai-1992" }],
  },
  {
    key: "fascismo-classificacao",
    type: "INTERPRETATION",
    text: "A historiografia predominante classifica o fascismo italiano e o nazismo alemão como movimentos de extrema direita: ultranacionalistas, antiliberais, anticomunistas e hostis à democracia parlamentar.",
    sources: [{ slug: "paxton-2004" }, { slug: "britannica-fascism" }],
    context: "Há debates sobre aspectos econômicos desses regimes, mas a classificação como extrema direita é a posição amplamente majoritária entre historiadores.",
  },
  {
    key: "nazismo-perseguiu-esquerda",
    type: "FACT",
    text: "Após chegar ao poder em 1933, o regime nazista proibiu partidos e sindicatos e enviou comunistas e social-democratas a prisões e campos de concentração.",
    sources: [{ slug: "paxton-2004" }, { slug: "hobsbawm-1994" }],
  },
  {
    key: "fomes-sovietica-chinesa",
    type: "FACT",
    text: "A fome de 1932–1933 na Ucrânia soviética e a fome de 1959–1961 na China, ligadas à coletivização forçada e a metas impostas pelos governos comunistas, causaram milhões de mortes, segundo a historiografia.",
    sources: [{ slug: "applebaum-2017" }, { slug: "dikotter-2010" }],
    limitations: "As estimativas de mortes variam entre autores; a ocorrência das fomes e a responsabilidade de políticas estatais estão amplamente documentadas.",
  },
  {
    key: "gulag",
    type: "FACT",
    text: "O sistema de campos de trabalho forçado soviético (Gulag) aprisionou milhões de pessoas entre as décadas de 1930 e 1950, muitas por motivos políticos.",
    sources: [{ slug: "applebaum-2003" }],
  },
  {
    key: "queda-urss",
    type: "FACT",
    text: "O Muro de Berlim caiu em 1989 e a União Soviética se dissolveu em 1991, encerrando a Guerra Fria e levando partidos de esquerda em todo o mundo a rever programas.",
    sources: [{ slug: "hobsbawm-1994" }],
  },
  {
    key: "crise-2008",
    type: "FACT",
    text: "A comissão oficial dos EUA que investigou a crise financeira de 2008 concluiu, por maioria, que falhas de regulação e supervisão financeira, além de práticas de risco excessivo, estiveram entre as causas da crise.",
    sources: [{ slug: "fcic-2011" }],
    limitations: "Membros dissidentes da comissão atribuíram maior peso a políticas habitacionais do governo e a fatores globais.",
  },
  {
    key: "blanchard-leigh-2013",
    type: "INTERPRETATION",
    text: "Estudo do FMI (Blanchard e Leigh, 2013) concluiu que, após 2010, as projeções subestimaram o efeito negativo da consolidação fiscal sobre o crescimento de economias europeias.",
    sources: [{ slug: "imf-blanchard-leigh-2013" }],
    limitations: "O estudo trata de um período e de um conjunto de países específicos; não estabelece que todo ajuste fiscal é contraproducente.",
  },
  {
    key: "pobreza-global",
    type: "FACT",
    text: "O Banco Mundial documenta queda expressiva da pobreza extrema global desde 1990, concentrada em países que cresceram rapidamente, como China e Índia.",
    sources: [{ slug: "worldbank-poverty" }],
    context: "Quem atribui o resultado aos mercados destaca a abertura comercial; quem atribui ao Estado destaca o papel de políticas industriais e investimentos públicos nesses países.",
  },
  {
    key: "venezuela-migracao",
    type: "FACT",
    text: "Segundo a plataforma interagencial R4V (ACNUR e OIM), mais de 7 milhões de venezuelanos vivem fora de seu país, em um dos maiores deslocamentos populacionais recentes do mundo.",
    sources: [{ slug: "r4v" }],
    limitations: "Os números são estimativas atualizadas periodicamente.",
  },

  // ── Brasil: instituições e leis ─────────────────────────────────
  {
    key: "cf88",
    type: "FACT",
    text: "A Constituição Federal foi promulgada em 5 de outubro de 1988, após o fim do regime militar, e ampliou direitos sociais, políticos e individuais.",
    sources: [{ slug: "cf-1988" }],
  },
  {
    key: "cf88-saude",
    type: "FACT",
    text: "A Constituição define a saúde como “direito de todos e dever do Estado” (art. 196). O SUS foi regulamentado pela Lei nº 8.080/1990.",
    sources: [{ slug: "cf-1988", locator: "art. 196" }, { slug: "lei-8080-1990" }],
  },
  {
    key: "cf88-voto",
    type: "FACT",
    text: "No Brasil, o voto é obrigatório para alfabetizados de 18 a 70 anos e facultativo para analfabetos, maiores de 70 anos e jovens de 16 e 17 anos.",
    sources: [{ slug: "cf-1988", locator: "art. 14, § 1º" }],
  },
  {
    key: "cf88-maioridade",
    type: "FACT",
    text: "A Constituição estabelece que menores de 18 anos são penalmente inimputáveis (art. 228); propostas para reduzir essa idade tramitam há décadas no Congresso.",
    sources: [{ slug: "cf-1988", locator: "art. 228" }],
  },
  {
    key: "clt-1943",
    type: "FACT",
    text: "A Consolidação das Leis do Trabalho (CLT) foi instituída em 1º de maio de 1943, durante o Estado Novo de Getúlio Vargas, regime autoritário.",
    sources: [{ slug: "del-5452-1943" }, { slug: "fausto-1994" }],
  },
  {
    key: "pcb-1922",
    type: "FACT",
    text: "O Partido Comunista do Brasil (PCB) foi fundado em 1922.",
    sources: [{ slug: "fausto-1994" }],
  },
  {
    key: "aib-1932",
    type: "FACT",
    text: "A Ação Integralista Brasileira, movimento de inspiração fascista liderado por Plínio Salgado, foi fundada em 1932.",
    sources: [{ slug: "fausto-1994" }],
  },
  {
    key: "golpe-1964",
    type: "FACT",
    text: "Em 1964, um golpe civil-militar depôs o presidente João Goulart e iniciou um regime militar que durou até 1985.",
    sources: [{ slug: "fausto-1994" }, { slug: "cnv-portal" }],
  },
  {
    key: "ai5",
    type: "FACT",
    text: "O Ato Institucional nº 5 (dezembro de 1968) permitiu fechar o Congresso, cassar mandatos e suspendeu a garantia de habeas corpus para crimes políticos.",
    sources: [{ slug: "ai-5-1968" }],
  },
  {
    key: "cnv-2014",
    type: "FACT",
    text: "O relatório final da Comissão Nacional da Verdade (2014) apontou 434 mortos e desaparecidos e atribuiu a 377 agentes do Estado responsabilidade por graves violações de direitos humanos durante o regime militar.",
    sources: [{ slug: "cnv-portal" }, { slug: "radio-senado-cnv-2014" }, { slug: "hrw-cnv-2014" }],
    context: "A Lei da Anistia (1979) impediu a punição criminal desses agentes; o relatório recomendou rever essa interpretação.",
  },
  {
    key: "anistia-1979",
    type: "FACT",
    text: "A Lei da Anistia, de 1979, anistiou crimes políticos e conexos cometidos entre 1961 e 1979, abrangendo tanto opositores quanto agentes do regime.",
    sources: [{ slug: "lei-6683-1979" }],
  },
  {
    key: "pt-1980",
    type: "FACT",
    text: "O Partido dos Trabalhadores (PT) foi fundado em 1980, reunindo sindicalistas, intelectuais, militantes católicos de base e ex-integrantes de grupos de oposição ao regime militar.",
    sources: [{ slug: "fausto-1994" }],
  },
  {
    key: "plano-real",
    type: "FACT",
    text: "O Plano Real (1993–1994) encerrou um longo período de inflação muito alta no Brasil; a moeda real foi instituída em 1994 e o programa foi consolidado pela Lei nº 9.069/1995.",
    sources: [{ slug: "lei-9069-1995" }, { slug: "bcb-portal" }],
  },
  {
    key: "lrf-2000",
    type: "FACT",
    text: "A Lei de Responsabilidade Fiscal (2000) estabeleceu limites para gastos com pessoal e endividamento de União, estados e municípios.",
    sources: [{ slug: "lrf-2000" }],
  },
  {
    key: "privatizacoes-1990",
    type: "FACT",
    text: "Nos anos 1990, o Programa Nacional de Desestatização e a Lei Geral de Telecomunicações abriram caminho para privatizações, incluindo a do sistema Telebrás, em 1998.",
    sources: [{ slug: "lei-9491-1997" }, { slug: "lei-9472-1997" }],
  },
  {
    key: "bolsa-familia-criacao",
    type: "FACT",
    text: "O Programa Bolsa Família foi criado em 2003 e convertido na Lei nº 10.836/2004, unificando programas anteriores de transferência de renda; foi reformulado pela Lei nº 14.601/2023.",
    sources: [{ slug: "lei-10836-2004" }, { slug: "lei-14601-2023" }],
  },
  {
    key: "bolsa-familia-efeitos",
    type: "INTERPRETATION",
    text: "Avaliações publicadas pelo Ipea e pela Enap associam o Bolsa Família à redução da pobreza extrema e a uma parcela da queda da desigualdade de renda observada desde os anos 2000.",
    sources: [{ slug: "ipea-bf-effects" }, { slug: "enap-bf-15-anos" }],
    limitations: "As estimativas dependem de metodologia e período. Críticos discutem efeitos sobre informalidade, focalização e saída do programa.",
  },
  {
    key: "cotas-2012",
    type: "FACT",
    text: "A Lei de Cotas (2012) reserva vagas em universidades e institutos federais para estudantes de escolas públicas, com subcotas por renda e para pretos, pardos e indígenas.",
    sources: [{ slug: "lei-12711-2012" }],
  },
  {
    key: "estatuto-desarmamento",
    type: "FACT",
    text: "O Estatuto do Desarmamento (2003) restringiu a posse e o porte de armas de fogo por civis; regras de acesso foram ampliadas e depois novamente restringidas por decretos de governos sucessivos.",
    sources: [{ slug: "lei-10826-2003" }],
  },
  {
    key: "teto-gastos-2016",
    type: "FACT",
    text: "A Emenda Constitucional nº 95/2016 instituiu o teto de gastos, limitando o crescimento das despesas primárias federais à inflação; foi substituída pelo arcabouço fiscal da Lei Complementar nº 200/2023.",
    sources: [{ slug: "ec-95-2016" }, { slug: "lc-200-2023" }],
  },
  {
    key: "reforma-trabalhista-2017",
    type: "FACT",
    text: "A reforma trabalhista de 2017 fez com que acordos coletivos prevalecessem sobre a lei em diversos pontos, criou o trabalho intermitente e acabou com a contribuição sindical obrigatória.",
    sources: [{ slug: "lei-13467-2017" }],
  },
  {
    key: "reforma-previdencia-2019",
    type: "FACT",
    text: "A reforma da Previdência de 2019 estabeleceu idade mínima para aposentadoria e mudou regras de cálculo dos benefícios.",
    sources: [{ slug: "ec-103-2019" }],
  },
  {
    key: "bc-autonomia",
    type: "FACT",
    text: "Desde 2021, o Banco Central do Brasil tem autonomia formal: presidente e diretores têm mandatos fixos, não coincidentes com o do Presidente da República.",
    sources: [{ slug: "lc-179-2021" }],
  },
  {
    key: "liberdade-economica-2019",
    type: "FACT",
    text: "A Lei de Liberdade Econômica (2019) dispensou de alvará atividades de baixo risco e estabeleceu princípios de intervenção mínima do Estado sobre a atividade econômica.",
    sources: [{ slug: "lei-13874-2019" }],
  },
  {
    key: "eletrobras-2021",
    type: "FACT",
    text: "A Lei nº 14.182/2021 autorizou a desestatização da Eletrobras, concretizada em 2022 por meio de oferta de ações que reduziu a participação da União.",
    sources: [{ slug: "lei-14182-2021" }],
  },
  {
    key: "saneamento-2020",
    type: "FACT",
    text: "O novo marco do saneamento (2020) fixou metas de universalização de água e esgoto até 2033 e ampliou a participação de empresas privadas por meio de licitações.",
    sources: [{ slug: "lei-14026-2020" }],
  },
  {
    key: "codigo-florestal-2012",
    type: "FACT",
    text: "O Código Florestal de 2012 manteve exigências de reserva legal e áreas de preservação, mas flexibilizou regras para áreas desmatadas antes de 2008 — ponto criticado por ambientalistas e defendido por produtores rurais.",
    sources: [{ slug: "lei-12651-2012" }],
  },
  {
    key: "lei-anticorrupcao",
    type: "FACT",
    text: "A Lei Anticorrupção (2013) passou a responsabilizar empresas por atos lesivos à administração pública e regulamentou acordos de leniência.",
    sources: [{ slug: "lei-12846-2013" }],
  },
  {
    key: "ficha-limpa",
    type: "FACT",
    text: "A Lei da Ficha Limpa (2010), originada de projeto de iniciativa popular, tornou inelegíveis por oito anos pessoas condenadas por órgãos colegiados por determinados crimes.",
    sources: [{ slug: "lc-135-2010" }],
  },
  {
    key: "lei-drogas-2006",
    type: "FACT",
    text: "A Lei de Drogas (2006) deixou de prever prisão para o porte para consumo pessoal, mas não fixou critério objetivo para distinguir usuário de traficante.",
    sources: [{ slug: "lei-11343-2006", locator: "art. 28" }],
  },
  {
    key: "casamento-igualitario",
    type: "FACT",
    text: "Desde a Resolução nº 175/2013 do Conselho Nacional de Justiça, cartórios não podem recusar a celebração de casamento civil entre pessoas do mesmo sexo.",
    sources: [{ slug: "cnj-res-175-2013" }],
  },
  {
    key: "fundeb-2020",
    type: "FACT",
    text: "A Emenda Constitucional nº 108/2020 tornou permanente o Fundeb, principal mecanismo de financiamento da educação básica pública, e ampliou a complementação da União.",
    sources: [{ slug: "ec-108-2020" }],
  },
  {
    key: "reeleicao-1997",
    type: "FACT",
    text: "A Emenda Constitucional nº 16/1997 permitiu a reeleição para cargos do Executivo.",
    sources: [{ slug: "ec-16-1997" }],
  },
  {
    key: "homicidios-brasil",
    type: "FACT",
    text: "O Brasil registra dezenas de milhares de homicídios por ano, segundo o Atlas da Violência (Ipea e Fórum Brasileiro de Segurança Pública).",
    sources: [{ slug: "ipea-atlas-violencia" }],
  },
  {
    key: "populacao-prisional",
    type: "FACT",
    text: "O Brasil tem uma das maiores populações prisionais do mundo, segundo o World Prison Brief.",
    sources: [{ slug: "wpb-brazil" }],
  },

  // ── Brasil: história política recente ──────────────────────────
  {
    key: "mensalao",
    type: "FACT",
    text: "Em dezembro de 2012, o STF concluiu o julgamento da Ação Penal 470 (“mensalão”), condenando 25 dos 38 réus, entre eles dirigentes do PT e de partidos então aliados ao governo.",
    sources: [{ slug: "cf-mensalao-2012" }],
    context: "O caso tratou de pagamentos a parlamentares e partidos da base aliada no primeiro governo Lula. Condenados recorreram, e parte das penas foi revista em embargos.",
  },
  {
    key: "lula-anulacao-2021",
    type: "FACT",
    text: "Em abril de 2021, o plenário do STF confirmou, por 8 votos a 3, a anulação das condenações de Lula na Lava Jato por incompetência da 13ª Vara Federal de Curitiba; em março, a 2ª Turma havia declarado a suspeição do ex-juiz Sergio Moro no caso do triplex.",
    sources: [{ slug: "poder360-lula-2021" }],
    context: "As decisões trataram de competência e imparcialidade do julgamento, não do mérito das acusações. Defensores de Lula afirmam que isso confirma perseguição judicial; críticos afirmam que as decisões não equivalem a absolvição.",
  },
  {
    key: "recessao-2015-2016",
    type: "FACT",
    text: "Segundo as primeiras estimativas do IBGE, o PIB brasileiro caiu 3,8% em 2015 e 3,6% em 2016 — a maior recessão em dois anos consecutivos da série histórica iniciada em 1948.",
    sources: [{ slug: "ibge-pib-2016" }],
    limitations: "Os valores foram revisados posteriormente pelo IBGE. As causas são debatidas: há quem enfatize a política econômica do período e quem enfatize a queda das commodities e a crise política.",
  },
  {
    key: "impeachment-2016",
    type: "FACT",
    text: "Em 31 de agosto de 2016, o Senado aprovou por 61 votos a 20 a perda do mandato de Dilma Rousseff por crimes de responsabilidade ligados a decretos de crédito suplementar e operações com bancos públicos; os direitos políticos dela foram mantidos em votação separada.",
    sources: [{ slug: "senado-impeachment-final" }, { slug: "senado-impeachment-pronuncia" }],
    context: "Apoiadores do impeachment o consideram aplicação da Constituição; a defesa e aliados de Dilma o classificam como golpe parlamentar, por entenderem não haver crime de responsabilidade.",
  },
  {
    key: "oito-de-janeiro",
    type: "FACT",
    text: "Em 8 de janeiro de 2023, as sedes do Congresso, do Planalto e do STF foram invadidas e depredadas. Em outubro de 2023, a CPMI do 8 de Janeiro aprovou, por 20 votos a 11, relatório que pediu o indiciamento de Jair Bolsonaro e de outras 60 pessoas.",
    sources: [{ slug: "opovo-cpmi-2023" }],
    context: "Parlamentares de oposição contestaram o relatório e acusaram a comissão de parcialidade. Pedido de indiciamento por CPMI não é condenação.",
  },
  {
    key: "stf-trama-golpista-2025",
    type: "FACT",
    text: "Em setembro de 2025, a Primeira Turma do STF condenou, por 4 votos a 1, o ex-presidente Jair Bolsonaro e outros sete réus por crimes que incluem tentativa de golpe de Estado.",
    sources: [{ slug: "bloomberglinea-stf-2025" }, { slug: "cm-stf-2025" }],
    context: "O ministro Luiz Fux divergiu e votou pela absolvição de Bolsonaro, questionando também a competência da Turma. A defesa nega os crimes e contesta o processo.",
  },
  {
    key: "bolognesi-classificacao",
    type: "INTERPRETATION",
    text: "Uma classificação de partidos brasileiros feita a partir de survey com cientistas políticos (Bolognesi, Ribeiro e Codato, 2023) identificou deslocamento da maioria dos partidos para a direita e grande número de partidos mais orientados a cargos e votos do que a programas.",
    sources: [{ slug: "bolognesi-2023" }],
    limitations: "Classificações de especialistas são aproximações; partidos mudam ao longo do tempo e têm alas internas diversas.",
  },
  {
    key: "direita-envergonhada",
    type: "INTERPRETATION",
    text: "Estudos sobre a redemocratização, como o de Timothy Power (2000), observaram que poucos políticos brasileiros se apresentavam como “de direita” após 1985, em parte pela associação do rótulo com o regime militar.",
    sources: [{ slug: "power-2000" }],
  },
  {
    key: "pesquisas-registro",
    type: "FACT",
    text: "A legislação eleitoral exige que pesquisas de opinião sobre eleições ou candidatos sejam registradas na Justiça Eleitoral antes da divulgação, com informações sobre metodologia, amostra e contratante.",
    sources: [{ slug: "lei-9504-1997", locator: "art. 33" }, { slug: "tse-res-23600" }],
  },
  {
    key: "eleicao-2026-1turno",
    type: "FACT",
    text: "No 1º turno das eleições de 2026, com 99,99% das urnas apuradas, Flávio Bolsonaro (PL) teve 47,03% dos votos válidos e Lula (PT), 45,16%. Os dois disputam o 2º turno em 25 de outubro de 2026.",
    sources: [{ slug: "tse-resultado-1turno-2026" }],
    context: "Pela Constituição, vence no 1º turno quem obtém mais da metade dos votos válidos; se ninguém consegue, os dois mais votados vão ao 2º turno.",
  },
  {
    key: "cf88-jornada",
    type: "FACT",
    text: "A Constituição fixa a jornada de trabalho em até 8 horas diárias e 44 horas semanais.",
    sources: [{ slug: "cf-1988", locator: "art. 7º, XIII" }],
  },
  {
    key: "lgpd-dados-sensiveis",
    type: "FACT",
    text: "A LGPD classifica a opinião política como dado pessoal sensível, sujeito a regras mais restritivas de tratamento.",
    sources: [{ slug: "lgpd-2018", locator: "art. 5º, II" }],
  },
];

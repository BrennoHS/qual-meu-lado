/** Linha do tempo viva. Cada evento aponta para uma afirmação com fonte. */
export type TimelineSeed = {
  slug: string;
  year: number;
  dateLabel: string;
  title: string;
  body: string;
  scope: "BRAZIL" | "INTERNATIONAL";
  tags: string[];
  claimKey?: string;
};

export const timeline: TimelineSeed[] = [
  { slug: "riqueza-das-nacoes", year: 1776, dateLabel: "1776", title: "A riqueza das nações", body: "Adam Smith publica a obra que se tornaria referência do liberalismo econômico.", scope: "INTERNATIONAL", tags: ["direita", "economia"], claimKey: "smith-1776" },
  { slug: "assembleia-1789", year: 1789, dateLabel: "1789", title: "Nasce a divisão", body: "Na Assembleia Nacional francesa, a posição dos assentos — à esquerda ou à direita do presidente da sessão — passa a indicar posições políticas.", scope: "INTERNATIONAL", tags: ["esquerda", "direita"], claimKey: "origem-assembleia-1789" },
  { slug: "burke-reflexoes", year: 1790, dateLabel: "1790", title: "Burke responde à Revolução", body: "Edmund Burke critica a Revolução Francesa e lança bases do conservadorismo moderno.", scope: "INTERNATIONAL", tags: ["direita"], claimKey: "burke-1790" },
  { slug: "manifesto-comunista", year: 1848, dateLabel: "1848", title: "Manifesto Comunista", body: "Marx e Engels publicam o texto que marcaria os movimentos socialistas.", scope: "INTERNATIONAL", tags: ["esquerda"], claimKey: "manifesto-1848" },
  { slug: "revolucao-russa", year: 1917, dateLabel: "1917", title: "Revolução Russa", body: "Os bolcheviques tomam o poder; a esquerda mundial se divide entre reformistas e revolucionários.", scope: "INTERNATIONAL", tags: ["esquerda"], claimKey: "revolucao-russa-1917" },
  { slug: "pcb-fundado", year: 1922, dateLabel: "1922", title: "Fundação do PCB", body: "É fundado o Partido Comunista do Brasil.", scope: "BRAZIL", tags: ["esquerda"], claimKey: "pcb-1922" },
  { slug: "integralismo", year: 1932, dateLabel: "1932", title: "Ação Integralista Brasileira", body: "Surge o movimento integralista, de inspiração fascista.", scope: "BRAZIL", tags: ["direita"], claimKey: "aib-1932" },
  { slug: "nazismo-poder", year: 1933, dateLabel: "1933", title: "Nazismo no poder", body: "O regime nazista proíbe partidos e sindicatos e persegue comunistas e social-democratas.", scope: "INTERNATIONAL", tags: ["direita"], claimKey: "nazismo-perseguiu-esquerda" },
  { slug: "fome-ucrania", year: 1932, dateLabel: "1932–1933", title: "Fome na Ucrânia soviética", body: "A coletivização forçada imposta pelo regime soviético provoca fome com milhões de mortos.", scope: "INTERNATIONAL", tags: ["esquerda"], claimKey: "fomes-sovietica-chinesa" },
  { slug: "teoria-geral", year: 1936, dateLabel: "1936", title: "Keynes e a Teoria Geral", body: "A defesa da atuação estatal contra crises influencia governos de todo o espectro no pós-guerra.", scope: "INTERNATIONAL", tags: ["economia", "centro"], claimKey: "keynes-1936" },
  { slug: "clt", year: 1943, dateLabel: "1943", title: "CLT", body: "Getúlio Vargas institui a Consolidação das Leis do Trabalho durante o Estado Novo.", scope: "BRAZIL", tags: ["esquerda", "economia"], claimKey: "clt-1943" },
  { slug: "caminho-servidao", year: 1944, dateLabel: "1944", title: "O caminho da servidão", body: "Hayek alerta que o planejamento central ameaça a liberdade.", scope: "INTERNATIONAL", tags: ["direita", "economia"], claimKey: "hayek-1944" },
  { slug: "fome-china", year: 1959, dateLabel: "1959–1961", title: "Grande Fome na China", body: "Metas do “Grande Salto Adiante” de Mao Tsé-tung levam a uma fome com milhões de mortos.", scope: "INTERNATIONAL", tags: ["esquerda"], claimKey: "fomes-sovietica-chinesa" },
  { slug: "golpe-64", year: 1964, dateLabel: "1964", title: "Golpe e regime militar", body: "Golpe civil-militar depõe João Goulart; o regime dura até 1985.", scope: "BRAZIL", tags: ["direita", "instituicoes"], claimKey: "golpe-1964" },
  { slug: "ai-5", year: 1968, dateLabel: "1968", title: "AI-5", body: "O regime endurece: Congresso pode ser fechado e o habeas corpus é suspenso para crimes políticos.", scope: "BRAZIL", tags: ["direita", "instituicoes"], claimKey: "ai5" },
  { slug: "rawls", year: 1971, dateLabel: "1971", title: "Uma teoria da justiça", body: "Rawls formula a defesa filosófica de desigualdades só quando beneficiam os menos favorecidos.", scope: "INTERNATIONAL", tags: ["esquerda", "centro"], claimKey: "rawls-1971" },
  { slug: "nozick", year: 1974, dateLabel: "1974", title: "Anarquia, Estado e utopia", body: "Nozick responde a Rawls com a defesa do Estado mínimo.", scope: "INTERNATIONAL", tags: ["direita"], claimKey: "nozick-1974" },
  { slug: "anistia", year: 1979, dateLabel: "1979", title: "Lei da Anistia", body: "Anistia abrange opositores e agentes do regime, abrindo caminho para a volta de exilados.", scope: "BRAZIL", tags: ["instituicoes"], claimKey: "anistia-1979" },
  { slug: "pt-fundado", year: 1980, dateLabel: "1980", title: "Fundação do PT", body: "Sindicalistas, intelectuais e militantes de base fundam o Partido dos Trabalhadores.", scope: "BRAZIL", tags: ["esquerda"], claimKey: "pt-1980" },
  { slug: "constituicao-88", year: 1988, dateLabel: "1988", title: "Constituição Cidadã", body: "Nova Constituição amplia direitos e cria as bases do SUS.", scope: "BRAZIL", tags: ["instituicoes"], claimKey: "cf88" },
  { slug: "queda-do-muro", year: 1989, dateLabel: "1989–1991", title: "Fim do bloco soviético", body: "Cai o Muro de Berlim e a União Soviética se dissolve; esquerdas do mundo revisam programas.", scope: "INTERNATIONAL", tags: ["esquerda", "direita"], claimKey: "queda-urss" },
  { slug: "plano-real", year: 1994, dateLabel: "1994", title: "Plano Real", body: "Estabilização monetária encerra décadas de inflação muito alta.", scope: "BRAZIL", tags: ["economia", "centro"], claimKey: "plano-real" },
  { slug: "privatizacoes", year: 1998, dateLabel: "1998", title: "Privatização da Telebrás", body: "Ápice do ciclo de desestatizações dos anos 1990.", scope: "BRAZIL", tags: ["direita", "economia"], claimKey: "privatizacoes-1990" },
  { slug: "lrf", year: 2000, dateLabel: "2000", title: "Lei de Responsabilidade Fiscal", body: "Limites para gastos com pessoal e endividamento nos três níveis de governo.", scope: "BRAZIL", tags: ["economia", "instituicoes"], claimKey: "lrf-2000" },
  { slug: "bolsa-familia", year: 2003, dateLabel: "2003", title: "Bolsa Família", body: "Programas de transferência de renda são unificados.", scope: "BRAZIL", tags: ["esquerda", "economia"], claimKey: "bolsa-familia-criacao" },
  { slug: "crise-financeira", year: 2008, dateLabel: "2008", title: "Crise financeira global", body: "Colapso de bancos reabre o debate sobre regulação dos mercados.", scope: "INTERNATIONAL", tags: ["economia"], claimKey: "crise-2008" },
  { slug: "ficha-limpa", year: 2010, dateLabel: "2010", title: "Ficha Limpa", body: "Lei de iniciativa popular torna inelegíveis condenados por órgãos colegiados.", scope: "BRAZIL", tags: ["instituicoes"], claimKey: "ficha-limpa" },
  { slug: "mensalao", year: 2012, dateLabel: "2012", title: "Julgamento do mensalão", body: "STF condena 25 réus, entre eles dirigentes do PT e de partidos aliados.", scope: "BRAZIL", tags: ["esquerda", "instituicoes"], claimKey: "mensalao" },
  { slug: "cnv", year: 2014, dateLabel: "2014", title: "Relatório da Comissão da Verdade", body: "CNV responsabiliza 377 agentes por graves violações durante o regime militar.", scope: "BRAZIL", tags: ["direita", "instituicoes"], claimKey: "cnv-2014" },
  { slug: "recessao", year: 2015, dateLabel: "2015–2016", title: "Recessão", body: "PIB cai em dois anos consecutivos, na maior recessão da série do IBGE.", scope: "BRAZIL", tags: ["esquerda", "economia"], claimKey: "recessao-2015-2016" },
  { slug: "impeachment", year: 2016, dateLabel: "2016", title: "Impeachment de Dilma Rousseff", body: "Senado aprova a perda do mandato por crimes de responsabilidade; aliados chamam o processo de golpe.", scope: "BRAZIL", tags: ["esquerda", "instituicoes"], claimKey: "impeachment-2016" },
  { slug: "teto", year: 2016, dateLabel: "2016", title: "Teto de gastos", body: "Emenda limita o crescimento das despesas federais à inflação.", scope: "BRAZIL", tags: ["direita", "economia"], claimKey: "teto-gastos-2016" },
  { slug: "reforma-trabalhista", year: 2017, dateLabel: "2017", title: "Reforma trabalhista", body: "Acordos coletivos passam a prevalecer sobre a lei em diversos pontos.", scope: "BRAZIL", tags: ["direita", "economia"], claimKey: "reforma-trabalhista-2017" },
  { slug: "previdencia", year: 2019, dateLabel: "2019", title: "Reforma da Previdência", body: "Idade mínima para aposentadoria passa a valer.", scope: "BRAZIL", tags: ["direita", "economia"], claimKey: "reforma-previdencia-2019" },
  { slug: "anulacao-lula", year: 2021, dateLabel: "2021", title: "STF anula condenações de Lula", body: "Plenário confirma a incompetência da Justiça Federal de Curitiba; Moro é declarado suspeito no caso do triplex.", scope: "BRAZIL", tags: ["esquerda", "instituicoes"], claimKey: "lula-anulacao-2021" },
  { slug: "bc-autonomo", year: 2021, dateLabel: "2021", title: "Autonomia do Banco Central", body: "Diretoria passa a ter mandatos fixos e não coincidentes com o do presidente.", scope: "BRAZIL", tags: ["economia", "instituicoes"], claimKey: "bc-autonomia" },
  { slug: "oito-janeiro", year: 2023, dateLabel: "2023", title: "8 de janeiro", body: "Sedes dos Três Poderes são invadidas e depredadas em Brasília.", scope: "BRAZIL", tags: ["direita", "instituicoes"], claimKey: "oito-de-janeiro" },
  { slug: "arcabouco", year: 2023, dateLabel: "2023", title: "Arcabouço fiscal", body: "Governo Lula aprova nova regra fiscal no lugar do teto de gastos.", scope: "BRAZIL", tags: ["esquerda", "economia"], claimKey: "teto-gastos-2016" },
  { slug: "julgamento-stf-2025", year: 2025, dateLabel: "2025", title: "STF julga trama golpista", body: "Primeira Turma condena Jair Bolsonaro e outros sete réus; a defesa contesta.", scope: "BRAZIL", tags: ["direita", "instituicoes"], claimKey: "stf-trama-golpista-2025" },
];

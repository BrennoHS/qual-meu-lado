/**
 * Fontes documentais iniciais.
 *
 * Política: só entram URLs conferidas em 12/10/2026 (HTTP 200) ou de
 * instituições oficiais que bloqueiam acesso automatizado (HTTP 403 → BLOCKED,
 * exigem conferência manual). Livros e artigos acadêmicos sem URL estável são
 * registrados pela referência bibliográfica completa.
 */
export type SourceSeed = {
  slug: string;
  title: string;
  url?: string;
  institution: string;
  author?: string;
  kind: "OFFICIAL" | "LEGISLATION" | "DATA" | "ACADEMIC" | "BOOK" | "JOURNALISM" | "FACT_CHECK" | "CAMPAIGN" | "DEMO" | "OTHER";
  publishedLabel?: string;
  publishedAt?: string;
  notes?: string;
  linkStatus?: "OK" | "BLOCKED" | "UNKNOWN";
  isDemo?: boolean;
};

const planalto = "Presidência da República — Planalto";

const law = (slug: string, title: string, url: string, publishedAt: string): SourceSeed => ({
  slug,
  title,
  url,
  institution: planalto,
  kind: "LEGISLATION",
  publishedAt,
  publishedLabel: publishedAt.slice(0, 4),
  linkStatus: "OK",
  notes: "Texto compilado oficial. Verifique a redação vigente e alterações posteriores.",
});

export const sources: SourceSeed[] = [
  // ── Obras de referência (livros) ───────────────────────────────
  { slug: "bobbio-1994", title: "Direita e esquerda: razões e significados de uma distinção política", institution: "Editora Unesp (ed. brasileira)", author: "Norberto Bobbio", kind: "BOOK", publishedLabel: "1994 (orig. italiano)" },
  { slug: "burke-1790", title: "Reflexões sobre a Revolução na França", institution: "Diversas edições", author: "Edmund Burke", kind: "BOOK", publishedLabel: "1790" },
  { slug: "smith-1776", title: "A riqueza das nações", institution: "Diversas edições", author: "Adam Smith", kind: "BOOK", publishedLabel: "1776" },
  { slug: "marx-engels-1848", title: "Manifesto do Partido Comunista", institution: "Diversas edições", author: "Karl Marx e Friedrich Engels", kind: "BOOK", publishedLabel: "1848" },
  { slug: "keynes-1936", title: "A teoria geral do emprego, do juro e da moeda", institution: "Diversas edições", author: "John Maynard Keynes", kind: "BOOK", publishedLabel: "1936" },
  { slug: "hayek-1944", title: "O caminho da servidão", institution: "Diversas edições", author: "Friedrich A. Hayek", kind: "BOOK", publishedLabel: "1944" },
  { slug: "hayek-1945", title: "The Use of Knowledge in Society", institution: "American Economic Review, v. 35, n. 4", author: "Friedrich A. Hayek", kind: "ACADEMIC", publishedLabel: "1945" },
  { slug: "friedman-1962", title: "Capitalismo e liberdade", institution: "Diversas edições", author: "Milton Friedman", kind: "BOOK", publishedLabel: "1962" },
  { slug: "rawls-1971", title: "Uma teoria da justiça", institution: "Diversas edições", author: "John Rawls", kind: "BOOK", publishedLabel: "1971" },
  { slug: "nozick-1974", title: "Anarquia, Estado e utopia", institution: "Diversas edições", author: "Robert Nozick", kind: "BOOK", publishedLabel: "1974" },
  { slug: "kornai-1992", title: "The Socialist System: The Political Economy of Communism", institution: "Princeton University Press", author: "János Kornai", kind: "BOOK", publishedLabel: "1992" },
  { slug: "hobsbawm-1994", title: "Era dos extremos: o breve século XX (1914–1991)", institution: "Companhia das Letras (ed. brasileira)", author: "Eric Hobsbawm", kind: "BOOK", publishedLabel: "1994" },
  { slug: "piketty-2013", title: "O capital no século XXI", institution: "Intrínseca (ed. brasileira)", author: "Thomas Piketty", kind: "BOOK", publishedLabel: "2013" },
  { slug: "paxton-2004", title: "A anatomia do fascismo", institution: "Paz e Terra (ed. brasileira)", author: "Robert O. Paxton", kind: "BOOK", publishedLabel: "2004" },
  { slug: "applebaum-2003", title: "Gulag: uma história dos campos de prisioneiros soviéticos", institution: "Ediouro (ed. brasileira)", author: "Anne Applebaum", kind: "BOOK", publishedLabel: "2003" },
  { slug: "applebaum-2017", title: "A fome vermelha: a guerra de Stálin na Ucrânia", institution: "Record (ed. brasileira)", author: "Anne Applebaum", kind: "BOOK", publishedLabel: "2017" },
  { slug: "dikotter-2010", title: "A grande fome de Mao", institution: "Record (ed. brasileira)", author: "Frank Dikötter", kind: "BOOK", publishedLabel: "2010" },
  { slug: "fausto-1994", title: "História do Brasil", institution: "Edusp", author: "Boris Fausto", kind: "BOOK", publishedLabel: "1994 (edições revistas posteriores)" },
  { slug: "power-2000", title: "The Political Right in Postauthoritarian Brazil: Elites, Institutions, and Democratization", institution: "Penn State University Press", author: "Timothy J. Power", kind: "BOOK", publishedLabel: "2000" },

  // ── Enciclopédias acadêmicas ───────────────────────────────────
  { slug: "sep-liberalism", title: "Liberalism", url: "https://plato.stanford.edu/entries/liberalism/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "sep-socialism", title: "Socialism", url: "https://plato.stanford.edu/entries/socialism/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "sep-libertarianism", title: "Libertarianism", url: "https://plato.stanford.edu/entries/libertarianism/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "sep-conservatism", title: "Conservatism", url: "https://plato.stanford.edu/entries/conservatism/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "sep-burke", title: "Edmund Burke", url: "https://plato.stanford.edu/entries/burke/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "sep-equality", title: "Equality", url: "https://plato.stanford.edu/entries/equality/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "sep-distributive-justice", title: "Distributive Justice", url: "https://plato.stanford.edu/entries/justice-distributive/", institution: "Stanford Encyclopedia of Philosophy", kind: "ACADEMIC", linkStatus: "OK" },
  { slug: "britannica-left", title: "Left (political science)", url: "https://www.britannica.com/topic/left", institution: "Encyclopaedia Britannica", kind: "ACADEMIC", linkStatus: "BLOCKED" },
  { slug: "britannica-fascism", title: "Fascism", url: "https://www.britannica.com/topic/fascism", institution: "Encyclopaedia Britannica", kind: "ACADEMIC", linkStatus: "BLOCKED" },

  // ── Legislação (Planalto) ──────────────────────────────────────
  law("cf-1988", "Constituição da República Federativa do Brasil de 1988", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm", "1988-10-05"),
  law("lei-9504-1997", "Lei nº 9.504/1997 — Lei das Eleições", "https://www.planalto.gov.br/ccivil_03/leis/l9504.htm", "1997-09-30"),
  law("lgpd-2018", "Lei nº 13.709/2018 — Lei Geral de Proteção de Dados (LGPD)", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm", "2018-08-14"),
  law("lrf-2000", "Lei Complementar nº 101/2000 — Lei de Responsabilidade Fiscal", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm", "2000-05-04"),
  law("ec-95-2016", "Emenda Constitucional nº 95/2016 — Novo Regime Fiscal (teto de gastos)", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc95.htm", "2016-12-15"),
  law("lc-200-2023", "Lei Complementar nº 200/2023 — Regime fiscal sustentável (arcabouço fiscal)", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp200.htm", "2023-08-30"),
  law("lc-179-2021", "Lei Complementar nº 179/2021 — Autonomia do Banco Central", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm", "2021-02-24"),
  law("lei-13467-2017", "Lei nº 13.467/2017 — Reforma trabalhista", "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13467.htm", "2017-07-13"),
  law("ec-103-2019", "Emenda Constitucional nº 103/2019 — Reforma da Previdência", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm", "2019-11-12"),
  law("lei-10836-2004", "Lei nº 10.836/2004 — Cria o Programa Bolsa Família", "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.836.htm", "2004-01-09"),
  law("lei-14601-2023", "Lei nº 14.601/2023 — Institui o novo Programa Bolsa Família", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14601.htm", "2023-06-19"),
  law("lei-10826-2003", "Lei nº 10.826/2003 — Estatuto do Desarmamento", "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.826.htm", "2003-12-22"),
  law("lei-14026-2020", "Lei nº 14.026/2020 — Novo marco legal do saneamento", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14026.htm", "2020-07-15"),
  law("lei-12651-2012", "Lei nº 12.651/2012 — Código Florestal", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm", "2012-05-25"),
  law("lei-9069-1995", "Lei nº 9.069/1995 — Plano Real", "https://www.planalto.gov.br/ccivil_03/leis/l9069.htm", "1995-06-29"),
  law("lei-8080-1990", "Lei nº 8.080/1990 — Lei Orgânica da Saúde (SUS)", "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm", "1990-09-19"),
  law("lei-9491-1997", "Lei nº 9.491/1997 — Programa Nacional de Desestatização", "https://www.planalto.gov.br/ccivil_03/leis/l9491.htm", "1997-09-09"),
  law("lei-9472-1997", "Lei nº 9.472/1997 — Lei Geral de Telecomunicações", "https://www.planalto.gov.br/ccivil_03/leis/l9472.htm", "1997-07-16"),
  law("lei-12711-2012", "Lei nº 12.711/2012 — Lei de Cotas no ensino superior federal", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12711.htm", "2012-08-29"),
  law("del-5452-1943", "Decreto-Lei nº 5.452/1943 — Consolidação das Leis do Trabalho (CLT)", "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm", "1943-05-01"),
  law("lei-13874-2019", "Lei nº 13.874/2019 — Declaração de Direitos de Liberdade Econômica", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13874.htm", "2019-09-20"),
  law("ai-5-1968", "Ato Institucional nº 5, de 13 de dezembro de 1968", "https://www.planalto.gov.br/ccivil_03/ait/ait-05-68.htm", "1968-12-13"),
  law("lei-6683-1979", "Lei nº 6.683/1979 — Lei da Anistia", "https://www.planalto.gov.br/ccivil_03/leis/l6683.htm", "1979-08-28"),
  law("lei-12846-2013", "Lei nº 12.846/2013 — Lei Anticorrupção", "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12846.htm", "2013-08-01"),
  law("lc-135-2010", "Lei Complementar nº 135/2010 — Lei da Ficha Limpa", "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp135.htm", "2010-06-04"),
  law("lei-14182-2021", "Lei nº 14.182/2021 — Desestatização da Eletrobras", "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14182.htm", "2021-07-12"),
  law("ec-108-2020", "Emenda Constitucional nº 108/2020 — Fundeb permanente", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc108.htm", "2020-08-26"),
  law("lei-11343-2006", "Lei nº 11.343/2006 — Lei de Drogas", "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11343.htm", "2006-08-23"),
  law("ec-16-1997", "Emenda Constitucional nº 16/1997 — Reeleição", "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc16.htm", "1997-06-04"),
  { slug: "cnj-res-175-2013", title: "Resolução CNJ nº 175/2013 — Casamento civil entre pessoas do mesmo sexo", url: "https://atos.cnj.jus.br/atos/detalhar/1754", institution: "Conselho Nacional de Justiça", kind: "LEGISLATION", publishedAt: "2013-05-14", publishedLabel: "2013", linkStatus: "OK" },

  // ── Instituições oficiais e dados ──────────────────────────────
  { slug: "tse-portal", title: "Portal do Tribunal Superior Eleitoral — resultados e estatísticas eleitorais", url: "https://www.tse.jus.br", institution: "Tribunal Superior Eleitoral", kind: "OFFICIAL", linkStatus: "BLOCKED", notes: "O portal bloqueia verificação automatizada; conferir manualmente." },
  { slug: "tse-res-23600", title: "Resolução TSE nº 23.600/2019 — Pesquisas eleitorais", url: "https://www.tse.jus.br/legislacao/compilada/res/2019/resolucao-no-23-600-de-12-de-dezembro-de-2019", institution: "Tribunal Superior Eleitoral", kind: "LEGISLATION", publishedAt: "2019-12-12", publishedLabel: "2019", linkStatus: "BLOCKED" },
  { slug: "tse-partidos", title: "Partidos registrados no TSE", url: "https://www.tse.jus.br/partidos/partidos-registrados-no-tse", institution: "Tribunal Superior Eleitoral", kind: "OFFICIAL", linkStatus: "BLOCKED" },
  { slug: "divulgacandcontas", title: "DivulgaCandContas — candidaturas e prestações de contas", url: "https://divulgacandcontas.tse.jus.br/divulga/", institution: "Tribunal Superior Eleitoral", kind: "OFFICIAL", linkStatus: "BLOCKED" },
  { slug: "ibge-pib-2016", title: "PIB recua 3,6% em 2016 e fecha ano em R$ 6,3 trilhões", url: "https://agenciadenoticias.ibge.gov.br/pt/agencia-sala-de-imprensa/9439-pib-recua-3-6-em-2016-e-fecha-ano-em-r-6-3-trilhoes.html", institution: "IBGE — Agência de Notícias", kind: "DATA", publishedAt: "2017-03-07", publishedLabel: "07/03/2017", linkStatus: "BLOCKED", notes: "Primeira estimativa. As Contas Nacionais foram revisadas depois; os valores revisados são um pouco menores, mas mantêm o biênio como o de maior queda da série." },
  { slug: "ipea-atlas-violencia", title: "Atlas da Violência", url: "https://www.ipea.gov.br/atlasviolencia/", institution: "Ipea e Fórum Brasileiro de Segurança Pública", kind: "DATA", linkStatus: "OK" },
  { slug: "wpb-brazil", title: "World Prison Brief — Brazil", url: "https://www.prisonstudies.org/country/brazil", institution: "Institute for Crime & Justice Policy Research (Birkbeck, University of London)", kind: "DATA", linkStatus: "OK" },
  { slug: "bcb-portal", title: "Banco Central do Brasil", url: "https://www.bcb.gov.br", institution: "Banco Central do Brasil", kind: "OFFICIAL", linkStatus: "OK" },
  { slug: "camara-dados-abertos", title: "Dados Abertos da Câmara dos Deputados", url: "https://dadosabertos.camara.leg.br", institution: "Câmara dos Deputados", kind: "DATA", linkStatus: "OK" },
  { slug: "anpd", title: "Autoridade Nacional de Proteção de Dados", url: "https://www.gov.br/anpd/pt-br", institution: "ANPD", kind: "OFFICIAL", linkStatus: "OK" },
  { slug: "cnv-portal", title: "Comissão Nacional da Verdade — relatório final", url: "https://cnv.memoriasreveladas.gov.br/", institution: "Comissão Nacional da Verdade / Arquivo Nacional", kind: "OFFICIAL", publishedLabel: "2014", linkStatus: "OK" },
  { slug: "radio-senado-cnv-2014", title: "Renan recebe relatório final da Comissão Nacional da Verdade", url: "https://www12.senado.leg.br/radio/1/noticia/2014/12/10/renan-recebe-relatorio-final-da-comissao-nacional-da-verdade", institution: "Rádio Senado", kind: "OFFICIAL", publishedAt: "2014-12-10", publishedLabel: "10/12/2014", linkStatus: "OK" },
  { slug: "hrw-cnv-2014", title: "Brasil: Comissão da Verdade expõe atrocidades da ditadura", url: "https://www.hrw.org/pt/news/2014/12/10/brasil-comissao-da-verdade-expoe-atrocidades-da-ditadura", institution: "Human Rights Watch", kind: "OTHER", publishedAt: "2014-12-10", publishedLabel: "10/12/2014", linkStatus: "OK" },
  { slug: "senado-impeachment-pronuncia", title: "Senado vai julgar presidente Dilma Rousseff por crimes de responsabilidade", url: "https://www12.senado.leg.br/noticias/materias/2016/08/10/senado-vai-julgar-presidente-dilma-rousseff-por-crimes-de-responsabilidade-1", institution: "Agência Senado", kind: "OFFICIAL", publishedAt: "2016-08-10", publishedLabel: "10/08/2016", linkStatus: "OK" },
  { slug: "senado-impeachment-final", title: "Senado aprova impeachment de Dilma Rousseff", url: "https://www12.senado.leg.br/radio/1/noticia/2016/08/31/senado-aprova-impeachment-de-dilma-rousseff", institution: "Rádio Senado", kind: "OFFICIAL", publishedAt: "2016-08-31", publishedLabel: "31/08/2016", linkStatus: "OK" },
  { slug: "enap-bf-15-anos", title: "Bolsa Família 15 anos (2003–2018)", url: "https://repositorio.enap.gov.br/handle/1/3647", institution: "Escola Nacional de Administração Pública (Enap)", kind: "ACADEMIC", publishedLabel: "2018", linkStatus: "OK" },
  { slug: "ipea-bf-effects", title: "The effects of Brazil's Bolsa Família programme on poverty and inequality: an assessment of the first 15 years", url: "https://repositorio.ipea.gov.br/entities/publication/fc8464f4-e233-4d7e-9e78-6ce4f5488bed/full", institution: "Ipea / International Policy Centre for Inclusive Growth", kind: "ACADEMIC", publishedLabel: "2019", linkStatus: "OK" },
  { slug: "bolognesi-2023", title: "Uma nova classificação ideológica dos partidos políticos brasileiros", url: "https://scielo.br/j/dados/a/zzyM3gzHD4P45WWdytXjZWg/?format=pdf", institution: "Dados — Revista de Ciências Sociais, v. 66, n. 2", author: "Bruno Bolognesi, Ednaldo Ribeiro e Adriano Codato", kind: "ACADEMIC", publishedLabel: "2023", linkStatus: "UNKNOWN", notes: "DOI 10.1590/dados.2023.66.2.303. Survey com cientistas políticos realizado em 2018." },
  { slug: "worldbank-poverty", title: "Poverty, Prosperity, and Planet Report (série Poverty and Shared Prosperity)", url: "https://www.worldbank.org/en/publication/poverty-and-shared-prosperity", institution: "Banco Mundial", kind: "DATA", linkStatus: "OK" },
  { slug: "imf-blanchard-leigh-2013", title: "Growth Forecast Errors and Fiscal Multipliers (IMF Working Paper 13/1)", url: "https://www.imf.org/external/pubs/ft/wp/2013/wp1301.pdf", institution: "Fundo Monetário Internacional", author: "Olivier Blanchard e Daniel Leigh", kind: "ACADEMIC", publishedLabel: "2013", linkStatus: "BLOCKED" },
  { slug: "fcic-2011", title: "The Financial Crisis Inquiry Report", url: "https://www.govinfo.gov/app/details/GPO-FCIC", institution: "Financial Crisis Inquiry Commission (EUA)", kind: "OFFICIAL", publishedLabel: "2011", linkStatus: "OK", notes: "O relatório tem votos dissidentes de membros da comissão, que atribuem pesos diferentes às causas da crise." },
  { slug: "r4v", title: "Plataforma de Coordenação Interagencial para Refugiados e Migrantes da Venezuela", url: "https://www.r4v.info/", institution: "R4V (ACNUR e OIM)", kind: "DATA", linkStatus: "BLOCKED" },

  // ── Jornalismo profissional (complementar) ─────────────────────
  { slug: "cf-mensalao-2012", title: "STF encerra julgamento do mensalão", url: "https://www.congressoemfoco.com.br/noticia/59193/stf-encerra-julgamento-do-mensalao", institution: "Congresso em Foco", kind: "JOURNALISM", publishedLabel: "dez. 2012", linkStatus: "OK" },
  { slug: "poder360-lula-2021", title: "Plenário do STF anula condenações de Lula na Lava Jato", url: "https://www.poder360.com.br/justica/stf-confirma-anulacao-das-decisoes-da-justica-de-curitiba/", institution: "Poder360", kind: "JOURNALISM", publishedLabel: "abr. 2021", linkStatus: "OK" },
  { slug: "opovo-cpmi-2023", title: "CPMI do 8/1 aprova relatório final e pede indiciamento de Bolsonaro e mais 60", url: "https://www.opovo.com.br/noticias/politica/2023/10/18/cpmi-do-8-1-aprova-relatorio-final-e-pede-indiciamento-de-bolsonaro-e-mais-60.html", institution: "O Povo", kind: "JOURNALISM", publishedAt: "2023-10-18", publishedLabel: "18/10/2023", linkStatus: "OK" },
  { slug: "bloomberglinea-stf-2025", title: "Jair Bolsonaro é considerado culpado pelo STF por golpe de Estado e mais quatro crimes", url: "https://www.bloomberglinea.com.br/brasil/jair-bolsonaro-e-considerado-culpado-pelo-stf-por-golpe-de-estado-e-mais-quatro-crimes/", institution: "Bloomberg Línea", kind: "JOURNALISM", publishedLabel: "set. 2025", linkStatus: "OK" },
  { slug: "cm-stf-2025", title: "Bolsonaro e outros sete réus são condenados por tentativa de golpe de Estado", url: "https://www.correiodamanha.com.br/politica/2025/09/220907-bolsonaro-e-outros-sete-reus-sao-condenados-por-tentativa-de-golpe-de-estado.html", institution: "Correio da Manhã", kind: "JOURNALISM", publishedLabel: "set. 2025", linkStatus: "OK" },

  // ── Eleições 2026 (fontes primárias) ───────────────────────────
  { slug: "tse-resultado-1turno-2026", title: "Flávio Bolsonaro (PL) e Lula (PT) vão disputar o 2º turno para a Presidência da República", url: "https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/flavio-bolsonaro-e-lula-vao-disputar-o-2o-turno-para-a-presidencia-da-republica", institution: "Tribunal Superior Eleitoral", kind: "OFFICIAL", publishedAt: "2026-10-05", publishedLabel: "05/10/2026", linkStatus: "BLOCKED", notes: "Conferido manualmente em 13/10/2026 (o portal bloqueia verificação automatizada)." },
  { slug: "tse-propostas-2026", title: "Planos de governo dos candidatos ao cargo de Presidente da República — Eleições 2026", url: "https://www.tse.jus.br/eleicoes/eleicoes-2026-content/propostas-de-governo-dos-candidatos-ao-cargo-de-presidente-da-republica-eleicoes-2026", institution: "Tribunal Superior Eleitoral", kind: "OFFICIAL", publishedLabel: "2026", linkStatus: "BLOCKED", notes: "Índice oficial com os planos registrados e o índice temático por página." },
  { slug: "plano-lula-2026", title: "Diretrizes para o Programa de Transformação do Brasil — plano de governo registrado (Lula, PT, coligação Brasil Pronto pra Mais)", url: "https://www.tse.jus.br/eleicoes/eleicoes-2026-content/arquivos/proposta-pt/@@display-file/file/proposta-pt.pdf", institution: "Candidatura Lula (PT) — documento registrado no TSE", kind: "CAMPAIGN", publishedLabel: "2026", linkStatus: "BLOCKED", notes: "Fonte primária do que foi PROMETIDO, não prova de viabilidade. Trechos conferidos no PDF oficial em 13/10/2026; páginas indicadas conforme a numeração do documento." },
  { slug: "plano-flavio-2026", title: "Plano de governo registrado (Flávio Bolsonaro, PL)", url: "https://www.tse.jus.br/eleicoes/eleicoes-2026-content/arquivos/proposta-pl/@@display-file/file/proposta-pl.pdf", institution: "Candidatura Flávio Bolsonaro (PL) — documento registrado no TSE", kind: "CAMPAIGN", publishedLabel: "2026", linkStatus: "BLOCKED", notes: "Fonte primária do que foi PROMETIDO, não prova de viabilidade. Trechos conferidos no PDF oficial em 13/10/2026; páginas indicadas conforme a numeração do documento." },
];

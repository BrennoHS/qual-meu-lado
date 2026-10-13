/** Mitos e realidades + curiosidades ("Você sabia?"). */
export type MythSeed = {
  slug: string;
  statement: string;
  verdict: "CONFIRMED" | "FALSE" | "PARTIAL" | "CONTEXT_DEPENDENT" | "INSUFFICIENT_EVIDENCE";
  explanation: string;
  claimKeys: string[];
};

export const myths: MythSeed[] = [
  {
    slug: "origem-francesa",
    statement: "Os termos “esquerda” e “direita” nasceram na Revolução Francesa.",
    verdict: "CONFIRMED",
    explanation: "A origem está na disposição dos assentos da Assembleia Nacional de 1789. O que mudou foi o conteúdo associado a cada lado.",
    claimKeys: ["origem-assembleia-1789"],
  },
  {
    slug: "mesmo-significado",
    statement: "Esquerda e direita significam a mesma coisa em todos os países.",
    verdict: "FALSE",
    explanation: "Os sentidos variam. “Liberal” nos EUA costuma indicar centro-esquerda; no Brasil, geralmente remete ao liberalismo econômico. No século XIX, liberais ocupavam a esquerda.",
    claimKeys: ["termos-variam", "liberais-seculo-xix"],
  },
  {
    slug: "mercado-conservador",
    statement: "Quem defende o livre mercado é, necessariamente, conservador nos costumes.",
    verdict: "FALSE",
    explanation: "Libertários defendem mercado livre e também liberdade ampla nos costumes. Economia e costumes são dimensões que variam de forma independente.",
    claimKeys: ["nozick-1974"],
  },
  {
    slug: "estado-progressista",
    statement: "Quem defende mais Estado na economia é, necessariamente, progressista nos costumes.",
    verdict: "FALSE",
    explanation: "O desenvolvimentismo foi praticado por governos democráticos e pelo regime militar. A CLT foi criada durante o Estado Novo, regime autoritário. Há eleitores de esquerda conservadores em costumes.",
    claimKeys: ["clt-1943"],
  },
  {
    slug: "voto-obrigatorio-todos",
    statement: "No Brasil, o voto é obrigatório para todos os cidadãos.",
    verdict: "PARTIAL",
    explanation: "É obrigatório para alfabetizados de 18 a 70 anos e facultativo para analfabetos, maiores de 70 e jovens de 16 e 17 anos.",
    claimKeys: ["cf88-voto"],
  },
  {
    slug: "saude-direito",
    statement: "A Constituição de 1988 define a saúde como direito de todos e dever do Estado.",
    verdict: "CONFIRMED",
    explanation: "Está no artigo 196. O debate político é sobre como financiar e gerir esse direito — não sobre sua existência legal.",
    claimKeys: ["cf88-saude"],
  },
  {
    slug: "banco-central",
    statement: "O Banco Central do Brasil tem autonomia formal em relação ao governo.",
    verdict: "CONFIRMED",
    explanation: "Desde 2021, presidente e diretores têm mandatos fixos e não coincidentes com o do Presidente da República. O grau ideal de autonomia ainda é debatido.",
    claimKeys: ["bc-autonomia"],
  },
  {
    slug: "nazismo-esquerda",
    statement: "O nazismo era um movimento de esquerda, já que o partido tinha “socialista” no nome.",
    verdict: "FALSE",
    explanation: "A historiografia predominante classifica o nazismo como extrema direita. O regime proibiu sindicatos e perseguiu comunistas e social-democratas. O nome de um partido não define sua ideologia.",
    claimKeys: ["fascismo-classificacao", "nazismo-perseguiu-esquerda"],
  },
  {
    slug: "fomes-exagero",
    statement: "As fomes e a repressão em regimes comunistas do século XX são exageros sem documentação.",
    verdict: "FALSE",
    explanation: "As fomes na Ucrânia soviética (1932–1933) e na China (1959–1961) e o sistema de campos do Gulag estão amplamente documentados. As estimativas de mortes variam entre autores, mas a ocorrência dos fatos e a responsabilidade dos governos não estão em dúvida na historiografia.",
    claimKeys: ["fomes-sovietica-chinesa", "gulag"],
  },
  {
    slug: "regime-militar-sem-violacoes",
    statement: "O regime militar brasileiro (1964–1985) não cometeu violações de direitos humanos.",
    verdict: "FALSE",
    explanation: "A Comissão Nacional da Verdade documentou 434 mortos e desaparecidos e responsabilizou 377 agentes do Estado. O AI-5 suspendeu garantias como o habeas corpus para crimes políticos.",
    claimKeys: ["cnv-2014", "ai5"],
  },
  {
    slug: "enquete-online",
    statement: "Uma enquete aberta na internet mostra o que os brasileiros pensam.",
    verdict: "FALSE",
    explanation: "Participação voluntária não forma amostra representativa. Pesquisas eleitorais seguem regras de metodologia e registro na Justiça Eleitoral. Por isso este site não publica placares de opinião.",
    claimKeys: ["pesquisas-registro"],
  },
  {
    slug: "partido-nome",
    statement: "O nome de um partido indica com segurança sua posição ideológica.",
    verdict: "CONTEXT_DEPENDENT",
    explanation: "Nomes refletem o momento da fundação e nem sempre acompanham mudanças posteriores. Classificações de especialistas apontam deslocamentos de partidos ao longo do tempo. Programas, votações e alianças dizem mais.",
    claimKeys: ["bolognesi-classificacao"],
  },
];

export type CuriositySeed = { slug: string; text: string; claimKey?: string; tags: string[] };

export const curiosities: CuriositySeed[] = [
  { slug: "assentos", text: "Os termos “esquerda” e “direita” vêm de uma questão prática: onde cada grupo sentava na Assembleia francesa de 1789.", claimKey: "origem-assembleia-1789", tags: ["origens"] },
  { slug: "liberais-esquerda", text: "No século XIX, os liberais estavam à esquerda: enfrentavam monarquistas e defendiam constituições e liberdade de imprensa.", claimKey: "liberais-seculo-xix", tags: ["origens", "direita"] },
  { slug: "clt-estado-novo", text: "A CLT, símbolo dos direitos trabalhistas, foi criada em 1943 por um governo autoritário — o Estado Novo de Vargas.", claimKey: "clt-1943", tags: ["brasil", "esquerda"] },
  { slug: "friedman-renda", text: "Milton Friedman, ícone liberal, propôs o “imposto de renda negativo” — uma espécie de renda mínima paga pelo Estado.", claimKey: "friedman-1962", tags: ["direita", "politicas-sociais"] },
  { slug: "direita-envergonhada", text: "Depois de 1985, poucos políticos brasileiros se diziam “de direita”. Pesquisadores chamaram o fenômeno de “direita envergonhada”.", claimKey: "direita-envergonhada", tags: ["brasil", "direita"] },
  { slug: "ficha-limpa-popular", text: "A Lei da Ficha Limpa começou como projeto de iniciativa popular, com assinaturas de eleitores.", claimKey: "ficha-limpa", tags: ["brasil", "instituicoes"] },
  { slug: "bobbio", text: "O filósofo italiano Norberto Bobbio sugeriu que a atitude diante da igualdade é o critério mais duradouro para separar esquerda e direita.", claimKey: "bobbio-igualdade", tags: ["origens"] },
  { slug: "desenvolvimentismo-dois-lados", text: "Planos de industrialização com forte presença estatal foram adotados tanto por governos democráticos quanto pelo regime militar brasileiro.", tags: ["brasil", "economia"] },
];

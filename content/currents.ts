/**
 * Correntes ideológicas. As coordenadas econX/socialY são um ESQUEMA
 * DIDÁTICO de posições aproximadas (não uma medição) — o site exibe esse
 * aviso sempre que o gráfico aparece.
 *   econX:   -1 = mais coordenação estatal … +1 = mais coordenação de mercado
 *   socialY: -1 = mais abertura a mudanças nos costumes … +1 = mais tradição
 */
export type CurrentSeed = {
  slug: string;
  name: string;
  family: "Esquerda" | "Direita" | "Transversal";
  side?: "LEFT" | "RIGHT";
  summary: string;
  keyIdeas: string[];
  thinkers: string[];
  inBrazil?: string;
  econX?: number;
  socialY?: number;
};

export const currents: CurrentSeed[] = [
  {
    slug: "social-democracia",
    name: "Social-democracia",
    family: "Esquerda",
    side: "LEFT",
    summary: "Aceita a economia de mercado e a democracia representativa, mas defende que o Estado corrija desigualdades por meio de impostos progressivos, serviços públicos universais e negociação entre trabalhadores e empresas.",
    keyIdeas: ["Estado de bem-estar social", "Reformas graduais, não revolução", "Negociação coletiva entre capital e trabalho"],
    thinkers: ["Eduard Bernstein", "John Rawls (liberalismo igualitário, afinidade)"],
    inBrazil: "O PSDB nasceu (1988) com identidade social-democrata, mas governou com reformas liberalizantes; parte do PT, do PDT e do PSB também reivindica a tradição.",
    econX: -0.35,
    socialY: -0.3,
  },
  {
    slug: "socialismo-democratico",
    name: "Socialismo democrático",
    family: "Esquerda",
    side: "LEFT",
    summary: "Defende ampliar a propriedade pública ou coletiva de setores da economia, mas por vias eleitorais e com liberdades civis preservadas.",
    keyIdeas: ["Democratização da economia", "Propriedade pública ou cooperativa de setores-chave", "Rejeição ao autoritarismo"],
    thinkers: ["Rosa Luxemburgo (crítica ao autoritarismo bolchevique)", "Antonio Gramsci"],
    inBrazil: "Presente em correntes do PT e do PSOL, com divergências sobre ritmo e alianças.",
    econX: -0.7,
    socialY: -0.55,
  },
  {
    slug: "marxismo-leninismo",
    name: "Comunismo marxista-leninista",
    family: "Esquerda",
    side: "LEFT",
    summary: "Corrente que orientou a União Soviética, a China maoista e outros regimes: partido único, planejamento central e propriedade estatal dos meios de produção.",
    keyIdeas: ["Luta de classes", "Partido de vanguarda", "Planejamento central"],
    thinkers: ["Karl Marx", "Vladimir Lênin"],
    inBrazil: "O PCB (1922) foi sua principal expressão histórica; hoje é minoritária no sistema partidário.",
    econX: -0.95,
    socialY: -0.1,
  },
  {
    slug: "trabalhismo",
    name: "Trabalhismo",
    family: "Esquerda",
    side: "LEFT",
    summary: "Tradição que prioriza direitos trabalhistas, sindicatos e proteção social, frequentemente com forte papel do Estado na economia e traços nacionalistas.",
    keyIdeas: ["Direitos trabalhistas", "Sindicatos fortes", "Desenvolvimento nacional"],
    thinkers: ["Getúlio Vargas (trabalhismo brasileiro)", "Leonel Brizola"],
    inBrazil: "Ligado à herança de Vargas, ao antigo PTB e ao PDT. A CLT foi criada durante o Estado Novo, regime autoritário — um exemplo de que direitos sociais e democracia nem sempre caminharam juntos.",
    econX: -0.55,
    socialY: 0.05,
  },
  {
    slug: "anarquismo",
    name: "Anarquismo",
    family: "Esquerda",
    side: "LEFT",
    summary: "Rejeita tanto o Estado quanto a hierarquia econômica, defendendo autogestão e associações voluntárias.",
    keyIdeas: ["Abolição do Estado", "Autogestão", "Federação de comunidades livres"],
    thinkers: ["Pierre-Joseph Proudhon", "Mikhail Bakunin"],
    inBrazil: "Teve peso no movimento operário do início do século XX, como na greve geral de 1917 em São Paulo.",
    econX: -0.6,
    socialY: -0.9,
  },
  {
    slug: "liberalismo-economico",
    name: "Liberalismo econômico",
    family: "Direita",
    side: "RIGHT",
    summary: "Defende mercados livres, propriedade privada, concorrência e um Estado concentrado em garantir regras, contratos e estabilidade monetária.",
    keyIdeas: ["Livre iniciativa", "Responsabilidade fiscal", "Abertura comercial"],
    thinkers: ["Adam Smith", "Friedrich Hayek", "Milton Friedman"],
    inBrazil: "Inspirou privatizações dos anos 1990, a Lei de Responsabilidade Fiscal e a Lei de Liberdade Econômica; é a bandeira central do Partido Novo.",
    econX: 0.75,
    socialY: 0.0,
  },
  {
    slug: "libertarianismo",
    name: "Libertarianismo",
    family: "Direita",
    side: "RIGHT",
    summary: "Leva a defesa da liberdade individual ao máximo: Estado mínimo na economia e também nos costumes, com oposição a restrições sobre escolhas pessoais.",
    keyIdeas: ["Estado mínimo", "Autopropriedade", "Liberdade nas escolhas pessoais"],
    thinkers: ["Robert Nozick", "Ludwig von Mises", "Murray Rothbard"],
    inBrazil: "Presente em institutos e movimentos liberais surgidos sobretudo a partir dos anos 2010.",
    econX: 0.95,
    socialY: -0.6,
  },
  {
    slug: "conservadorismo",
    name: "Conservadorismo",
    family: "Direita",
    side: "RIGHT",
    summary: "Valoriza instituições, costumes e comunidades que resistiram ao tempo e desconfia de mudanças rápidas planejadas a partir de teorias abstratas.",
    keyIdeas: ["Prudência e mudança gradual", "Família, religião e comunidades", "Ordem e autoridade legítima"],
    thinkers: ["Edmund Burke", "Michael Oakeshott", "Roger Scruton"],
    inBrazil: "Expressa-se em bancadas religiosas e em partidos de direita; nem todo conservador é liberal na economia.",
    econX: 0.45,
    socialY: 0.7,
  },
  {
    slug: "democracia-crista",
    name: "Democracia cristã",
    family: "Direita",
    side: "RIGHT",
    summary: "Baseada na doutrina social cristã, combina valores tradicionais com economia social de mercado e proteção social.",
    keyIdeas: ["Dignidade da pessoa", "Subsidiariedade", "Economia social de mercado"],
    thinkers: ["Jacques Maritain", "Konrad Adenauer (prática política)"],
    inBrazil: "Teve expressão no PDC (1945–1965); suas ideias circulam hoje em diferentes partidos de centro e direita.",
    econX: 0.0,
    socialY: 0.55,
  },
  {
    slug: "nacional-populismo",
    name: "Direita nacional-populista",
    family: "Direita",
    side: "RIGHT",
    summary: "Combina discurso contra elites, defesa da soberania nacional, pautas conservadoras e, frequentemente, desconfiança de instituições internacionais, da imprensa e de tribunais.",
    keyIdeas: ["Soberania nacional", "“Povo” contra “elites”", "Ordem e valores tradicionais"],
    thinkers: ["Fenômeno estudado por autores como Cas Mudde e Pippa Norris"],
    inBrazil: "Ganhou força na década de 2010. Há debate acadêmico e político sobre quais lideranças se enquadram no conceito.",
    econX: 0.05,
    socialY: 0.92,
  },
  {
    slug: "desenvolvimentismo",
    name: "Desenvolvimentismo",
    family: "Transversal",
    summary: "Defende que o Estado coordene a industrialização e o crescimento — política adotada no Brasil tanto por governos democráticos quanto pelo regime militar.",
    keyIdeas: ["Industrialização", "Bancos e empresas estatais como indutores", "Planejamento de longo prazo"],
    thinkers: ["Celso Furtado", "Raúl Prebisch (Cepal)"],
    inBrazil: "Marcou Vargas, Juscelino Kubitschek, governos militares (como o II PND) e governos do PT — prova de que a mesma política econômica pode aparecer à esquerda e à direita.",
    econX: -0.5,
    socialY: 0.2,
  },
  {
    slug: "ecologismo-politico",
    name: "Ecologismo político",
    family: "Transversal",
    summary: "Coloca a sustentabilidade ambiental no centro das decisões. Costuma se aproximar da esquerda, mas há vertentes conservacionistas e de mercado.",
    keyIdeas: ["Limites ecológicos", "Justiça climática", "Precificação de danos ambientais"],
    thinkers: ["Rachel Carson", "Arne Næss"],
    inBrazil: "Expresso em partidos como PV e Rede e em movimentos socioambientais.",
    econX: -0.35,
    socialY: -0.45,
  },
];

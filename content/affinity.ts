/**
 * Mapa de afinidades — DEFINIÇÕES (dimensões e afirmações).
 * Respostas de visitantes nunca são enviadas ao servidor.
 *
 * direction: +1 → concordar aproxima do polo A; -1 → aproxima do polo B.
 * As afirmações alternam a direção para reduzir o viés de aquiescência
 * (tendência de concordar com qualquer frase).
 */
export type DimensionSeed = {
  key: string;
  name: string;
  description: string;
  poleA: string;
  poleB: string;
  leftPole: "A" | "B" | null;
  relation: "CONVENTIONAL" | "WEAK" | "NONE";
  basis: string;
};

export type StatementSeed = {
  key: string;
  dimension: string;
  direction: 1 | -1;
  text: string;
  context: string;
  argumentsAgree: string;
  argumentsDisagree: string;
  whyDepends: string;
  claimKeys?: string[];
};

export const dimensions: DimensionSeed[] = [
  {
    key: "economia",
    name: "Política econômica",
    description: "Quem deve coordenar investimentos, crédito e setores estratégicos.",
    poleA: "Mais coordenação estatal",
    poleB: "Mais coordenação pelo mercado",
    leftPole: "A",
    relation: "CONVENTIONAL",
    basis: "Associação clássica na ciência política: a esquerda tende a defender mais intervenção estatal na economia; a direita, mais mercado (Bobbio; enciclopédias de filosofia política). Há exceções relevantes, como o desenvolvimentismo de governos militares.",
  },
  {
    key: "estado",
    name: "Tamanho do Estado",
    description: "Quanto de serviços o poder público deve oferecer — e quanto de impostos isso exige.",
    poleA: "Estado mais amplo, com mais serviços",
    poleB: "Estado mais enxuto, com menos impostos",
    leftPole: "A",
    relation: "CONVENTIONAL",
    basis: "Associação convencional e amplamente usada em pesquisas de opinião comparadas. Conservadores podem defender Estado forte em segurança, o que este eixo não captura.",
  },
  {
    key: "liberdades",
    name: "Liberdades individuais",
    description: "Autonomia de adultos em escolhas que afetam principalmente a si mesmos ou a própria expressão.",
    poleA: "Mais autonomia individual",
    poleB: "Mais regulação estatal de condutas",
    leftPole: null,
    relation: "WEAK",
    basis: "Categoria DIDÁTICA. Libertários (direita) e progressistas (esquerda) defendem autonomia em temas diferentes — armas, drogas, expressão. Por isso este eixo não é associado a nenhum lado.",
  },
  {
    key: "costumes",
    name: "Valores e costumes",
    description: "Família, religião e moral: mudar ou preservar.",
    poleA: "Mais abertura a mudanças",
    poleB: "Mais preservação de tradições",
    leftPole: "A",
    relation: "CONVENTIONAL",
    basis: "Associação convencional (eixo progressista–conservador). Há eleitores de esquerda conservadores e liberais de direita progressistas nos costumes.",
  },
  {
    key: "social",
    name: "Políticas sociais e desigualdade",
    description: "Redistribuição de renda e proteção social.",
    poleA: "Mais redistribuição",
    poleB: "Mais responsabilidade individual",
    leftPole: "A",
    relation: "CONVENTIONAL",
    basis: "Corresponde ao critério da igualdade proposto por Bobbio, um dos mais estáveis na literatura sobre esquerda e direita.",
  },
  {
    key: "seguranca",
    name: "Segurança pública",
    description: "Prevenção social ou endurecimento penal como caminho principal.",
    poleA: "Ênfase em prevenção",
    poleB: "Ênfase em punição",
    leftPole: "A",
    relation: "CONVENTIONAL",
    basis: "Associação frequente no debate brasileiro recente, mas não universal: governos de esquerda também ampliaram encarceramento, e liberais de direita criticam a guerra às drogas.",
  },
  {
    key: "ambiente",
    name: "Meio ambiente",
    description: "Proteção ambiental e clima diante de custos econômicos.",
    poleA: "Mais proteção ambiental",
    poleB: "Mais flexibilidade produtiva",
    leftPole: "A",
    relation: "WEAK",
    basis: "Associação relativamente recente e instável. Há conservacionismo de direita e desenvolvimentismo de esquerda com grandes obras e petróleo.",
  },
  {
    key: "instituicoes",
    name: "Instituições democráticas",
    description: "Peso de tribunais, imprensa e órgãos de controle diante da maioria eleita.",
    poleA: "Mais freios e contrapesos",
    poleB: "Mais margem para a maioria eleita",
    leftPole: null,
    relation: "NONE",
    basis: "Categoria DIDÁTICA, sem associação com esquerda ou direita: o apoio a controles institucionais varia conforme quem está no poder, nos dois campos.",
  },
];

export const statements: StatementSeed[] = [
  // ── Política econômica ──
  {
    key: "eco-credito-direcionado",
    dimension: "economia",
    direction: 1,
    text: "O governo deveria ter papel ativo em definir quais setores da economia recebem incentivos e crédito de bancos públicos.",
    context: "Bancos como o BNDES financiam projetos com juros diferenciados. O alcance desse papel muda de governo para governo.",
    argumentsAgree: "Quem concorda costuma argumentar que setores estratégicos e projetos de longo prazo não recebem crédito privado suficiente, e que países que se industrializaram usaram esse tipo de política.",
    argumentsDisagree: "Quem discorda costuma argumentar que o governo escolhe mal os “vencedores”, que o crédito subsidiado tem custo fiscal e que favorece empresas com acesso político.",
    whyDepends: "Pode depender do setor, da transparência dos critérios e de haver avaliação de resultados.",
  },
  {
    key: "eco-impostos-empresas",
    dimension: "economia",
    direction: -1,
    text: "Reduzir impostos sobre empresas tende a beneficiar toda a sociedade, por estimular investimento e emprego.",
    context: "A tributação sobre lucro, folha e consumo afeta decisões de investimento e preços.",
    argumentsAgree: "Quem concorda costuma argumentar que impostos altos reduzem o retorno do investimento, empurram empresas para a informalidade e encarecem a produção.",
    argumentsDisagree: "Quem discorda costuma argumentar que os ganhos se concentram nos donos do capital, que a arrecadação perdida reduz serviços públicos e que o efeito sobre emprego é incerto.",
    whyDepends: "Os efeitos dependem de qual imposto é reduzido, de como a perda é compensada e da situação econômica.",
  },
  {
    key: "eco-estatais-estrategicas",
    dimension: "economia",
    direction: 1,
    text: "Em setores estratégicos, como energia, empresas estatais atendem melhor ao interesse público do que empresas privadas.",
    context: "O Brasil privatizou a Telebrás (1998) e a Eletrobras (2022), mas mantém estatais como a Petrobras sob controle da União.",
    argumentsAgree: "Quem concorda costuma argumentar que estatais garantem soberania, investimentos de longo prazo e preços menos sujeitos à lógica do lucro.",
    argumentsDisagree: "Quem discorda costuma argumentar que estatais ficam expostas a interferência política e corrupção, e que concorrência com regulação produz serviços melhores.",
    whyDepends: "Pode depender da governança da empresa, da qualidade da regulação e de existir concorrência no setor.",
    claimKeys: ["privatizacoes-1990", "eletrobras-2021"],
  },
  // ── Tamanho do Estado ──
  {
    key: "est-servicos-essenciais",
    dimension: "estado",
    direction: 1,
    text: "O Estado deveria participar mais diretamente da oferta de serviços essenciais.",
    context: "Serviços essenciais incluem saúde, educação, saneamento e transporte. Hoje, no Brasil, convivem oferta pública, privada e parcerias.",
    argumentsAgree: "Quem concorda costuma argumentar que a oferta pública garante acesso universal, inclusive em regiões pouco lucrativas, e reduz desigualdades.",
    argumentsDisagree: "Quem discorda costuma argumentar que a gestão privada ou em parceria pode ser mais eficiente e que ampliar o Estado exige mais impostos.",
    whyDepends: "A resposta pode variar por serviço: muita gente defende saúde pública e, ao mesmo tempo, concessões em rodovias.",
    claimKeys: ["cf88-saude", "saneamento-2020"],
  },
  {
    key: "est-menos-impostos",
    dimension: "estado",
    direction: -1,
    text: "É preferível pagar menos impostos, mesmo que isso signifique menos serviços oferecidos pelo governo.",
    context: "Toda política pública tem custo. Esta afirmação pergunta sobre a troca entre carga tributária e serviços.",
    argumentsAgree: "Quem concorda costuma argumentar que as pessoas sabem usar melhor o próprio dinheiro e que o Estado brasileiro arrecada muito e entrega pouco.",
    argumentsDisagree: "Quem discorda costuma argumentar que os mais pobres dependem dos serviços públicos e que a redução de impostos beneficia mais quem já tem renda alta.",
    whyDepends: "Pode depender de quais impostos e quais serviços seriam reduzidos.",
  },
  {
    key: "est-parcerias",
    dimension: "estado",
    direction: -1,
    text: "Parcerias com empresas privadas e organizações sociais costumam ser uma boa forma de gerir hospitais e escolas públicas.",
    context: "Organizações sociais já administram unidades de saúde em vários estados, por contratos com metas.",
    argumentsAgree: "Quem concorda costuma argumentar que contratos com metas permitem gestão mais ágil, com contratação e compras menos burocráticas.",
    argumentsDisagree: "Quem discorda costuma argumentar que parcerias podem precarizar o trabalho, dificultar a fiscalização e abrir espaço para desvios.",
    whyDepends: "Os resultados variam conforme a capacidade do governo de fiscalizar os contratos.",
  },
  // ── Liberdades individuais ──
  {
    key: "lib-drogas",
    dimension: "liberdades",
    direction: 1,
    text: "Adultos deveriam poder consumir substâncias que prejudicam apenas a si mesmos sem sofrer punição criminal.",
    context: "A Lei de Drogas não prevê prisão para o porte para consumo, mas não define critério objetivo para diferenciar usuário de traficante.",
    argumentsAgree: "Quem concorda costuma argumentar que o Estado não deve punir escolhas sobre o próprio corpo e que a criminalização alimenta o tráfico e o encarceramento.",
    argumentsDisagree: "Quem discorda costuma argumentar que o consumo afeta famílias e a saúde pública, e que a liberação pode ampliar o uso, sobretudo entre jovens.",
    whyDepends: "Pode depender da substância, da forma de regulação e de políticas de saúde associadas.",
    claimKeys: ["lei-drogas-2006"],
  },
  {
    key: "lib-conteudo-internet",
    dimension: "liberdades",
    direction: -1,
    text: "O Estado deve poder exigir a remoção de conteúdos na internet considerados nocivos, mesmo que isso limite parte da liberdade de expressão.",
    context: "O debate envolve desinformação, discurso de ódio, proteção de crianças e responsabilidade das plataformas.",
    argumentsAgree: "Quem concorda costuma argumentar que conteúdos nocivos causam danos reais, inclusive à democracia, e que plataformas lucram com sua circulação.",
    argumentsDisagree: "Quem discorda costuma argumentar que o critério de “nocivo” pode ser usado para censurar opiniões legítimas, dependendo de quem está no poder.",
    whyDepends: "Pode depender de quem decide, de haver controle judicial e da definição precisa do que é proibido.",
  },
  {
    key: "lib-armas",
    dimension: "liberdades",
    direction: 1,
    text: "Adultos que cumprem os requisitos legais deveriam ter mais facilidade para comprar e portar armas.",
    context: "O Estatuto do Desarmamento (2003) restringiu o acesso; decretos posteriores ampliaram e depois voltaram a restringir.",
    argumentsAgree: "Quem concorda costuma argumentar que a autodefesa é um direito individual e que criminosos já se armam ilegalmente.",
    argumentsDisagree: "Quem discorda costuma argumentar que mais armas em circulação aumentam mortes em conflitos, acidentes e suicídios, e abastecem o mercado ilegal.",
    whyDepends: "Pode depender de distinguir posse em casa de porte na rua, e de regras de controle e rastreamento.",
    claimKeys: ["estatuto-desarmamento"],
  },
  // ── Valores e costumes ──
  {
    key: "cos-escolas-familias",
    dimension: "costumes",
    direction: -1,
    text: "Escolas deveriam seguir prioritariamente os valores das famílias ao tratar de temas como sexualidade e religião.",
    context: "O debate envolve currículo, autonomia docente e o papel da escola na formação de valores.",
    argumentsAgree: "Quem concorda costuma argumentar que a formação moral cabe primeiro às famílias, e que a escola não deve contrariar suas convicções.",
    argumentsDisagree: "Quem discorda costuma argumentar que a escola deve oferecer informação científica e preparar para a convivência com a diversidade, inclusive para proteger crianças.",
    whyDepends: "Pode depender da idade dos alunos e do tema específico.",
  },
  {
    key: "cos-casamento",
    dimension: "costumes",
    direction: 1,
    text: "O casamento civil entre pessoas do mesmo sexo deve continuar plenamente reconhecido por lei.",
    context: "Desde 2013, cartórios não podem recusar esses casamentos, por resolução do CNJ. Não há lei aprovada pelo Congresso sobre o tema.",
    argumentsAgree: "Quem concorda costuma argumentar que o Estado laico deve garantir os mesmos direitos civis a todos os casais.",
    argumentsDisagree: "Quem discorda costuma argumentar que o casamento tem definição tradicional ligada à família e à religião, e que a mudança deveria vir do Congresso, não de decisões judiciais.",
    whyDepends: "Há quem apoie os direitos civis, mas questione a via pela qual foram reconhecidos.",
    claimKeys: ["casamento-igualitario"],
  },
  {
    key: "cos-religiao-leis",
    dimension: "costumes",
    direction: -1,
    text: "Valores religiosos devem servir de referência importante para a elaboração de leis.",
    context: "O Brasil é um Estado laico, mas a maioria da população declara alguma religião.",
    argumentsAgree: "Quem concorda costuma argumentar que leis refletem valores da sociedade e que a religião é fonte legítima de convicções morais de muitos cidadãos.",
    argumentsDisagree: "Quem discorda costuma argumentar que leis devem ser justificáveis para pessoas de todas as crenças — e de nenhuma — em um Estado laico.",
    whyDepends: "Pode depender de quais valores — muitos princípios religiosos coincidem com valores laicos, como a proteção dos vulneráveis.",
  },
  // ── Políticas sociais ──
  {
    key: "soc-tributar-ricos",
    dimension: "social",
    direction: 1,
    text: "Quem tem renda muito alta deveria pagar proporcionalmente mais impostos para financiar políticas sociais.",
    context: "Impostos progressivos cobram alíquotas maiores de rendas maiores.",
    argumentsAgree: "Quem concorda costuma argumentar que o sistema brasileiro pesa mais sobre o consumo, o que onera proporcionalmente mais os pobres.",
    argumentsDisagree: "Quem discorda costuma argumentar que mais impostos sobre altas rendas podem desestimular investimentos e provocar saída de capitais.",
    whyDepends: "Pode depender do desenho: alíquotas, isenções e se a mudança reduz outros tributos.",
  },
  {
    key: "soc-transferencias-temporarias",
    dimension: "social",
    direction: -1,
    text: "Programas de transferência de renda deveriam ser temporários e ter regras mais rígidas de permanência.",
    context: "O Bolsa Família exige condicionalidades como frequência escolar e vacinação, e tem regras de saída.",
    argumentsAgree: "Quem concorda costuma argumentar que benefícios devem ser uma ponte para o trabalho, não uma situação permanente.",
    argumentsDisagree: "Quem discorda costuma argumentar que a pobreza tem causas estruturais e que cortar benefícios cedo demais devolve famílias à miséria.",
    whyDepends: "Pode depender do perfil das famílias e de haver oportunidades de emprego disponíveis.",
    claimKeys: ["bolsa-familia-criacao", "bolsa-familia-efeitos"],
  },
  {
    key: "soc-cotas",
    dimension: "social",
    direction: 1,
    text: "Cotas sociais e raciais em universidades públicas são um instrumento adequado para ampliar oportunidades.",
    context: "A Lei de Cotas (2012) reserva vagas para egressos de escolas públicas, com subcotas por renda e cor.",
    argumentsAgree: "Quem concorda costuma argumentar que desigualdades históricas e de acesso à educação básica exigem medidas compensatórias.",
    argumentsDisagree: "Quem discorda costuma argumentar que critérios raciais podem gerar novas injustiças e que o foco deveria ser a melhoria do ensino básico.",
    whyDepends: "Há quem apoie cotas sociais (por renda) e rejeite cotas raciais, ou o contrário.",
    claimKeys: ["cotas-2012"],
  },
  // ── Segurança ──
  {
    key: "seg-penas-duras",
    dimension: "seguranca",
    direction: -1,
    text: "Penas mais duras são o caminho mais eficaz para reduzir a criminalidade.",
    context: "O Brasil tem uma das maiores populações prisionais do mundo e registra dezenas de milhares de homicídios por ano.",
    argumentsAgree: "Quem concorda costuma argumentar que a punição dissuade criminosos e protege a sociedade ao retirar de circulação quem comete crimes graves.",
    argumentsDisagree: "Quem discorda costuma argumentar que a certeza da punição importa mais que o tamanho da pena, e que prisões superlotadas fortalecem facções.",
    whyDepends: "Pode depender do tipo de crime: violento ou não violento.",
    claimKeys: ["populacao-prisional", "homicidios-brasil"],
  },
  {
    key: "seg-programas-sociais",
    dimension: "seguranca",
    direction: 1,
    text: "Investir em programas sociais nas regiões mais violentas reduz mais o crime do que ampliar o encarceramento.",
    context: "Programas de prevenção incluem educação, esporte, emprego para jovens e urbanização.",
    argumentsAgree: "Quem concorda costuma argumentar que a violência se concentra onde faltam oportunidades e que prevenir custa menos que prender.",
    argumentsDisagree: "Quem discorda costuma argumentar que programas sociais têm efeito lento e que, sem presença policial, o crime organizado domina os territórios.",
    whyDepends: "Muitos especialistas defendem combinar as duas estratégias.",
  },
  {
    key: "seg-maioridade",
    dimension: "seguranca",
    direction: -1,
    text: "A maioridade penal deveria ser reduzida para menos de 18 anos.",
    context: "A Constituição fixa a inimputabilidade penal para menores de 18 anos; adolescentes respondem por medidas socioeducativas.",
    argumentsAgree: "Quem concorda costuma argumentar que adolescentes que cometem crimes graves têm consciência de seus atos e devem responder como adultos.",
    argumentsDisagree: "Quem discorda costuma argumentar que o sistema prisional tende a aprofundar o envolvimento com o crime e que a mudança pode ser inconstitucional.",
    whyDepends: "Há quem defenda a redução apenas para crimes hediondos.",
    claimKeys: ["cf88-maioridade"],
  },
  // ── Meio ambiente ──
  {
    key: "amb-floresta",
    dimension: "ambiente",
    direction: 1,
    text: "Proteger a floresta deve ter prioridade mesmo quando isso limita a expansão da agropecuária.",
    context: "O Código Florestal define áreas de preservação e reserva legal em propriedades rurais.",
    argumentsAgree: "Quem concorda costuma argumentar que o desmatamento afeta chuvas, clima e biodiversidade — inclusive a própria agricultura.",
    argumentsDisagree: "Quem discorda costuma argumentar que o agronegócio sustenta exportações e empregos, e que o produtor já cumpre exigências rigorosas.",
    whyDepends: "Pode depender de distinguir desmatamento legal de ilegal e de haver alternativas de produtividade.",
    claimKeys: ["codigo-florestal-2012"],
  },
  {
    key: "amb-licenciamento",
    dimension: "ambiente",
    direction: -1,
    text: "O licenciamento ambiental deveria ser mais rápido e simples, mesmo que isso reduza algumas exigências.",
    context: "Licenciamento é o processo que autoriza obras e atividades com impacto ambiental.",
    argumentsAgree: "Quem concorda costuma argumentar que a demora trava investimentos em infraestrutura e gera insegurança jurídica.",
    argumentsDisagree: "Quem discorda costuma argumentar que reduzir exigências aumenta o risco de desastres ambientais.",
    whyDepends: "Pode depender do porte e do risco de cada atividade.",
  },
  {
    key: "amb-petroleo",
    dimension: "ambiente",
    direction: 1,
    text: "O Brasil deveria limitar a abertura de novas áreas de exploração de petróleo para cumprir metas climáticas.",
    context: "O tema divide também o próprio governo e o campo da esquerda, além da direita.",
    argumentsAgree: "Quem concorda costuma argumentar que novas frentes de exploração prolongam a dependência de combustíveis fósseis.",
    argumentsDisagree: "Quem discorda costuma argumentar que a receita do petróleo pode financiar a transição energética e o desenvolvimento.",
    whyDepends: "Pode depender do ritmo da transição e de onde a exploração ocorreria.",
  },
  // ── Instituições ──
  {
    key: "ins-tribunais",
    dimension: "instituicoes",
    direction: 1,
    text: "Tribunais devem poder anular decisões do governo e do Congresso que considerem inconstitucionais, mesmo contra a vontade da maioria.",
    context: "O controle de constitucionalidade é previsto na Constituição de 1988.",
    argumentsAgree: "Quem concorda costuma argumentar que direitos fundamentais não podem depender de maiorias passageiras.",
    argumentsDisagree: "Quem discorda costuma argumentar que juízes não eleitos não deveriam ter a palavra final sobre escolhas políticas.",
    whyDepends: "Muitas pessoas apoiam o controle judicial em geral, mas criticam decisões específicas.",
    claimKeys: ["cf88"],
  },
  {
    key: "ins-orgaos-controle",
    dimension: "instituicoes",
    direction: -1,
    text: "Governantes eleitos deveriam ter mais liberdade para implementar seus programas, com menos bloqueios de órgãos de controle.",
    context: "Órgãos como tribunais de contas, Ministério Público e agências reguladoras fiscalizam atos do Executivo.",
    argumentsAgree: "Quem concorda costuma argumentar que o excesso de controles paralisa a administração e frustra a vontade do eleitor.",
    argumentsDisagree: "Quem discorda costuma argumentar que os controles previnem abusos e corrupção, qualquer que seja o governo.",
    whyDepends: "A percepção costuma mudar conforme quem governa — um bom teste é imaginar o governo de que você menos gosta.",
  },
  {
    key: "ins-imprensa",
    dimension: "instituicoes",
    direction: 1,
    text: "A imprensa e organizações da sociedade civil devem ter garantias fortes para fiscalizar governos, mesmo quando isso gera instabilidade política.",
    context: "A Constituição protege a liberdade de imprensa e de associação.",
    argumentsAgree: "Quem concorda costuma argumentar que a fiscalização independente é essencial para expor abusos de qualquer governo.",
    argumentsDisagree: "Quem discorda costuma argumentar que parte da imprensa e das organizações atua com viés político e deveria ter mais responsabilização.",
    whyDepends: "Pode depender de distinguir fiscalização de campanhas de desinformação.",
    claimKeys: ["cf88"],
  },
];

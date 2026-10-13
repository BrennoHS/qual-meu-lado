/**
 * Temas e posições frequentemente associadas a cada campo.
 * Regra editorial: as duas posições de cada tema têm a mesma estrutura
 * (resumo, três pontos, ressalvas) e extensão semelhante.
 */
type Position = { summary: string; points: [string, string, string]; nuances: string; claimKeys?: string[] };

export type ThemeSeed = {
  slug: string;
  name: string;
  description: string;
  valueConflict: string;
  left: Position;
  right: Position;
};

export const themes: ThemeSeed[] = [
  {
    slug: "papel-do-estado",
    name: "Papel do Estado",
    description: "Quanto o poder público deve fazer diretamente — e quanto deve deixar a cargo de pessoas, empresas e comunidades.",
    valueConflict: "Capacidade de agir coletivamente × risco de concentração de poder e de ineficiência.",
    left: {
      summary: "Tende a ver o Estado como instrumento para garantir direitos e corrigir desigualdades que o mercado, sozinho, não resolve.",
      points: ["Serviços públicos universais (saúde, educação, previdência)", "Planejamento e investimento público em infraestrutura", "Regulação para proteger trabalhadores, consumidores e o ambiente"],
      nuances: "Social-democratas aceitam mercados e parcerias privadas; correntes socialistas defendem propriedade pública mais ampla. Anarquistas rejeitam o próprio Estado.",
    },
    right: {
      summary: "Tende a defender um Estado mais limitado, concentrado em segurança, justiça e regras estáveis, com mais espaço para iniciativa privada e sociedade civil.",
      points: ["Menos impostos e menos burocracia", "Privatizações e concessões", "Subsidiariedade: resolver no nível mais próximo das pessoas"],
      nuances: "Conservadores e nacional-populistas podem defender Estado forte em segurança, defesa e costumes; libertários querem Estado mínimo em tudo.",
    },
  },
  {
    slug: "economia",
    name: "Economia e mercado",
    description: "Como produzir riqueza, gerar empregos e manter a estabilidade de preços.",
    valueConflict: "Eficiência e crescimento × proteção contra riscos e instabilidade.",
    left: {
      summary: "Costuma enfatizar que mercados geram concentração e crises, e que o Estado pode estabilizar a economia e induzir setores estratégicos.",
      points: ["Política fiscal ativa para sustentar emprego", "Bancos públicos e crédito direcionado", "Valorização do salário mínimo"],
      nuances: "Governos de esquerda no Brasil também adotaram metas de inflação e regras fiscais, como o arcabouço de 2023.",
      claimKeys: ["keynes-1936", "teto-gastos-2016"],
    },
    right: {
      summary: "Costuma enfatizar que preços livres, concorrência e propriedade privada alocam recursos melhor e que equilíbrio fiscal é condição para crescer.",
      points: ["Responsabilidade fiscal e controle da dívida", "Abertura comercial e redução de barreiras", "Segurança jurídica para investimentos"],
      nuances: "Parte da direita defende protecionismo, subsídios setoriais ou estatais estratégicas — sobretudo nas vertentes nacionalistas.",
      claimKeys: ["hayek-1945-precos", "lrf-2000"],
    },
  },
  {
    slug: "desigualdade",
    name: "Desigualdade e distribuição de renda",
    description: "Se a desigualdade é um problema em si e quais instrumentos são legítimos para reduzi-la.",
    valueConflict: "Igualdade de resultados × liberdade de dispor do que se ganha.",
    left: {
      summary: "Trata a desigualdade elevada como injusta e prejudicial à democracia e à mobilidade social, defendendo redistribuição.",
      points: ["Impostos progressivos sobre renda e patrimônio", "Transferências de renda", "Ações afirmativas"],
      nuances: "Há divergência sobre o foco: igualdade de oportunidades, de resultados ou combate à pobreza extrema.",
      claimKeys: ["rawls-1971", "piketty-2013"],
    },
    right: {
      summary: "Tende a priorizar o combate à pobreza e a igualdade perante a lei, vendo diferenças de renda como parcialmente legítimas quando resultam de esforço e escolhas.",
      points: ["Crescimento econômico como motor de mobilidade", "Igualdade de oportunidades, não de resultados", "Simplificação tributária"],
      nuances: "Conservadores e democratas-cristãos frequentemente apoiam redes de proteção; libertários questionam a redistribuição compulsória.",
      claimKeys: ["nozick-1974", "pobreza-global"],
    },
  },
  {
    slug: "liberdades",
    name: "Liberdades individuais",
    description: "Até onde vai a autonomia de cada pessoa sobre a própria vida, o próprio corpo e a própria expressão.",
    valueConflict: "Autonomia individual × proteção de terceiros e da coletividade.",
    left: {
      summary: "Costuma defender ampla liberdade em costumes e identidade, combinada com regulação maior da atividade econômica.",
      points: ["Direitos civis de minorias", "Laicidade do Estado", "Revisão da política de drogas (em parte da esquerda)"],
      nuances: "Setores da esquerda defendem mais regulação de discursos e de plataformas digitais — o que liberais de vários campos criticam.",
    },
    right: {
      summary: "Costuma defender ampla liberdade econômica e de expressão, combinada, nas vertentes conservadoras, com limites em questões morais.",
      points: ["Liberdade de expressão e de crença", "Direito de propriedade", "Acesso legal a armas (em parte da direita)"],
      nuances: "Libertários defendem também liberdade nos costumes; conservadores defendem restrições em temas como drogas e aborto.",
    },
  },
  {
    slug: "seguranca-publica",
    name: "Segurança pública",
    description: "Como reduzir a violência e o crime, e qual equilíbrio entre punição, prevenção e direitos.",
    valueConflict: "Proteção imediata das vítimas × garantias contra abusos do poder punitivo.",
    left: {
      summary: "Tende a relacionar violência a desigualdade e exclusão, priorizando prevenção, inteligência policial e controle de abusos.",
      points: ["Políticas sociais em territórios vulneráveis", "Controle do uso da força policial", "Alternativas penais para crimes sem violência"],
      nuances: "Governos de esquerda também ampliaram policiamento e encarceramento; há tensões internas sobre política de drogas.",
      claimKeys: ["populacao-prisional"],
    },
    right: {
      summary: "Tende a enfatizar a responsabilidade individual, o efeito dissuasório da punição e o apoio às forças de segurança.",
      points: ["Penas mais rigorosas", "Fortalecimento das polícias", "Direito à legítima defesa, inclusive armada"],
      nuances: "Liberais e libertários podem divergir em temas como drogas; conservadores divergem sobre armas.",
      claimKeys: ["homicidios-brasil"],
    },
  },
  {
    slug: "politicas-sociais",
    name: "Políticas sociais",
    description: "Transferência de renda, assistência e previdência: quem deve receber, quanto e com quais regras.",
    valueConflict: "Proteção contra a pobreza × incentivos ao trabalho e equilíbrio das contas.",
    left: {
      summary: "Vê a proteção social como direito e como investimento que reduz pobreza e amplia oportunidades.",
      points: ["Transferências de renda amplas", "Previdência pública e solidária", "Benefícios com reajuste real"],
      nuances: "Há debate interno entre universalismo (benefícios para todos) e focalização (para os mais pobres).",
      claimKeys: ["bolsa-familia-efeitos"],
    },
    right: {
      summary: "Aceita redes de proteção focalizadas, mas enfatiza portas de saída, condicionalidades e sustentabilidade fiscal.",
      points: ["Focalização nos mais pobres", "Incentivo ao emprego formal", "Reformas para conter o crescimento de gastos"],
      nuances: "Liberais como Milton Friedman propuseram o imposto de renda negativo, uma forma de renda mínima.",
      claimKeys: ["friedman-1962", "reforma-previdencia-2019"],
    },
  },
  {
    slug: "educacao",
    name: "Educação",
    description: "Quem deve oferecer, financiar e definir o conteúdo da educação.",
    valueConflict: "Padrão comum para todos × autonomia das famílias e diversidade de escolas.",
    left: {
      summary: "Defende educação pública, gratuita e laica como instrumento de igualdade e cidadania.",
      points: ["Mais financiamento público", "Cotas e ações afirmativas", "Valorização dos professores da rede pública"],
      nuances: "Há divergências sobre avaliação de desempenho, parcerias com o setor privado e escolas de tempo integral.",
      claimKeys: ["fundeb-2020", "cotas-2012"],
    },
    right: {
      summary: "Valoriza a liberdade de escolha das famílias, a gestão por resultados e, nas vertentes conservadoras, o papel da família na formação moral.",
      points: ["Vouchers ou parcerias com escolas privadas", "Avaliação e metas de desempenho", "Participação das famílias no currículo"],
      nuances: "Liberais enfatizam escolha e eficiência; conservadores enfatizam valores. Ambos convivem com defensores da escola pública.",
    },
  },
  {
    slug: "saude",
    name: "Saúde",
    description: "Como garantir acesso a cuidados de saúde e quem deve financiá-los.",
    valueConflict: "Acesso universal × custos, filas e liberdade de escolha.",
    left: {
      summary: "Defende sistemas públicos e universais como o SUS, financiados por impostos.",
      points: ["Ampliação do financiamento do SUS", "Atenção básica e prevenção", "Regulação de planos privados e de preços de medicamentos"],
      nuances: "Governos de esquerda também mantiveram e ampliaram parcerias com organizações sociais na gestão de unidades.",
      claimKeys: ["cf88-saude"],
    },
    right: {
      summary: "Aceita o sistema público, mas defende mais participação privada, concorrência e gestão por resultados.",
      points: ["Parcerias público-privadas e organizações sociais", "Incentivos aos planos de saúde", "Foco em eficiência e redução de desperdícios"],
      nuances: "O SUS é previsto na Constituição e conta com apoio em todo o espectro; o debate é sobre gestão e financiamento.",
      claimKeys: ["cf88-saude"],
    },
  },
  {
    slug: "valores-e-costumes",
    name: "Valores e costumes",
    description: "Família, religião, sexualidade e identidade: o que deve ser regulado por lei e o que pertence à esfera privada.",
    valueConflict: "Pluralismo e direitos de minorias × preservação de tradições compartilhadas.",
    left: {
      summary: "Tende a defender o reconhecimento de diferentes formas de família e identidade e a separação clara entre religião e Estado.",
      points: ["Casamento civil igualitário", "Políticas contra discriminação", "Laicidade"],
      nuances: "Há eleitores e lideranças de esquerda religiosos e conservadores em costumes, especialmente no Brasil.",
      claimKeys: ["casamento-igualitario"],
    },
    right: {
      summary: "Tende a valorizar a família tradicional, a religião e normas morais herdadas como fundamentos da vida comunitária.",
      points: ["Proteção da família e da infância segundo valores tradicionais", "Liberdade religiosa e presença da fé na vida pública", "Cautela com mudanças rápidas nos costumes"],
      nuances: "Liberais e libertários de direita costumam ser progressistas ou neutros nesses temas.",
    },
  },
  {
    slug: "meio-ambiente",
    name: "Meio ambiente",
    description: "Como equilibrar proteção ambiental, clima e atividade econômica.",
    valueConflict: "Proteção ambiental de longo prazo × renda e empregos imediatos.",
    left: {
      summary: "Tende a defender regulação mais forte, metas climáticas e proteção de povos tradicionais.",
      points: ["Combate ao desmatamento com fiscalização", "Transição energética com investimento público", "Demarcação de terras indígenas"],
      nuances: "Governos de esquerda também apoiaram grandes hidrelétricas e a exploração de petróleo, gerando conflitos com ambientalistas.",
      claimKeys: ["codigo-florestal-2012"],
    },
    right: {
      summary: "Tende a priorizar o desenvolvimento econômico e o direito de propriedade, defendendo regras mais simples e soluções de mercado.",
      points: ["Licenciamento mais rápido", "Segurança jurídica para o produtor rural", "Instrumentos de mercado, como crédito de carbono"],
      nuances: "Existe conservacionismo de direita (proteção da natureza como patrimônio) e ambientalismo de mercado.",
      claimKeys: ["codigo-florestal-2012"],
    },
  },
  {
    slug: "democracia-e-instituicoes",
    name: "Democracia e instituições",
    description: "Tribunais, imprensa, controles e o equilíbrio entre os Poderes.",
    valueConflict: "Vontade da maioria eleita × limites constitucionais e direitos de minorias.",
    left: {
      summary: "A esquerda democrática defende instituições representativas, participação social e direitos de minorias.",
      points: ["Conselhos e participação popular", "Regulação de plataformas digitais (em parte da esquerda)", "Proteção de direitos por tribunais"],
      nuances: "Parte da esquerda relativizou regimes autoritários de esquerda (como Cuba e Venezuela), o que é criticado dentro e fora do campo.",
      claimKeys: ["cf88"],
    },
    right: {
      summary: "A direita democrática defende Estado de Direito, separação de Poderes, limites ao governo e liberdade de expressão.",
      points: ["Limites ao poder do Executivo e à tributação", "Liberdade de imprensa e de expressão", "Instituições estáveis e previsíveis"],
      nuances: "Parte da direita apoiou regimes autoritários (como o regime militar brasileiro) ou atacou instituições, o que é criticado dentro e fora do campo.",
      claimKeys: ["cf88"],
    },
  },
];

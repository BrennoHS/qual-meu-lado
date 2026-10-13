import type { PerspectiveSeed } from "./types";

/**
 * Camadas:
 *  - layer "surface" (padrão): fundamentos em linguagem simples — o que todo
 *    mundo precisa saber para entender o campo.
 *  - layer "deep": aprofundamento (correntes, dados, história detalhada).
 * A estrutura é espelhada em direita.ts (verificado por teste).
 */
export const esquerda: PerspectiveSeed = {
  slug: "esquerda",
  side: "LEFT",
  name: "Esquerda",
  tagline: "A igualdade como ponto de partida",
  heroDescription: "Um campo amplo que, em suas várias correntes, tende a priorizar a redução de desigualdades e a ver no Estado e na ação coletiva instrumentos para isso.",
  intro: "Não existe uma esquerda só — existem várias. Elas discordam em muita coisa, mas partem de uma ideia comum: muitas desigualdades são criadas pela própria sociedade, e por isso podem ser diminuídas.",
  chapters: [
    {
      number: 1,
      slug: "origens",
      kicker: "De onde veio?",
      title: "Tudo começou com cadeiras",
      summary: "Como uma questão de lugar numa sala, em 1789, virou o nome de um lado da política — e como a esquerda mudou desde então.",
      keyPoints: [
        "Os nomes “esquerda” e “direita” nasceram na França, em 1789, por causa do lugar onde cada grupo sentava.",
        "Quem sentava à esquerda queria mudar as regras e diminuir o poder do rei.",
        "Com o tempo, ser de esquerda passou a significar lutar para reduzir as desigualdades.",
      ],
      blocks: [
        { type: "lead", text: "Em 1789, a França vivia uma revolução. Numa grande sala, deputados discutiam quanto poder o rei deveria ter. Quem queria limitar o rei sentou do lado esquerdo. Quem queria proteger o rei sentou do lado direito. Foi por causa de cadeiras que esses nomes nasceram." },
        { type: "illustration", name: "hemicycle", title: "A sala que deu nome à política", caption: "Assembleia Nacional da França, 1789: à esquerda, quem queria limitar o rei; à direita, quem queria manter seus poderes." },
        { type: "claims", claimKeys: ["origem-assembleia-1789"] },
        {
          type: "text",
          title: "Como a esquerda mudou com o tempo",
          body: "**Primeiro**, ser de esquerda era ser contra o poder absoluto do rei.\n\n**Depois**, com as fábricas do século 19, muitos trabalhadores — inclusive crianças — tinham jornadas de 14 horas e quase nenhum direito. A esquerda passou a defender quem trabalha: salário justo, descanso, escola para todos.\n\n**No século 20**, a esquerda se dividiu em dois caminhos. Um buscou mudanças pelo voto e criou sistemas públicos de saúde e aposentadoria na Europa. O outro fez revoluções e criou governos de partido único, como a União Soviética — que perseguiram opositores.",
        },
        {
          type: "glossary",
          title: "Palavras que vão aparecer",
          items: [
            { term: "Ideologia", definition: "Um conjunto de ideias sobre como a sociedade deveria funcionar." },
            { term: "Partido", definition: "Uma organização que disputa eleições. Pode mudar de posição com o tempo." },
            { term: "Desigualdade", definition: "Diferença de renda, de oportunidades ou de direitos entre as pessoas." },
            { term: "Estado", definition: "O governo e suas instituições: escolas e hospitais públicos, polícia, tribunais." },
          ],
        },
        { type: "didYouKnow", curiositySlug: "bobbio" },
        {
          type: "text",
          title: "E no Brasil?",
          body: "Aqui, a esquerda nasceu do movimento operário e do Partido Comunista (1922). Ganhou força com os direitos trabalhistas da era Vargas e com a resistência à ditadura militar. Em 1980, sindicalistas e militantes fundaram o PT, que se tornaria o maior partido do campo.",
        },
        { type: "timeline", layer: "deep", title: "Linha do tempo da esquerda", intro: "Marcos no Brasil e no mundo. Toque em um evento para ver a fonte.", tags: ["esquerda"] },
        { type: "currents", layer: "deep", title: "Muitas esquerdas", intro: "As principais correntes. Todas se preocupam com a igualdade, mas discordam sobre os meios, o ritmo e o papel do Estado.", slugs: ["social-democracia", "socialismo-democratico", "marxismo-leninismo", "trabalhismo", "anarquismo"] },
        { type: "claims", layer: "deep", title: "Fatos da história brasileira", claimKeys: ["pcb-1922", "clt-1943", "pt-1980"] },
        { type: "didYouKnow", layer: "deep", curiositySlug: "liberais-esquerda" },
      ],
      deepDive: "## Para ir além\n\nO livro **Direita e esquerda**, de Norberto Bobbio, é a referência mais citada sobre o tema. Para ele, a divisão sobrevive porque organiza um conflito real — a atitude diante da igualdade — mesmo quando os assuntos mudam.\n\nA **Era dos extremos**, do historiador marxista Eric Hobsbawm, conta o século XX com atenção às divisões da esquerda. Críticos apontam que o livro é brando com a União Soviética; vale lê-lo ao lado de historiadoras como Anne Applebaum.",
    },
    {
      number: 2,
      slug: "o-que-defende",
      kicker: "O que defende?",
      title: "Igualdade como bússola",
      summary: "As ideias que costumam unir a esquerda — e onde ela mesma se divide.",
      keyPoints: [
        "A ideia central: muitas desigualdades são criadas pela sociedade — e podem ser diminuídas.",
        "Para isso, a esquerda costuma confiar no Estado: saúde e escola públicas, impostos maiores para quem ganha mais, direitos para quem trabalha.",
        "Há várias esquerdas, e elas discordam sobre até onde ir.",
      ],
      blocks: [
        { type: "lead", text: "Se a esquerda tivesse uma bússola, ela apontaria para a igualdade. A pergunta que move o campo é: quais diferenças entre as pessoas são injustas — e o que dá para fazer a respeito?" },
        { type: "example", title: "No dia a dia", body: "Duas crianças nascem no mesmo dia. Uma, numa família com dinheiro: escola boa, plano de saúde, aulas de inglês. A outra, numa família pobre: escola sem professor, posto de saúde lotado. Para a esquerda, uma boa escola pública e o SUS existem para diminuir essa diferença de largada." },
        { type: "illustration", name: "ladder", title: "Largadas diferentes", caption: "Para a esquerda, oportunidade igual de verdade exige compensar quem larga atrás — com escola, saúde e renda." },
        { type: "themes", title: "Tema por tema", intro: "Toque em um tema para ver o que costuma ser defendido — e as ressalvas." },
        { type: "pulse", statementKey: "soc-tributar-ricos", prompt: "E você? Rapidinho:" },
        { type: "valueConflict", title: "Igualdade × liberdade", values: ["Igualdade", "Liberdade individual"], scenario: "Um imposto sobre heranças muito grandes pagaria bolsas de estudo para jovens pobres.", tension: "Quem prioriza igualdade vê justiça: ninguém conquistou a herança pelo próprio esforço. Quem prioriza liberdade vê injustiça: a família tem direito de deixar o que construiu. As duas intuições são legítimas — o debate é sobre qual pesa mais." },
        { type: "axes", layer: "deep", title: "Economia e costumes não andam juntos", intro: "Posições sobre economia e sobre costumes variam de forma independente. Este esquema DIDÁTICO mostra posições aproximadas — não é uma medição.", highlightSlugs: ["social-democracia", "socialismo-democratico", "marxismo-leninismo", "trabalhismo", "anarquismo"] },
        {
          type: "text",
          layer: "deep",
          title: "Social-democracia não é socialismo (nem comunismo)",
          body: "**Social-democratas** aceitam a economia de mercado e corrigem seus efeitos com impostos, serviços públicos e negociação entre empresas e sindicatos.\n\n**Socialistas democráticos** querem ir além e ampliar a propriedade pública ou cooperativa — pelo voto.\n\n**Comunistas marxistas-leninistas** defenderam o fim da propriedade privada das empresas sob um partido único. Social-democratas estão entre os críticos históricos desses regimes.",
        },
        { type: "claims", layer: "deep", claimKeys: ["bobbio-igualdade"] },
      ],
      deepDive: "## Universal ou focalizado?\n\nUma divisão importante: benefícios **universais** (para todos, como o SUS) criam apoio amplo, mas custam mais. Benefícios **focalizados** (para os mais pobres, como o Bolsa Família) custam menos, mas podem ser frágeis politicamente.\n\n## Classe ou identidade?\n\nOutro debate: priorizar desigualdades econômicas ou também as de raça, gênero e orientação sexual. Muitos dizem que são inseparáveis; outros temem que a segunda ênfase afaste trabalhadores de baixa renda.",
    },
    {
      number: 3,
      slug: "argumentos",
      kicker: "Por que defende?",
      title: "Os melhores argumentos",
      summary: "Os argumentos mais fortes de quem defende ideias de esquerda — e os limites que eles mesmos reconhecem.",
      keyPoints: [
        "Ninguém escolhe onde nasce — por isso, dizem, é justo ajudar quem começa atrás.",
        "Alguns serviços, como saúde e saneamento, não chegam a todos se dependerem só do lucro.",
        "Programas de renda, como o Bolsa Família, ajudaram a reduzir a pobreza extrema, segundo estudos públicos.",
      ],
      blocks: [
        { type: "lead", text: "Aqui estão os argumentos como seus defensores os apresentam. Cada um vem com os limites reconhecidos e com o que a evidência permite dizer." },
        { type: "illustration", name: "taxes", title: "Para onde vai o imposto", caption: "No argumento da esquerda, o imposto pago por todos vira escola, posto de saúde e renda para quem mais precisa." },
        {
          type: "arguments",
          kind: "PRO",
          items: [
            { id: "ponto-de-partida", category: "valores", title: "Ninguém escolhe onde nasce", body: "A família e o lugar onde alguém nasce pesam muito na escola, na saúde e no salário que essa pessoa terá. Para a esquerda, uma sociedade justa compensa essa diferença de largada — e não apenas premia quem chegou na frente.", claimKeys: ["rawls-1971"], limits: "Há discordância sobre até onde essa compensação deve ir e se ela desestimula o esforço.", evidenceNote: "É um argumento de valor (sobre o que é justo). Não se resolve só com dados." },
            { id: "bens-publicos", category: "economia", title: "Tem coisa que o lucro não resolve", body: "Ninguém lucra levando esgoto a uma vila pobre ou mantendo um posto de saúde numa cidade pequena. Se depender só do mercado, esses serviços chegam tarde — ou não chegam. Por isso, dizem, o Estado precisa garantir o básico.", claimKeys: ["cf88-saude", "saneamento-2020"], limits: "Liberais concordam com parte do diagnóstico, mas preferem concessões e parcerias com empresas.", evidenceNote: "A ideia de que o mercado falha em alguns serviços é aceita na economia; a melhor solução é debatida." },
            { id: "transferencias", category: "evidencia", title: "Dar renda direto reduz a pobreza", body: "Programas como o Bolsa Família pagam um valor mensal às famílias mais pobres, que em troca mantêm os filhos na escola e com vacina em dia. Defensores dizem que é uma das formas mais baratas de combater a fome.", claimKeys: ["bolsa-familia-criacao", "bolsa-familia-efeitos"], limits: "Críticos discutem efeitos sobre trabalho informal e como as famílias saem do programa.", evidenceNote: "Estudos do Ipea e da Enap associam o programa à queda da pobreza extrema; o tamanho do efeito varia conforme o método." },
          ],
        },
        { type: "pulse", statementKey: "est-servicos-essenciais", prompt: "Parando para pensar:" },
        {
          type: "arguments",
          kind: "PRO",
          layer: "deep",
          title: "Mais argumentos",
          items: [
            { id: "trabalho", category: "historia", title: "Direitos trabalhistas equilibram uma relação desigual", body: "Um trabalhador sozinho tem pouco poder para negociar com uma empresa. Sindicatos, salário mínimo e leis trabalhistas reduziriam essa diferença — conquistas historicamente ligadas a movimentos de esquerda.", claimKeys: ["clt-1943"], limits: "Liberais argumentam que regras rígidas podem aumentar a informalidade." },
            { id: "crises", category: "economia", title: "O Estado como amortecedor em crises", body: "Numa recessão, empresas e famílias cortam gastos ao mesmo tempo e a crise piora. Para keynesianos e parte da esquerda, o governo pode gastar para segurar o emprego até a economia voltar.", claimKeys: ["keynes-1936", "crise-2008"], limits: "Exige que o país tenha espaço no orçamento; países muito endividados têm menos margem.", evidenceNote: "Política anticíclica é amplamente aceita em crises agudas; seu uso prolongado é controverso." },
            { id: "concentracao", category: "evidencia", title: "Sem correção, a riqueza se concentra", body: "Pesquisas com dados de séculos sugerem que, sem impostos e políticas públicas, a riqueza tende a se acumular nas mãos de poucos — e isso pode virar poder político.", claimKeys: ["piketty-2013"], limits: "A tese é contestada por parte dos economistas." },
          ],
        },
        { type: "didYouKnow", layer: "deep", curiositySlug: "clt-estado-novo" },
      ],
      deepDive: "## Como ler esses argumentos\n\nArgumentos **de valor** (o que é justo) e argumentos **de evidência** (o que funciona) se avaliam de jeitos diferentes. Dá para aceitar que transferências reduzem a pobreza e, ainda assim, discordar da prioridade dada a elas.\n\nPara aprofundar: Rawls, **Uma teoria da justiça**; avaliações do Bolsa Família publicadas pelo Ipea e pela Enap (na biblioteca de fontes).",
    },
    {
      number: 4,
      slug: "criticas",
      kicker: "O que dizem os críticos?",
      title: "As críticas mais fortes",
      summary: "Críticas econômicas, históricas e de prática — sempre com a resposta de quem defende.",
      keyPoints: [
        "Onde o governo controlou toda a economia, faltaram comida e produtos, e opositores foram perseguidos.",
        "Gastar mais do que se arrecada pode gerar crise, inflação e desemprego.",
        "Governos de esquerda no Brasil também tiveram escândalos de corrupção.",
      ],
      blocks: [
        { type: "lead", text: "Este capítulo tem o mesmo peso que o anterior. As críticas abaixo são documentadas ou bem sustentadas — e cada uma traz a resposta de quem defende a esquerda." },
        { type: "illustration", name: "scale", title: "O outro prato da balança", caption: "Toda ideia tem custos. Olhar as críticas à esquerda com o mesmo cuidado é o que permite pesar de verdade." },
        {
          type: "arguments",
          kind: "CRITIQUE",
          items: [
            { id: "regimes", category: "historica", title: "Regimes comunistas e repressão", body: "Governos que se diziam socialistas ou comunistas instalaram partido único, perseguiram opositores e foram responsáveis por fomes que mataram milhões, como na Ucrânia soviética e na China de Mao.", claimKeys: ["fomes-sovietica-chinesa", "gulag"], response: "A esquerda democrática rejeita esses regimes e os critica desde cedo. Críticos lembram que parte da esquerda os defendeu por décadas.", evidenceNote: "Fatos amplamente documentados; o número de vítimas varia entre historiadores." },
            { id: "fiscal", category: "consequencias", title: "Gastar demais gera crise", body: "Críticos atribuem a recessão de 2015–2016 — a pior da história medida pelo IBGE — ao aumento de gastos e ao crédito barato dos anos anteriores. O impeachment de 2016 foi baseado em acusações sobre manobras nas contas públicas.", claimKeys: ["recessao-2015-2016", "impeachment-2016"], response: "Defensores do governo da época culpam principalmente a queda dos preços das exportações e a crise política, e consideram o impeachment ilegítimo.", evidenceNote: "A recessão é fato; as causas são disputadas entre economistas." },
            { id: "corrupcao", category: "discurso-pratica", title: "Discurso ético, escândalos na prática", body: "O PT construiu parte de sua imagem defendendo a ética na política. No mensalão, o STF condenou dirigentes do partido e de aliados por pagamentos a parlamentares.", claimKeys: ["mensalao", "lula-anulacao-2021"], response: "Defensores lembram que governos do PT fortaleceram órgãos de controle e aprovaram a Lei Anticorrupção — e que as condenações de Lula na Lava Jato foram anuladas pelo STF.", evidenceNote: "As anulações trataram de qual juiz podia julgar e da imparcialidade do juiz, não de inocência ou culpa." },
          ],
        },
        {
          type: "arguments",
          kind: "CRITIQUE",
          layer: "deep",
          title: "Mais críticas",
          items: [
            { id: "planejamento", category: "economica", title: "Planejar tudo do centro gera escassez", body: "Economias planejadas pelo governo no século 20 viveram falta crônica de produtos e pouca inovação. Para críticos, sem preços livres falta informação para decidir o que produzir.", claimKeys: ["hayek-1945-precos", "kornai-escassez"], response: "Social-democratas dizem que não defendem planejamento central, e sim economias mistas como as dos países nórdicos." },
            { id: "venezuela", category: "implementacao", title: "Venezuela: colapso e êxodo", body: "A Venezuela chavista, apoiada por parte da esquerda latino-americana, teve hiperinflação, escassez e o êxodo de milhões de pessoas, além de concentrar poder.", claimKeys: ["venezuela-migracao"], response: "Defensores apontam sanções e a queda do petróleo. Outros setores da esquerda criticam o governo venezuelano." },
            { id: "liberdade", category: "institucional", title: "Estado grande pode limitar escolhas", body: "Liberais argumentam que quanto mais o governo decide sobre economia e serviços, menor o espaço para escolhas individuais — e maior o risco de grupos organizados capturarem o Estado.", claimKeys: ["hayek-1944"], response: "Defensores respondem que a falta de renda e de serviços também limita escolhas." },
            { id: "internas", category: "interna", title: "Brigas internas", body: "A esquerda disputa internamente temas como desenvolvimento × meio ambiente (hidrelétricas, petróleo) e alianças com partidos de centro e de direita.", claimKeys: [], response: "Para muitos, a diversidade é sinal de vida democrática; para outros, enfraquece a capacidade de governar." },
          ],
        },
        { type: "valueConflict", layer: "deep", title: "Crescimento × meio ambiente", values: ["Empregos e renda", "Proteção ambiental"], scenario: "Uma nova área de exploração de petróleo geraria empregos numa região pobre, mas aumentaria a poluição do clima.", tension: "O dilema divide a própria esquerda: uns veem renda para reduzir desigualdades; outros, um compromisso climático rompido." },
      ],
      deepDive: "## Crítica fundamentada × fato comprovado\n\nAlgumas críticas acima descrevem **fatos documentados** (as fomes, o mensalão, a recessão). Outras são **interpretações sobre causas** (por que a recessão aconteceu). As etiquetas de cada fonte indicam a diferença.\n\nPara aprofundar: Kornai, **The Socialist System**; Applebaum, **A fome vermelha**.",
    },
    {
      number: 5,
      slug: "no-brasil",
      kicker: "E no Brasil?",
      title: "A esquerda brasileira",
      summary: "Do movimento operário ao PT no governo: por que a esquerda daqui não cabe num rótulo só.",
      keyPoints: [
        "No Brasil, a esquerda veio do movimento dos trabalhadores, dos sindicatos e da oposição à ditadura.",
        "O PT é o partido mais conhecido do campo, mas há outros, como PSOL, PCdoB, PDT e PSB.",
        "Para governar, a esquerda fez alianças com partidos de centro e de direita — o que muda as políticas.",
      ],
      blocks: [
        { type: "lead", text: "A esquerda brasileira juntou ideias europeias com coisas bem nossas: os direitos trabalhistas da era Vargas, padres e freiras ligados às periferias, o sindicalismo do ABC paulista e, desde 2003, a experiência de governar o país." },
        { type: "illustration", name: "congress", title: "Governar é negociar", caption: "Nenhum presidente eleito desde 1989 teve maioria própria no Congresso. Todos precisaram de alianças." },
        {
          type: "text",
          title: "No governo",
          body: "Os governos do PT (2003–2016 e desde 2023) ampliaram programas sociais e o salário mínimo. Ao mesmo tempo, mantiveram ferramentas que muitos associam à direita, como metas de inflação e regras para controlar gastos — o governo atual criou o **arcabouço fiscal**, uma regra de controle de despesas.",
        },
        { type: "claims", claimKeys: ["bolsa-familia-criacao"] },
        { type: "example", title: "Em uma frase", body: "**Presidencialismo de coalizão** é o nome do jeito brasileiro de governar: o presidente precisa de vários partidos aliados para aprovar leis — e cada aliado cobra algo em troca." },
        { type: "illustration", name: "powers", title: "Os Três Poderes", caption: "Quem governa, quem faz as leis e quem julga são separados e se controlam — seja qual for o lado no poder." },
        { type: "timeline", layer: "deep", title: "A esquerda na história do Brasil", tags: ["esquerda"], scope: "BRAZIL" },
        {
          type: "text",
          layer: "deep",
          title: "Rótulos que não encaixam",
          body: "O **PSDB** nasceu social-democrata, mas governou com privatizações e reformas de mercado — por isso muitos o classificam como centro ou centro-direita.\n\nO PT, por sua vez, governou com partidos de centro e de direita, e parte de seu eleitorado é religiosa e conservadora em costumes.\n\nPesquisadores costumam classificar como de esquerda ou centro-esquerda partidos como PT, PSOL, PCdoB, PDT, PSB, Rede e PV — mas as classificações variam com o tempo.",
        },
        { type: "claims", layer: "deep", claimKeys: ["bolognesi-classificacao", "teto-gastos-2016", "cotas-2012"] },
        { type: "valueConflict", layer: "deep", title: "Governar × manter a coerência", values: ["Governabilidade", "Coerência"], scenario: "Para aprovar um programa social, o governo precisa do voto de partidos que se opõem a outras ideias suas.", tension: "Alianças amplas permitem governar, mas podem diluir propostas e desgastar a relação com a própria base." },
      ],
      deepDive: "## Presidencialismo de coalizão\n\nO termo foi cunhado pelo cientista político Sérgio Abranches (1988). Ele ajuda a entender por que políticas raramente seguem um manual ideológico puro no Brasil.\n\nPara aprofundar: Bolognesi, Ribeiro e Codato (2023), na biblioteca de fontes.",
    },
    {
      number: 6,
      slug: "o-outro-lado",
      kicker: "E o outro lado?",
      title: "A direita responderia assim",
      summary: "Os argumentos da esquerda diante das melhores respostas da direita — e o que a evidência permite dizer.",
      keyPoints: [
        "Para cada argumento da esquerda existe uma resposta forte da direita.",
        "Muitas vezes os dois lados concordam sobre o problema e discordam sobre a solução.",
        "Ouvir a melhor versão do outro lado ajuda a ter certeza do que você pensa.",
      ],
      blocks: [
        { type: "lead", text: "Um argumento só fica completo quando enfrenta a melhor objeção. Toque para alternar entre os dois lados de cada questão." },
        { type: "illustration", name: "dialogue", title: "Ouvir antes de responder", caption: "Cada argumento da esquerda vem com a resposta da direita. Toque para alternar entre os dois." },
        {
          type: "counterpoints",
          items: [
            { id: "servicos", prompt: "A esquerda diz: mais Estado oferece mais serviços e reduz desigualdades. O que a direita responde?", thisSide: "Serviços públicos garantem acesso a quem não pode pagar e chegam a lugares que não dão lucro.", otherSide: "O dinheiro do governo é limitado e o Brasil já cobra muito imposto. Parcerias com empresas, concessões e vouchers poderiam atender mais gente gastando melhor.", evidence: "Depende do setor e do país: há sistemas públicos e mistos bem avaliados. A qualidade da gestão pesa tanto quanto quem é o dono.", claimKeys: ["cf88-saude", "saneamento-2020"] },
            { id: "transferencias", prompt: "A esquerda diz: transferir renda reduz a pobreza. O que a direita responde?", thisSide: "O dinheiro chega direto a quem mais precisa, com custo baixo.", otherSide: "O melhor programa social é o emprego. Benefício sem porta de saída pode desestimular a carteira assinada; o foco deveria ser crescimento e qualificação.", evidence: "Estudos públicos associam o Bolsa Família à queda da pobreza extrema; os efeitos sobre trabalho são debatidos e dependem das regras do programa.", claimKeys: ["bolsa-familia-efeitos"] },
          ],
        },
        {
          type: "counterpoints",
          layer: "deep",
          title: "Mais confrontos",
          items: [
            { id: "trabalhistas", prompt: "A esquerda diz: direitos trabalhistas protegem o trabalhador. O que a direita responde?", thisSide: "Sem regras e sindicatos, o trabalhador negocia em desvantagem.", otherSide: "Regras rígidas encarecem a contratação e empurram milhões para a informalidade, onde não há direito nenhum.", evidence: "Os efeitos da reforma trabalhista de 2017 sobre emprego e informalidade ainda são estudados, com conclusões diferentes.", claimKeys: ["reforma-trabalhista-2017"] },
            { id: "crise", prompt: "A esquerda diz: o governo deve gastar para combater crises. O que a direita responde?", thisSide: "Em recessões, o gasto público segura o emprego.", otherSide: "Gasto sem controle gera dívida, juros altos e inflação — que castigam justamente os mais pobres.", evidence: "Economistas aceitam gasto extra em crises agudas, mas divergem sobre limites, sobretudo em países endividados.", claimKeys: ["keynes-1936", "lrf-2000"] },
          ],
        },
      ],
      deepDive: "## O teste da melhor objeção\n\nFilósofos chamam de **princípio da caridade** interpretar o argumento do outro na sua versão mais forte. Não exige concordar — só entender por que pessoas razoáveis chegam a outra conclusão.",
    },
    {
      number: 7,
      slug: "o-que-voce-pensa",
      kicker: "E você?",
      title: "Agora é com você",
      summary: "Algumas perguntas sobre o que você viu. Não há resposta certa — e “depende” vale.",
      keyPoints: [
        "Responda só se quiser: suas respostas ficam apenas no seu celular ou computador.",
        "“Depende” e “não sei” são respostas válidas.",
        "Depois, veja o outro lado — e, se quiser, faça sua escolha no final.",
      ],
      blocks: [
        { type: "lead", text: "Nenhuma resposta aqui faz de você alguém de esquerda ou de direita. São só pistas — e elas alimentam o seu mapa de afinidades." },
        { type: "illustration", name: "crossroads", title: "O caminho é seu", caption: "Você pode concordar com um lado em alguns temas e com o outro em outros — e mudar de ideia." },
        { type: "reflection", statementKeys: ["eco-estatais-estrategicas", "soc-transferencias-temporarias", "seg-programas-sociais", "amb-petroleo", "ins-imprensa"] },
      ],
      deepDive: "## Por que “depende” é uma boa resposta\n\nMuitas questões políticas envolvem trocas reais entre valores. Responder “depende” mostra que você percebe essas trocas — e o mapa trata essa resposta como posição intermediária, não como falta de opinião.",
    },
  ],
};

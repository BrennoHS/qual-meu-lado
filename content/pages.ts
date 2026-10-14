/** Páginas institucionais (editáveis no painel). Formato: markdown simplificado. */
export type PageSeed = { slug: string; title: string; summary: string; body: string };

export const pages: PageSeed[] = [
  {
    slug: "como-funciona",
    title: "Entenda primeiro como funciona",
    summary: "O que é este site, como navegar e o que fazemos (e não fazemos) com suas respostas.",
    body: `## O que é o DOIS LADOS

Um especial interativo de educação política. Ele apresenta as principais tradições associadas à esquerda e à direita, seus argumentos, suas críticas e como aparecem no Brasil. **Não recomenda candidatos, partidos nem ideologias.**

## Três caminhos

- **Explorar a esquerda** ou **explorar a direita**: sete capítulos curtos, da origem histórica às críticas e contrapontos. Você pode pular entre capítulos e trocar de lado a qualquer momento.
- **Descobrir minhas afinidades**: 24 afirmações sobre oito dimensões políticas. Para cada uma, você pode concordar, discordar, responder “depende” ou “não sei”. O resultado mostra padrões aproximados, tema por tema — nunca um rótulo.
- **Quem defende o quê**: área informativa sobre candidaturas e propostas documentadas, com comparador manual.

## Como ler as etiquetas

Cada afirmação relevante tem um botão **Ver fonte** e uma etiqueta:

- **Fato documentado** — verificável em fonte primária ou de referência.
- **Argumento favorável** — como defensores de uma posição a justificam.
- **Crítica fundamentada** — objeção sustentada por evidência ou literatura.
- **Interpretação** — leitura de especialistas sobre fatos; pode haver outras.
- **Proposta** — promessa ou plano, não política implementada.
- **Informação não confirmada** — ainda em apuração.

## Suas respostas

Ficam **apenas no seu navegador**. Nada é enviado ao nosso servidor, e você pode apagar tudo a qualquer momento em [Seu percurso](/meu-percurso).

## A ordem esquerda/direita

Apresentamos esquerda antes de direita apenas por convenção de leitura (da esquerda para a direita), não por preferência. As duas perspectivas têm a mesma estrutura, o mesmo número de capítulos e o mesmo tratamento visual.`,
  },
  {
    slug: "como-construimos",
    title: "Como construímos este site",
    summary: "Objetivo editorial, seleção de temas e fontes, tratamento de críticas, curadoria de propostas, cálculo de afinidades, limites e correções.",
    body: `## Objetivo editorial

Ajudar pessoas a compreender ideias políticas e a formar o próprio julgamento. Não buscamos convencer ninguém a apoiar partido, candidatura ou ideologia. Não afirmamos ser “100% imparciais”: preferimos mostrar como trabalhamos, para que você possa verificar.

## Como os assuntos são selecionados

Os onze temas cobrem as áreas mais recorrentes em programas de governo e na literatura sobre esquerda e direita: papel do Estado, economia, desigualdade, liberdades, segurança, políticas sociais, educação, saúde, costumes, meio ambiente e instituições.

## Como as fontes são avaliadas

Priorizamos, nesta ordem: legislação e documentos oficiais (Planalto, TSE, Câmara, Senado); dados públicos (IBGE, Ipea, Banco Central, Tesouro); literatura acadêmica e obras de referência; e jornalismo profissional e agências de checagem como complemento. Documentos de campanha são fonte primária **do que foi prometido**, não prova de viabilidade.

Cada afirmação relevante é registrada com tipo (fato, interpretação, proposta, previsão ou opinião), fonte, data de verificação, contexto e limitações. Links são verificados periodicamente; portais oficiais que bloqueiam verificação automatizada são marcados para conferência manual.

## Como identificamos correntes

Usamos classificações consolidadas na filosofia política e na ciência política. Distinguimos **ideologias** (tradições de pensamento) de **partidos** (organizações que podem mudar de posição). Quando classificamos partidos, citamos estudos e informamos que classificações variam.

## Como tratamos críticas e contrapontos

As duas perspectivas têm capítulos de críticas com a mesma estrutura e o mesmo destaque que os argumentos favoráveis. Não inventamos defeitos para manter simetria nem omitimos críticas bem documentadas. Cada crítica traz a resposta de quem defende a posição criticada. Imparcialidade metodológica não significa distribuir razão igualmente: quando há consenso documental, nós o apresentamos como tal.

## Como escolhemos propostas para destaque

Aplicamos os mesmos seis critérios públicos a todas as candidaturas, com nota de 0 a 2 em cada: centralidade no plano de governo, impacto potencial, relevância nacional, grau de especificidade, interesse público e disponibilidade de documentação verificável. Destacamos de 4 a 8 propostas por candidatura; as demais ficam disponíveis na lista completa. Promessas nunca são apresentadas como políticas implementadas.

## Como funciona o mapa de afinidades

Ver a seção detalhada abaixo, gerada a partir das definições publicadas no banco de dados.

## Limites

O conteúdo é uma introdução, não um tratado. Resumos simplificam. Classificações são aproximações. O mapa de afinidades mostra padrões nas suas respostas a 24 afirmações — não mede sua identidade política.

## Erros e correções

Encontrou um erro? Use o formulário em [Contato](/contato). Correções relevantes são publicadas no [Registro de correções](/correcoes), com data e descrição do que mudou.

## Proteção de dados

Suas respostas ficam no seu navegador. Ver [Política de privacidade](/privacidade).

## Estado atual do conteúdo

O conteúdo inicial foi redigido com pesquisa assistida e links verificados automaticamente em outubro de 2026. Antes de um lançamento público, todo o acervo deve passar pela revisão editorial humana prevista no fluxo do painel (Rascunho → Em revisão → Verificado → Publicado). As propostas das candidaturas do 2º turno vêm dos planos de governo registrados no TSE, com página indicada.`,
  },
  {
    slug: "privacidade",
    title: "Política de privacidade",
    summary: "Que dados tratamos, por quê, e o que nunca fazemos.",
    body: `## Resumo

- Suas respostas às afirmações e o resultado do mapa de afinidades **ficam apenas no seu navegador** (armazenamento local). Não são enviados ao servidor.
- Não criamos perfis políticos, não usamos cookies de publicidade nem identificadores de rastreamento.
- Não associamos resultados a nome, e-mail, conta ou endereço IP.

## Por que esse cuidado

A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) classifica opinião política como **dado pessoal sensível**. A forma mais segura de proteger esse dado é não coletá-lo.

## Dados que podemos tratar

- **Relatos de erro** enviados voluntariamente pelo formulário de contato: mensagem, página e, se você quiser, um e-mail para resposta. Não registramos IP. Retenção máxima recomendada: 180 dias.
- **Registros técnicos** do servidor de hospedagem, necessários para segurança e funcionamento, sem vínculo com respostas.
- **Contas administrativas** da equipe editorial (nome, e-mail, senha protegida por hash).

## Seus direitos

Você pode apagar suas respostas locais a qualquer momento em [Seu percurso](/meu-percurso). Para relatos enviados, solicite exclusão pelo [Contato](/contato). Dúvidas sobre proteção de dados podem ser dirigidas também à ANPD.

## Estatísticas de visitas (ligadas desde 14/10/2026)

Contamos visitas de forma **agregada e anônima** com o Web Analytics e o Speed Insights da Vercel, a empresa que hospeda o site: quantas pessoas abriram cada página, de onde vieram (por exemplo, um link no WhatsApp), país, tipo de aparelho e a velocidade de carregamento. Não há cookies nem identificador que siga você de um dia para o outro: para não contar a mesma visita duas vezes, a Vercel usa um código temporário descartado a cada 24 horas.

Antes de cada envio, o próprio site **corta a parte do endereço depois de "?"** (onde links compartilhados levam dados de resultado), e quem liga "Global Privacy Control" ou "Do Not Track" no navegador **não é contado**. Nada disso tem ligação com suas respostas, que nunca saem do seu navegador.

## Medição própria dos reels (hoje: desligada)

O site também tem uma medição própria, **agregada e anônima**, desligada por padrão. Se for ativada — só depois de parecer jurídico —, ela contará apenas até qual tela os reels são vistos, por dia: sem cookies, sem IP, sem identificador e sem ligação com respostas. Nas propostas do 2º turno, conta só o tema, nunca a candidatura. Navegadores com "Global Privacy Control" ou "Do Not Track" ligados ficam fora. Os números servem apenas para melhorar o conteúdo e não são divulgados. Se ela for ativada, esta seção será atualizada com a data.

## O que fica só no seu navegador

Suas respostas, sua escolha final e o ponto onde você parou em cada reel ("continuar de onde parei") ficam apenas no armazenamento local do seu navegador e podem ser apagados em [Seu percurso](/meu-percurso). O botão "Ouvir" usa a voz do seu próprio aparelho.

## Funcionalidades futuras

Qualquer funcionalidade que envolva dados coletivos sobre preferências políticas só poderá ser ativada após avaliação jurídica específica, com base legal adequada, transparência e controles de proteção.`,
  },
  {
    slug: "termos",
    title: "Termos de uso",
    summary: "Regras de uso do site.",
    body: `## Finalidade

O DOIS LADOS é um projeto educativo. Não é propaganda eleitoral, não é pesquisa eleitoral e não recomenda candidaturas.

## Conteúdo

Buscamos precisão e indicamos fontes, mas o conteúdo pode conter erros. Consulte sempre as fontes originais para decisões importantes e reporte problemas pelo [Contato](/contato).

## Mapa de afinidades

O resultado é uma ferramenta de reflexão baseada em um conjunto limitado de afirmações. Não constitui diagnóstico, classificação oficial ou recomendação de voto.

## Compartilhamento

Você pode compartilhar páginas e informações verificáveis. O mapa de afinidades não tem botão de compartilhar. Na tela "Sua escolha" você pode, se quiser, compartilhar uma frase sobre o lado com que se identifica: ela revela sua opinião a quem receber. Nós não guardamos essa escolha nem a associamos a você.

## Uso indevido

É proibido tentar acessar áreas administrativas sem autorização, automatizar acessos abusivos ou usar o conteúdo para criar perfis eleitorais de terceiros.`,
  },
  {
    slug: "politica-editorial",
    title: "Política editorial",
    summary: "Princípios que orientam a produção e a revisão do conteúdo.",
    body: `## Princípios

1. **Verificabilidade**: afirmações factuais relevantes só são publicadas com fonte.
2. **Equilíbrio estrutural**: as duas perspectivas têm a mesma estrutura, extensão comparável e tratamento visual equivalente.
3. **Distinção entre fato e interpretação**: cada afirmação é classificada e exibida com etiqueta.
4. **Sem falsa equivalência**: alegações demonstravelmente falsas não são apresentadas como “outro lado”.
5. **Linguagem**: português claro, sem sensacionalismo, sem jargão sem explicação, sem tratar o leitor como ignorante.
6. **Sem recomendação**: não ranqueamos, recomendamos ou sugerimos candidaturas — nem por inteligência artificial.

## Fluxo editorial

Todo conteúdo passa por: **Rascunho → Em revisão → Verificado → Publicado**, e pode ser marcado como **Desatualizado**. A verificação é feita por pessoa diferente de quem editou. O sistema impede a publicação de afirmações factuais sem fonte e mantém histórico de versões, autores e datas.

## Período eleitoral

Durante o processo eleitoral, observamos a legislação e as resoluções do TSE. Não publicamos enquetes, placares de opinião ou qualquer conteúdo que possa ser confundido com pesquisa eleitoral.`,
  },
  {
    slug: "apoie",
    title: "Apoie o DOIS LADOS",
    summary: "Como este projeto pode se sustentar sem perder a independência — e as regras que nenhum apoiador pode mudar.",
    body: `## Por que falar de dinheiro

Pesquisar, verificar e manter um site como este custa tempo e trabalho. Para continuar gratuito e aberto, o projeto pode receber apoio — desde que isso nunca interfira no conteúdo.

## Formas de apoio previstas

- **Apoio institucional**: fundações, universidades, institutos e empresas podem apoiar o projeto e aparecer em espaços discretos e sinalizados como “Apoio institucional”.
- **Editais e fomento**: programas de apoio a jornalismo, educação e inovação cívica.
- **Apoio de leitores**: contribuições voluntárias de quem gosta do projeto.
- **Licenciamento educativo**: versões para escolas, cursinhos e veículos de imprensa.

## Regras que não mudam

1. **Nenhuma propaganda política ou eleitoral.** Partidos, candidaturas, governos em campanha e grupos de pressão política não podem anunciar nem apoiar.
2. **Apoio não compra conteúdo.** Apoiadores não leem textos antes da publicação, não escolhem temas e não podem pedir alterações.
3. **Sem rastreamento.** Não usamos pixels de publicidade, perfis de usuário ou segmentação. Respostas dos visitantes nunca são compartilhadas — elas nem chegam ao nosso servidor.
4. **Sempre sinalizado.** Todo espaço de apoio diz claramente “Apoio institucional”, com link marcado como patrocinado.
5. **Lista pública.** Todos os apoiadores ficam listados nesta página, com o período do apoio.

## Quer apoiar?

Fale com a equipe pela página de [contato](/contato) e escreva “apoio” no início da mensagem.`,
  },
];

export const settings: Record<string, unknown> = {
  hero: {
    question: "Você sabe de que lado está?",
    subtitle: "Antes de escolher, descubra o que cada lado realmente defende.",
    finalPhrase: "Você não precisa concordar com um lado inteiro para saber no que acredita.",
  },
  notice: {
    enabled: true,
    text: "Versão de desenvolvimento: o conteúdo ainda passa por revisão editorial humana antes do lançamento.",
  },
  election: {
    enabled: true,
    secondRoundDate: "2026-10-25T08:00:00-03:00",
    title: "2º turno · 25 de outubro",
    cta: "Compare as propostas de Flávio Bolsonaro e Lula",
  },
  sponsorship: {
    enabled: true,
    label: "Apoio institucional",
    sponsors: [],
    placeholder: "Este espaço é reservado a apoiadores institucionais que não interferem no conteúdo. Nunca exibimos propaganda política ou eleitoral.",
  },
};

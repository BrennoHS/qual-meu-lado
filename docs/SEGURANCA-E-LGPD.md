# Segurança, privacidade e conformidade

## Dados pessoais

| Dado | Onde fica | Observação |
|---|---|---|
| Respostas às afirmações, resultado do mapa, capítulos visitados | **somente no navegador** (`localStorage`, chave `doislados:journey:v1`) | Nunca enviados ao servidor (verificado por teste E2E). O visitante apaga tudo em `/meu-percurso`. |
| Relatos de erro | banco (`ErrorReport`) | Mensagem, página e e-mail **opcional**. Sem IP. Retenção recomendada: 180 dias (exclusão no painel). |
| Contas da equipe | banco (`User`, `Session`) | Senha com bcrypt (custo 12); sessão guarda só hash SHA-256 do token; sem IP. |
| Rate limiting | memória do processo | Chave = hash efêmero (IP+UA); nada persistido. |

A LGPD (art. 5º, II) classifica **opinião política como dado sensível**. A decisão de arquitetura é não coletá-lo: não há tabela, endpoint ou analytics que receba respostas. Não há cookies de publicidade, pixels ou identificadores de rastreamento. Qualquer funcionalidade futura que trate esses dados exige revisão jurídica específica, base legal, transparência, minimização e controles de segurança (ver “Funcionalidades condicionais”).

## Legislação eleitoral

- O site não publica enquetes nem placares de preferência. A `FeatureFlag("collective-results")` está desligada e exige, para ativar: parecer jurídico registrado + `COLLECTIVE_RESULTS_ENABLED=true` no servidor + desenvolvimento de coleta com metodologia apropriada (hoje inexistente).
- Pesquisas eleitorais exigem registro prévio na Justiça Eleitoral (Lei 9.504/1997, art. 33; Res. TSE 23.600/2019). Participação voluntária em site **não** é amostra representativa — o mito correspondente explica isso ao público.
- Nenhum mecanismo ranqueia, recomenda ou sugere candidaturas, inclusive por IA. O comparador exige escolha manual e não atribui nota.
- Em 12/10/2026 o país está entre o 1º e o 2º turno: revise com assessoria jurídica qualquer conteúdo sobre candidaturas antes de publicá-lo.

## Medição agregada (desligada por padrão)

**Por que é delicada.** (1) LGPD: opinião política é dado pessoal sensível (art. 5º, II; art. 11). Saber quanto tempo alguém passou em cada lado, ou em qual candidatura, permite *inferir* inclinação política — e IP + horário já são dados pessoais. (2) Lei eleitoral: em período de campanha são vedadas enquetes sobre o processo eleitoral (Lei 9.504/1997, art. 33, §5º), e divulgar números de preferência sem registro pode ser tratado como pesquisa irregular (Res. TSE 23.600/2019). Um número como “60% viram as propostas de X” é exatamente o tipo de coisa a evitar. (3) Confiança: o site promete que nada sai do navegador; mudar isso exige transparência.

**Como foi construída para reduzir o risco.**
- Duas travas: `AGGREGATE_METRICS_ENABLED=true` no servidor **e** chave no painel, que exige referência de parecer jurídico (registrada na auditoria).
- Desligada, o navegador não envia nada (o teste e2e “respostas nunca são enviadas” continua valendo).
- Um único evento, `reel_depth`: a tela mais funda alcançada, enviada uma vez ao sair da página. Lista fechada de chaves (regex), sem texto livre.
- Propostas: a chave é o **tema**, nunca a candidatura. Não existe contador “por candidato”.
- Sem cookie, IP, user agent, horário exato ou identificador. O hash usado no limite de requisições fica só na memória.
- Respeita Global Privacy Control e Do Not Track.
- Contadores diários; retenção de 90 dias; painel oculta valores < 10.
- Uso interno: o painel avisa que os números não podem ser divulgados nem apresentados como preferência.

**Antes de ativar:** parecer jurídico; atualizar a política de privacidade com a data; avaliar base legal (legítimo interesse, com teste de balanceamento) e registrar no inventário de dados.

## Ameaças e mitigações

| Ameaça | Mitigação |
|---|---|
| Acesso não autorizado ao painel | Middleware barra sem cookie; **toda** página (`requireUser`) e **toda** server action (`assertUser`) validam sessão e papel no servidor. |
| Força bruta no login | 5 tentativas/15 min por cliente e 10/h por conta; resposta e tempo iguais para e-mail inexistente (hash fictício); falhas auditadas. |
| Roubo de sessão | Token aleatório de 256 bits; cookie `httpOnly`, `SameSite=Strict`, `Secure` e prefixo `__Host-` em produção; expiração de 8 h; desativar usuário derruba sessões. |
| CSRF | Server actions do Next comparam `Origin` com `Host`; cookie `SameSite=Strict`; não há rotas de mutação via GET. |
| XSS | Conteúdo editorial nunca vira HTML bruto (renderizador próprio, testado); links só `http(s)`, internos, `#` ou `mailto:`; CSP com `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. |
| SQL injection | Prisma com consultas parametrizadas; nenhum SQL concatenado. |
| Entrada inválida | Zod no servidor para formulários, blocos JSON, critérios, parâmetros da API. |
| Clickjacking | `X-Frame-Options: DENY` + CSP. |
| Vazamento por cabeçalhos | `poweredByHeader: false`; `Referrer-Policy`; `Permissions-Policy` restritiva; painel com `noindex` e `no-store`. |
| Spam no formulário | honeypot + 5 envios/hora por cliente. |
| Perda de rastreabilidade | `AuditLog` para logins, criações, edições, transições, exclusões (com snapshot), links, usuários e flags. |

**Trade-off conhecido**: `script-src 'unsafe-inline'` é necessário para os scripts de hidratação sem nonce. Migrar para CSP com nonce (middleware) é possível, mas torna todas as páginas dinâmicas.

## Checklist de produção

- [ ] `DATABASE_URL` de PostgreSQL gerenciado com TLS; backups automáticos.
- [ ] `NODE_ENV=production`, HTTPS, `NEXT_PUBLIC_SITE_URL` correto.
- [ ] Não use `SEED_ADMIN_PASSWORD`; crie contas com `npm run admin:create` e remova a conta de desenvolvimento.
- [ ] `EDITORIAL_REQUIRE_SECOND_REVIEWER=true`.
- [ ] Rate limiter distribuído (Redis/Upstash) se houver mais de uma instância.
- [ ] Cron diário de `npm run links:check`; cron de `purgeExpiredSessions`; política de retenção de relatos.
- [ ] Revisão editorial humana de todo o acervo; remoção das candidaturas demonstrativas; desligar aviso de demonstração.
- [ ] Revisão jurídica (LGPD e eleitoral) da política de privacidade, termos e da área de candidaturas.
- [ ] Encarregado(a) de dados (DPO) indicado(a) na política de privacidade.

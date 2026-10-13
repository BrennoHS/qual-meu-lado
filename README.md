# DOIS LADOS

**Dois lados. Milhões de perspectivas.**
Experiência interativa de educação política brasileira: o visitante explora o que esquerda e direita defendem, seus argumentos, suas críticas e as fontes de cada afirmação — e forma a própria conclusão.

> Princípio editorial: o site não persuade ninguém a apoiar partido, candidatura ou ideologia. Credibilidade vem de verificabilidade e transparência, não de slogans.

---

## Rodando localmente

Requisitos: **Node.js 20+** (testado com 24). Não é preciso Docker nem PostgreSQL instalado.

```bash
npm install
cp .env.example .env          # ajuste SEED_ADMIN_PASSWORD (mín. 12 caracteres)
npm run db:local              # terminal 1: sobe um PostgreSQL 17 embutido na porta 5433
npm run db:deploy             # terminal 2: aplica as migrações
npm run db:seed               # importa o acervo editorial inicial
npm run dev                   # http://localhost:3000  ·  painel: /admin
```

`db:local` usa o pacote `embedded-postgres` (binários oficiais do PostgreSQL via npm), com dados em `.pgdata/` e encoding UTF-8 forçado. Se preferir Docker: `docker compose up -d` (mesma porta e credenciais).

> **npm 11+/12**: scripts de instalação ficam bloqueados por padrão. O `package.json` já traz `allowScripts` para Prisma, esbuild e embedded-postgres. Se o Prisma Client não for gerado, rode `npx prisma generate`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` / `build` / `start` | Next.js em desenvolvimento / build / produção |
| `npm run db:local` | PostgreSQL embutido para desenvolvimento |
| `npm run db:migrate` | Cria nova migração a partir do `schema.prisma` |
| `npm run db:deploy` | Aplica migrações (produção/CI) |
| `npm run db:seed` | Importa `/content` para o banco (**sobrescreve conteúdo editorial**, mantém usuários; bloqueado em produção sem `SEED_ALLOW_OVERWRITE=true`) |
| `npm run admin:create -- email "Nome"` | Cria/reativa conta administrativa pedindo a senha no terminal |
| `npm run links:check` | Verifica todas as URLs de fontes e atualiza o estado no banco (agende diariamente) |
| `npm test` | Testes unitários (Vitest) — cálculo, regras editoriais, segurança, **integridade e equilíbrio do conteúdo** |
| `npm run test:e2e` | Testes de ponta a ponta (Playwright, desktop + celular). Antes: `npx playwright install chromium` — ou, no Windows, use o Edge do sistema: `PW_CHANNEL=msedge npm run test:e2e` |
| `npm run lint` | Checagem de tipos (TypeScript estrito) |

---

## O que existe

**Site público** (sem login)
- `/` — hero dividido em tela cheia (lado a lado no desktop, empilhado no celular), com transição de “corte” ao escolher um lado.
- `/explorar/[esquerda|direita]` e `/explorar/[lado]/[capitulo]` — walkthrough em 7 capítulos espelhados: origens, o que defende, argumentos, **críticas** (com resposta dos defensores), Brasil, contrapontos, reflexão. Navegação livre, indicador de progresso, troca de perspectiva no mesmo capítulo, modo leitura aprofundada.
- `/afinidades` — experiência SIM/NÃO (+ Depende, Não sei, Entender melhor) com 24 afirmações em 8 dimensões.
- `/afinidades/resultado` — mapa de afinidades calculado **no navegador**, com metodologia, contribuições por resposta, limitações e dimensões indeterminadas. Sem botão de compartilhar resultado.
- `/temas`, `/temas/[slug]` — os dois lados lado a lado, conflitos de valores, “o outro lado pensa…”.
- `/linha-do-tempo`, `/mitos`, `/fontes`, `/meu-percurso`.
- `/quem-defende-o-que`, `/[slug]`, `/comparar` — candidaturas, propostas com 10 campos, comparador manual.
- `/como-funciona`, `/como-construimos`, `/politica-editorial`, `/privacidade`, `/termos`, `/correcoes`, `/contato`.
- Componente universal **Ver fonte** e etiquetas: Fato documentado · Argumento favorável · Crítica fundamentada · Interpretação · Proposta · Informação não confirmada.

**Painel** (`/admin`, protegido)
- CRUD de todos os tipos de conteúdo (fontes, afirmações, perspectivas, capítulos em JSON validado, correntes, temas, posições, linha do tempo, mitos, curiosidades, dimensões, afirmações do mapa, eleições, candidaturas, propostas, declarações, páginas, correções, destaques da home, imagens).
- Fluxo **Rascunho → Em revisão → Verificado → Publicado → Desatualizado**, com permissões por papel, princípio dos quatro olhos, histórico de versões e auditoria.
- **Bloqueio de publicação** sem fonte (fatos, capítulos que citam afirmações não verificadas, propostas sem fonte/data etc.).
- Saúde dos links, afirmações a reverificar, relatos de erro, usuários e papéis, funcionalidades condicionais.

**API interna somente leitura** (`/api/content/*`, `/api/health`) — só conteúdo publicado; nunca recebe respostas de visitantes.

---

## Dados demonstrativos — leia antes de publicar

- **As três candidaturas são fictícias** (`isDemo`), exibidas com aviso em todas as telas. Candidaturas reais devem ser cadastradas pelo painel a partir do DivulgaCandContas/TSE e dos programas registrados.
- O acervo editorial inicial (86 fontes, 70 afirmações, 14 capítulos, 24 afirmações do mapa) foi redigido com pesquisa assistida. URLs foram conferidas automaticamente em 12/10/2026; portais que bloqueiam robôs (TSE, IBGE, Britannica, FMI, R4V) estão marcados para conferência manual. **Todo o acervo precisa passar por revisão editorial humana antes do lançamento** — o aviso no rodapé (configurável em “Destaques da home e avisos”) diz isso ao público até lá.
- Uma curiosidade sem fonte ficou automaticamente “Em revisão” — exemplo da regra que impede publicar afirmação sem fonte.

## Documentação

- [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — stack, decisões, modelo de dados, fluxo de requisições, desempenho.
- [docs/EDITORIAL.md](docs/EDITORIAL.md) — fluxo editorial, regras de publicação, blocos de capítulo, como cadastrar candidaturas reais.
- [docs/SEGURANCA-E-LGPD.md](docs/SEGURANCA-E-LGPD.md) — autenticação, ameaças mitigadas, dados pessoais, legislação eleitoral, checklist de produção.

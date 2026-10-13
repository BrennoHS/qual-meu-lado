# Arquitetura

## Stack e por quê

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | **Next.js 15 (App Router)** + React 19 | RSC para páginas editoriais (HTML pronto, pouco JS), ISR com `revalidate` + `revalidatePath` ao publicar, server actions para o painel. Versão 15.5 escolhida por maturidade. |
| Linguagem | TypeScript estrito | |
| Estilo | **Tailwind CSS 4** com tokens em `@theme` (`globals.css`) | Design system em um só lugar; sem CSS-in-JS em runtime. |
| Animação | **Motion 12** (`LazyMotion` + `m.*`) | Bundle menor; `MotionConfig reducedMotion="user"` respeita `prefers-reduced-motion` globalmente. Animações só em `transform`/`opacity` (exceções pontuais documentadas no código). |
| Banco | **PostgreSQL 17** + **Prisma 6** | Migrações versionadas (`prisma/migrations`). Em dev, `embedded-postgres` dispensa Docker. |
| Validação | **Zod** | Blocos de capítulo, formulários do painel, parâmetros da API, formulário de contato. |
| Componentes acessíveis | **Radix Dialog** | Painel “Ver fonte”, menu. Foco preso, `Esc`, `aria-*` corretos. |
| Testes | **Vitest** (unidade) e **Playwright** (E2E, desktop + Pixel 7) | |

Não foi usado shadcn/ui completo: só um primitivo (Dialog) era necessário, e o visual é próprio.

## Estrutura

```
content/                 Acervo editorial inicial (fonte do seed — NÃO lido pelo site)
prisma/                  schema, migrações, seed
scripts/                 postgres embutido, verificador de links, criação de admin
src/app/                 rotas públicas, painel (/admin), API (/api)
src/components/          hero, walkthrough, evidence (Ver fonte), affinity, candidates, admin
src/lib/
  content/blocks.ts      esquema Zod dos blocos de capítulo
  content/queries.ts     camada de leitura pública (só PUBLISHED/OUTDATED)
  affinity/score.ts      cálculo do mapa (puro, testado, roda no navegador)
  journey/store.ts       estado local (localStorage) — respostas e capítulos visitados
  editorial/             estados, transições, regras de publicação, checagens no banco
  admin/                 definição declarativa dos recursos do CMS e parsing de formulários
  auth/                  senhas (bcrypt), sessões opacas, guardas
  security/rate-limit.ts limitador em memória (trocar por Redis com várias instâncias)
  links/check.ts         verificador de links
  richtext.tsx           renderizador seguro de markdown simplificado (sem HTML bruto)
tests/unit, tests/e2e
```

## Modelo de dados (resumo)

- **Evidências**: `Source` ↔ `ClaimSource` ↔ `Claim`. Toda afirmação relevante tem tipo (`FACT`, `INTERPRETATION`, `PROPOSAL`, `PREDICTION`, `OPINION`), fontes com localizador, trecho, contexto, limitações, datas e estado editorial. `Source` guarda estado do link (`OK`, `BLOCKED`, `BROKEN`).
- **Jornada**: `Perspective` → `Chapter` (blocos JSON validados), `Current`, `Theme` → `ThemePosition`, `TimelineEvent`, `Myth`, `Curiosity`. Conteúdo referencia afirmações pela **chave** (`claimKeys`), o que permite revisar uma afirmação uma vez e refletir em todo o site.
- **Mapa**: `Dimension` → `Statement` (definições). **Não existe tabela de respostas.**
- **Candidaturas**: `Election` → `Candidate` → `Proposal` / `Declaration` (com `Source`).
- **Governança**: `User`, `Session` (hash do token), `Revision` (snapshot por versão), `AuditLog`, `ErrorReport`, `Correction`, `FeatureFlag`, `SiteSetting`, `Page`, `MediaAsset`.

## Renderização e cache

- Páginas públicas são Server Components com `revalidate = 300`. Toda ação do painel chama `revalidatePath("/", "layout")`, então publicações aparecem imediatamente.
- O build precisa do banco acessível (páginas estáticas consultam o conteúdo).
- Componentes cliente recebem objetos serializados (datas em ISO).
- `loading.tsx` só existe em rotas que nunca retornam 404, para que `notFound()` produza status HTTP 404 real (streaming iniciado antes devolveria 200).

## Hero dividido

`src/components/hero/split-hero.tsx`. Um motion value (`useSpring`) alimenta a variável CSS `--split` (0–100). Recortes (`clip-path`), linha divisória e botão central são posicionados por CSS (`.hero-*` em `globals.css`), e **a orientação é decidida só por media query** — lado a lado ≥768px, empilhado abaixo. Isso evita discrepância entre servidor e cliente. Ao escolher um lado, `--split` anima para 0/100 e a navegação acontece após ~700 ms (imediata com movimento reduzido). Na página seguinte, `EntryCurtain` empurra a linha até a borda.

## Mapa de afinidades

`src/lib/affinity/score.ts` — função pura e determinística:
1. Concordo = +1, Discordo = −1, Depende = 0; Não sei fica fora.
2. Multiplica pela direção da afirmação (direções alternadas por dimensão reduzem viés de aquiescência — garantido por teste).
3. Média de −1 a +1 → proximidade percentual com o polo mais próximo.
4. Menos de 2 respostas decisivas → dimensão indeterminada, sem percentual.
5. Sem pontuação geral. Dimensões `NONE` (didáticas) nunca contam para um lado.

## Desempenho

- ~140 kB de JS inicial por página pública (Next + React + Motion lazy).
- Fontes via `next/font` (self-hosted, `display: swap`, sem CLS de troca de fonte).
- Sem imagens pesadas: o visual é tipográfico + SVG gerado; grão via SVG inline.
- `prefers-reduced-motion` e `prefers-reduced-data` desativam animações decorativas.
- Gráficos em SVG responsivo; comparador e abas com rolagem horizontal contida (sem overflow de página — verificado por teste E2E).

## Funcionalidade coletiva (desligada)

`FeatureFlag("collective-results")` só pode ser ativada por ADMIN com referência de parecer jurídico **e** `COLLECTIVE_RESULTS_ENABLED=true` no servidor. Não há endpoint de coleta: implementá-la exigirá desenho específico (ver docs/SEGURANCA-E-LGPD.md).

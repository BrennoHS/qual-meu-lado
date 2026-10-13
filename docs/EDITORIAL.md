# Manual editorial do painel

## Papéis

| Papel | Pode |
|---|---|
| **Edição** (EDITOR) | criar e editar rascunhos; enviar para revisão; voltar itens em revisão para rascunho |
| **Revisão** (REVIEWER) | tudo da edição + verificar, publicar, marcar como desatualizado, editar conteúdo publicado, verificar links, auditoria |
| **Administração** (ADMIN) | tudo + usuários, exclusões, eleições, funcionalidades condicionais |

## Fluxo

```
Rascunho → Em revisão → Verificado → Publicado → Desatualizado
                ↑______________|           |______→ Em revisão
```

- Não é possível pular a verificação (Rascunho/Em revisão → Publicado é bloqueado).
- **Quatro olhos**: quem fez a última edição não pode marcar como verificado (desligável em dev com `EDITORIAL_REQUIRE_SECOND_REVIEWER=false`).
- Conteúdo verificado/publicado só é editável por revisores; ao salvar, as regras de publicação rodam de novo e a alteração é **rejeitada** se o conteúdo deixar de cumpri-las.
- Cada salvamento e cada transição criam uma `Revision` (snapshot completo, autor, nota) e um registro de auditoria.
- “Desatualizado” continua visível ao público com aviso; use para conteúdo que precisa de revisão mas não pode sumir.

## Regras de publicação (impostas pelo sistema)

| Conteúdo | Para verificar/publicar precisa de |
|---|---|
| Afirmação `FACT` | ao menos uma fonte com URL válida (não quebrada) ou referência bibliográfica completa (livro/artigo) |
| Qualquer afirmação | nenhuma fonte com link quebrado; nada de fonte demonstrativa em conteúdo real |
| Capítulo | blocos válidos; todas as afirmações citadas verificadas/publicadas; correntes, curiosidades e perguntas existentes |
| Posição por tema, afirmação do mapa | afirmações citadas verificadas |
| Mito | ao menos uma afirmação de apoio verificada |
| Evento da linha do tempo, curiosidade | afirmação de referência verificada |
| Proposta | fonte original e data da informação |
| Declaração | fonte |
| Candidatura real | link do registro oficial (DivulgaCandContas) ou do programa de governo |

## Classificação das afirmações

- **Fato** — verificável em fonte primária ou de referência.
- **Interpretação** — leitura de especialistas (inclui consensos acadêmicos; explique em “Contexto”).
- **Proposta** — promessa/plano. Nunca descreva promessa como política implementada.
- **Previsão** — projeção. Só com fonte e metodologia.
- **Opinião** — posição atribuída, sempre com autoria.
Use “Limitações” para dizer o que a fonte **não** permite afirmar.

## Blocos de capítulo (JSON)

Validados por `src/lib/content/blocks.ts`. Tipos:

| `type` | Campos |
|---|---|
| `lead` | `text` |
| `text` | `title?`, `body` (markdown simplificado) |
| `claims` | `title?`, `claimKeys[]` |
| `timeline` | `title?`, `intro?`, `tags?[]`, `scope?` (`BRAZIL`/`INTERNATIONAL`) |
| `currents` | `title?`, `intro?`, `slugs[]` |
| `axes` | `title?`, `intro?`, `highlightSlugs?[]` |
| `themes` | `title?`, `intro?` |
| `arguments` | `kind` (`PRO`/`CRITIQUE`), `items[]` com `id`, `title`, `body`, `category?`, `claimKeys[]`, `response?` (críticas), `limits?` (favoráveis), `evidenceNote?` |
| `counterpoints` | `items[]` com `id`, `prompt`, `thisSide`, `otherSide`, `evidence`, `claimKeys[]` |
| `reflection` | `statementKeys[]` |
| `didYouKnow` | `curiositySlug` |
| `valueConflict` | `title`, `values` [a, b], `scenario`, `tension` |

Markdown simplificado: `## título`, `- lista`, `1. lista`, `**negrito**`, `*itálico*`, `[link](https://…)` ou `[link](/interno)`. HTML é exibido como texto.

## Equilíbrio

`tests/unit/content-integrity.test.ts` falha se as perspectivas deixarem de ter os mesmos capítulos, se a extensão de um capítulo divergir mais de 30% entre os lados, se o número de argumentos/críticas divergir em mais de 1, ou se alguma crítica ficar sem resposta dos defensores. Equilíbrio estrutural **não** significa distribuir razão igualmente: quando há consenso documental, apresente-o como tal (ver mitos sobre nazismo e sobre fomes em regimes comunistas).

## Cadastrando candidaturas reais

1. Crie/escolha a **Eleição** (Administração) e marque “em destaque”.
2. Cadastre a **Fonte** do programa de governo registrado no TSE (tipo “Documento de campanha”) e, se houver, do registro no DivulgaCandContas.
3. Cadastre a **Candidatura** com `isDemo` desmarcado e os links oficiais.
4. Cadastre as **Propostas** com os 10 campos e os 6 critérios (0–2). Destaque de 4 a 8 por candidatura, pelos mesmos critérios para todas.
5. Envie para revisão. Outra pessoa verifica e publica.
6. Despublique (marque como desatualizado) ou exclua as candidaturas demonstrativas e desligue o aviso de demonstração em “Destaques da home e avisos”.

## Correções

Ao corrigir algo relevante já publicado, registre em **Registro de correções** (data, o que mudou, conteúdo afetado) e publique. Relatos do público chegam em **Relatos de erro**.

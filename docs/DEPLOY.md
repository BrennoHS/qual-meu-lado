# Colocando o DOIS LADOS no ar

Arquitetura recomendada (simples, barata e escalável para um pico de compartilhamento):

| Peça | Serviço sugerido | Por quê | Custo aproximado |
|---|---|---|---|
| Código | GitHub (repositório **privado**) | Histórico e deploy automático | Grátis |
| Site (Next.js) | Vercel | Feito pelos criadores do Next.js; HTTPS e CDN automáticos; aguenta picos | Plano Pro: US$ 20/mês* |
| Banco (PostgreSQL) | Supabase, região **São Paulo** | Postgres gerenciado, com backup | Grátis no início |
| Domínio | Registro.br (`.com.br`) | Registro oficial do Brasil | ~R$ 40/ano |

\* O plano gratuito (Hobby) da Vercel é só para uso **não comercial**. Como o site prevê apoio institucional, use o Pro. Alternativas equivalentes: Railway, Render ou um servidor próprio com Docker.

## Passo a passo

### 1. Domínio
1. Pesquise em <https://registro.br> (ex.: `doislados.app.br` — o `doislados.com.br` já tem dono). `.com.br` exige CPF ou CNPJ do titular.
2. Compre também as variações que você quer proteger (ex.: o nome com e sem hífen) e aponte-as para o principal depois.

### 2. Banco de dados (Supabase)
1. Crie o projeto na região **South America (São Paulo)** — os dados ficam no Brasil e o site responde mais rápido.
2. Em *Settings → API*, **desligue a Data API** (ou remova `public` dos *exposed schemas*). O site não usa essa API. Mesmo assim, a migração `seguranca_supabase` liga RLS em todas as tabelas e tira o acesso dos papéis públicos, por garantia.
3. Copie `.env.supabase.example` para `.env.supabase` e cole as duas conexões (botão **Connect → ORM → Prisma**). Esse arquivo não vai para o git.
4. Do seu computador, **uma única vez** (no Git Bash):
   ```bash
   set -a; source .env.supabase; set +a
   npx prisma migrate deploy
   DATABASE_URL="$DIRECT_URL" npm run db:seed:prod
   DATABASE_URL="$DIRECT_URL" npm run admin:create:prod -- seu@email "Seu nome"
   ```
   O último comando pede a senha do painel no próprio terminal (mín. 12 caracteres).
   > ⚠️ O seed **apaga e recria todo o conteúdo editorial**. Rode-o só no lançamento. Depois disso, edite pelo painel `/admin` — rodar o seed de novo apagaria as edições.

### 3. Código e hospedagem
1. Crie um repositório **privado** no GitHub e envie o projeto (o `.env` nunca vai junto — já está no `.gitignore`).
2. Na Vercel: *Add New → Project → Import* o repositório. Ela detecta o Next.js sozinha.
3. Em *Settings → Environment Variables* (ambiente Production), cadastre:

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | conexão **Transaction** do Supabase (porta 6543, `?pgbouncer=true&connection_limit=1`) |
   | `DIRECT_URL` | conexão **Session** do Supabase (porta 5432) |
   | `NEXT_PUBLIC_SITE_URL` | `https://seudominio.com.br` (sem barra no fim) |
   | `EDITORIAL_REQUIRE_SECOND_REVIEWER` | `true` |
   | `COLLECTIVE_RESULTS_ENABLED` | `false` |
   | `AGGREGATE_METRICS_ENABLED` | `false` |
   | `CONTACT_EMAIL` | `contato@qualmeulado.com.br` |
   | `MAIL_FROM` | `DOIS LADOS <site@qualmeulado.com.br>` |
   | `RESEND_API_KEY` | chave do Resend (ver 4b) |

   `NEXT_PUBLIC_SITE_URL` é o endereço que aparece no card de compartilhamento e no QR code — confira antes de divulgar.
4. Em *Settings → Functions → Function Region*, escolha **São Paulo (gru1)** — a mesma região do banco.
5. *Deploy*. Na primeira vez leva alguns minutos.

### 4. Ligar o domínio
1. Na Vercel: *Settings → Domains → Add* o domínio com e sem `www`.
2. No Registro.br, em *DNS*, crie os registros que a Vercel mostrar (normalmente um `A` para a raiz e um `CNAME` para `www`). O HTTPS é emitido sozinho.
3. Propagação: de minutos a algumas horas.

### 4b. E-mail (contato@qualmeulado.com.br)
Dois serviços, cada um com seus registros de DNS (todos em Registro.br → domínio → **DNS → Editar zona**):
- **Zoho Mail (grátis)** — a caixa de entrada `contato@`: um `TXT` de verificação, três `MX` na raiz e um `TXT` de SPF (`v=spf1 include:zoho.com ~all`), mais o DKIM que o Zoho mostrar.
- **Resend (grátis até 3.000/mês)** — o envio do formulário de anúncios: registros no subdomínio `send` (MX + TXT) e um `TXT` de DKIM (`resend._domainkey`). Não conflitam com os do Zoho.
- Depois de verificado, crie a chave em *Resend → API Keys* e cadastre na Vercel: `RESEND_API_KEY`, `MAIL_FROM` (`DOIS LADOS <site@qualmeulado.com.br>`) e `CONTACT_EMAIL` (`contato@qualmeulado.com.br`).
- Sem essas variáveis, o formulário continua funcionando: as mensagens ficam em `/admin` → Relatos.

### 5. Antes de divulgar (checklist)
- [ ] Revisão humana dos “pontos de atenção” das propostas e das críticas de cada lado.
- [ ] Parecer jurídico (lei eleitoral e LGPD), sobretudo por estarmos perto de 25/10.
- [ ] E-mail de contato real nas páginas de privacidade/contato.
- [ ] Testar no celular: home → um lado → teste → card de stories (o QR leva ao site certo?).
- [ ] Prévia do link no WhatsApp: cole `https://seudominio.com.br/lado/esquerda?p=20` numa conversa consigo mesmo.
- [ ] Trocar a senha do admin e ativar o "quatro olhos" (`EDITORIAL_REQUIRE_SECOND_REVIEWER=true`).

## Observações técnicas
- O limite de requisições (`src/lib/security/rate-limit.ts`) é em memória. Na Vercel cada instância tem o seu; para algo mais robusto, troque o `store` por Upstash Redis mantendo a interface.
- Imagens de compartilhamento (`/og/...`) são geradas sob demanda e cacheadas — aguentam picos.
- Atualizações de conteúdo pelo painel aparecem em até 5 minutos (cache).

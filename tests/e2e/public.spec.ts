import { expect, test } from "@playwright/test";

test.describe("experiência pública", () => {
  test("home apresenta a pergunta e os três caminhos, sem lado pré-selecionado", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/de que lado está/i);
    await expect(page.getByRole("link", { name: /explorar a esquerda/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /explorar a direita/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /descobrir minhas afinidades/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /como funciona/i }).first()).toBeVisible();
    await expect(page.getByRole("radio", { name: /ver propostas/i }).first()).toBeAttached();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("escolher um lado abre a jornada", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /explorar a direita/i }).first().click();
    // animação do hero + cortina + 1ª compilação da rota (em dev) podem passar de 5 s
    await expect(page).toHaveURL(/\/explorar\/direita$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/direita/i);
  });

  test("capítulo de críticas tem fontes e painel 'Ver fonte' acessível", async ({ page }) => {
    await page.goto("/explorar/esquerda/criticas");
    await expect(page.getByText("Crítica fundamentada").first()).toBeVisible();
    await page.getByRole("button", { name: /ver fonte/i }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/classificação/i)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("trocar de perspectiva mantém o capítulo", async ({ page, isMobile }) => {
    test.skip(isMobile, "link de troca fica no cabeçalho desktop; no celular há a seção final");
    await page.goto("/explorar/esquerda/argumentos");
    await page.getByRole("link", { name: /ver na direita/i }).click();
    await expect(page).toHaveURL(/\/explorar\/direita\/argumentos$/);
  });

  test("SIM/NÃO registra resposta localmente, oferece alternativas e já passa para a próxima", async ({ page }) => {
    await page.goto("/afinidades");
    await page.getByRole("button", { name: /^(começar|continuar)/i }).click();
    await expect(page.getByRole("button", { name: /depende/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /não sei/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /entender melhor/i })).toBeVisible();
    const first = await page.locator("#afirmacao").innerText();
    await page.getByRole("button", { name: /^sim/i }).click();
    await expect(page.locator("#afirmacao")).not.toHaveText(first);
    // sem tela intermediária de "quem concorda/discorda"
    await expect(page.getByText(/quem concorda/i)).toHaveCount(0);
    const stored = await page.evaluate(() => localStorage.getItem("doislados:journey:v1"));
    expect(stored).toContain("agree");
  });

  test("respostas nunca são enviadas ao servidor", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.method() !== "GET") posts.push(r.url());
    });
    await page.goto("/afinidades");
    await page.getByRole("button", { name: /^(começar|continuar)/i }).click();
    const first = await page.locator("#afirmacao").innerText();
    await page.getByRole("button", { name: /^não\s*discordo/i }).click();
    await expect(page.locator("#afirmacao")).not.toHaveText(first);
    await page.getByRole("button", { name: /depende/i }).click();
    await page.goto("/afinidades/resultado");
    expect(posts).toEqual([]);
  });

  test("ao terminar: o lado em destaque, compartilhável, com metodologia e limitações", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/afinidades");
    await page.getByRole("button", { name: /^(começar|continuar)/i }).click();
    for (let i = 0; i < 24; i++) {
      const before = await page.locator("#afirmacao").innerText().catch(() => "");
      await page.keyboard.press(i % 3 === 0 ? "n" : "s");
      if (i < 23) await expect(page.locator("#afirmacao")).not.toHaveText(before);
    }
    await expect(page).toHaveURL(/\/afinidades\/resultado/, { timeout: 15_000 });
    await expect(page.getByText(/eu me identifico mais com/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/^(ESQUERDA|CENTRO|DIREITA)$/);
    await expect(page.getByRole("link", { name: /baixar para os stories/i })).toHaveAttribute("href", /\/og\/lado\/(esquerda|centro|direita)\?p=\d+&formato=story/);
    await expect(page.getByRole("button", { name: /compartilhar/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /como cada indicador foi calculado/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /limitações/i })).toBeVisible();
  });

  test("2º turno: candidaturas reais, mesma posição da home, sem ranking e com trecho do plano", async ({ page }) => {
    await page.goto("/segundo-turno");
    await expect(page.getByText(/fictícias/i)).toHaveCount(0);
    const names = await page.locator("a[href^=\"/segundo-turno/\"] .font-display").allTextContents();
    expect(names.slice(0, 2)).toEqual(["Lula", "Flávio Bolsonaro"]);
    await expect(page.getByRole("button", { name: /inverter lados/i })).toBeVisible();
    await page.goto("/segundo-turno/lula#r-economia");
    await page.getByRole("button", { name: /o que diz o plano/i }).first().click();
    await expect(page.getByText(/o que diz o plano registrado no tse/i).first()).toBeVisible();
  });

  test("home: a pergunta rápida grava a resposta como o teste e convida a continuar", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const quick = page.locator("section", { has: page.locator("#rapida") });
    await quick.getByRole("button", { name: "Sim", exact: true }).click();
    await expect(quick.getByText(/isso já conta para o seu indicador/i)).toBeVisible();
    const stored = await page.evaluate(() => localStorage.getItem("doislados:journey:v1"));
    expect(stored).toContain("agree");
    await expect(quick.getByRole("link", { name: /continuar o teste/i })).toHaveAttribute("href", "/afinidades");
  });

  test("home: cada tema do 2º turno abre a comparação direto nele", async ({ page }) => {
    await page.goto("/");
    await page.locator("section", { has: page.locator("#eleicao") }).getByRole("link", { name: /Saúde/ }).click();
    await expect(page).toHaveURL(/\/segundo-turno\?tema=saude/, { timeout: 15_000 });
    await expect(page.locator("#rodada-titulo")).toContainText(/filas/i);
  });

  test("o reel acompanha a rolagem mesmo se o IntersectionObserver falhar (iPhone/Safari)", async ({ page }) => {
    // simula o Safari com inércia: o observador nunca avisa nada
    await page.addInitScript(() => {
      class Mute {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      }
      (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = Mute;
    });
    await page.goto("/explorar/esquerda", { waitUntil: "networkidle" });
    const active = page.locator("section[data-active=true]");
    await expect(active).toHaveAttribute("id", "origens-cover");
    const scroller = page.locator(".reel-scroller");
    // repete até o reel estar montado (antes disso ele mesmo se posiciona no início)
    await expect(async () => {
      await scroller.evaluate((el) => el.scrollTo(0, el.clientHeight));
      await expect(active).not.toHaveAttribute("id", "origens-cover", { timeout: 1000 });
    }).toPass({ timeout: 20_000 });
    await scroller.evaluate((el) => el.scrollTo(0, 0));
    await expect(active).toHaveAttribute("id", "origens-cover"); // voltou: a capa ativa de novo (e reanima)
  });

  test("ilustrações do reel aparecem mesmo se o IntersectionObserver falhar (iPhone/Safari)", async ({ page }) => {
    await page.addInitScript(() => {
      class Mute {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      }
      (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = Mute;
    });
    // as cadeiras de 1789 (bolinhas) e a feira (moeda indo e voltando)
    for (const hash of ["origens-1-ill", "o-que-defende-2-ill"]) {
      const side = hash.startsWith("origens") ? "esquerda" : "direita";
      await page.goto(`/explorar/${side}#${hash}`, { waitUntil: "networkidle" });
      const svg = page.locator(`#${hash} svg`).first();
      await expect(svg).toBeVisible();
      // o desenho termina de entrar: o primeiro traço/bolinha chega a opacidade 1
      await expect
        .poll(async () => svg.locator("circle, path, rect").first().evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 8000 })
        .toBeGreaterThan(0.9);
    }
  });

  test("o reel não desliza para os lados no celular", async ({ page, isMobile }) => {
    test.skip(!isMobile, "só no celular");
    await page.goto("/explorar/esquerda");
    const extra = await page.locator(".reel-scroller").evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(extra).toBe(0);
  });

  test("quem já viu um lado não revê, no outro, as telas iguais (ex.: as cadeiras de 1789)", async ({ page }) => {
    await page.goto("/explorar/direita");
    await expect(page.locator("#origens-0-lead")).toHaveCount(1);
    await page.evaluate(() =>
      localStorage.setItem("doislados:journey:v1", JSON.stringify({ answers: {}, visited: [{ side: "esquerda", chapter: "origens", at: 1 }] })),
    );
    await page.reload();
    await expect(page.locator("#origens-cover")).toHaveCount(1);
    await expect(page.locator("#origens-0-lead")).toHaveCount(0);
    await expect(page.locator("#origens-1-ill")).toHaveCount(0);
    await expect(page.locator("#origens-3-text")).toHaveCount(1); // o que é próprio da direita continua
    await expect(page.locator("#origens-cover").getByText(/sem repetir/i)).toBeVisible();
  });

  test("no reel, cada tema responde ao toque e mostra o outro lado", async ({ page }) => {
    await page.goto("/explorar/esquerda#o-que-defende-3-themes");
    const slide = page.locator("section[data-active=true]");
    await expect(slide).toHaveAttribute("id", "o-que-defende-3-themes");
    // carrossel: os pontos levam a qualquer tema (inclusive o último)
    const current = slide.locator("article[aria-hidden=false]");
    await expect(current.locator("h3")).toHaveText(/papel do estado/i);
    await slide.getByRole("button", { name: /ir para democracia e instituições/i }).click();
    await expect(current.locator("h3")).toHaveText(/democracia e instituições/i);
    // o mesmo tema pelo outro lado
    const card = current.locator("[aria-live=polite]");
    const mine = await card.innerText();
    await current.getByRole("tab", { name: "Direita" }).click();
    await expect(current.getByRole("tab", { name: "Direita" })).toHaveAttribute("aria-selected", "true");
    await expect(card).not.toHaveText(mine);
    // arrastar para o lado troca de tema
    await slide.getByRole("button", { name: /ir para papel do estado/i }).click();
    await expect(current.locator("h3")).toHaveText(/papel do estado/i);
    await expect(current).toBeInViewport({ ratio: 0.95 }); // espera o carrossel parar de deslizar
    await page.waitForTimeout(300);
    const box = (await current.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.8, box.y + 40);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.2, box.y + 40, { steps: 8 });
    await page.mouse.up();
    await expect(current.locator("h3")).toHaveText(/economia e mercado/i);
  });

  test("história em passos: tocar avança, volta ao primeiro, e no fim aparece a seta para seguir", async ({ page }) => {
    await page.goto("/explorar/esquerda#origens-3-text", { waitUntil: "networkidle" });
    const slide = page.locator("#origens-3-text");
    const label = slide.locator("h2");
    await expect(label).toHaveText(/primeiro/i);
    await expect(slide.getByText(/toque para avançar/i)).toBeVisible();
    // o primeiro toque repete até a página terminar de carregar (antes disso o toque não é ouvido)
    await expect(async () => {
      if (/primeiro/i.test(await label.innerText())) await slide.locator(".rt").first().click();
      await expect(label).toHaveText(/depois/i, { timeout: 1500 });
    }).toPass({ timeout: 20_000 });
    await slide.locator(".rt").first().click();
    await expect(label).toHaveText(/século 20/i);
    await expect(slide.getByText(/role para continuar/i)).toBeVisible();
    await slide.locator(".rt").first().click();
    await expect(label).toHaveText(/primeiro/i);
  });

  test("carrossel de temas: arrastar na diagonal troca o tema sem rolar a página (celular)", async ({ page, context, isMobile }) => {
    test.skip(!isMobile, "gesto de toque");
    await page.goto("/explorar/esquerda#o-que-defende-3-themes", { waitUntil: "networkidle" });
    const slide = page.locator("#o-que-defende-3-themes");
    const card = slide.locator("article[aria-hidden=false]");
    await expect(card.locator("h3")).toHaveText(/papel do estado/i);
    await page.waitForTimeout(1500); // carregado e montado
    const scroller = page.locator(".reel-scroller");
    const before = await scroller.evaluate((el) => el.scrollTop);
    const box = (await card.boundingBox())!;
    const cdp = await context.newCDPSession(page);
    const x0 = box.x + box.width * 0.8;
    const y0 = box.y + 80;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] });
    for (let k = 1; k <= 10; k++) {
      // ~40° de inclinação: mais de lado que de pé
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 - k * 20, y: y0 + k * 16 }] });
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(card.locator("h3")).toHaveText(/economia e mercado/i);
    expect(await scroller.evaluate((el) => el.scrollTop)).toBe(before);
  });

  test("jogo 'De quem é essa ideia?': mistura os dois lados, revela e conta os acertos", async ({ page }) => {
    await page.goto("/explorar/esquerda#argumentos-whose", { waitUntil: "networkidle" });
    const g = page.locator("#argumentos-whose");
    // espera o reel se posicionar na tela do jogo (como alguém que chegou nela)
    await expect(page.locator("section[data-active=true]")).toHaveAttribute("id", "argumentos-whose", { timeout: 15_000 });
    await page.waitForTimeout(1000);
    await expect(g.getByText(/de quem é essa ideia/i)).toBeVisible();
    const sides = new Set<string>();
    for (let k = 0; k < 6; k++) {
      const btn = g.getByRole("button", { name: "Esquerda", exact: true });
      // repete o toque até a página terminar de carregar (antes disso ele não é ouvido)
      await expect(async () => {
        if (await btn.isVisible()) await btn.click({ timeout: 2000 });
        await expect(g.getByText(/argumento da (esquerda|direita):/i)).toBeVisible({ timeout: 1500 });
      }).toPass({ timeout: 15_000 });
      sides.add((await g.getByText(/argumento da (esquerda|direita):/i).innerText()).match(/esquerda|direita/i)![0].toLowerCase());
      // clique direto: com o encolhimento automático (zoom), o Playwright calcula mal a posição do botão
      await g.getByRole("button", { name: /próxima|ver quantas acertei/i }).dispatchEvent("click");
      // a carta seguinte entra (a anterior sai antes): espera os botões de chute de novo
      if (k < 5) await expect(g.getByRole("button", { name: "Esquerda", exact: true })).toBeVisible();
    }
    expect(sides).toEqual(new Set(["esquerda", "direita"]));
    await expect(g.getByText(/de 6\.|todas/i)).toBeVisible();
  });

  test("cards para compartilhar: 'Você sabia?', fato e 'Eu conheci os dois lados'", async ({ page, request }) => {
    await page.goto("/explorar/esquerda", { waitUntil: "networkidle" });
    const ids = await page.$$eval("section[id]", (els) => els.map((e) => e.id));
    const dyk = ids.find((i) => i.endsWith("-dyk"))!;
    const story = await page.locator(`#${dyk} a[download]`).getAttribute("href");
    expect(story).toMatch(/^\/og\/sabia\/[a-z0-9-]+\?formato=story$/);
    for (const url of [story!, story!.replace("?formato=story", ""), "/og/fato/origem-assembleia-1789", "/og/dois-lados?formato=story"]) {
      const res = await request.get(url);
      expect(res.status(), url).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
    const landing = await request.get(story!.replace("/og/sabia/", "/sabia/").replace("?formato=story", ""));
    expect(landing.status()).toBe(200);
  });

  test("quem terminou os dois lados vê a tela de conclusão", async ({ page }) => {
    const ch = ["origens", "o-que-defende", "argumentos", "criticas", "no-brasil", "o-outro-lado", "o-que-voce-pensa"];
    await page.addInitScript((list) => {
      const visited = ["esquerda", "direita"].flatMap((side, s) => list.map((chapter, i) => ({ side, chapter, at: s * 10 + i })));
      localStorage.setItem("doislados:journey:v1", JSON.stringify({ answers: {}, visited }));
    }, ch);
    await page.goto("/explorar/direita#end", { waitUntil: "networkidle" });
    await expect(page.getByText("Missão cumprida")).toBeVisible();
    await expect(page.locator("#end a[download]")).toHaveAttribute("href", "/og/dois-lados?formato=story");
  });

  test("mitos: um palpite vira o cartão com o veredito, e a próxima afirmação entra", async ({ page }) => {
    await page.goto("/mitos", { waitUntil: "networkidle" });
    const card = page.locator("article").first();
    const first = await card.locator("p.font-display").innerText();
    await card.getByRole("button", { name: "Verdade", exact: true }).click();
    await expect(card.getByText(/seu palpite bateu|você disse/i)).toBeVisible();
    await page.getByRole("button", { name: /próxima/i }).click();
    await expect(page.locator("article").first().locator("p.font-display")).not.toHaveText(first);
  });

  test("home: o mito do dia revela o veredito e leva aos outros", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const sec = page.locator("section", { has: page.locator("#mito") });
    await sec.getByRole("button", { name: "Mito", exact: true }).click();
    await expect(sec.getByRole("link", { name: /mais \d+ afirmações/i })).toHaveAttribute("href", "/mitos");
  });

  test("virar para o plano e voltar mantém o card visível", async ({ page }) => {
    await page.goto("/segundo-turno/lula#r-economia");
    const slide = page.locator("section[data-active=true]");
    await slide.getByRole("button", { name: /o que diz o plano/i }).click();
    await slide.getByRole("button", { name: /voltar ao resumo/i }).click();
    await expect(slide.getByRole("article", { name: /proposta de lula/i })).toBeVisible();
    await expect(slide.getByRole("article", { name: /proposta de lula/i })).toHaveCSS("opacity", "1");
  });

  test("home: no modo propostas, as posições seguem as setas (Lula ← · Flávio →)", async ({ page }) => {
    await page.goto("/?ver=propostas");
    const lula = await page.getByRole("link", { name: /ver as propostas de lula/i }).boundingBox();
    const flavio = await page.getByRole("link", { name: /ver as propostas de flávio/i }).boundingBox();
    // computador: lado a lado; celular: empilhado (Lula em cima)
    expect(lula!.x + lula!.y).toBeLessThan(flavio!.x + flavio!.y);
    // e as fotos: Lula à esquerda, Flávio à direita — no computador E no celular
    const center = async (sel: string) => {
      const b = await page.locator(sel).first().boundingBox();
      return b!.x + b!.width / 2;
    };
    await page.waitForTimeout(1200);
    expect(await center('img[src*="lula"]')).toBeLessThan(await center('img[src*="flavio"]'));
  });

  test("palavra difícil abre o significado; medição desligada não envia nada", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (r) => r.method() === "POST" && posts.push(r.url()));
    await page.goto("/explorar/esquerda#o-que-defende-1-ex");
    const term = page.locator("section[data-active=true] .gloss").first();
    const word = ((await term.textContent()) ?? "").trim();
    await term.click();
    const pop = page.locator("[data-radix-popper-content-wrapper]").first();
    await expect(pop).toBeVisible();
    await expect(pop).toContainText(new RegExp(word.slice(0, 4), "i"));
    await expect(pop).toContainText(/entendi/i);
    await page.keyboard.press("Escape");
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowDown");
    await page.goto("/");
    expect(posts).toEqual([]);
  });

  test("link compartilhado de tema abre direto naquele tema e tem prévia com as duas candidaturas", async ({ page, request }) => {
    await page.goto("/segundo-turno/flavio-bolsonaro?tema=saude");
    await expect(page.locator("section[data-active=true]")).toHaveAttribute("id", "r-saude");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\/tema\/saude$/);
    const og = await request.get("/og/tema/saude");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
  });

  test("continuar de onde parei aparece ao voltar ao reel", async ({ page }) => {
    await page.goto("/explorar/direita");
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(500);
    }
    await page.goto("/explorar/direita");
    await expect(page.getByText(/você parou em/i)).toBeVisible();
  });

  test("sua escolha: frase compartilhável, link público e imagem — sem enviar nada ao servidor", async ({ page, request }) => {
    const posts: string[] = [];
    page.on("request", (r) => r.method() === "POST" && posts.push(r.url()));
    await page.goto("/sua-escolha");
    await page.getByRole("button", { name: /mais perto da direita/i }).click();
    await expect(page.getByText(/cada pessoa é livre para construir a própria vida/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /compartilhar minha frase/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /baixar imagem para stories/i })).toHaveAttribute("href", "/og/escolha/direita?formato=story");
    expect(posts).toEqual([]);
    await page.goto("/eu/direita");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/direita/i);
    await expect(page.getByRole("link", { name: /explorar a esquerda/i })).toBeVisible();
    for (const u of ["/og/escolha/esquerda", "/og/escolha/direita?formato=story"]) {
      const r = await request.get(u);
      expect(r.status(), u).toBe(200);
    }
  });

  test("comparar lado a lado: setas do teclado e virar os dois planos", async ({ page, isMobile }) => {
    test.skip(isMobile, "no celular a troca é por deslize");
    await page.goto("/segundo-turno");
    await page.locator("#duelo").scrollIntoViewIfNeeded();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#rodada-titulo")).toContainText(/quem trabalha/i);
    await page.getByRole("button", { name: /trechos dos dois planos/i }).click();
    await expect(page.getByText(/plano registrado no TSE/i).first()).toBeVisible();
  });

  test("caminho em 4 passos na home e no menu, marcando o que já foi feito", async ({ page }) => {
    await page.goto("/");
    const steps = page.locator("#caminho ol > li");
    await expect(steps).toHaveCount(4);
    await expect(page.locator("#caminho [aria-current=step]")).toContainText(/conhecer a esquerda/i);
    await page.evaluate(() =>
      localStorage.setItem("doislados:journey:v1", JSON.stringify({ answers: {}, visited: ["origens", "o-que-defende", "argumentos", "criticas", "no-brasil", "o-outro-lado", "o-que-voce-pensa"].map((chapter) => ({ side: "esquerda", chapter, at: 1 })) })),
    );
    await page.reload();
    await expect(page.locator("#caminho [aria-current=step]")).toContainText(/conhecer a direita/i);
    await page.getByRole("button", { name: /menu/i }).click();
    await expect(page.getByRole("dialog").getByText("O caminho")).toBeVisible();
    await expect(page.getByRole("dialog").getByRole("link", { name: /descobrir sua afinidade/i })).toBeVisible();
  });

  test("card compartilhado deixa claro onde fazer o teste", async ({ page, request }) => {
    await page.goto("/lado/direita?p=78");
    await expect(page.getByText(/eu me identifico mais com a/i).first()).toBeVisible();
    await expect(page.getByText(/teste de afinidade política do dois lados/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /fazer o teste agora/i })).toHaveAttribute("href", "/afinidades");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\/lado\/direita\?p=78$/);
    expect((await request.get("/og/lado/direita?p=78&formato=story")).status()).toBe(200);
  });

  test("home alterna para as propostas e leva ao reel da candidatura", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("radio", { name: /ver propostas/i }).locator("visible=true").first().click();
    await expect(page).toHaveURL(/\?ver=propostas$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/duas propostas de país/i);
    await page.getByRole("link", { name: /ver as propostas de flávio bolsonaro/i }).click();
    await expect(page).toHaveURL(/\/segundo-turno\/flavio-bolsonaro/, { timeout: 15_000 });
  });

  test("reel avança uma tela por vez e o modo aprofundar acrescenta telas", async ({ page }) => {
    await page.goto("/explorar/esquerda");
    const first = page.locator("section[data-active=true]");
    await expect(first).toHaveAttribute("id", "origens-cover");
    // o botão "próxima" pula na 1ª tela (convite); clicamos sem esperar que pare
    await page.getByRole("button", { name: /próxima tela/i }).click({ force: true });
    await expect(page.locator("section[data-active=true]")).not.toHaveAttribute("id", "origens-cover");
    const before = await page.locator("section[data-index]").count();
    await page.getByRole("switch", { name: /aprofundar/i }).click();
    await expect.poll(() => page.locator("section[data-index]").count()).toBeGreaterThan(before);
  });
});

test.describe("segurança", () => {
  test("painel exige autenticação", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto("/admin/afirmacoes");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("login inválido não revela se o e-mail existe", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("E-mail").fill("ninguem@example.com");
    await page.getByLabel("Senha").fill("senha-errada-qualquer");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.locator("form [role=alert], p[role=alert]").first()).toHaveText(/e-mail ou senha incorretos|muitas tentativas/i);
  });

  test("debate: o player do YouTube só carrega depois do clique (privacidade)", async ({ page }) => {
    const yt: string[] = [];
    page.on("request", (r) => /youtube-nocookie|googlevideo/.test(r.url()) && yt.push(r.url()));
    await page.goto("/debate", { waitUntil: "networkidle" });
    await expect(page.locator("iframe")).toHaveCount(0);
    expect(yt).toHaveLength(0);
    await page.getByRole("button", { name: /assistir:/i }).click();
    await expect(page.locator('iframe[src^="https://www.youtube-nocookie.com/embed/"]')).toHaveCount(1);
    await expect(page.getByRole("link", { name: /assistir no youtube/i })).toHaveAttribute("href", /youtube\.com\/watch/);
  });

  test("cabeçalhos de segurança presentes", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  });

  test("API de conteúdo é somente leitura e valida parâmetros", async ({ request }) => {
    expect((await request.get("/api/content/claims/..%2F..%2Fetc")).status()).toBe(400);
    expect((await request.get("/api/health")).status()).toBe(200);
  });
});

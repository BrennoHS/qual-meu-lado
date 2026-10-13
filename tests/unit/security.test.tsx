import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RichText, isSafeHref } from "@/lib/richtext";
import { parseField } from "@/lib/admin/form";
import { rateLimit, resetRateLimit } from "@/lib/security/rate-limit";
import { classify } from "@/lib/links/check";

describe("renderização segura (XSS)", () => {
  it("escapa HTML digitado no conteúdo", () => {
    const html = renderToStaticMarkup(<RichText text={'<script>alert(1)</script> <img src=x onerror=alert(1)>'} />);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("não cria links javascript:", () => {
    const html = renderToStaticMarkup(<RichText text={"[clique](javascript:alert(1))"} />);
    expect(html).not.toContain("href");
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("//evil.example")).toBe(false);
    expect(isSafeHref("https://www.planalto.gov.br")).toBe(true);
    expect(isSafeHref("/fontes")).toBe(true);
  });

  it("links externos abrem com noopener", () => {
    const html = renderToStaticMarkup(<RichText text={"[TSE](https://www.tse.jus.br)"} />);
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe("validação no servidor do painel", () => {
  it("rejeita URLs não http(s)", () => {
    expect(parseField({ name: "url", label: "URL", type: "url" }, "javascript:alert(1)").error).toBeTruthy();
    expect(parseField({ name: "url", label: "URL", type: "url" }, "https://www.ibge.gov.br").value).toBe("https://www.ibge.gov.br");
  });

  it("exige slug no formato correto", () => {
    expect(parseField({ name: "slug", label: "Slug", type: "text" }, "Com Espaço").error).toBeTruthy();
    expect(parseField({ name: "slug", label: "Slug", type: "text" }, "ok-slug-1").value).toBe("ok-slug-1");
  });

  it("valida blocos de capítulo contra o esquema", () => {
    const f = { name: "blocks", label: "Blocos", type: "json", schema: "blocks" } as const;
    expect(parseField(f, '[{"type":"lead"}]').error).toMatch(/Bloco inválido/);
    expect(parseField(f, '[{"type":"lead","text":"Olá"}]').value).toEqual([{ type: "lead", text: "Olá", layer: "surface" }]);
    expect(parseField(f, "{não é json").error).toMatch(/JSON inválido/);
  });

  it("valida critérios de destaque (0 a 2)", () => {
    const f = { name: "criteria", label: "Critérios", type: "json", schema: "criteria" } as const;
    expect(parseField(f, '{"centralidade":3}').error).toBeTruthy();
  });
});

describe("rate limiting", () => {
  it("bloqueia após o limite e libera após a janela", () => {
    resetRateLimit();
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("k", 5, 1000, t0 + i).ok).toBe(true);
    expect(rateLimit("k", 5, 1000, t0 + 10).ok).toBe(false);
    expect(rateLimit("k", 5, 1000, t0 + 2000).ok).toBe(true);
  });
});

describe("verificador de links", () => {
  it("classifica códigos HTTP", () => {
    expect(classify(200)).toBe("OK");
    expect(classify(301)).toBe("OK");
    expect(classify(403)).toBe("BLOCKED");
    expect(classify(404)).toBe("BROKEN");
    expect(classify(500)).toBe("BROKEN");
  });
});

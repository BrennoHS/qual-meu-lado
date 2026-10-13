/** Regressão: o texto animado palavra por palavra nunca pode perder letras. */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Kinetic } from "@/components/reel/reel";

const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

describe("Kinetic", () => {
  for (const t of ["Os melhores argumentos", "Como reduzir filas e cuidar melhor das pessoas?", "A inflação e o SUS são assuntos sérios."]) {
    it(`preserva o texto: ${t}`, () => {
      expect(text(renderToStaticMarkup(<Kinetic text={t} active />))).toBe(t);
      expect(text(renderToStaticMarkup(<Kinetic text={t} active gloss />))).toBe(t);
    });
  }
});

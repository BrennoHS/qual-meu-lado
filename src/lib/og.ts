import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Fontes e retratos para as imagens de prévia (Satori aceita .woff e data URLs). */
const root = process.cwd();
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700; style: "normal" }[]> | null = null;

export function ogFonts() {
  fonts ??= Promise.all([
    readFile(path.join(root, "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff")).then((data) => ({ name: "SG", data, weight: 700 as const, style: "normal" as const })),
    readFile(path.join(root, "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff")).then((data) => ({ name: "SG", data, weight: 400 as const, style: "normal" as const })),
  ]);
  return fonts;
}

const photos = new Map<string, Promise<string | null>>();
export function ogPhoto(publicPath: string | undefined) {
  if (!publicPath) return Promise.resolve(null);
  if (!photos.has(publicPath)) {
    photos.set(
      publicPath,
      readFile(path.join(root, "public", publicPath))
        .then((b) => `data:image/png;base64,${b.toString("base64")}`)
        .catch(() => null),
    );
  }
  return photos.get(publicPath)!;
}

export const OG_SIZE = { width: 1200, height: 630 };
export const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

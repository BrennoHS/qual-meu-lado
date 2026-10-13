import { z } from "zod";
import { blocksSchema } from "@/lib/content/blocks";
import type { FieldDef, ResourceDef } from "./resources";

/**
 * Converte o FormData do painel em dados tipados, validando NO SERVIDOR
 * cada campo segundo sua definição. Nunca confia no navegador.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const criteriaKeys = ["centralidade", "impacto", "relevanciaNacional", "especificidade", "interessePublico", "documentacao"] as const;
export const criteriaSchema = z.object(Object.fromEntries(criteriaKeys.map((k) => [k, z.number().int().min(0).max(2)]))).strict();

export type ClaimSourceInput = { slug: string; locator: string | null };
export type ParsedForm = { data: Record<string, unknown>; errors: Record<string, string>; claimSources?: ClaimSourceInput[] };

function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseField(f: FieldDef, raw: FormDataEntryValue | null): { value?: unknown; error?: string } {
  const str = typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim() : "";
  const required = "required" in f && f.required;
  if (required && str === "") return { error: "Campo obrigatório." };

  switch (f.type) {
    case "text":
    case "textarea":
    case "markdown": {
      const max = f.max ?? (f.type === "text" ? 300 : 20000);
      if (str.length > max) return { error: `Máximo de ${max} caracteres.` };
      if ((f.name === "slug" || f.name === "key") && str && !SLUG.test(str)) return { error: "Use apenas letras minúsculas, números e hífens." };
      return { value: str === "" ? null : str };
    }
    case "url":
      if (str === "") return { value: null };
      if (str.length > 1000 || !isHttpUrl(str)) return { error: "Informe uma URL http(s) válida." };
      return { value: str };
    case "date": {
      if (str === "") return { value: null };
      if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return { error: "Data inválida." };
      const d = new Date(`${str}T12:00:00-03:00`);
      return Number.isNaN(d.getTime()) ? { error: "Data inválida." } : { value: d };
    }
    case "number": {
      if (str === "") return { value: f.name === "order" ? 0 : null };
      const n = Number(str.replace(",", "."));
      if (!Number.isFinite(n)) return { error: "Número inválido." };
      if (f.integer && !Number.isInteger(n)) return { error: "Use um número inteiro." };
      if (f.min !== undefined && n < f.min) return { error: `Mínimo: ${f.min}.` };
      if (f.max !== undefined && n > f.max) return { error: `Máximo: ${f.max}.` };
      return { value: n };
    }
    case "boolean":
      return { value: raw === "on" || raw === "true" };
    case "enum": {
      if (str === "") return f.nullable ? { value: null } : { error: "Escolha uma opção." };
      if (!f.options.some((o) => o.value === str)) return { error: "Opção inválida." };
      return { value: f.name === "direction" ? Number(str) : str };
    }
    case "list":
      return { value: str.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 100) };
    case "json": {
      if (str === "") return { value: null };
      let parsed: unknown;
      try {
        parsed = JSON.parse(str);
      } catch (e) {
        return { error: `JSON inválido: ${(e as Error).message}` };
      }
      if (f.schema === "blocks") {
        const r = blocksSchema.safeParse(parsed);
        if (!r.success) {
          const i = r.error.issues[0];
          return { error: `Bloco inválido em ${i.path.join(".") || "raiz"}: ${i.message}` };
        }
        return { value: r.data };
      }
      if (f.schema === "criteria") {
        const r = criteriaSchema.safeParse(parsed);
        return r.success ? { value: r.data } : { error: `Critérios: use as chaves ${criteriaKeys.join(", ")} com valores de 0 a 2.` };
      }
      return { value: parsed };
    }
    case "relation":
      if (str === "") return f.nullable ? { value: null } : { error: "Escolha um item." };
      if (str.length > 40) return { error: "Referência inválida." };
      return { value: str };
    case "claimSources":
      return { value: undefined };
  }
}

export function parseClaimSources(raw: FormDataEntryValue | null): ClaimSourceInput[] {
  const str = typeof raw === "string" ? raw : "";
  return str
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [slug, ...rest] = l.split("|");
      return { slug: slug.trim(), locator: rest.join("|").trim() || null };
    });
}

export function parseResourceForm(def: ResourceDef, form: FormData): ParsedForm {
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  let claimSources: ClaimSourceInput[] | undefined;
  for (const f of def.fields) {
    if (f.type === "claimSources") {
      claimSources = parseClaimSources(form.get(f.name));
      continue;
    }
    const r = parseField(f, form.get(f.name));
    if (r.error) errors[f.name] = r.error;
    else if (r.value !== undefined) data[f.name] = r.value;
  }
  return { data, errors, claimSources };
}

/** Valor de um registro formatado para preencher o formulário. */
export function fieldToInput(f: FieldDef, value: unknown): string {
  if (value === null || value === undefined) return "";
  switch (f.type) {
    case "date":
      return value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
    case "list":
      return Array.isArray(value) ? value.join("\n") : "";
    case "json":
      return JSON.stringify(value, null, 2);
    case "boolean":
      return value ? "on" : "";
    default:
      return String(value);
  }
}

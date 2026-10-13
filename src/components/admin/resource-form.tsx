"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";
import type { FieldDef, Option } from "@/lib/admin/resources";

type Props = {
  fields: FieldDef[];
  values: Record<string, string>;
  relationOptions: Record<string, Option[]>;
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  submitLabel: string;
  editorial: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

const input = "w-full border border-line bg-graphite-2 px-3 text-paper focus:border-paper focus:outline-none aria-[invalid=true]:border-ev-critique";

export function ResourceForm({ fields, values, relationOptions, action, submitLabel, editorial, disabled, disabledReason }: Props) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {disabled && disabledReason && <p role="note" className="border border-dashed border-ev-critique p-3 text-sm text-ev-critique">{disabledReason}</p>}
      <fieldset disabled={disabled || pending} className="space-y-6 disabled:opacity-70">
        {fields.map((f) => {
          const err = state.errors?.[f.name];
          const id = `f-${f.name}`;
          const v = values[f.name] ?? "";
          const describedBy = [f.help ? `${id}-help` : null, err ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
          const required = "required" in f && f.required;
          const label = (
            <label htmlFor={id} className="kicker mb-1.5 block">
              {f.label}
              {required && <span aria-hidden> *</span>}
            </label>
          );
          let control: React.ReactNode;
          switch (f.type) {
            case "textarea":
            case "markdown":
              control = <textarea id={id} name={f.name} defaultValue={v} rows={f.type === "markdown" ? 14 : 4} aria-invalid={!!err} aria-describedby={describedBy} className={`${input} py-2 ${f.type === "markdown" ? "font-mono text-sm" : ""}`} />;
              break;
            case "json":
            case "claimSources":
              control = <textarea id={id} name={f.name} defaultValue={v} rows={f.type === "json" && f.schema === "blocks" ? 28 : 6} spellCheck={false} aria-invalid={!!err} aria-describedby={describedBy} className={`${input} py-2 font-mono text-xs leading-relaxed`} />;
              break;
            case "list":
              control = <textarea id={id} name={f.name} defaultValue={v} rows={4} aria-invalid={!!err} aria-describedby={describedBy} className={`${input} py-2`} />;
              break;
            case "boolean":
              return (
                <div key={f.name} className="flex items-start gap-3">
                  <input id={id} name={f.name} type="checkbox" defaultChecked={v === "on"} className="mt-1 h-5 w-5 accent-[var(--color-paper)]" aria-describedby={describedBy} />
                  <div>
                    <label htmlFor={id} className="text-sm">{f.label}</label>
                    {f.help && <p id={`${id}-help`} className="text-xs text-ash">{f.help}</p>}
                  </div>
                </div>
              );
            case "enum":
              control = (
                <select id={id} name={f.name} defaultValue={v} aria-invalid={!!err} aria-describedby={describedBy} className={`${input} h-11`}>
                  {(f.nullable || !required) && <option value="">—</option>}
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              );
              break;
            case "relation":
              control = (
                <select id={id} name={f.name} defaultValue={v} aria-invalid={!!err} aria-describedby={describedBy} className={`${input} h-11`}>
                  {(f.nullable || !required) && <option value="">—</option>}
                  {!v && required && <option value="">Escolha…</option>}
                  {(relationOptions[f.name] ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              );
              break;
            default:
              control = (
                <input
                  id={id}
                  name={f.name}
                  defaultValue={v}
                  type={f.type === "date" ? "date" : f.type === "url" ? "url" : f.type === "number" ? "text" : "text"}
                  inputMode={f.type === "number" ? "decimal" : undefined}
                  aria-invalid={!!err}
                  aria-describedby={describedBy}
                  className={`${input} h-11`}
                />
              );
          }
          return (
            <div key={f.name}>
              {label}
              {control}
              {f.help && <p id={`${id}-help`} className="mt-1 text-xs text-ash">{f.help}</p>}
              {err && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-ev-critique">{err}</p>}
            </div>
          );
        })}

        {editorial && (
          <div>
            <label htmlFor="f-_note" className="kicker mb-1.5 block">Nota desta revisão (opcional)</label>
            <input id="f-_note" name="_note" className={`${input} h-11`} placeholder="O que mudou e por quê" />
          </div>
        )}
      </fieldset>

      {state.message && (
        <div role="alert" className={`border p-3 text-sm ${state.ok ? "border-line" : "border-ev-critique text-ev-critique"}`}>
          <p>{state.message}</p>
          {state.issues && <ul className="mt-2 list-disc pl-5">{state.issues.map((i) => <li key={i}>{i}</li>)}</ul>}
        </div>
      )}
      {!disabled && (
        <button type="submit" disabled={pending} className="btn btn-solid disabled:opacity-60">{pending ? "Salvando…" : submitLabel}</button>
      )}
    </form>
  );
}

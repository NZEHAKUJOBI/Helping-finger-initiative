"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { initialFormState, type FieldConfig, type FormState } from "./types";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

const inputClasses =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-alert-500";

/** Config-driven form: each feature supplies fields + a server action, this renders and wires them. */
export function FormRenderer({
  action,
  fields,
  submitLabel,
}: {
  action: Action;
  fields: FieldConfig[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-card border border-brand-200 bg-brand-50 p-8 text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-white">
          <Icon name="check" className="size-7" />
        </span>
        <p className="mt-4 text-lg font-semibold text-brand-900">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="grid gap-5 sm:grid-cols-2">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-alert-500 sm:col-span-2">
          {state.message}
        </p>
      )}

      {fields.map((field) => {
        const id = `field-${field.name}`;
        const error = state.errors?.[field.name]?.[0];
        const common = {
          id,
          name: field.name,
          required: field.required,
          placeholder: field.placeholder,
          autoComplete: field.autoComplete,
          defaultValue: state.values?.[field.name] ?? "",
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
          className: inputClasses,
        };
        return (
          <div key={`${field.name}-${state.values?.[field.name] ?? ""}`} className={cn(field.wide && "sm:col-span-2")}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-brand-900">
              {field.label}
              {field.required && <span className="text-alert-500"> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea rows={5} {...common} />
            ) : field.type === "select" ? (
              <select {...common}>
                <option value="">Select…</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input type={field.type} {...common} />
            )}
            {error && (
              <p id={`${id}-error`} className="mt-1.5 text-sm text-alert-500">
                {error}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot for bots — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { createNewsletter } from "@/app/admin/newsletter-actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const initial: ActionResult = { status: "idle" };

export function NewNewsletterForm() {
  const [state, action, pending] = useActionState(createNewsletter, initial);

  return (
    <form action={action} className="rounded-card border border-line bg-white p-5 shadow-soft sm:p-7">
      <label htmlFor="new-title" className="mb-1.5 block text-sm font-semibold text-brand-900">
        Start a new newsletter
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="new-title"
          name="title"
          required
          minLength={3}
          maxLength={150}
          placeholder="e.g. Ramadan food outreach in Birnin Kebbi"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <Button type="submit" variant="accent" disabled={pending}>
          <Icon name="pencil" className="size-4" />
          {pending ? "Creating…" : "Create draft"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted">
        You can add the story and photos next. Nothing appears on the website until you publish.
      </p>
      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm text-alert-500">
          {state.message}
        </p>
      )}
    </form>
  );
}

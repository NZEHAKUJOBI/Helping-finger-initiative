"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { saveNewsletter } from "@/app/admin/newsletter-actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES, type Newsletter } from "@/domain/types";
import { cn } from "@/lib/cn";

const initial: ActionResult = { status: "idle" };

const field =
  "w-full rounded-xl border border-line bg-white px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100";
const label = "mb-1.5 block text-sm font-semibold text-brand-900";

export function NewsletterEditor({ newsletter: n }: { newsletter: Newsletter }) {
  const [state, action, pending] = useActionState(saveNewsletter, initial);
  const published = n.status === "published";

  return (
    <form action={action} className="space-y-6 rounded-card border border-line bg-white p-5 shadow-soft sm:p-7">
      <input type="hidden" name="id" value={n.id} />

      <div>
        <label htmlFor="nl-title" className={label}>
          Title
        </label>
        <input id="nl-title" name="title" required maxLength={150} defaultValue={n.title} className={cn(field, "h-12 text-base")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="nl-date" className={label}>
            Date of activity
          </label>
          <input id="nl-date" name="eventDate" type="date" required defaultValue={n.eventDate} className={cn(field, "h-11")} />
        </div>
        <div>
          <label htmlFor="nl-location" className={label}>
            Location <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="nl-location"
            name="location"
            maxLength={120}
            defaultValue={n.location}
            placeholder="e.g. Gwadangaji, Birnin Kebbi"
            className={cn(field, "h-11")}
          />
        </div>
        <div>
          <label htmlFor="nl-category" className={label}>
            Category
          </label>
          <select id="nl-category" name="category" defaultValue={n.category} className={cn(field, "h-11 px-3")}>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="nl-summary" className={label}>
          Summary
        </label>
        <textarea
          id="nl-summary"
          name="summary"
          rows={2}
          maxLength={300}
          defaultValue={n.summary}
          placeholder="One or two sentences shown on the home page and newsletter list."
          className={cn(field, "py-3")}
        />
      </div>

      <div>
        <label htmlFor="nl-body" className={label}>
          The story
        </label>
        <textarea
          id="nl-body"
          name="body"
          rows={14}
          maxLength={20000}
          defaultValue={n.body}
          placeholder={"What happened, who took part, and what difference it made.\n\n## Add a heading like this\n\n- Start a line with a dash for a list"}
          aria-describedby="nl-body-help"
          className={cn(field, "py-3 leading-relaxed")}
        />
        <p id="nl-body-help" className="mt-2 text-xs text-muted">
          Leave a blank line between paragraphs. Start a line with <code className="rounded bg-sand px-1">## </code> for a
          heading or <code className="rounded bg-sand px-1">- </code> for a bullet point.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        {published ? (
          <>
            <Button type="submit" name="intent" value="save" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
            <Button type="submit" name="intent" value="unpublish" variant="ghost" disabled={pending}>
              Unpublish
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" name="intent" value="publish" variant="accent" disabled={pending}>
              <Icon name="megaphone" className="size-4" />
              {pending ? "Saving…" : "Publish"}
            </Button>
            <Button type="submit" name="intent" value="save" variant="outline" disabled={pending}>
              Save draft
            </Button>
          </>
        )}
        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={cn("text-sm font-medium", state.status === "error" ? "text-alert-500" : "text-brand-700")}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

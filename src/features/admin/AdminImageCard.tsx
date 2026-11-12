"use client";

import { useActionState } from "react";
import { deleteImage, updateImage, type ActionResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES, type GalleryImage } from "@/domain/types";
import { cn } from "@/lib/cn";

const initial: ActionResult = { status: "idle" };

export function AdminImageCard({ image }: { image: GalleryImage }) {
  const [state, action, pending] = useActionState(updateImage, initial);

  return (
    <article className="overflow-hidden rounded-card border border-line bg-white shadow-soft">
      <a href={image.src} target="_blank" rel="noreferrer" className="block aspect-[4/3] bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised thumbnail */}
        <img src={image.thumbSrc} alt={image.caption} className="size-full object-cover" loading="lazy" />
      </a>
      <form action={action} className="space-y-3 p-4">
        <input type="hidden" name="id" value={image.id} />
        <input
          name="caption"
          defaultValue={image.caption}
          maxLength={200}
          placeholder="Add a caption"
          aria-label="Caption"
          className="h-10 w-full rounded-lg border border-line px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <div className="flex gap-2">
          <select
            name="category"
            defaultValue={image.category}
            aria-label="Category"
            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-white px-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm" className="h-10" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
        {state.message && (
          <p className={cn("text-xs", state.status === "error" ? "text-alert-500" : "text-brand-700")} role="status">
            {state.message}
          </p>
        )}
      </form>
      <form
        action={deleteImage}
        onSubmit={(e) => {
          if (!confirm("Delete this photo permanently? This cannot be undone.")) e.preventDefault();
        }}
        className="flex items-center justify-between border-t border-line px-4 py-2.5"
      >
        <span className="text-xs text-muted">
          {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeZone: "Africa/Lagos" }).format(new Date(image.createdAt))}
        </span>
        <input type="hidden" name="id" value={image.id} />
        <button className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-alert-500 hover:bg-red-50">
          <Icon name="trash" className="size-4" /> Delete
        </button>
      </form>
    </article>
  );
}

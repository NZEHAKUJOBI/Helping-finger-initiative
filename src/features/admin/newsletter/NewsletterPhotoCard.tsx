"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { removeNewsletterPhoto, setNewsletterCover, updateNewsletterPhoto } from "@/app/admin/newsletter-actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { NewsletterPhoto } from "@/domain/types";
import { cn } from "@/lib/cn";

const initial: ActionResult = { status: "idle" };

export function NewsletterPhotoCard({
  newsletterId,
  photo,
  isCover,
}: {
  newsletterId: string;
  photo: NewsletterPhoto;
  isCover: boolean;
}) {
  const [state, action, pending] = useActionState(updateNewsletterPhoto, initial);

  return (
    <article className={cn("overflow-hidden rounded-card border bg-white shadow-soft", isCover ? "border-accent-400 ring-2 ring-accent-300" : "border-line")}>
      <a href={photo.src} target="_blank" rel="noreferrer" className="relative block aspect-[4/3] bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised thumbnail */}
        <img src={photo.thumbSrc} alt={photo.caption} className="size-full object-cover" loading="lazy" />
        {isCover && (
          <span className="absolute left-2 top-2 rounded-full bg-accent-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-950">
            Cover
          </span>
        )}
      </a>
      <form action={action} className="flex gap-2 p-3">
        <input type="hidden" name="id" value={newsletterId} />
        <input type="hidden" name="photoId" value={photo.id} />
        <input
          name="caption"
          defaultValue={photo.caption}
          maxLength={200}
          placeholder="Add a caption"
          aria-label="Caption"
          className="h-9 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "…" : "Save"}
        </Button>
      </form>
      {state.message && (
        <p className={cn("-mt-1 px-3 pb-2 text-xs", state.status === "error" ? "text-alert-500" : "text-brand-700")} role="status">
          {state.message}
        </p>
      )}
      <div className="flex items-center justify-between border-t border-line px-3 py-2">
        {isCover ? (
          <span className="text-xs text-muted">Shown on cards and the home page</span>
        ) : (
          <form action={setNewsletterCover}>
            <input type="hidden" name="id" value={newsletterId} />
            <input type="hidden" name="photoId" value={photo.id} />
            <button className="rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50">Make cover</button>
          </form>
        )}
        <form
          action={removeNewsletterPhoto}
          onSubmit={(e) => {
            if (!confirm("Remove this photo from the newsletter? If it is not also in the gallery, it will be deleted.")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={newsletterId} />
          <input type="hidden" name="photoId" value={photo.id} />
          <button className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-alert-500 hover:bg-red-50">
            <Icon name="trash" className="size-4" /> Remove
          </button>
        </form>
      </div>
    </article>
  );
}

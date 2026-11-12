"use client";

import { deleteNewsletter } from "@/app/admin/newsletter-actions";
import { Icon } from "@/components/ui/Icon";

export function DeleteNewsletterButton({ id }: { id: string }) {
  return (
    <form
      action={deleteNewsletter}
      onSubmit={(e) => {
        if (!confirm("Delete this newsletter permanently? Its photos are deleted too, unless they are also in the gallery. This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-alert-500 hover:bg-red-50">
        <Icon name="trash" className="size-4" /> Delete newsletter
      </button>
    </form>
  );
}

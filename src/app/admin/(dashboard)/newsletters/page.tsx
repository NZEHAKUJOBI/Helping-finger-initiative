import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { NewNewsletterForm } from "@/features/admin/newsletter/NewNewsletterForm";
import { requireAdmin } from "@/lib/auth/session";
import { cn } from "@/lib/cn";
import { coverOf, formatEventDate, newsletterRepo } from "@/lib/newsletter";

export const metadata: Metadata = { title: "Newsletters" };

export default async function AdminNewslettersPage() {
  await requireAdmin();
  const items = await newsletterRepo.list();

  return (
    <>
      <header>
        <p className="text-sm font-semibold text-brand-600">Content</p>
        <h1 className="mt-1 text-4xl font-medium">Newsletters</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Write up your activities with photos. Published newsletters appear on the website&apos;s Newsletter page and the
          latest ones show on the home page.
        </p>
      </header>

      <section className="mt-8">
        <NewNewsletterForm />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-medium">
          All newsletters <span className="text-base font-normal text-muted">({items.length})</span>
        </h2>
        {items.length === 0 ? (
          <p className="text-muted">No newsletters yet. Start one above.</p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
            {items.map((n) => {
              const cover = coverOf(n);
              return (
                <li key={n.id} className="flex items-center gap-4 p-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                    {cover ? (
                      /* eslint-disable-next-line @next/next/no-img-element -- pre-optimised thumbnail */
                      <img src={cover.thumbSrc} alt="" className="size-full object-cover" />
                    ) : (
                      <Icon name="news" className="m-auto mt-4 size-8 text-brand-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/newsletters/${n.id}`} className="font-semibold text-brand-900 hover:underline">
                      {n.title}
                    </Link>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-bold uppercase tracking-wider",
                          n.status === "published" ? "bg-brand-50 text-brand-700" : "bg-sand text-ink/70",
                        )}
                      >
                        {n.status === "published" ? "Published" : "Draft"}
                      </span>
                      <span>{formatEventDate(n.eventDate)}</span>
                      <span>
                        {n.photos.length} photo{n.photos.length === 1 ? "" : "s"}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {n.status === "published" && (
                      <Link
                        href={`/newsletter/${n.slug}`}
                        target="_blank"
                        className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 sm:inline-flex"
                      >
                        <Icon name="eye" className="size-4" /> View
                      </Link>
                    )}
                    <Link
                      href={`/admin/newsletters/${n.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      <Icon name="pencil" className="size-4" /> Edit
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

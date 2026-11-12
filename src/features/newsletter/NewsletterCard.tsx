import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES, type Newsletter } from "@/domain/types";
import { cn } from "@/lib/cn";
import { coverOf, formatEventDate } from "@/lib/newsletter";

export function NewsletterCard({ item, featured = false }: { item: Newsletter; featured?: boolean }) {
  const cover = coverOf(item);
  const category = GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-shadow hover:shadow-lg",
        featured && "lg:flex-row",
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-sand", featured && "lg:aspect-auto lg:w-3/5")}>
        {cover ? (
          /* eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload */
          <img
            src={featured ? cover.src : cover.thumbSrc}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-brand-900">
            <Icon name="news" className="size-14 text-accent-300" />
          </div>
        )}
        {category && (
          <span className="absolute left-4 top-4 rounded-full bg-accent-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-950">
            {category}
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", featured && "lg:justify-center lg:p-10")}>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="size-4 text-brand-600" />
            <time dateTime={item.eventDate}>{formatEventDate(item.eventDate)}</time>
          </span>
          {item.location && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="map" className="size-4 text-brand-600" />
              {item.location}
            </span>
          )}
        </p>
        <h3 className={cn("mt-3 font-display font-medium leading-tight text-brand-900", featured ? "text-3xl sm:text-4xl" : "text-2xl")}>
          <Link href={`/newsletter/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className={cn("mt-3 leading-relaxed text-ink/75", !featured && "line-clamp-3")}>{item.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-brand-700">
          Read the story <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

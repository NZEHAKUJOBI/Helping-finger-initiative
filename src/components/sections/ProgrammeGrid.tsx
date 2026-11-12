import Link from "next/link";
import type { Programme } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Bento grid: first programme is featured on a forest panel, the rest on white cards. */
export function ProgrammeGrid({ items }: { items: Programme[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => {
        const featured = i === 0;
        return (
          <li key={p.slug} className={cn(featured && "sm:col-span-2 lg:col-span-1 lg:row-span-2")}>
            <Link
              href={`/programmes/${p.slug}`}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-card p-7 transition duration-300 hover:-translate-y-1",
                featured
                  ? "grain bg-brand-800 text-white shadow-lift"
                  : "border border-line bg-white shadow-soft hover:shadow-lift",
              )}
            >
              {featured && (
                <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-accent-400/90" />
              )}
              <div className="relative flex items-start justify-between">
                <span
                  className={cn(
                    "inline-flex size-12 items-center justify-center rounded-2xl",
                    featured ? "bg-white/10 text-accent-300" : "bg-brand-50 text-brand-700",
                  )}
                >
                  <Icon name={p.icon} />
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "font-display text-5xl font-medium leading-none",
                    featured ? "text-brand-950/40" : "text-brand-100",
                  )}
                >
                  {p.letter}
                </span>
              </div>
              <h3
                className={cn(
                  "relative mt-8 font-medium leading-tight",
                  featured ? "text-3xl text-white lg:mt-auto lg:pt-24" : "text-xl",
                )}
              >
                {p.title}
              </h3>
              <p className={cn("relative mt-3 text-[15px] leading-relaxed", featured ? "text-white/75" : "text-muted")}>
                {p.summary}
              </p>
              <span
                className={cn(
                  "relative mt-6 inline-flex items-center gap-2 text-sm font-semibold",
                  featured ? "text-accent-300" : "text-brand-700",
                )}
              >
                Learn more
                <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        );
      })}
      <li>
        <Link
          href="/partner"
          className="group flex h-full min-h-56 flex-col justify-between rounded-card border-2 border-dashed border-brand-900/15 p-7 transition hover:border-brand-500 hover:bg-white"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-100 text-brand-900">
            <Icon name="handshake" />
          </span>
          <div>
            <h3 className="text-xl font-medium">Have a project in mind?</h3>
            <p className="mt-2 text-[15px] text-muted">Partner with us to reach more people in need.</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
              Partner with us
              <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </li>
    </ul>
  );
}

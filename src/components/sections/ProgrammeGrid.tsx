import Link from "next/link";
import type { Programme } from "@/domain/types";
import { IconBadge } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export function ProgrammeGrid({ items }: { items: Programme[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/programmes/${p.slug}`}
            className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md sm:p-7"
          >
            <div className="flex items-center justify-between">
              <IconBadge icon={p.icon} />
              <span className="text-sm font-bold text-brand-200" aria-hidden>
                {p.letter}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
              Learn more
              <Icon name="arrow-right" className="size-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

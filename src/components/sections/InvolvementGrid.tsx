import Link from "next/link";
import type { InvolvementOption } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function InvolvementGrid({ options }: { options: InvolvementOption[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {options.map((o) => {
        const primary = o.kind === "donate";
        return (
          <li key={o.kind}>
            <Link
              href={o.href}
              className={cn(
                "group flex h-full flex-col rounded-card p-7 transition duration-300 hover:-translate-y-1",
                primary
                  ? "bg-accent-400 text-brand-950 shadow-lift"
                  : "border border-line bg-white shadow-soft hover:shadow-lift",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-2xl",
                  primary ? "bg-white/60 text-brand-900" : "bg-brand-50 text-brand-700",
                )}
              >
                <Icon name={o.icon} />
              </span>
              <h3 className="mt-6 text-2xl font-medium">{o.title}</h3>
              <p className={cn("mt-2 flex-1 text-[15px] leading-relaxed", primary ? "text-brand-950/75" : "text-muted")}>
                {o.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                {o.cta}
                <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

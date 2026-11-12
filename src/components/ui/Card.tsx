import type { IconName } from "@/domain/types";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-card border border-line bg-surface p-6 shadow-soft sm:p-8", className)}>
      {children}
    </div>
  );
}

const badgeTones = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  accent: "bg-accent-100 text-brand-900 ring-accent-300/50",
  forest: "bg-white/10 text-accent-300 ring-white/15",
} as const;

export function IconBadge({
  icon,
  tone = "brand",
  className,
}: {
  icon: IconName;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset",
        badgeTones[tone],
        className,
      )}
    >
      <Icon name={icon} />
    </span>
  );
}

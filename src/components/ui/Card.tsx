import type { IconName } from "@/domain/types";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-card border border-line bg-surface p-6 shadow-sm sm:p-7", className)}>
      {children}
    </div>
  );
}

export function IconBadge({ icon, tone = "brand" }: { icon: IconName; tone?: "brand" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-xl",
        tone === "brand" ? "bg-brand-50 text-brand-700" : "bg-accent-100 text-brand-900",
      )}
    >
      <Icon name={icon} />
    </span>
  );
}

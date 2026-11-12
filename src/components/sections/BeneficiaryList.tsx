import type { Beneficiary } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";

export function BeneficiaryList({ items }: { items: Beneficiary[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b, i) => (
        <li
          key={b.label}
          className="group flex min-h-36 flex-col justify-between rounded-card border border-line bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <Icon name={b.icon} className="size-7 text-brand-600" />
            <span aria-hidden className="font-display text-sm text-brand-200">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <span className="mt-6 font-display text-xl leading-snug text-brand-900">{b.label}</span>
        </li>
      ))}
    </ul>
  );
}

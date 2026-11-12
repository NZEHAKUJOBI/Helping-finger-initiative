import type { Beneficiary } from "@/domain/types";
import { IconBadge } from "@/components/ui/Card";

export function BeneficiaryList({ items }: { items: Beneficiary[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b) => (
        <li key={b.label} className="flex items-center gap-4 rounded-card border border-line bg-surface p-5">
          <IconBadge icon={b.icon} />
          <span className="font-semibold leading-snug text-brand-900">{b.label}</span>
        </li>
      ))}
    </ul>
  );
}

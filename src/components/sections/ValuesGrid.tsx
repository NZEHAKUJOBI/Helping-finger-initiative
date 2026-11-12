import type { CoreValue } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";

export function ValuesGrid({ values }: { values: CoreValue[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {values.map((v) => (
        <li key={v.title} className="bg-white p-7 transition-colors hover:bg-cream">
          <Icon name={v.icon} className="size-7 text-brand-600" />
          <h3 className="mt-5 text-xl font-medium">{v.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.description}</p>
        </li>
      ))}
      <li className="grain flex flex-col justify-end bg-brand-800 p-7 text-white">
        <p className="font-display text-2xl leading-snug">
          Guided by values, <em className="text-accent-300">driven by people.</em>
        </p>
      </li>
    </ul>
  );
}

import type { CoreValue } from "@/domain/types";
import { Card, IconBadge } from "@/components/ui/Card";

export function ValuesGrid({ values }: { values: CoreValue[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((v, i) => (
        <li key={v.title}>
          <Card className="h-full">
            <IconBadge icon={v.icon} tone={i % 2 ? "accent" : "brand"} />
            <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}

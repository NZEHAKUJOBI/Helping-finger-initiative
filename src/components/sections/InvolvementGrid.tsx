import type { InvolvementOption } from "@/domain/types";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconBadge } from "@/components/ui/Card";

export function InvolvementGrid({ options }: { options: InvolvementOption[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {options.map((o) => (
        <li key={o.kind}>
          <Card className="flex h-full flex-col">
            <IconBadge icon={o.icon} tone={o.kind === "donate" ? "accent" : "brand"} />
            <h3 className="mt-4 text-lg font-bold">{o.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{o.description}</p>
            <ButtonLink
              href={o.href}
              variant={o.kind === "donate" ? "accent" : "outline"}
              className="mt-6 self-start"
            >
              {o.cta}
            </ButtonLink>
          </Card>
        </li>
      ))}
    </ul>
  );
}

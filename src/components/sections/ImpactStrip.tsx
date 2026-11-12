import { Container } from "@/components/ui/Section";

export interface Stat {
  value: string;
  label: string;
}

export function ImpactStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-line bg-white">
      <Container>
        <dl className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-2 py-8 sm:px-8 lg:py-10">
              <dt className="mt-1 text-sm font-medium text-muted">{s.label}</dt>
              <dd className="font-display text-4xl font-medium text-brand-800 sm:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

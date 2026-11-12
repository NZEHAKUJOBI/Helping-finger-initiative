import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

export function QuoteBand({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <section className="relative overflow-hidden bg-accent-400 py-20 sm:py-24">
      <div aria-hidden className="absolute -left-20 -top-24 size-72 rounded-full bg-accent-300" />
      <div aria-hidden className="absolute -bottom-32 -right-10 size-80 rounded-full border-[28px] border-brand-500/25" />
      <Container className="relative">
        <figure className="mx-auto max-w-4xl text-center">
          <Icon name="quote" className="mx-auto size-10 text-brand-900/70" />
          <blockquote className="mt-6 font-display text-3xl font-medium leading-tight text-brand-950 sm:text-5xl">
            {quote}
          </blockquote>
          {attribution && (
            <figcaption className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-brand-900/70">
              {attribution}
            </figcaption>
          )}
        </figure>
      </Container>
    </section>
  );
}

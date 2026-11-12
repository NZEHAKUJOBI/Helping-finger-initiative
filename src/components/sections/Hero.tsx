import type { Hero as HeroContent } from "@/domain/types";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

export function Hero({ eyebrow, title, subtitle, belief }: HeroContent) {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Concentric arcs echo the letterhead's corner motif */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 hidden size-[24rem] rounded-full bg-brand-500 lg:block xl:-right-24 xl:-top-24" />
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 hidden size-[12rem] rounded-full bg-accent-400 lg:block xl:-right-4 xl:-top-4" />
      {/* Small screens: the letterhead's green/yellow band instead of arcs */}
      <div aria-hidden className="flex h-1.5 lg:hidden">
        <div className="flex-[3] bg-brand-500" />
        <div className="flex-1 bg-accent-400" />
      </div>

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
            <Icon name="map" className="size-4" />
            {eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{subtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/donate" variant="accent" size="lg">
              Donate now
            </ButtonLink>
            <ButtonLink href="/get-involved" variant="outline" size="lg">
              Get involved <Icon name="arrow-right" className="size-5" />
            </ButtonLink>
          </div>
        </div>

        <blockquote className="mt-16 max-w-2xl border-l-4 border-accent-400 pl-5 text-lg font-semibold text-brand-900 sm:text-xl">
          “{belief}”
        </blockquote>
      </Container>
    </section>
  );
}

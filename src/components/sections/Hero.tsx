import type { GalleryImage, Hero as HeroContent } from "@/domain/types";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow } from "@/components/ui/Section";

/** Yellow brush underline, echoing the letterhead accent. */
function Swoosh() {
  return (
    <svg aria-hidden viewBox="0 0 220 18" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-accent-400 sm:-bottom-3 sm:h-4">
      <path d="M3 13C50 5 120 3 217 8" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function Hero({ hero, images }: { hero: HeroContent; images: GalleryImage[] }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <Container className="grid items-center gap-14 pb-20 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="animate-rise">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="text-[2.75rem] font-medium leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
            Extending hands of{" "}
            <span className="relative inline-block italic text-brand-600">
              hope
              <Swoosh />
            </span>
            , restoring dignity, transforming lives.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{hero.subtitle}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/donate" variant="accent" size="lg">
              <Icon name="heart" className="size-5" /> Donate now
            </ButtonLink>
            <ButtonLink href="/programmes" variant="outline" size="lg">
              Our programmes <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-800">
            {["Community-driven", "Transparent", "Accountable"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" className="size-4 text-brand-500" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual images={images} belief={hero.belief} />
      </Container>
    </section>
  );
}

function HeroVisual({ images, belief }: { images: GalleryImage[]; belief: string }) {
  const [main, second, third] = images;

  return (
    <div className="relative mx-auto w-full max-w-xl animate-rise [animation-delay:150ms] lg:max-w-none">
      {/* Letterhead arcs */}
      <div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-accent-400 sm:size-64" />
      <div aria-hidden className="absolute -bottom-8 -right-8 size-32 rounded-full border-[14px] border-brand-500/80" />

      <div className="relative grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4" style={{ aspectRatio: "5 / 5.4" }}>
        {/* Main arch */}
        <div className="col-span-3 row-span-6 overflow-hidden rounded-[999px_999px_1.5rem_1.5rem] bg-brand-800 shadow-lift">
          {main ? (
            // eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload
            <img src={main.src} alt={main.caption || "Helping Fingers community work"} className="size-full object-cover" />
          ) : (
            <div className="grain flex size-full flex-col items-center justify-center bg-gradient-to-b from-brand-600 to-brand-900 p-6 pb-24 text-center text-white">
              <span className="font-display text-7xl font-medium text-accent-300 sm:text-8xl">7</span>
              <span className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Programme areas
              </span>
              <span className="mt-1 text-xs text-white/60">from relief to empowerment</span>
            </div>
          )}
        </div>

        <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl bg-sand shadow-soft">
          {second ? (
            // eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload
            <img src={second.thumbSrc} alt={second.caption || ""} className="size-full object-cover" />
          ) : (
            <div className="flex size-full flex-col justify-between bg-white p-5">
              <Icon name="users" className="size-8 text-brand-600" />
              <p className="font-display text-lg leading-snug text-brand-900">Women, children & youths</p>
            </div>
          )}
        </div>

        <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl bg-brand-100 shadow-soft">
          {third ? (
            // eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload
            <img src={third.thumbSrc} alt={third.caption || ""} className="size-full object-cover" />
          ) : (
            <div className="flex size-full flex-col justify-between bg-brand-100 p-5">
              <Icon name="map" className="size-8 text-brand-700" />
              <p className="font-display text-lg leading-snug text-brand-900">Rooted in Kebbi State</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating belief card */}
      <figure className="absolute -bottom-10 left-4 right-16 rounded-2xl bg-white p-5 shadow-lift sm:-left-6 sm:right-auto sm:w-80 lg:-bottom-12">
        <Icon name="quote" className="size-6 text-accent-400" />
        <blockquote className="mt-2 font-display text-[1.05rem] leading-snug text-brand-900">{belief}</blockquote>
      </figure>
    </div>
  );
}

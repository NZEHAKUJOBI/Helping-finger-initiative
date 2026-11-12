import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

interface CTABannerProps {
  title: string;
  body: string;
  slogan?: string;
}

export function CTABanner({ title, body, slogan }: CTABannerProps) {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <Container>
        <div className="grain relative overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-14 sm:px-14 sm:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-brand-500/60" />
          <div aria-hidden className="absolute -right-6 -top-6 size-48 rounded-full bg-accent-400" />
          <div className="relative max-w-2xl">
            {slogan && (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-300">{slogan}</p>
            )}
            <h2 className="text-4xl font-medium leading-[1.05] text-white sm:text-6xl">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/donate" variant="accent" size="lg">
                <Icon name="heart" className="size-5" /> Donate
              </ButtonLink>
              <ButtonLink href="/volunteer" variant="light" size="lg">
                Become a volunteer
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

interface CTABannerProps {
  title: string;
  body: string;
  slogan?: string;
}

export function CTABanner({ title, body, slogan }: CTABannerProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-700 px-6 py-12 text-white sm:px-12 sm:py-16">
          <div aria-hidden className="absolute -bottom-24 -right-16 size-72 rounded-full bg-accent-400/90" />
          <div aria-hidden className="absolute -bottom-10 -right-2 size-36 rounded-full bg-brand-500" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/85">{body}</p>
            {slogan && <p className="mt-4 font-bold text-accent-400">{slogan}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/donate" variant="accent" size="lg">
                Donate
              </ButtonLink>
              <ButtonLink href="/volunteer" variant="light" size="lg">
                Volunteer
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

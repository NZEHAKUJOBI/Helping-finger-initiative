import Link from "next/link";
import type { NavItem, SiteConfig } from "@/domain/types";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { Logo } from "./Logo";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export function Footer({ site, nav }: { site: SiteConfig; nav: NavItem[] }) {
  const { contact } = site;
  const more: NavItem[] = [
    { label: "Partner With Us", href: "/partner" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
  ];

  return (
    <footer className="grain relative overflow-hidden bg-brand-950 text-white/70">
      <div aria-hidden className="absolute -bottom-40 -right-40 size-[28rem] rounded-full border-[40px] border-brand-500/10" />
      <Container className="relative">
        <div className="flex flex-col gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">
            Be a helping hand. <em className="text-accent-300">Restore hope.</em> Transform lives.
          </p>
          <ButtonLink href="/get-involved" variant="accent" size="lg" className="self-start lg:self-auto">
            Get involved <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
          <div>
            <Logo invert />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">{site.letterheadTagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">Explore</h2>
            <ul className="space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-accent-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Get involved">
            <h2 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">Take part</h2>
            <ul className="space-y-3 text-sm">
              {more.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-accent-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">Reach us</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-accent-400" />
                <span>
                  {contact.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:text-white">
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              {contact.email && (
                <li className="flex gap-3">
                  <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-accent-400" />
                  <a href={`mailto:${contact.email}`} className="hover:text-white">
                    {contact.email}
                  </a>
                </li>
              )}
              <li className="flex gap-3">
                <Icon name="map" className="mt-0.5 size-5 shrink-0 text-accent-400" />
                <address className="not-italic leading-relaxed">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>
            Â© <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <p>Birnin Kebbi Â· Kebbi State Â· Nigeria</p>
        </div>
      </Container>
      <div aria-hidden className="flex h-1.5">
        <div className="flex-[3] bg-brand-500" />
        <div className="flex-1 bg-accent-400" />
      </div>
    </footer>
  );
}

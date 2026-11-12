import Link from "next/link";
import type { NavItem, SiteConfig } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { Logo } from "./Logo";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export function Footer({ site, nav }: { site: SiteConfig; nav: NavItem[] }) {
  const { contact } = site;
  return (
    <footer className="bg-brand-900 text-white/80">
      {/* Green/yellow band echoes the letterhead footer */}
      <div className="flex h-2" aria-hidden>
        <div className="flex-[3] bg-brand-500" />
        <div className="flex-1 bg-accent-400" />
      </div>
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.4fr]">
        <div>
          <Logo invert />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.letterheadTagline}</p>
          <p className="mt-4 text-sm font-semibold text-accent-400">
            Be a helping hand. Restore hope. Transform lives.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Explore</h2>
          <ul className="space-y-2 text-sm">
            {[...nav, { label: "Partner With Us", href: "/partner" }, { label: "Volunteer", href: "/volunteer" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Contact</h2>
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
              <address className="not-italic">
                {contact.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-6 text-xs text-white/60">
          © <CopyrightYear /> {site.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}

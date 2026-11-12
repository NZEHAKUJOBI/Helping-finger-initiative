"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/domain/types";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header({ nav, logo }: { nav: NavItem[]; logo: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || open
          ? "border-b border-line bg-cream/90 shadow-[0_8px_30px_-12px_rgb(16_48_28/0.15)] backdrop-blur-md"
          : "border-b border-transparent bg-cream",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        {logo}

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-3 py-2 text-[14px] font-semibold transition-colors",
                      "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent-400 after:transition-transform",
                      active
                        ? "text-brand-900 after:scale-x-100"
                        : "text-ink/70 after:scale-x-0 hover:text-brand-900 hover:after:scale-x-100",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink href="/donate" variant="accent">
              <Icon name="heart" className="size-4" />
              Donate
            </ButtonLink>
          </span>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-brand-900 ring-1 ring-brand-900/10 hover:bg-white xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto border-t border-line bg-cream xl:hidden"
        >
          <Container className="flex flex-col py-6">
            <ul className="flex flex-col divide-y divide-line">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between py-4 font-display text-2xl",
                      isActive(pathname, item.href) ? "text-brand-700" : "text-brand-900",
                    )}
                  >
                    {item.label}
                    <Icon name="arrow-right" className="size-5 text-brand-300" />
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href="/donate" variant="accent" size="lg" className="mt-8 w-full" onClick={close}>
              <Icon name="heart" className="size-4" /> Donate
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}

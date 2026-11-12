import type { NavItem, SiteConfig } from "@/domain/types";

/**
 * Organisation identity. The name follows the logo and letterhead;
 * the web brief used "Helping Fingers Support Association" — change it here only.
 */
export const site: SiteConfig = {
  name: "Helping Fingers Initiative Association",
  shortName: "Helping Fingers",
  tagline: "Extending Hands of Hope, Restoring Dignity, Transforming Lives.",
  letterheadTagline: "Empowering Vulnerable Women, Children & Youths with Social & Economic Benefits",
  description:
    "A community-oriented humanitarian organisation in Birnin Kebbi, Kebbi State, supporting vulnerable individuals, strengthening families and improving living conditions in underserved communities.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    phones: ["+234 803 054 8865", "+234 906 952 5659"],
    email: undefined, // TODO: official email address
    address: [
      "Suite 7, Amadu Plaza, Opp. Masallacin Abbas Jega",
      "Refin Atiku, Badariya Road",
      "Birnin Kebbi, Kebbi State, Nigeria",
    ],
    socials: [], // TODO: social media handles
  },
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Who We Support", href: "/who-we-support" },
  { label: "Gallery", href: "/gallery" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

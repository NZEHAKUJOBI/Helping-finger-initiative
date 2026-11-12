/**
 * Domain types — the single source of truth for the shape of site content.
 * No React, no framework imports: these can be reused by a CMS adapter later.
 */

export type IconName =
  | "heart"
  | "hand"
  | "users"
  | "book"
  | "health"
  | "wheat"
  | "shield"
  | "community"
  | "scale"
  | "star"
  | "handshake"
  | "megaphone"
  | "gift"
  | "phone"
  | "mail"
  | "map"
  | "arrow-right"
  | "check"
  | "image"
  | "upload"
  | "trash"
  | "close"
  | "chevron-left"
  | "chevron-right"
  | "quote";

export interface ContactInfo {
  phones: string[];
  email?: string;
  address: string[];
  socials: SocialLink[];
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "x" | "linkedin" | "youtube" | "whatsapp";
  url: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  /** Tagline used on the official letterhead. */
  letterheadTagline: string;
  description: string;
  url: string;
  contact: ContactInfo;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Hero {
  eyebrow: string;
  title: string;
  subtitle: string;
  belief: string;
}

export interface CoreValue {
  title: string;
  description: string;
  icon: IconName;
}

export interface Programme {
  slug: string;
  letter: string;
  title: string;
  summary: string;
  icon: IconName;
  /** Longer copy for the programme detail page. */
  details: string[];
}

export interface ApproachStep {
  step: number;
  title: string;
  description: string;
}

export interface Beneficiary {
  label: string;
  icon: IconName;
}

/** Discriminated union: every way someone can get involved, each with its own route. */
export type InvolvementKind = "donate" | "volunteer" | "partner" | "share";

export interface InvolvementOption {
  kind: InvolvementKind;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: IconName;
}

export interface GovernanceBody {
  title: string;
  description: string;
}

export const GALLERY_CATEGORIES = [
  { value: "relief", label: "Relief & Outreach" },
  { value: "empowerment", label: "Empowerment" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "community", label: "Community" },
  { value: "events", label: "Events" },
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["value"];

export interface GalleryImage {
  id: string;
  caption: string;
  category: GalleryCategory;
  /** Public URLs served by the storage adapter. */
  src: string;
  thumbSrc: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface AboutContent {
  intro: string[];
  vision: string;
  mission: string;
  objectives: string[];
  commitment: string[];
  governance: GovernanceBody[];
  accountability: string[];
}

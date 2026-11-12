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
  | "quote"
  | "calendar"
  | "news"
  | "pencil"
  | "eye";

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

/** A photo attached to a newsletter issue. Ids are shared with the gallery when "also add to gallery" is used. */
export interface NewsletterPhoto {
  id: string;
  src: string;
  thumbSrc: string;
  width: number;
  height: number;
  caption: string;
}

export type NewsletterStatus = "draft" | "published";

/** A newsletter issue: a write-up of an activity, with its photos. */
export interface Newsletter {
  id: string;
  /** URL segment, set once at creation so shared links keep working. */
  slug: string;
  title: string;
  /** One or two sentences shown on cards and the home page. */
  summary: string;
  /** Plain text. Blank lines separate paragraphs; "## " starts a heading; "- " starts a list item. */
  body: string;
  /** Date the activity took place (YYYY-MM-DD). */
  eventDate: string;
  location: string;
  category: GalleryCategory;
  /** Id of the photo used as the cover; falls back to the first photo. */
  coverId: string | null;
  photos: NewsletterPhoto[];
  status: NewsletterStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

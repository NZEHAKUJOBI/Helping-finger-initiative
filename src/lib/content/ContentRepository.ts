import type {
  AboutContent,
  ApproachStep,
  Beneficiary,
  CoreValue,
  Hero,
  InvolvementOption,
  NavItem,
  Programme,
  SiteConfig,
} from "@/domain/types";

/**
 * Repository pattern: pages depend on this interface, never on where content lives.
 * Swap StaticContentRepository for a CMS-backed implementation without touching pages.
 */
export interface ContentRepository {
  getSite(): Promise<SiteConfig>;
  getNav(): Promise<NavItem[]>;
  getHero(): Promise<Hero>;
  getWelcome(): Promise<string[]>;
  getApproach(): Promise<{ intro: string; steps: ApproachStep[] }>;
  getJoinUs(): Promise<{ title: string; body: string; slogan: string }>;
  getAbout(): Promise<AboutContent>;
  getCoreValues(): Promise<CoreValue[]>;
  getProgrammes(): Promise<Programme[]>;
  getProgramme(slug: string): Promise<Programme | null>;
  getBeneficiaries(): Promise<Beneficiary[]>;
  getPartnerTypes(): Promise<string[]>;
  getInvolvementOptions(): Promise<InvolvementOption[]>;
}

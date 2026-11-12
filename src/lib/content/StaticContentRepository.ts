import { about, coreValues } from "@/content/about";
import { approach, approachIntro, hero, joinUs, welcome } from "@/content/home";
import { beneficiaries, involvementOptions, partnerTypes } from "@/content/involvement";
import { programmes } from "@/content/programmes";
import { mainNav, site } from "@/content/site";
import type { ContentRepository } from "./ContentRepository";

/** Reads typed content from /src/content. Async so a CMS implementation is a drop-in swap. */
export class StaticContentRepository implements ContentRepository {
  async getSite() {
    return site;
  }
  async getNav() {
    return mainNav;
  }
  async getHero() {
    return hero;
  }
  async getWelcome() {
    return welcome;
  }
  async getApproach() {
    return { intro: approachIntro, steps: approach };
  }
  async getJoinUs() {
    return joinUs;
  }
  async getAbout() {
    return about;
  }
  async getCoreValues() {
    return coreValues;
  }
  async getProgrammes() {
    return programmes;
  }
  async getProgramme(slug: string) {
    return programmes.find((p) => p.slug === slug) ?? null;
  }
  async getBeneficiaries() {
    return beneficiaries;
  }
  async getPartnerTypes() {
    return partnerTypes;
  }
  async getInvolvementOptions() {
    return involvementOptions;
  }
}

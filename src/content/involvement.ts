import type { Beneficiary, InvolvementOption } from "@/domain/types";

export const beneficiaries: Beneficiary[] = [
  { label: "Low-income and vulnerable households", icon: "community" },
  { label: "Widows and single mothers", icon: "heart" },
  { label: "Orphans and disadvantaged children", icon: "book" },
  { label: "Unemployed and disadvantaged youths", icon: "star" },
  { label: "Elderly people without adequate support", icon: "hand" },
  { label: "Persons living with disabilities", icon: "users" },
  { label: "Internally displaced and crisis-affected persons", icon: "shield" },
  { label: "Underserved rural and urban communities", icon: "map" },
];

export const partnerTypes: string[] = [
  "Government ministries, departments and agencies",
  "Local and international NGOs",
  "Corporate organisations and businesses",
  "Philanthropists and charitable foundations",
  "Community-based organisations",
  "Faith-based organisations",
  "Development partners and volunteers",
];

export const involvementOptions: InvolvementOption[] = [
  {
    kind: "donate",
    title: "Donate",
    description:
      "Support our humanitarian and empowerment programmes through financial or material contributions.",
    cta: "Make a donation",
    href: "/donate",
    icon: "gift",
  },
  {
    kind: "volunteer",
    title: "Volunteer",
    description: "Give your time, skills and experience to support community interventions.",
    cta: "Become a volunteer",
    href: "/volunteer",
    icon: "hand",
  },
  {
    kind: "partner",
    title: "Partner With Us",
    description: "Collaborate with us to implement projects and reach vulnerable populations.",
    cta: "Start a partnership",
    href: "/partner",
    icon: "handshake",
  },
  {
    kind: "share",
    title: "Spread the Word",
    description:
      "Help us raise awareness about the needs of disadvantaged individuals and communities.",
    cta: "Contact us",
    href: "/contact",
    icon: "megaphone",
  },
];

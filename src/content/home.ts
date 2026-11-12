import type { ApproachStep, Hero } from "@/domain/types";

export const hero: Hero = {
  eyebrow: "Birnin Kebbi · Kebbi State · Nigeria",
  title: "Extending Hands of Hope, Restoring Dignity, Transforming Lives.",
  subtitle:
    "We believe that everyone deserves a chance to live a dignified and meaningful life, regardless of their social or economic circumstances.",
  belief:
    "A little help, when given at the right time, can make a lasting difference in someone's life.",
};

export const welcome: string[] = [
  "We are a community-oriented humanitarian organisation committed to supporting vulnerable individuals, strengthening families and improving the living conditions of underserved communities.",
  "Through practical assistance, community engagement, partnerships and empowerment programmes, we work to bring hope to people facing difficult circumstances and create opportunities for a better future.",
];

export const approachIntro =
  "We believe humanitarian support should go beyond distributing relief materials. We involve community members in planning, implementation and monitoring to ensure that our interventions respond to real needs.";

export const approach: ApproachStep[] = [
  {
    step: 1,
    title: "Respond",
    description: "Identify urgent needs and provide timely assistance to people facing hardship.",
  },
  {
    step: 2,
    title: "Empower",
    description:
      "Equip individuals and families with skills, resources and opportunities to improve their circumstances.",
  },
  {
    step: 3,
    title: "Sustain",
    description:
      "Build partnerships and community structures that promote long-term development and self-reliance.",
  },
];

export const joinUs = {
  title: "Together, We Can Make a Difference!",
  body: "A better community begins when people care enough to help one another. Whether you are an individual, organisation, business, volunteer or development partner, there is a place for you in our mission.",
  slogan: "Be a helping hand. Restore hope. Transform lives.",
};

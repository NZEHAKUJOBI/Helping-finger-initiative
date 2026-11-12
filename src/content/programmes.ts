import type { Programme } from "@/domain/types";

export const programmes: Programme[] = [
  {
    slug: "humanitarian-assistance",
    letter: "A",
    title: "Humanitarian Assistance and Emergency Relief",
    summary:
      "We provide support to individuals and families facing hardship through food distribution, clothing, household essentials and emergency assistance.",
    icon: "gift",
    details: [
      "When families face sudden hardship, timely help matters. We distribute food, clothing, household essentials and relief materials to the people who need them most.",
      "We work with community leaders to identify households in urgent need, so assistance reaches those who genuinely need it.",
    ],
  },
  {
    slug: "women-and-youth-empowerment",
    letter: "B",
    title: "Women and Youth Empowerment",
    summary:
      "We support women and young people with skills acquisition, entrepreneurship training, small business development and livelihood opportunities.",
    icon: "star",
    details: [
      "Women and young people are at the heart of our work. Through vocational training, entrepreneurship support and small business development, we help them build reliable livelihoods.",
      "Our goal is lasting independence: skills and opportunities that improve households for years to come.",
    ],
  },
  {
    slug: "education-and-child-welfare",
    letter: "C",
    title: "Education and Child Welfare",
    summary:
      "We promote children's access to education through school materials, learning support, educational assistance and child protection activities.",
    icon: "book",
    details: [
      "Every child deserves the chance to learn. We provide school materials, learning support and educational assistance to disadvantaged children.",
      "We also run child protection activities that keep children safe and supported in their communities.",
    ],
  },
  {
    slug: "health-and-social-welfare",
    letter: "D",
    title: "Health and Social Welfare",
    summary:
      "We support community health outreaches, medical assistance, health awareness and access to essential healthcare services.",
    icon: "health",
    details: [
      "We reduce the burden of disease through community health outreaches, medical assistance and health awareness campaigns.",
      "We help vulnerable people reach essential healthcare services they would otherwise go without.",
    ],
  },
  {
    slug: "poverty-reduction-and-food-security",
    letter: "E",
    title: "Poverty Reduction and Food Security",
    summary:
      "We promote household food security, agricultural activities, community gardens and income-generating initiatives that improve livelihoods.",
    icon: "wheat",
    details: [
      "Food security is the foundation of a healthy household. We support agricultural activities, community gardens and income-generating initiatives.",
      "These programmes help families move from dependence to self-reliance.",
    ],
  },
  {
    slug: "support-for-vulnerable-groups",
    letter: "F",
    title: "Support for Vulnerable Groups",
    summary:
      "We provide special attention to widows, orphans, elderly people, persons with disabilities, displaced persons and economically disadvantaged households.",
    icon: "shield",
    details: [
      "Some groups are too often left behind. We give special attention to widows, orphans, elderly people, persons with disabilities and displaced persons.",
      "We advocate for their rights, protection and social inclusion while providing practical support.",
    ],
  },
  {
    slug: "community-development",
    letter: "G",
    title: "Community Development and Social Inclusion",
    summary:
      "We mobilise communities to identify their needs, participate in development activities and work together towards sustainable solutions.",
    icon: "community",
    details: [
      "Lasting change comes from within communities. We mobilise people to identify their own needs and take part in development activities.",
      "Through volunteerism, awareness campaigns and grassroots participation, communities own the solutions they build.",
    ],
  },
];

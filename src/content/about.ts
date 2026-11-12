import type { AboutContent, CoreValue } from "@/domain/types";

export const about: AboutContent = {
  intro: [
    "We are a humanitarian and community development organisation established to respond to the everyday challenges facing vulnerable individuals, families and underserved communities.",
    "We recognise that many people struggle to access basic necessities such as food, clothing, healthcare, education and economic opportunities. Our organisation exists to bridge these gaps through practical interventions that address immediate needs while promoting long-term development.",
    "We work with community leaders, volunteers, government institutions, civil society organisations, private sector partners and development agencies to identify vulnerable populations and deliver meaningful support.",
    "Our approach is community-driven. We listen to the needs of the people, involve communities in identifying solutions and promote programmes that improve lives and strengthen local capacity. We are committed to ensuring that no vulnerable person is left without hope or support.",
  ],
  vision:
    "A caring and inclusive society where everyone has the opportunity to live a dignified, healthy and productive life.",
  mission:
    "To provide humanitarian support, empower vulnerable people and strengthen communities through practical assistance, partnerships and sustainable development initiatives.",
  objectives: [
    "Provide humanitarian assistance to vulnerable individuals and families through food, clothing, shelter and essential relief materials.",
    "Promote access to basic healthcare services, medical assistance and community health education.",
    "Support disadvantaged children through educational materials, school support and child welfare programmes.",
    "Empower women and young people through vocational training, entrepreneurship and livelihood development.",
    "Promote food security, poverty reduction and household economic empowerment.",
    "Support elderly people, persons with disabilities, widows, orphans and other disadvantaged groups.",
    "Promote community development through volunteerism, awareness campaigns and grassroots participation.",
    "Advocate for the rights, protection and social inclusion of vulnerable populations.",
    "Build partnerships with government, private organisations, philanthropists and development partners to expand humanitarian services.",
  ],
  commitment: [
    "We are committed to responsible humanitarian service, transparency, accountability and respect for the people we serve.",
    "We believe that assistance should reach those who genuinely need it, and every intervention should create meaningful value for beneficiaries and their communities.",
    "Our goal is not simply to provide temporary relief but to help people regain hope, rebuild their lives and become active contributors to community development.",
  ],
  // From the organisation's constitution (Articles 12–27).
  governance: [
    {
      title: "Board of Trustees",
      description:
        "The highest organ of the organisation: women and men of integrity committed to the vision, who hold its assets, give advice and adopt the annual report and budget.",
    },
    {
      title: "Management Board",
      description:
        "Led by the State Coordinator, it implements all programmes and day-to-day activities, prepares budgets, raises funds and recruits volunteers.",
    },
    {
      title: "Volunteers",
      description:
        "Members of the public who share our vision and contribute their skills, knowledge and experience to our programmes.",
    },
  ],
  // From the constitution (Articles 33–36, 46).
  accountability: [
    "Accounts are audited annually by a competent accountant and reported to the Board of Trustees.",
    "Every bank transaction requires two signatories.",
    "All income is applied to our objectives — no portion is paid as profit to members.",
  ],
};

export const coreValues: CoreValue[] = [
  {
    title: "Compassion",
    description: "We care about people and respond to their needs with kindness and understanding.",
    icon: "heart",
  },
  {
    title: "Human Dignity",
    description: "We respect the rights, worth and dignity of every individual.",
    icon: "shield",
  },
  {
    title: "Integrity",
    description: "We uphold honesty, transparency and accountability in everything we do.",
    icon: "scale",
  },
  {
    title: "Service",
    description: "We believe in selfless service and making a positive difference in people's lives.",
    icon: "hand",
  },
  {
    title: "Inclusiveness",
    description:
      "We work to ensure that women, children, youths, elderly people and persons with disabilities are not left behind.",
    icon: "users",
  },
  {
    title: "Empowerment",
    description:
      "We help people build the confidence, skills and opportunities needed to improve their lives.",
    icon: "star",
  },
  {
    title: "Partnership",
    description: "We believe that lasting change is achieved through collaboration and collective action.",
    icon: "handshake",
  },
];

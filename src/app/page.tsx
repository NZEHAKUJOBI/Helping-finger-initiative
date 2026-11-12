import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { CTABanner } from "@/components/sections/CTABanner";
import { Hero } from "@/components/sections/Hero";
import { InvolvementGrid } from "@/components/sections/InvolvementGrid";
import { ProgrammeGrid } from "@/components/sections/ProgrammeGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { content } from "@/lib/content";

export default async function HomePage() {
  const [hero, welcome, programmes, approach, involvement, joinUs, site] = await Promise.all([
    content.getHero(),
    content.getWelcome(),
    content.getProgrammes(),
    content.getApproach(),
    content.getInvolvementOptions(),
    content.getJoinUs(),
    content.getSite(),
  ]);

  return (
    <>
      <Hero {...hero} />

      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading eyebrow="Welcome" title={`Welcome to ${site.name}`} />
          <div className="space-y-5 text-lg leading-relaxed text-ink">
            {welcome.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ButtonLink href="/about" variant="outline">
              More about us
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="What we do"
          title="Our programme areas"
          intro="Practical interventions that meet immediate needs while promoting long-term development."
        />
        <ProgrammeGrid items={programmes} />
      </Section>

      <Section tone="brand">
        <SectionHeading eyebrow="Our approach" title="Respond. Empower. Sustain." intro={approach.intro} invert />
        <ApproachSteps steps={approach.steps} />
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="How you can help"
          title="Every contribution counts. Every helping hand matters."
          align="center"
        />
        <InvolvementGrid options={involvement} />
      </Section>

      <CTABanner {...joinUs} />
    </>
  );
}

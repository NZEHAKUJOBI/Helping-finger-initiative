import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { BeneficiaryList } from "@/components/sections/BeneficiaryList";
import { CTABanner } from "@/components/sections/CTABanner";
import { Hero } from "@/components/sections/Hero";
import { ImpactStrip } from "@/components/sections/ImpactStrip";
import { InvolvementGrid } from "@/components/sections/InvolvementGrid";
import { ProgrammeGrid } from "@/components/sections/ProgrammeGrid";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { GalleryBrowser } from "@/features/gallery/GalleryBrowser";
import { NewsletterCard } from "@/features/newsletter/NewsletterCard";
import { content } from "@/lib/content";
import { getGalleryImages } from "@/lib/gallery";
import { getPublishedNewsletters } from "@/lib/newsletter";

export default async function HomePage() {
  const [hero, welcome, programmes, approach, involvement, joinUs, about, beneficiaries, photos, news] = await Promise.all([
    content.getHero(),
    content.getWelcome(),
    content.getProgrammes(),
    content.getApproach(),
    content.getInvolvementOptions(),
    content.getJoinUs(),
    content.getAbout(),
    content.getBeneficiaries(),
    getGalleryImages(9),
    getPublishedNewsletters(3),
  ]);

  const stats = [
    { value: String(programmes.length), label: "Programme areas" },
    { value: String(beneficiaries.length), label: "Priority groups we serve" },
    { value: String(about.objectives.length), label: "Organisational objectives" },
    { value: String(approach.steps.length), label: "Steps: respond, empower, sustain" },
  ];

  return (
    <>
      <Hero hero={hero} images={photos.slice(0, 3)} />
      <ImpactStrip stats={stats} />

      {/* Welcome */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="text-4xl font-medium leading-[1.08] sm:text-5xl">
              Everyone deserves a chance to live a <em className="text-brand-600">dignified</em> and meaningful life.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            {welcome.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ButtonLink href="/about" variant="outline">
              Our story <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          eyebrow="What we do"
          title="Programmes that meet today's needs and build tomorrow's"
          action={
            <ButtonLink href="/programmes" variant="outline">
              All programmes <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          }
        />
        <ProgrammeGrid items={programmes} />
      </Section>

      <QuoteBand quote={about.vision} attribution="Our vision" />

      <Section tone="forest">
        <SectionHeading eyebrow="Our approach" title="Beyond relief — towards self-reliance" intro={approach.intro} invert />
        <ApproachSteps steps={approach.steps} />
      </Section>

      {news.length > 0 && (
        <Section tone="white">
          <SectionHeading
            eyebrow="Newsletter"
            title="Latest from our work"
            action={
              <ButtonLink href="/newsletter" variant="outline">
                All newsletters <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            }
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <li key={item.id}>
                <NewsletterCard item={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {photos.length > 0 && (
        <Section tone="cream">
          <SectionHeading
            eyebrow="Gallery"
            title="Our work in pictures"
            action={
              <ButtonLink href="/gallery" variant="outline">
                View gallery <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            }
          />
          <GalleryBrowser images={photos.slice(0, 6)} filters={false} />
        </Section>
      )}

      <Section tone={photos.length > 0 ? "sand" : "cream"}>
        <SectionHeading
          eyebrow="Who we support"
          title="No vulnerable person left without hope"
          intro="Our programmes prioritise the people most likely to be left behind."
        />
        <BeneficiaryList items={beneficiaries} />
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="How you can help" title="Every helping hand matters" align="center" />
        <InvolvementGrid options={involvement} />
      </Section>

      <CTABanner {...joinUs} />
    </>
  );
}

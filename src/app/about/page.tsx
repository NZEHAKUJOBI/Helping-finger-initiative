import type { Metadata } from "next";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Our story, vision, mission, core values, objectives and governance.",
};

export default async function AboutPage() {
  const [about, values, joinUs] = await Promise.all([
    content.getAbout(),
    content.getCoreValues(),
    content.getJoinUs(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Bridging the gap between need and opportunity"
        intro="A humanitarian and community development organisation serving vulnerable individuals, families and underserved communities."
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed">
          {about.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="border-l-4 border-l-brand-500">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">Our vision</p>
            <p className="mt-3 text-xl font-semibold leading-relaxed text-brand-900">{about.vision}</p>
          </Card>
          <Card className="border-l-4 border-l-accent-400">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">Our mission</p>
            <p className="mt-3 text-xl font-semibold leading-relaxed text-brand-900">{about.mission}</p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Core values" title="What guides our work" />
        <ValuesGrid values={values} />
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Objectives" title="What we seek to achieve" />
        <ol className="grid gap-4 md:grid-cols-2">
          {about.objectives.map((o, i) => (
            <li key={o} className="flex gap-4 rounded-card border border-line p-5">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-700">
                {i + 1}
              </span>
              <span className="leading-relaxed">{o}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="brand">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Governance" title="How we are organised" invert />
            <ul className="space-y-5">
              {about.governance.map((g) => (
                <li key={g.title} className="rounded-card border border-white/15 bg-white/5 p-6">
                  <h3 className="text-lg font-bold">{g.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/80">{g.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Our commitment" title="Transparency and accountability" invert />
            <div className="space-y-4 leading-relaxed text-white/85">
              {about.commitment.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-3">
              {about.accountability.map((a) => (
                <li key={a} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent-400" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CTABanner {...joinUs} />
    </>
  );
}

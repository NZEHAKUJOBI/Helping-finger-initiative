import type { Metadata } from "next";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
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
  const [lead, ...rest] = about.intro;

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Bridging the gap between need and opportunity"
        intro="A humanitarian and community development organisation serving vulnerable individuals, families and underserved communities in Kebbi State."
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <p className="font-display text-3xl leading-snug text-brand-900 sm:text-4xl">{lead}</p>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <section className="grid md:grid-cols-2">
        <div className="grain bg-brand-800 px-6 py-20 text-white sm:px-14 lg:py-28">
          <Eyebrow invert>Our vision</Eyebrow>
          <p className="max-w-lg font-display text-3xl leading-snug sm:text-4xl">{about.vision}</p>
        </div>
        <div className="bg-accent-400 px-6 py-20 text-brand-950 sm:px-14 lg:py-28">
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-900">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-brand-900" />
            Our mission
          </p>
          <p className="max-w-lg font-display text-3xl leading-snug sm:text-4xl">{about.mission}</p>
        </div>
      </section>

      <Section tone="cream">
        <SectionHeading eyebrow="Core values" title="What guides our work" />
        <ValuesGrid values={values} />
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="Objectives" title="What we seek to achieve" />
        <ol className="grid gap-x-12 md:grid-cols-2">
          {about.objectives.map((o, i) => (
            <li key={o} className="flex gap-5 border-t border-brand-900/10 py-6">
              <span className="font-display text-3xl font-medium leading-none text-brand-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed text-ink/85">{o}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="forest">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Governance" title="How we are organised" invert />
            <ol className="space-y-4">
              {about.governance.map((g, i) => (
                <li key={g.title} className="flex gap-5 rounded-card border border-white/10 bg-white/5 p-6">
                  <span className="font-display text-2xl text-accent-300">{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium">{g.title}</h3>
                    <p className="mt-2 leading-relaxed text-white/70">{g.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Our commitment" title="Transparency and accountability" invert />
            <div className="space-y-4 leading-relaxed text-white/75">
              {about.commitment.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-3 rounded-card bg-white/5 p-6">
              {about.accountability.map((a) => (
                <li key={a} className="flex gap-3 text-white/90">
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

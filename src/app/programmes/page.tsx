import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProgrammeGrid } from "@/components/sections/ProgrammeGrid";
import { Section } from "@/components/ui/Section";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Programmes",
  description: "Humanitarian relief, empowerment, education, health, food security and community development.",
};

export default async function ProgrammesPage() {
  const programmes = await content.getProgrammes();
  return (
    <>
      <PageHeader
        eyebrow="Programme areas"
        title="Practical help today, lasting change tomorrow"
        intro="Our programmes address immediate needs while building skills, resources and community structures for the long term."
      />
      <Section>
        <ProgrammeGrid items={programmes} />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { InvolvementGrid } from "@/components/sections/InvolvementGrid";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Donate, volunteer, partner with us or spread the word.",
};

export default async function GetInvolvedPage() {
  const options = await content.getInvolvementOptions();
  return (
    <>
      <PageHeader
        eyebrow="How you can help"
        title="Every contribution counts. Every helping hand matters."
        intro="You can become part of our mission to improve lives and strengthen communities."
      />
      <Section>
        <InvolvementGrid options={options} />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { BeneficiaryList } from "@/components/sections/BeneficiaryList";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Who We Support",
  description: "The vulnerable individuals, families and communities our programmes prioritise.",
};

export default async function WhoWeSupportPage() {
  const [beneficiaries, joinUs] = await Promise.all([content.getBeneficiaries(), content.getJoinUs()]);
  return (
    <>
      <PageHeader
        eyebrow="Who we support"
        title="No vulnerable person left without hope"
        intro="Our programmes prioritise the people most likely to be left behind."
      />
      <Section>
        <BeneficiaryList items={beneficiaries} />
      </Section>
      <CTABanner {...joinUs} />
    </>
  );
}

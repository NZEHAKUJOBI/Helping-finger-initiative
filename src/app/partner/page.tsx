import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { PartnerForm } from "@/features/forms";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Collaborate with us to mobilise resources and reach more people in need.",
};

export default async function PartnerPage() {
  const partnerTypes = await content.getPartnerTypes();
  return (
    <>
      <PageHeader
        eyebrow="Partnership and collaboration"
        title="No single organisation can do it alone"
        intro="Together, we can mobilise resources, expand opportunities and reach more people in need."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="text-2xl font-extrabold">We welcome partnerships with</h2>
            <ul className="mt-6 space-y-3">
              {partnerTypes.map((t) => (
                <li key={t} className="flex gap-3">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card>
            <h2 className="mb-6 text-2xl font-extrabold">Start a conversation</h2>
            <PartnerForm />
          </Card>
        </div>
      </Section>
    </>
  );
}

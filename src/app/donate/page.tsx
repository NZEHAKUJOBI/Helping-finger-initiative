import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconBadge } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support our humanitarian and empowerment programmes through financial or material contributions.",
};

export default async function DonatePage() {
  const [site, about] = await Promise.all([content.getSite(), content.getAbout()]);
  const phone = site.contact.phones[0];

  return (
    <>
      <PageHeader
        eyebrow="Donate"
        title="A little help, at the right time, makes a lasting difference"
        intro="Support our humanitarian and empowerment programmes through financial or material contributions."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <IconBadge icon="gift" tone="accent" />
            <h2 className="mt-4 text-xl font-bold">Financial contributions</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Online giving is coming soon. In the meantime, please contact us for our official bank
              account details.
            </p>
            <ButtonLink href={`tel:${phone.replace(/\s/g, "")}`} variant="accent" className="mt-6">
              Call {phone}
            </ButtonLink>
          </Card>
          <Card>
            <IconBadge icon="hand" />
            <h2 className="mt-4 text-xl font-bold">Material donations</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Food, clothing, household essentials, school materials and relief items help us respond
              quickly to families in need. Get in touch to arrange a drop-off at our office.
            </p>
            <ButtonLink href="/contact" variant="outline" className="mt-6">
              Arrange a donation
            </ButtonLink>
          </Card>
        </div>

        <div className="mt-10 rounded-card bg-brand-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold">Your gift is accounted for</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
            {about.accountability.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}

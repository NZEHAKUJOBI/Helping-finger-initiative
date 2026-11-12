import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card, IconBadge } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/features/forms";
import { content } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, visit or write to us in Birnin Kebbi, Kebbi State.",
};

export default async function ContactPage() {
  const { contact } = await content.getSite();
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="We'd love to hear from you"
        intro="Whether you need support, want to help or have a question, reach out to our team."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-5">
            <Card className="flex gap-4">
              <IconBadge icon="phone" />
              <div>
                <h2 className="font-bold">Call</h2>
                {contact.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block text-muted hover:text-brand-700">
                    {p}
                  </a>
                ))}
              </div>
            </Card>
            {contact.email && (
              <Card className="flex gap-4">
                <IconBadge icon="mail" />
                <div>
                  <h2 className="font-bold">Email</h2>
                  <a href={`mailto:${contact.email}`} className="text-muted hover:text-brand-700">
                    {contact.email}
                  </a>
                </div>
              </Card>
            )}
            <Card className="flex gap-4">
              <IconBadge icon="map" tone="accent" />
              <div>
                <h2 className="font-bold">Visit</h2>
                <address className="not-italic text-muted">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </Card>
          </div>
          <Card>
            <h2 className="mb-6 text-2xl font-extrabold">Send us a message</h2>
            <ContactForm />
          </Card>
        </div>
      </Section>
    </>
  );
}

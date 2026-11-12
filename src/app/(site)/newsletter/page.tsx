import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { NewsletterCard } from "@/features/newsletter/NewsletterCard";
import { getPublishedNewsletters } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "News and stories from our outreaches, trainings and community programmes across Kebbi State.",
};

export default async function NewsletterPage() {
  const [latest, ...rest] = await getPublishedNewsletters();

  return (
    <>
      <PageHeader
        eyebrow="Newsletter"
        title="News from the field"
        intro="Stories and photos from our outreaches, trainings and community programmes."
      />
      <Section>
        {!latest ? (
          <div className="mx-auto max-w-lg rounded-card border-2 border-dashed border-line bg-white px-8 py-16 text-center">
            <Icon name="news" className="mx-auto size-12 text-brand-300" />
            <h2 className="mt-5 text-3xl font-medium">Stories coming soon</h2>
            <p className="mt-3 text-muted">
              We are writing up our recent activities. In the meantime, see how you can be part of the story.
            </p>
            <ButtonLink href="/get-involved" className="mt-8">
              Get involved
            </ButtonLink>
          </div>
        ) : (
          <>
            <NewsletterCard item={latest} featured />
            {rest.length > 0 && (
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <li key={item.id}>
                    <NewsletterCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Section>
    </>
  );
}

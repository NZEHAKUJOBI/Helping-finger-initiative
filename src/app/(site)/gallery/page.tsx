import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { GalleryBrowser } from "@/features/gallery/GalleryBrowser";
import { getGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from our outreaches, trainings and community programmes across Kebbi State.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments of hope, captured"
        intro="Scenes from our outreaches, trainings, school support and community programmes."
      />
      <Section>
        {images.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-card border-2 border-dashed border-line bg-white px-8 py-16 text-center">
            <Icon name="image" className="mx-auto size-12 text-brand-300" />
            <h2 className="mt-5 text-3xl font-medium">Photos coming soon</h2>
            <p className="mt-3 text-muted">
              We are gathering pictures from our recent programmes. In the meantime, see how you can be part of the story.
            </p>
            <ButtonLink href="/get-involved" className="mt-8">
              Get involved
            </ButtonLink>
          </div>
        ) : (
          <GalleryBrowser images={images} />
        )}
      </Section>
    </>
  );
}

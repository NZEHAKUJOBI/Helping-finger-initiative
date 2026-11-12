import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABanner } from "@/components/sections/CTABanner";
import { Icon } from "@/components/ui/Icon";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { GALLERY_CATEGORIES, type GalleryImage } from "@/domain/types";
import { GalleryBrowser } from "@/features/gallery/GalleryBrowser";
import { NewsletterCard } from "@/features/newsletter/NewsletterCard";
import { content } from "@/lib/content";
import { coverOf, formatEventDate, getPublishedNewsletter, getPublishedNewsletters, parseBody } from "@/lib/newsletter";

/** Cache Components needs at least one param; a placeholder covers an empty newsletter list at build time. */
const PLACEHOLDER = "__none__";

export async function generateStaticParams() {
  const items = await getPublishedNewsletters();
  return items.length ? items.map((n) => ({ slug: n.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/newsletter/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedNewsletter(slug);
  if (!item) return {};
  const cover = coverOf(item);
  return {
    title: item.title,
    description: item.summary,
    openGraph: { title: item.title, description: item.summary, images: cover ? [cover.src] : undefined },
  };
}

export default async function NewsletterIssuePage({ params }: PageProps<"/newsletter/[slug]">) {
  const { slug } = await params;
  const [item, all, joinUs] = await Promise.all([
    getPublishedNewsletter(slug),
    getPublishedNewsletters(),
    content.getJoinUs(),
  ]);
  if (!item) notFound();

  const cover = coverOf(item);
  const category = GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label;
  const blocks = parseBody(item.body);
  const photos: GalleryImage[] = item.photos.map((p) => ({ ...p, category: item.category, createdAt: item.createdAt }));
  const more = all.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <Container className="relative pb-12 pt-12 sm:pt-16">
          <Link href="/newsletter" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Icon name="arrow-right" className="size-4 rotate-180" /> All newsletters
          </Link>
          <div className="mt-6 max-w-3xl animate-rise">
            {category && <Eyebrow>{category}</Eyebrow>}
            <h1 className="text-4xl font-medium leading-[1.05] sm:text-6xl">{item.title}</h1>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-muted">
              <span className="inline-flex items-center gap-2">
                <Icon name="calendar" className="size-5 text-brand-600" />
                <time dateTime={item.eventDate}>{formatEventDate(item.eventDate)}</time>
              </span>
              {item.location && (
                <span className="inline-flex items-center gap-2">
                  <Icon name="map" className="size-5 text-brand-600" />
                  {item.location}
                </span>
              )}
            </p>
          </div>
          {cover && (
            /* eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload */
            <img
              src={cover.src}
              alt={cover.caption}
              width={cover.width}
              height={cover.height}
              className="mt-10 max-h-[70vh] w-full rounded-card object-cover shadow-soft"
            />
          )}
        </Container>
        <div aria-hidden className="flex h-1.5">
          <div className="flex-[3] bg-brand-500" />
          <div className="flex-1 bg-accent-400" />
        </div>
      </section>

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-2xl leading-snug text-brand-900 sm:text-3xl">{item.summary}</p>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/80">
            {blocks.map((block, i) =>
              block.kind === "heading" ? (
                <h2 key={i} className="pt-4 text-3xl font-medium text-brand-900">
                  {block.text}
                </h2>
              ) : block.kind === "list" ? (
                <ul key={i} className="list-disc space-y-2 pl-6 marker:text-accent-400">
                  {block.items.map((text, j) => (
                    <li key={j}>{text}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          </div>
        </div>
      </Section>

      {photos.length > 0 && (
        <Section tone="cream">
          <h2 className="mb-10 text-4xl font-medium">Photos from the day</h2>
          <GalleryBrowser images={photos} filters={false} />
        </Section>
      )}

      {more.length > 0 && (
        <Section tone="sand">
          <h2 className="mb-10 text-4xl font-medium">More from our newsletter</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((n) => (
              <li key={n.id}>
                <NewsletterCard item={n} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CTABanner {...joinUs} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { uploadNewsletterPhotos } from "@/app/admin/newsletter-actions";
import { Icon } from "@/components/ui/Icon";
import { Uploader } from "@/features/admin/Uploader";
import { DeleteNewsletterButton } from "@/features/admin/newsletter/DeleteNewsletterButton";
import { NewsletterEditor } from "@/features/admin/newsletter/NewsletterEditor";
import { NewsletterPhotoCard } from "@/features/admin/newsletter/NewsletterPhotoCard";
import { requireAdmin } from "@/lib/auth/session";
import { coverOf, newsletterRepo } from "@/lib/newsletter";

export const metadata: Metadata = { title: "Edit newsletter" };

export default async function EditNewsletterPage({ params }: PageProps<"/admin/newsletters/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const n = await newsletterRepo.get(id);
  if (!n) notFound();
  const cover = coverOf(n);

  return (
    <>
      <Link href="/admin/newsletters" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
        <Icon name="arrow-right" className="size-4 rotate-180" /> All newsletters
      </Link>

      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-600">{n.status === "published" ? "Published" : "Draft"}</p>
          <h1 className="mt-1 text-4xl font-medium">{n.title}</h1>
        </div>
        {n.status === "published" && (
          <Link
            href={`/newsletter/${n.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
          >
            <Icon name="eye" className="size-4" /> View on website
          </Link>
        )}
      </header>

      <section className="mt-8">
        <NewsletterEditor newsletter={n} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-medium">
          Photos <span className="text-base font-normal text-muted">({n.photos.length})</span>
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          The cover photo leads the newsletter and shows on the home page. Upload up to 30 photos per newsletter.
        </p>

        <Uploader action={uploadNewsletterPhotos} withCategory={false}>
          <input type="hidden" name="id" value={n.id} />
          <label className="flex h-11 items-center gap-2 text-sm font-medium text-brand-900">
            <input type="checkbox" name="addToGallery" defaultChecked className="size-4 accent-brand-700" />
            Also add to the gallery
          </label>
        </Uploader>

        {n.photos.length > 0 && (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {n.photos.map((photo) => (
              <li key={photo.id}>
                <NewsletterPhotoCard newsletterId={n.id} photo={photo} isCover={photo.id === cover?.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16 flex justify-end border-t border-line pt-6">
        <DeleteNewsletterButton id={n.id} />
      </section>
    </>
  );
}

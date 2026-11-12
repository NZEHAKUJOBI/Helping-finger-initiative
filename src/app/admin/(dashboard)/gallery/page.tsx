import type { Metadata } from "next";
import { AdminImageCard } from "@/features/admin/AdminImageCard";
import { Uploader } from "@/features/admin/Uploader";
import { requireAdmin } from "@/lib/auth/session";
import { useBlobStorage } from "@/lib/storage";
import { galleryRepo } from "@/lib/gallery";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  await requireAdmin();
  const images = await galleryRepo.list();

  return (
    <>
      <header>
        <p className="text-sm font-semibold text-brand-600">Content</p>
        <h1 className="mt-1 text-4xl font-medium">Gallery</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Photos you upload here appear on the public gallery and the home page. Images are resized
          automatically and location data from phones is removed.
        </p>
      </header>

      <section className="mt-8">
        <Uploader direct={useBlobStorage} />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-medium">
          All photos <span className="text-base font-normal text-muted">({images.length})</span>
        </h2>
        {images.length === 0 ? (
          <p className="text-muted">No photos yet — your uploads will appear here.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <li key={img.id}>
                <AdminImageCard image={img} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

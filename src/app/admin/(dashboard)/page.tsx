import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES } from "@/domain/types";
import { requireAdmin } from "@/lib/auth/session";
import { galleryRepo } from "@/lib/gallery";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const images = await galleryRepo.list();
  const usedCategories = new Set(images.map((i) => i.category)).size;
  const latest = images[0]?.createdAt;

  const stats = [
    { label: "Photos in gallery", value: images.length },
    { label: "Categories used", value: `${usedCategories} / ${GALLERY_CATEGORIES.length}` },
    {
      label: "Last upload",
      value: latest
        ? new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeZone: "Africa/Lagos" }).format(new Date(latest))
        : "—",
    },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-600">Welcome back</p>
          <h1 className="mt-1 text-4xl font-medium">Website overview</h1>
        </div>
        <ButtonLink href="/admin/gallery" variant="accent">
          <Icon name="upload" className="size-4" /> Upload photos
        </ButtonLink>
      </header>

      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-white p-6">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-2 font-display text-3xl text-brand-900">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-medium">Recent photos</h2>
          <Link href="/admin/gallery" className="text-sm font-semibold text-brand-700 hover:underline">
            Manage gallery →
          </Link>
        </div>
        {images.length === 0 ? (
          <div className="rounded-card border-2 border-dashed border-line bg-white p-10 text-center">
            <Icon name="image" className="mx-auto size-10 text-brand-300" />
            <p className="mt-3 font-semibold text-brand-900">No photos yet</p>
            <p className="mt-1 text-sm text-muted">Upload your first photos to bring the website to life.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {images.slice(0, 6).map((img) => (
              <li key={img.id} className="aspect-square overflow-hidden rounded-xl bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised thumbnails */}
                <img src={img.thumbSrc} alt={img.caption} className="size-full object-cover" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

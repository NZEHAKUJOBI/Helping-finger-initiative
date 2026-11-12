import { galleryRepo, imageStorage } from "@/lib/gallery";
import { newsletterRepo } from "@/lib/newsletter";

/**
 * A stored image can be used by the gallery and by newsletters at the same time.
 * Call this after removing one reference: the files are deleted only when nothing else uses them.
 */
export async function releaseImageIfUnused(id: string) {
  const [gallery, newsletters] = await Promise.all([galleryRepo.list(), newsletterRepo.list()]);
  const inUse =
    gallery.some((img) => img.id === id) || newsletters.some((n) => n.photos.some((p) => p.id === id));
  if (!inUse) await imageStorage.remove(id);
}

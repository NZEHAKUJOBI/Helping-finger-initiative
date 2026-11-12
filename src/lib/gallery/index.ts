import { cacheLife, cacheTag } from "next/cache";
import type { GalleryImage } from "@/domain/types";
import { JsonGalleryRepository, type GalleryRepository } from "./GalleryRepository";
import { LocalImageStorage, type ImageStorage } from "./ImageStorage";

export const GALLERY_TAG = "gallery";

/** Composition root: the one place that picks gallery adapters. */
export const galleryRepo: GalleryRepository = new JsonGalleryRepository();
export const imageStorage: ImageStorage = new LocalImageStorage();

/** Cached read for public pages; admin actions call updateTag(GALLERY_TAG) after changes. */
export async function getGalleryImages(limit?: number): Promise<GalleryImage[]> {
  "use cache";
  cacheTag(GALLERY_TAG);
  cacheLife("minutes");
  const images = await galleryRepo.list();
  return limit ? images.slice(0, limit) : images;
}

export { ImageValidationError, MAX_UPLOAD_BYTES } from "./ImageStorage";

import type { GalleryImage } from "@/domain/types";
import { createJsonStore, type JsonStore } from "@/lib/jsonStore";

/** Repository for gallery metadata. Swap JsonGalleryRepository for a database-backed one later. */
export interface GalleryRepository {
  list(): Promise<GalleryImage[]>;
  addMany(images: GalleryImage[]): Promise<void>;
  update(id: string, patch: Partial<Pick<GalleryImage, "caption" | "category">>): Promise<GalleryImage | null>;
  remove(id: string): Promise<GalleryImage | null>;
}

/** Stores the gallery index as one JSON document (local disk or Vercel Blob, see createJsonStore). */
export class JsonGalleryRepository implements GalleryRepository {
  private readonly store: JsonStore<GalleryImage> = createJsonStore<GalleryImage>("gallery.json");

  async list(): Promise<GalleryImage[]> {
    const items = await this.store.read();
    return items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  addMany(images: GalleryImage[]) {
    return this.store.mutate((items) => {
      items.push(...images);
    });
  }

  async update(id: string, patch: Partial<Pick<GalleryImage, "caption" | "category">>) {
    let updated: GalleryImage | null = null;
    await this.store.mutate((items) => {
      updated = null; // reset on retry
      const item = items.find((i) => i.id === id);
      if (item) {
        Object.assign(item, patch);
        updated = { ...item };
      }
    });
    return updated;
  }

  async remove(id: string) {
    let removed: GalleryImage | null = null;
    await this.store.mutate((items) => {
      removed = null;
      const index = items.findIndex((i) => i.id === id);
      if (index >= 0) removed = items.splice(index, 1)[0];
    });
    return removed;
  }
}

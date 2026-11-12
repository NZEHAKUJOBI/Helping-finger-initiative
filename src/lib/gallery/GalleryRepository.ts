import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GalleryImage } from "@/domain/types";
import { storageDir } from "@/lib/storage";

/** Repository for gallery metadata. Swap JsonGalleryRepository for a database-backed one later. */
export interface GalleryRepository {
  list(): Promise<GalleryImage[]>;
  addMany(images: GalleryImage[]): Promise<void>;
  update(id: string, patch: Partial<Pick<GalleryImage, "caption" | "category">>): Promise<GalleryImage | null>;
  remove(id: string): Promise<GalleryImage | null>;
}

/**
 * Stores the gallery index as one JSON file. Writes are serialised in-process and
 * written atomically (temp file + rename) so a crash never leaves a half-written index.
 */
export class JsonGalleryRepository implements GalleryRepository {
  private readonly file = path.join(storageDir, "gallery.json");
  private queue: Promise<unknown> = Promise.resolve();

  async list(): Promise<GalleryImage[]> {
    try {
      const raw = await readFile(this.file, "utf8");
      const items = JSON.parse(raw) as GalleryImage[];
      return items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  addMany(images: GalleryImage[]) {
    return this.mutate((items) => {
      items.push(...images);
    });
  }

  async update(id: string, patch: Partial<Pick<GalleryImage, "caption" | "category">>) {
    let updated: GalleryImage | null = null;
    await this.mutate((items) => {
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
    await this.mutate((items) => {
      const index = items.findIndex((i) => i.id === id);
      if (index >= 0) removed = items.splice(index, 1)[0];
    });
    return removed;
  }

  private mutate(fn: (items: GalleryImage[]) => void): Promise<void> {
    const run = this.queue.then(async () => {
      const items = await this.list();
      fn(items);
      await mkdir(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.${process.pid}.tmp`;
      await writeFile(tmp, JSON.stringify(items, null, 2));
      await rename(tmp, this.file);
    });
    this.queue = run.catch(() => undefined);
    return run;
  }
}

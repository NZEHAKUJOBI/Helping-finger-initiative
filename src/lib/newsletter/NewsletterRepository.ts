import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Newsletter } from "@/domain/types";
import { storageDir } from "@/lib/storage";

/** Repository for newsletter issues. Swap JsonNewsletterRepository for a database-backed one later. */
export interface NewsletterRepository {
  /** All issues (drafts included), newest first. */
  list(): Promise<Newsletter[]>;
  get(id: string): Promise<Newsletter | null>;
  getBySlug(slug: string): Promise<Newsletter | null>;
  create(item: Newsletter): Promise<void>;
  /** Applies `fn` to the stored issue and saves it. Returns the updated copy, or null if it no longer exists. */
  update(id: string, fn: (item: Newsletter) => void): Promise<Newsletter | null>;
  remove(id: string): Promise<Newsletter | null>;
}

/** Newest activity first; undated drafts fall back to when they were created. */
function byNewest(a: Newsletter, b: Newsletter) {
  const ka = a.publishedAt ?? a.createdAt;
  const kb = b.publishedAt ?? b.createdAt;
  return b.eventDate.localeCompare(a.eventDate) || kb.localeCompare(ka);
}

/**
 * Stores every issue in one JSON file next to the gallery index. Writes are serialised
 * in-process and written atomically (temp file + rename), like JsonGalleryRepository.
 */
export class JsonNewsletterRepository implements NewsletterRepository {
  private readonly file = path.join(storageDir, "newsletters.json");
  private queue: Promise<unknown> = Promise.resolve();

  async list(): Promise<Newsletter[]> {
    return (await this.read()).toSorted(byNewest);
  }

  async get(id: string) {
    return (await this.read()).find((n) => n.id === id) ?? null;
  }

  async getBySlug(slug: string) {
    return (await this.read()).find((n) => n.slug === slug) ?? null;
  }

  create(item: Newsletter) {
    return this.mutate((items) => {
      items.push(item);
    });
  }

  async update(id: string, fn: (item: Newsletter) => void) {
    let updated: Newsletter | null = null;
    await this.mutate((items) => {
      const item = items.find((n) => n.id === id);
      if (item) {
        fn(item);
        item.updatedAt = new Date().toISOString();
        updated = structuredClone(item);
      }
    });
    return updated;
  }

  async remove(id: string) {
    let removed: Newsletter | null = null;
    await this.mutate((items) => {
      const index = items.findIndex((n) => n.id === id);
      if (index >= 0) removed = items.splice(index, 1)[0];
    });
    return removed;
  }

  private async read(): Promise<Newsletter[]> {
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as Newsletter[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  private mutate(fn: (items: Newsletter[]) => void): Promise<void> {
    const run = this.queue.then(async () => {
      const items = await this.read();
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

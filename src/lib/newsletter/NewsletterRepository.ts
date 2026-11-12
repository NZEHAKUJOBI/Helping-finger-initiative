import type { Newsletter } from "@/domain/types";
import { createJsonStore, type JsonStore } from "@/lib/jsonStore";

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

/** Stores every issue in one JSON document (local disk or Vercel Blob, see createJsonStore). */
export class JsonNewsletterRepository implements NewsletterRepository {
  private readonly store: JsonStore<Newsletter> = createJsonStore<Newsletter>("newsletters.json");

  async list(): Promise<Newsletter[]> {
    return (await this.store.read()).toSorted(byNewest);
  }

  async get(id: string) {
    return (await this.store.read()).find((n) => n.id === id) ?? null;
  }

  async getBySlug(slug: string) {
    return (await this.store.read()).find((n) => n.slug === slug) ?? null;
  }

  create(item: Newsletter) {
    return this.store.mutate((items) => {
      items.push(structuredClone(item));
    });
  }

  async update(id: string, fn: (item: Newsletter) => void) {
    let updated: Newsletter | null = null;
    await this.store.mutate((items) => {
      updated = null; // reset on retry
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
    await this.store.mutate((items) => {
      removed = null;
      const index = items.findIndex((n) => n.id === id);
      if (index >= 0) removed = items.splice(index, 1)[0];
    });
    return removed;
  }
}

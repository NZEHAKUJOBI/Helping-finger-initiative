import { cacheLife, cacheTag } from "next/cache";
import type { Newsletter, NewsletterPhoto } from "@/domain/types";
import { JsonNewsletterRepository, type NewsletterRepository } from "./NewsletterRepository";

export const NEWSLETTER_TAG = "newsletters";

/** Composition root: the one place that picks the newsletter adapter. */
export const newsletterRepo: NewsletterRepository = new JsonNewsletterRepository();

/** Cached read of published issues for public pages; admin actions call updateTag(NEWSLETTER_TAG). */
export async function getPublishedNewsletters(limit?: number): Promise<Newsletter[]> {
  "use cache";
  cacheTag(NEWSLETTER_TAG);
  cacheLife("minutes");
  const items = (await newsletterRepo.list()).filter((n) => n.status === "published");
  return limit ? items.slice(0, limit) : items;
}

export async function getPublishedNewsletter(slug: string): Promise<Newsletter | null> {
  "use cache";
  cacheTag(NEWSLETTER_TAG);
  cacheLife("minutes");
  const item = await newsletterRepo.getBySlug(slug);
  return item?.status === "published" ? item : null;
}

export function coverOf(item: Newsletter): NewsletterPhoto | null {
  return item.photos.find((p) => p.id === item.coverId) ?? item.photos[0] ?? null;
}

export function formatEventDate(date: string) {
  // Dates are stored as YYYY-MM-DD; format at noon UTC so no timezone shifts the day.
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function slugify(title: string) {
  return (
    title
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70)
      .replace(/-+$/g, "") || "newsletter"
  );
}

export type BodyBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

/**
 * Turns the plain-text body into blocks. Rendered as React text, never as HTML,
 * so nothing an admin types can inject markup.
 */
export function parseBody(body: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  for (const chunk of body.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    let paragraph: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      if (list.length) blocks.push({ kind: "list", items: list });
      paragraph = [];
      list = [];
    };
    for (const line of lines) {
      if (line.startsWith("## ")) {
        flush();
        blocks.push({ kind: "heading", text: line.slice(3).trim() });
      } else if (/^[-*•] /.test(line)) {
        if (paragraph.length) flush();
        list.push(line.slice(2).trim());
      } else {
        if (list.length) flush();
        paragraph.push(line);
      }
    }
    flush();
  }
  return blocks;
}

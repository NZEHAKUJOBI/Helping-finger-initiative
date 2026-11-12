import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { content } from "@/lib/content";
import { getPublishedNewsletters } from "@/lib/newsletter";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programmes, newsletters] = await Promise.all([content.getProgrammes(), getPublishedNewsletters()]);
  const routes = [
    "",
    "/about",
    "/programmes",
    "/who-we-support",
    "/get-involved",
    "/partner",
    "/volunteer",
    "/donate",
    "/contact",
    "/gallery",
    "/newsletter",
    ...newsletters.map((n) => `/newsletter/${n.slug}`),
    ...programmes.map((p) => `/programmes/${p.slug}`),
  ];
  return routes.map((route) => ({ url: `${site.url}${route}` }));
}

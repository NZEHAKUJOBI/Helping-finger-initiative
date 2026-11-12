import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { content } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programmes = await content.getProgrammes();
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
    ...programmes.map((p) => `/programmes/${p.slug}`),
  ];
  return routes.map((route) => ({ url: `${site.url}${route}` }));
}

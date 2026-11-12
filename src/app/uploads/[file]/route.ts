import { imageStorage } from "@/lib/gallery";

/** Serves uploaded images from persistent storage (public/ is fixed at build time). */
export async function GET(_request: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  const data = await imageStorage.read(file);
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/webp",
      // File names are unique per image, so browsers and the CDN (Vercel) may keep them forever.
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

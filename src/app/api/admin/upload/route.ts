import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/auth/session";
import { MAX_UPLOAD_BYTES } from "@/lib/gallery";
import { useBlobStorage } from "@/lib/storage";
import { isIncomingPath } from "@/lib/uploads";

/**
 * Gives the admin's browser a short-lived token to upload one photo straight to Vercel Blob
 * (Vercel limits requests to our own functions to 4.5 MB). Only signed-in admins get a token,
 * only for images up to 10 MB, and only under incoming/. The upload action then processes them.
 */
export async function POST(request: Request) {
  if (!useBlobStorage) return Response.json({ error: "Blob storage is not configured." }, { status: 404 });

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Not signed in.");
        if (!isIncomingPath(pathname)) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: ["image/*"],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}

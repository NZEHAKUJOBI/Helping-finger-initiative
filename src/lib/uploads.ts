import { del, get } from "@vercel/blob";
import { z } from "zod";
import { ImageValidationError, MAX_UPLOAD_BYTES, type IncomingImage } from "@/lib/gallery/ImageStorage";
import { useBlobStorage } from "@/lib/storage";

/** Browser uploads to Vercel Blob land here; the server processes them and then deletes the originals. */
export const INCOMING_PREFIX = "incoming/";

/** Only pathnames the upload route allowed (incoming/…), with no path tricks. */
export function isIncomingPath(pathname: string) {
  return pathname.startsWith(INCOMING_PREFIX) && !pathname.includes("..") && pathname.length < 300;
}

export class UploadError extends Error {}

export interface IncomingUpload {
  images: IncomingImage[];
  /** Deletes the Blob originals (no-op for form uploads). */
  discard(): Promise<void>;
}

/** A message safe to show the admin; unexpected errors are logged and replaced with a generic one. */
export function uploadErrorMessage(error: unknown, area: string): string {
  if (error instanceof UploadError || error instanceof ImageValidationError) return error.message;
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? "Please check the captions.";
  console.error(`[${area}] upload failed`, error);
  return "Upload failed. Please try again.";
}

/**
 * Collects the photos sent to an upload action, wherever they were sent:
 * - local disk mode: the files are in the form (`files`);
 * - Vercel Blob mode: the browser already uploaded them to Blob and sends their pathnames (`blobs`),
 *   because Vercel limits a request to 4.5 MB.
 * Call `discard()` when finished to delete the Blob originals.
 */
export async function readIncomingImages(formData: FormData): Promise<IncomingUpload> {
  const blobPaths = formData.getAll("blobs").map(String).filter(Boolean);
  const discard = async () => {
    if (blobPaths.length) await del(blobPaths.filter(isIncomingPath)).catch(() => undefined);
  };

  if (blobPaths.length === 0) {
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const images: IncomingImage[] = await Promise.all(
      files.map(async (f) => ({ name: f.name, data: Buffer.from(await f.arrayBuffer()) })),
    );
    return { images, discard };
  }

  if (!useBlobStorage || blobPaths.length > 30 || !blobPaths.every(isIncomingPath)) {
    await discard();
    throw new UploadError("Upload failed. Please try again.");
  }

  try {
    const images = await Promise.all(
      blobPaths.map(async (pathname): Promise<IncomingImage> => {
        const name = pathname.slice(INCOMING_PREFIX.length).replace(/-[A-Za-z0-9]{20,}(?=\.[^.]+$)/, "");
        const result = await get(pathname, { access: "private", useCache: false });
        if (!result || result.statusCode !== 200) throw new UploadError(`"${name}" did not finish uploading.`);
        if (result.blob.size > MAX_UPLOAD_BYTES) throw new UploadError(`"${name}" is larger than 10 MB.`);
        return { name, data: Buffer.from(await new Response(result.stream).arrayBuffer()) };
      }),
    );
    return { images, discard };
  } catch (error) {
    await discard();
    throw error;
  }
}

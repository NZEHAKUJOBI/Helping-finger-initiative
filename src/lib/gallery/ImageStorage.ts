import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, get, put } from "@vercel/blob";
import sharp, { type Metadata } from "sharp";
import { storageDir } from "@/lib/storage";

export interface StoredImage {
  id: string;
  src: string;
  thumbSrc: string;
  width: number;
  height: number;
}

/** An uploaded original, before processing. */
export interface IncomingImage {
  name: string;
  data: Buffer;
}

/**
 * Adapter for where image bytes live. LocalImageStorage writes to disk (VPS / Docker volume);
 * BlobImageStorage writes to a private Vercel Blob store. Both serve images at /uploads/<file>.
 */
export interface ImageStorage {
  save(image: IncomingImage): Promise<StoredImage>;
  remove(id: string): Promise<void>;
  read(fileName: string): Promise<Buffer | null>;
}

export class ImageValidationError extends Error {}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB per image
const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif"]);
const FULL_MAX = 1920;
const THUMB_MAX = 720;
const ID = /^[0-9a-f-]{36}$/;
const FILE_NAME = /^[0-9a-f-]{36}(-thumb)?\.webp$/;

interface ProcessedImage {
  id: string;
  full: Buffer;
  thumb: Buffer;
  width: number;
  height: number;
}

/** Validates an upload and produces a 1920px and a 720px WebP. Output has no EXIF data (incl. phone GPS). */
async function processImage({ name, data }: IncomingImage): Promise<ProcessedImage> {
  if (data.length === 0) throw new ImageValidationError(`"${name}" is empty.`);
  if (data.length > MAX_UPLOAD_BYTES) throw new ImageValidationError(`"${name}" is larger than 10 MB.`);

  let meta: Metadata;
  try {
    meta = await sharp(data).metadata();
  } catch {
    throw new ImageValidationError(`"${name}" is not a readable image.`);
  }
  if (!meta.format || !ACCEPTED_FORMATS.has(meta.format)) {
    throw new ImageValidationError(`"${name}" must be a JPG, PNG, WebP or HEIC image.`);
  }

  // rotate() applies EXIF orientation; sharp strips EXIF from the output by default.
  const base = sharp(data).rotate();
  const full = await base
    .clone()
    .resize(FULL_MAX, FULL_MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const thumb = await base
    .clone()
    .resize(THUMB_MAX, THUMB_MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 74 })
    .toBuffer();

  return { id: randomUUID(), full: full.data, thumb, width: full.info.width, height: full.info.height };
}

function toStored(p: ProcessedImage): StoredImage {
  return { id: p.id, src: `/uploads/${p.id}.webp`, thumbSrc: `/uploads/${p.id}-thumb.webp`, width: p.width, height: p.height };
}

export class LocalImageStorage implements ImageStorage {
  private readonly dir = path.join(storageDir, "uploads");

  async save(image: IncomingImage): Promise<StoredImage> {
    const p = await processImage(image);
    await mkdir(this.dir, { recursive: true });
    await Promise.all([
      writeFile(path.join(this.dir, `${p.id}.webp`), p.full),
      writeFile(path.join(this.dir, `${p.id}-thumb.webp`), p.thumb),
    ]);
    return toStored(p);
  }

  async remove(id: string): Promise<void> {
    if (!ID.test(id)) return;
    await Promise.all([
      rm(path.join(this.dir, `${id}.webp`), { force: true }),
      rm(path.join(this.dir, `${id}-thumb.webp`), { force: true }),
    ]);
  }

  async read(fileName: string): Promise<Buffer | null> {
    if (!FILE_NAME.test(fileName)) return null;
    try {
      return await readFile(path.join(this.dir, fileName));
    } catch {
      return null;
    }
  }
}

/** Processed images live under `images/` in a private Blob store and are served through /uploads/<file>. */
export class BlobImageStorage implements ImageStorage {
  async save(image: IncomingImage): Promise<StoredImage> {
    const p = await processImage(image);
    const options = { access: "private", contentType: "image/webp", addRandomSuffix: false } as const;
    await Promise.all([
      put(`images/${p.id}.webp`, p.full, options),
      put(`images/${p.id}-thumb.webp`, p.thumb, options),
    ]);
    return toStored(p);
  }

  async remove(id: string): Promise<void> {
    if (!ID.test(id)) return;
    await del([`images/${id}.webp`, `images/${id}-thumb.webp`]);
  }

  async read(fileName: string): Promise<Buffer | null> {
    if (!FILE_NAME.test(fileName)) return null;
    const result = await get(`images/${fileName}`, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }
}

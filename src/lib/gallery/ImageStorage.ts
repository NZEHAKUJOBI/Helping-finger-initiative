import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp, { type Metadata } from "sharp";
import { storageDir } from "@/lib/storage";

export interface StoredImage {
  id: string;
  src: string;
  thumbSrc: string;
  width: number;
  height: number;
}

/**
 * Adapter for where image bytes live. LocalImageStorage writes to disk (VPS / Docker volume);
 * a CloudinaryImageStorage or S3ImageStorage can implement the same interface for serverless hosting.
 */
export interface ImageStorage {
  save(file: File): Promise<StoredImage>;
  remove(id: string): Promise<void>;
  read(fileName: string): Promise<Buffer | null>;
}

export class ImageValidationError extends Error {}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB per image
const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif"]);
const FULL_MAX = 1920;
const THUMB_MAX = 720;
const FILE_NAME = /^[0-9a-f-]{36}(-thumb)?\.webp$/;

export class LocalImageStorage implements ImageStorage {
  private readonly dir = path.join(storageDir, "uploads");

  async save(file: File): Promise<StoredImage> {
    if (file.size === 0) throw new ImageValidationError(`"${file.name}" is empty.`);
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new ImageValidationError(`"${file.name}" is larger than 10 MB.`);
    }

    const input = Buffer.from(await file.arrayBuffer());
    let meta: Metadata;
    try {
      meta = await sharp(input).metadata();
    } catch {
      throw new ImageValidationError(`"${file.name}" is not a readable image.`);
    }
    if (!meta.format || !ACCEPTED_FORMATS.has(meta.format)) {
      throw new ImageValidationError(`"${file.name}" must be a JPG, PNG, WebP or HEIC image.`);
    }

    const id = randomUUID();
    await mkdir(this.dir, { recursive: true });

    // rotate() applies EXIF orientation; sharp strips EXIF (incl. GPS) from the output by default.
    const base = sharp(input).rotate();
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

    await Promise.all([
      writeFile(path.join(this.dir, `${id}.webp`), full.data),
      writeFile(path.join(this.dir, `${id}-thumb.webp`), thumb),
    ]);

    return {
      id,
      src: `/uploads/${id}.webp`,
      thumbSrc: `/uploads/${id}-thumb.webp`,
      width: full.info.width,
      height: full.info.height,
    };
  }

  async remove(id: string): Promise<void> {
    if (!/^[0-9a-f-]{36}$/.test(id)) return;
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

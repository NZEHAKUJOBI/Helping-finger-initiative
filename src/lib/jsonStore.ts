import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { storageDir, useBlobStorage } from "@/lib/storage";

/**
 * A small list of records saved as one JSON document (gallery index, newsletters).
 * Repositories depend on this interface, so the same code runs on a disk or on Vercel Blob.
 */
export interface JsonStore<T> {
  read(): Promise<T[]>;
  /** Reads the latest list, applies `fn`, and saves it. Concurrent writes never overwrite each other. */
  mutate(fn: (items: T[]) => void): Promise<void>;
}

/** Writes are serialised in-process and atomic (temp file + rename), so a crash never leaves a half-written file. */
class FileJsonStore<T> implements JsonStore<T> {
  private readonly file: string;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(name: string) {
    this.file = path.join(storageDir, name);
  }

  async read(): Promise<T[]> {
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as T[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  mutate(fn: (items: T[]) => void): Promise<void> {
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

/**
 * Stores the document as a private blob. Reads bypass the CDN cache so they are always current.
 * Serverless functions run in parallel, so writes use the blob's ETag: if someone else saved in
 * between, the write is rejected and retried on the fresh copy.
 */
class BlobJsonStore<T> implements JsonStore<T> {
  private static readonly MAX_ATTEMPTS = 5;

  constructor(private readonly pathname: string) {}

  async read(): Promise<T[]> {
    return (await this.load()).items;
  }

  async mutate(fn: (items: T[]) => void): Promise<void> {
    for (let attempt = 1; ; attempt++) {
      const { items, etag } = await this.load();
      fn(items);
      try {
        await put(this.pathname, JSON.stringify(items), {
          access: "private",
          contentType: "application/json",
          addRandomSuffix: false,
          // Existing document: only overwrite the version we read. New document: fail if one appeared meanwhile.
          ...(etag ? { allowOverwrite: true, ifMatch: etag } : { allowOverwrite: false }),
        });
        return;
      } catch (error) {
        const conflict = error instanceof BlobPreconditionFailedError || (!etag && /already exists/i.test(String(error)));
        if (!conflict || attempt >= BlobJsonStore.MAX_ATTEMPTS) throw error;
        await new Promise((r) => setTimeout(r, 50 * attempt + Math.random() * 100));
      }
    }
  }

  private async load(): Promise<{ items: T[]; etag: string | null }> {
    const result = await get(this.pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return { items: [], etag: null };
    const text = await new Response(result.stream).text();
    return { items: JSON.parse(text) as T[], etag: result.blob.etag };
  }
}

/** Picks Vercel Blob when a store is connected, otherwise the local `storageDir`. */
export function createJsonStore<T>(name: string): JsonStore<T> {
  return useBlobStorage ? new BlobJsonStore<T>(`data/${name}`) : new FileJsonStore<T>(name);
}

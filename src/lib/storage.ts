import path from "node:path";

/**
 * Root folder for everything admins create at runtime (uploaded images, gallery and newsletter data)
 * when running on a server with a disk. Must be on persistent disk in production — mount a volume here
 * when using Docker.
 */
export const storageDir = path.resolve(
  process.env.STORAGE_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), "storage"),
);

/**
 * Vercel (and other serverless hosts) have no persistent disk. When a Vercel Blob store is connected,
 * BLOB_READ_WRITE_TOKEN is set and everything is stored in that store instead of `storageDir`.
 * The store must be created as a **private** store.
 */
export const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

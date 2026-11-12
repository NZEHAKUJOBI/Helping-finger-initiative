import path from "node:path";

/**
 * Root folder for everything admins create at runtime (uploaded images, gallery index).
 * Must be on persistent disk in production — mount a volume here when using Docker.
 */
export const storageDir = path.resolve(
  process.env.STORAGE_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), "storage"),
);

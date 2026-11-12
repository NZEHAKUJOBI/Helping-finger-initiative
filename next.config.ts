import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Gallery uploads: up to 6 photos × 10 MB plus multipart overhead.
    serverActions: { bodySizeLimit: "64mb" },
  },
  partialPrefetching: true,
  turbopack: {
    // A stray lockfile in the parent folder would otherwise be picked as the root.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

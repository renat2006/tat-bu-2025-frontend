import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
      ],
    },
  ],
};

export default nextConfig;

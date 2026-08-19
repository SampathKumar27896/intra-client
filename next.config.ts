import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      }
    ],
  },
  allowedDevOrigins: ["app.sam.com"]
};

export default nextConfig;

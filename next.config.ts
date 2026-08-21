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
  allowedDevOrigins: ["app.sam.com", "192.168.1.8"]
};

export default nextConfig;

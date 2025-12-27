import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bidstorm.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

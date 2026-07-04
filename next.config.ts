import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.0.14"],
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;

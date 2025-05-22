import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Don't ignore build errors as they help catch issues early
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ensure ESLint runs on all files
    dirs: ["pages", "components", "lib", "app"],
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

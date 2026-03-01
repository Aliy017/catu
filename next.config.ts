import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/leads",
        destination: "https://mysayt.uz/api/leads",
      },
    ];
  },
};

export default nextConfig;

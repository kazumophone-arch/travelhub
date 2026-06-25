import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/guides",
        destination: "/discover",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

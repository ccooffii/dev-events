import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },

  async rewrites() { 
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://res.cloudinary.com/dqzzpuytu/:path*",
      },
      {
        source: "/ingest/upload/:path*",
        destination: "https://res.cloudinary.com/dqzzpuytu/:path*",
      }
    ]
  }

};

export default nextConfig;

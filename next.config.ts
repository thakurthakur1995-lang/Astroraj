import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "astroraj.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  compress: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/personal-consultation",
        destination: "/services/personal-consultation",
        permanent: true,
      },
      {
        source: "/online-puja-services",
        destination: "/services/online-puja",
        permanent: true,
      },
      {
        source: "/astrology-consultation",
        destination: "/services/astrology-consultation",
        permanent: true,
      },
      {
        source: "/gemstones",
        destination: "/services/gemstones",
        permanent: true,
      },
      {
        source: "/ayurveda",
        destination: "/services/ayurveda",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
  reactStrictMode: true,
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
    ];
  },
};

export default nextConfig;

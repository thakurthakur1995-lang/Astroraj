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
      {
        protocol: "https",
        hostname: "darkcyan-marten-836084.hostingersite.com",
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Placeholder for Magento and other image sources
      },
    ],
     qualities: [70, 75, 80, 85, 90],
     formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/jewellery-product",
        destination: "/jewellery",
        permanent: true,
      },
      { source: "/jewellery/bangles", destination: "/jewellery/diamond-bangles", permanent: true },
      { source: "/jewellery/necklaces", destination: "/jewellery/diamond-necklaces", permanent: true },
      { source: "/jewellery/rings", destination: "/jewellery/diamond-rings", permanent: true },
      { source: "/jewellery/pendants", destination: "/jewellery/diamond-pendants", permanent: true },
      { source: "/jewellery/nose-pins", destination: "/jewellery/diamond-nose-pins", permanent: true },
      { source: "/jewellery/earrings", destination: "/jewellery/diamond-earrings", permanent: true },
      { source: "/jewellery/bracelets", destination: "/jewellery/diamond-bracelets", permanent: true },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "bangles" }],
        destination: "/jewellery/diamond-bangles",
        permanent: true,
      },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "necklace" }],
        destination: "/jewellery/diamond-necklaces",
        permanent: true,
      },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "rings" }],
        destination: "/jewellery/diamond-rings",
        permanent: true,
      },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "pendants" }],
        destination: "/jewellery/diamond-pendants",
        permanent: true,
      },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "nosepins" }],
        destination: "/jewellery/diamond-nose-pins",
        permanent: true,
      },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "earrings" }],
        destination: "/jewellery/diamond-earrings",
        permanent: true,
      },
      {
        source: "/jewellery",
        has: [{ type: "query", key: "category", value: "bracelets" }],
        destination: "/jewellery/diamond-bracelets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

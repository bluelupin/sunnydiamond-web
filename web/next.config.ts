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
     minimumCacheTTL: 2678400, // 31 days — media URLs are content-hashed, safe to cache long
  },
  async redirects() {
    const jewelleryCategoryRedirects = [
      { value: "bangles", destination: "/jewellery/diamond-bangles" },
      { value: "necklace", destination: "/jewellery/diamond-necklaces" },
      { value: "rings", destination: "/jewellery/diamond-rings" },
      { value: "pendants", destination: "/jewellery/diamond-pendants" },
      { value: "nosepins", destination: "/jewellery/diamond-nose-pins" },
      { value: "earrings", destination: "/jewellery/diamond-earrings" },
      { value: "bracelets", destination: "/jewellery/diamond-bracelets" },
    ] as const;

    const legacyListingCategoryRedirects = jewelleryCategoryRedirects.flatMap((entry) => [
      {
        source: "/jewellery",
        has: [{ type: "query" as const, key: "category", value: entry.value }],
        destination: entry.destination,
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query" as const, key: "category", value: entry.value }],
        destination: entry.destination,
        permanent: true,
      },
    ]);

    return [
      {
        source: "/products",
        destination: "/jewellery",
        permanent: true,
      },
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
      ...legacyListingCategoryRedirects,
    ];
  },
};

export default nextConfig;

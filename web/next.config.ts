import type { NextConfig } from "next";

const JEWELLERY_CATEGORY_DESTINATIONS = [
  "diamond-bangles",
  "diamond-necklaces",
  "diamond-rings",
  "diamond-pendants",
  "diamond-nose-pins",
  "diamond-earrings",
  "diamond-bracelets",
] as const;

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
      { value: "bangles", destination: "/diamond-bangles" },
      { value: "necklace", destination: "/diamond-necklaces" },
      { value: "rings", destination: "/diamond-rings" },
      { value: "pendants", destination: "/diamond-pendants" },
      { value: "nosepins", destination: "/diamond-nose-pins" },
      { value: "earrings", destination: "/diamond-earrings" },
      { value: "bracelets", destination: "/diamond-bracelets" },
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

    const legacyJewelleryPathRedirects = [
      { source: "/jewellery/bangles", destination: "/diamond-bangles", permanent: true },
      { source: "/jewellery/necklaces", destination: "/diamond-necklaces", permanent: true },
      { source: "/jewellery/rings", destination: "/diamond-rings", permanent: true },
      { source: "/jewellery/pendants", destination: "/diamond-pendants", permanent: true },
      { source: "/jewellery/nose-pins", destination: "/diamond-nose-pins", permanent: true },
      { source: "/jewellery/earrings", destination: "/diamond-earrings", permanent: true },
      { source: "/jewellery/bracelets", destination: "/diamond-bracelets", permanent: true },
      ...JEWELLERY_CATEGORY_DESTINATIONS.map((slug) => ({
        source: `/jewellery/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      })),
    ];

    return [
      {
        source: "/about",
        destination: "/world-of-sunny",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/policy-and-certifications?policy=privacy-policy",
        permanent: true,
      },
      {
        source: "/policy-and-certification",
        destination: "/policy-and-certifications?policy=privacy-policy",
        permanent: true,
      },
      {
        source: "/returns-and-cancellations",
        destination: "/policy-and-certifications?policy=15-day-return-policy",
        permanent: true,
      },
      {
        source: "/exchange-and-resizing",
        destination: "/policy-and-certifications?policy=exchange-and-resizing",
        permanent: true,
      },
      {
        source: "/shipping-delivery",
        destination: "/policy-and-certifications?policy=shipping-delivery",
        permanent: true,
      },
      {
        source: "/cash-on-delivery-policy",
        destination: "/policy-and-certifications?policy=cash-on-delivery-policy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/policy-and-certifications?policy=terms-and-conditions",
        permanent: true,
      },
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
      {
        source: "/education",
        destination: "/learn-about-diamonds",
        permanent: true,
      },
      ...legacyJewelleryPathRedirects,
      ...legacyListingCategoryRedirects,
    ];
  },
};

export default nextConfig;

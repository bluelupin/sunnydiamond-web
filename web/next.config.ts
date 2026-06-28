import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/jewellery/bangles", destination: "/jewellery?category=bangles", permanent: true },
      { source: "/jewellery/necklaces", destination: "/jewellery?category=necklace", permanent: true },
      { source: "/jewellery/rings", destination: "/jewellery?category=rings", permanent: true },
      { source: "/jewellery/pendants", destination: "/jewellery?category=pendants", permanent: true },
      { source: "/jewellery/nose-pins", destination: "/jewellery?category=nosepins", permanent: true },
      { source: "/jewellery/earrings", destination: "/jewellery?category=earrings", permanent: true },
      { source: "/jewellery/bracelets", destination: "/jewellery?category=bracelets", permanent: true },
    ];
  },
};

export default nextConfig;

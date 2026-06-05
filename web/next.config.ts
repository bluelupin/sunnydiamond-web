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
     qualities: [70, 75, 85, 90],
     formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

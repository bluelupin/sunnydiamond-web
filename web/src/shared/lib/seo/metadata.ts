import { Metadata } from "next";
import siteEnv from "./siteConfig";

interface SeoConfig {
  title: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = "Sunny Diamond - Premium Jewelry and Diamonds",
  image = "/og-image.jpg",
  canonicalPath,
  noIndex = false,
}: SeoConfig): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@sunnydiamond",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    metadataBase: new URL(siteEnv.baseUrl),
    ...(canonicalPath && {
      alternates: {
        canonical: canonicalPath,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

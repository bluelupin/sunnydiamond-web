import { Metadata } from "next";
import { siteConfig } from "@/shared/lib/siteConfig";

interface SeoConfig {
  title: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  url?: string;
  siteName?: string;
  imageWidth?: number;
  imageHeight?: number;
}

function normalizeUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    return new URL(rawUrl).toString();
  } catch {
    return undefined;
  }
}

export function constructMetadata({
  title,
  description = siteConfig.seo.defaultDescription,
  image = siteConfig.seo.ogImage,
  canonicalPath,
  noIndex = false,
  url,
  siteName = siteConfig.brand.name,
  imageWidth = 1200,
  imageHeight = 630,
}: SeoConfig): Metadata {
  const resolvedImage = normalizeUrl(image) ?? `${siteConfig.seo.siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  const resolvedUrl = normalizeUrl(url ?? canonicalPath ?? siteConfig.seo.siteUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: resolvedUrl,
      siteName,
      type: "website",
      images: [
        {
          url: resolvedImage,
          width: imageWidth,
          height: imageHeight,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    metadataBase: new URL(siteConfig.seo.siteUrl),
    alternates: canonicalPath
      ? {
          canonical: canonicalPath,
        }
      : undefined,
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

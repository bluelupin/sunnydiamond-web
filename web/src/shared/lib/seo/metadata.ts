import { Metadata } from "next";
import { siteConfig } from "@/shared/lib/siteConfig";

interface SeoConfig {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  url?: string;
  siteName?: string;
  imageWidth?: number;
  imageHeight?: number;
  openGraphType?: "website" | "article";
}

function normalizeUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    return new URL(rawUrl).toString();
  } catch {
    return undefined;
  }
}

/**
 * Builds page metadata. Titles are absolute so the root layout template
 * (`%s | Sunny Diamonds`) is never appended on top of CMS titles.
 * Description/keywords come from the caller (CMS) when provided — we do not
 * invent SEO text beyond an optional description fallback for non-CMS pages.
 */
export function constructMetadata({
  title,
  description,
  keywords,
  image = siteConfig.seo.ogImage,
  canonicalPath,
  noIndex = false,
  url,
  siteName = siteConfig.brand.name,
  imageWidth = 1200,
  imageHeight = 630,
  openGraphType = "website",
}: SeoConfig): Metadata {
  const resolvedTitle = title.trim();
  const resolvedDescription = description?.trim() || undefined;
  const resolvedKeywords = keywords?.trim() || undefined;
  const resolvedImage =
    normalizeUrl(image) ??
    `${siteConfig.seo.siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  const resolvedUrl = normalizeUrl(url ?? canonicalPath ?? siteConfig.seo.siteUrl);

  return {
    // Bypass root `title.template` so CMS titles are used exactly as configured.
    title: { absolute: resolvedTitle },
    ...(resolvedDescription ? { description: resolvedDescription } : {}),
    // `null` clears the root layout keywords so pages don't inherit the site-wide list.
    keywords: resolvedKeywords ?? null,
    openGraph: {
      title: resolvedTitle,
      ...(resolvedDescription ? { description: resolvedDescription } : {}),
      url: resolvedUrl,
      siteName,
      type: openGraphType,
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
      title: resolvedTitle,
      ...(resolvedDescription ? { description: resolvedDescription } : {}),
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

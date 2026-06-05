import { siteConfig } from "@/shared/lib/siteConfig";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type { HomepageSeo } from "@/types/homepage/seo";

export interface HomepageSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  noIndex: boolean;
}

export type HomepageShellData = {
  homepage?: { seo?: HomepageSeo | null } | null;
  global?: { defaultSeo?: HomepageSeo | null } | null;
};

function buildAbsoluteUrl(rawUrl?: string | null): string | undefined {
  const trimmed = typeof rawUrl === "string" ? rawUrl.trim() : "";
  if (!trimmed) return undefined;

  try {
    return new URL(trimmed, siteConfig.seo.siteUrl).toString();
  } catch {
    return undefined;
  }
}

function resolveSeoImage(homepageSeo?: HomepageSeo | null, globalSeo?: HomepageSeo | null): string {
  return (
    resolveCmsMediaUrl(homepageSeo?.shareImage) ??
    resolveCmsMediaUrl(homepageSeo?.ogImage) ??
    resolveCmsMediaUrl(globalSeo?.shareImage) ??
    resolveCmsMediaUrl(globalSeo?.ogImage) ??
    buildAbsoluteUrl(siteConfig.seo.ogImage) ??
    ""
  );
}

function resolveSeoString(primary?: string | null, fallback?: string | null, defaultValue = ""): string {
  return (primary?.trim() || fallback?.trim() || defaultValue).trim();
}

export function resolveHomepageSeoMetadata(shellData: HomepageShellData): HomepageSeoMetadata {
  const homepageSeo = shellData?.homepage?.seo ?? null;
  const globalSeo = shellData?.global?.defaultSeo ?? null;

  const title = resolveSeoString(homepageSeo?.metaTitle, globalSeo?.metaTitle, siteConfig.seo.defaultTitle);
  const description = resolveSeoString(homepageSeo?.metaDescription, globalSeo?.metaDescription, siteConfig.seo.defaultDescription);
  const canonicalUrl =
    buildAbsoluteUrl(homepageSeo?.canonicalURL ?? homepageSeo?.canonicalUrl) ??
    buildAbsoluteUrl(globalSeo?.canonicalURL ?? globalSeo?.canonicalUrl) ??
    siteConfig.seo.siteUrl;
  const imageUrl = resolveSeoImage(homepageSeo, globalSeo);
  const noIndex = homepageSeo?.noIndex === true;

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    noIndex,
  };
}

export function buildHomepageJsonLd(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
}) {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.pinterest].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brand.name,
    url: data.url,
    description: data.description,
    logo: data.image
      ? {
          "@type": "ImageObject",
          url: data.image,
        }
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    mainEntityOfPage: data.url,
  };
}

import type { NormalizedHomepageHero } from "@/services/homepage/homepage.mapper";
import { siteConfig } from "@/shared/lib/siteConfig";
import { BRAND_LOGO_URL } from "@/shared/lib/seo/siteConfig";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type { HomepageSeo } from "@/types/homepage/seo";

export interface HomepageSeoMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  imageUrl: string;
  noIndex: boolean;
}

export type HomepageShellData = {
  homepage?: { seo?: HomepageSeo | null; hero?: NormalizedHomepageHero | null } | null;
  hero?: NormalizedHomepageHero | null;
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

function resolveHeroShareImage(shellData: HomepageShellData): string | undefined {
  const hero = shellData?.homepage?.hero ?? shellData?.hero;
  const heroImage = hero?.image;
  if (!heroImage) return undefined;

  return (
    resolveCmsMediaUrl(heroImage.desktopImage ?? heroImage) ??
    resolveCmsMediaUrl(heroImage.mobileImage) ??
    undefined
  );
}

function resolveSeoImage(
  homepageSeo?: HomepageSeo | null,
  globalSeo?: HomepageSeo | null,
  shellData?: HomepageShellData | null,
): string {
  return (
    resolveCmsMediaUrl(homepageSeo?.shareImage) ??
    resolveCmsMediaUrl(homepageSeo?.ogImage) ??
    resolveCmsMediaUrl(globalSeo?.shareImage) ??
    resolveCmsMediaUrl(globalSeo?.ogImage) ??
    resolveHeroShareImage(shellData ?? {}) ??
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

  // Homepage CMS SEO first, then global CMS defaultSeo — never invent brand suffixes.
  const title = resolveSeoString(
    homepageSeo?.metaTitle,
    globalSeo?.metaTitle,
    siteConfig.seo.defaultTitle,
  );
  const description = resolveSeoString(
    homepageSeo?.metaDescription,
    globalSeo?.metaDescription,
    siteConfig.seo.defaultDescription,
  );
  const canonicalUrl =
    buildAbsoluteUrl(homepageSeo?.canonicalURL ?? homepageSeo?.canonicalUrl) ??
    buildAbsoluteUrl(globalSeo?.canonicalURL ?? globalSeo?.canonicalUrl) ??
    siteConfig.seo.siteUrl;
  const imageUrl = resolveSeoImage(homepageSeo, globalSeo, shellData);
  const noIndex = homepageSeo?.noIndex === true;
  const keywords = resolveSeoString(
    homepageSeo?.metaKeywords,
    globalSeo?.metaKeywords,
    "",
  );

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    canonicalUrl,
    imageUrl,
    noIndex,
  };
}

export function buildHomepageJsonLd(data: {
  title: string;
  description: string;
  url: string;
}) {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.pinterest].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.brand.name,
        url: data.url,
        description: data.description,
      },
      {
        "@type": "Organization",
        name: siteConfig.brand.name,
        url: data.url,
        description: data.description,
        logo: {
          "@type": "ImageObject",
          url: BRAND_LOGO_URL,
        },
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
    ],
  };
}

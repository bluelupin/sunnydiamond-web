import { seoContent } from "@/features/cms/data/content";
import { siteConfig } from "@/shared/lib/siteConfig";
import { BESPOKE_JEWELLERY_PATH } from "@/shared/utils/navigation";
import type { NormalizedContactBespokePage } from "@/services/bespoke/contact-bespoke-page.types";

export function resolveBespokeOpenGraphImage(
  page: NormalizedContactBespokePage | null,
): string | undefined {
  const heroImage = page?.hero?.image;
  const candidate =
    heroImage?.desktopUrl?.trim() || heroImage?.mobileUrl?.trim() || undefined;
  return candidate;
}

export function resolveBespokeSeoMetadata(page: NormalizedContactBespokePage | null) {
  const cmsSeo = page?.seo;
  const cmsCanonical = cmsSeo?.canonicalPath?.replace(/\/$/, "") || "";
  const canonicalPath = !cmsCanonical
    ? BESPOKE_JEWELLERY_PATH
    : cmsSeo?.canonicalPath ?? BESPOKE_JEWELLERY_PATH;

  const cmsTitle = cmsSeo?.metaTitle?.trim();
  const cmsDescription = cmsSeo?.metaDescription?.trim();
  const image = resolveBespokeOpenGraphImage(page);

  return {
    // Prefer CMS exactly; static fallbacks only when CMS SEO is missing.
    title: cmsTitle || seoContent.bespoke.title,
    description: cmsDescription || seoContent.bespoke.description,
    canonicalPath,
    keywords: cmsSeo?.metaKeywords,
    ...(image ? { image } : {}),
  };
}

export function buildBespokeJsonLd(page: NormalizedContactBespokePage | null) {
  const { title, description, canonicalPath } = resolveBespokeSeoMetadata(page);
  const path = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteConfig.seo.siteUrl}${path}`,
  };
}

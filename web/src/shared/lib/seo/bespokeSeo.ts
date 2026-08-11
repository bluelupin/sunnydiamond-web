import { footerPages } from "@/features/cms/data/footerPages";
import type { NormalizedContactBespokePage } from "@/services/bespoke/contact-bespoke-page.types";
import { siteConfig } from "@/shared/lib/siteConfig";

const fallback = footerPages.bespokeJewellery;

export function resolveBespokeSeoMetadata(page: NormalizedContactBespokePage | null) {
  const cmsSeo = page?.seo;
  const cmsTitle = cmsSeo?.metaTitle?.trim();
  const cmsDescription = cmsSeo?.metaDescription?.trim();

  return {
    title: cmsTitle || fallback.title,
    description: cmsDescription || fallback.description,
    canonicalPath: cmsSeo?.canonicalPath ?? "/bespoke-jewellery",
    keywords: cmsSeo?.metaKeywords,
    image: cmsSeo?.ogImageUrl ?? page?.hero?.image.desktopUrl,
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

import type { NormalizedProductLandingPage } from "@/services/product-landing/product-landing-page.types";
import { siteConfig } from "@/shared/lib/siteConfig";

/** PLP SEO is CMS-only. Global siteConfig is used only if the CMS fetch/SEO block is missing. */
export function resolveJewellerySeoMetadata(page: NormalizedProductLandingPage | null) {
  const cmsSeo = page?.seo;

  return {
    title: cmsSeo?.metaTitle ?? siteConfig.seo.defaultTitle,
    description: cmsSeo?.metaDescription ?? siteConfig.seo.defaultDescription,
    canonicalPath: cmsSeo?.canonicalPath ?? "/jewellery",
    keywords: cmsSeo?.metaKeywords,
    image: cmsSeo?.ogImageUrl,
  };
}

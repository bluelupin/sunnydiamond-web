import type { NormalizedProductLandingPage } from "@/services/product-landing/product-landing-page.types";
import { siteConfig } from "@/shared/lib/siteConfig";
import {
  buildJewelleryCategoryHref,
  MAGENTO_URL_KEY_TO_SLUG,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";

/** PLP SEO is CMS-first. Site defaults only if the CMS SEO block is missing. */
export function resolveJewellerySeoMetadata(page: NormalizedProductLandingPage | null) {
  const cmsSeo = page?.seo;
  const cmsTitle = cmsSeo?.metaTitle?.trim();
  const cmsDescription = cmsSeo?.metaDescription?.trim();

  return {
    title: cmsTitle || siteConfig.seo.defaultTitle,
    description: cmsDescription || siteConfig.seo.defaultDescription,
    canonicalPath: cmsSeo?.canonicalPath ?? "/jewellery",
    keywords: cmsSeo?.metaKeywords,
    image: cmsSeo?.ogImageUrl,
  };
}

function formatCategoryLabelFromUrlKey(categoryUrlKey: string): string {
  const slug = MAGENTO_URL_KEY_TO_SLUG[categoryUrlKey];
  if (slug) {
    return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  return categoryUrlKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolveJewelleryCategorySeoMetadata(
  page: NormalizedProductLandingPage | null,
  categoryUrlKey: string,
  categoryLabel?: string | null,
) {
  const base = resolveJewellerySeoMetadata(page);
  const cmsSeo = page?.seo;
  const label = categoryLabel?.trim() || formatCategoryLabelFromUrlKey(categoryUrlKey);
  const canonicalPath = buildJewelleryCategoryHref(categoryUrlKey);

  const cmsTitle = cmsSeo?.metaTitle?.trim();
  const cmsDescription = cmsSeo?.metaDescription?.trim();

  return {
    // Prefer CMS exactly; never append "| Sunny Diamonds" in code.
    title: cmsTitle || `Shop ${label}`,
    description:
      cmsDescription ||
      `Browse our ${label.toLowerCase()} collection — handcrafted diamond jewellery with GIA-certified stones, timeless designs, and premium craftsmanship.`,
    canonicalPath,
    keywords: base.keywords,
    image: base.image,
  };
}

export type JewelleryListingJsonLdProduct = {
  name: string;
  urlKey: string;
  image?: string;
};

export function buildJewelleryListingJsonLd(options: {
  name: string;
  description: string;
  canonicalPath: string;
  products?: JewelleryListingJsonLdProduct[];
}) {
  const pageUrl = getAbsoluteUrl(options.canonicalPath);

  const itemListElement = (options.products ?? []).slice(0, 12).map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: getAbsoluteUrl(`/product/${product.urlKey}`),
    name: product.name,
    ...(product.image ? { image: product.image } : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: pageUrl,
  ...(itemListElement.length > 0
    ? {
        mainEntity: {
          "@type": "ItemList",
          itemListElement,
        },
      }
    : {}),
  };
}

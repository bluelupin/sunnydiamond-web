import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type {
  NormalizedProductLandingPage,
  NormalizedProductLandingSeo,
  StrapiProductLandingPage,
  StrapiProductLandingSeo,
} from "./product-landing-page.types";
import { EMPTY_PRODUCT_LANDING_PAGE } from "./product-landing-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const mapSeo = (seo?: StrapiProductLandingSeo | null): NormalizedProductLandingSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  return {
    metaTitle,
    metaDescription,
    canonicalPath: cleanText(seo.canonicalUrl) ?? "/jewellery",
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

export function mapProductLandingPage(
  raw?: StrapiProductLandingPage | null,
): NormalizedProductLandingPage {
  if (!raw) return EMPTY_PRODUCT_LANDING_PAGE;

  return {
    seo: mapSeo(raw.seo),
  };
}

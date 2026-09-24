import {
  buildJewelleryCollectionHref,
  slugifyCollectionSlug,
} from "./collectionListing";
import {
  buildJewelleryOccasionHref,
  normalizeJewelleryOccasionCtaUrl,
  slugifyOccasionTitle,
} from "./occasionListing";
import {
  buildJewelleryListingHref,
  JEWELLERY_CATEGORY_QUERY_PARAM,
  JEWELLERY_PATH,
  preserveJewelleryListingSearchParams,
  resolveCategoryUrlKeyFromPathname,
  resolveCategoryUrlKeyFromQueryParam,
} from "./jewelleryRoutes";

const GENERIC_PRODUCT_LISTING_PATHS = new Set([
  "/products",
  "/products/",
  "/jewellery",
  "/jewellery/",
  "/diamond-bangles",
  "/diamond-necklaces",
  "/diamond-rings",
  "/diamond-pendants",
  "/diamond-nose-pins",
  "/diamond-earrings",
  "/diamond-bracelets",
]);

function toRelativeHref(url: URL, original: string): string {
  if (original.startsWith("http://") || original.startsWith("https://")) {
    return url.toString();
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Rewrites collection/occasion PLP CTAs to `/jewellery?…` with preserved primary
 * filters and optional `?category=` — same pattern as Alankara collection CTAs.
 */
export function normalizeJewelleryPrimaryListingCtaUrl(ctaUrl: string): string {
  const trimmed = ctaUrl.trim();
  if (!trimmed) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed, "http://listing.local");
    const collection = url.searchParams.get("collection")?.trim();
    const occasion = url.searchParams.get("occasion")?.trim();

    if (!collection && !occasion) {
      const pathOnly = url.pathname.replace(/\/$/, "") || "/";
      if (GENERIC_PRODUCT_LISTING_PATHS.has(pathOnly.toLowerCase())) {
        return JEWELLERY_PATH;
      }

      return toRelativeHref(url, trimmed);
    }

    const preserved = preserveJewelleryListingSearchParams(url.searchParams);

    if (collection) {
      preserved.set("collection", slugifyCollectionSlug(collection));
    }

    if (occasion) {
      preserved.set("occasion", slugifyOccasionTitle(occasion));
    }

    const categoryFromQuery = url.searchParams.get(JEWELLERY_CATEGORY_QUERY_PARAM);
    const categoryUrlKey = categoryFromQuery
      ? resolveCategoryUrlKeyFromQueryParam(categoryFromQuery)
      : resolveCategoryUrlKeyFromPathname(url.pathname);

    return buildJewelleryListingHref({
      categoryUrlKey,
      searchParams: preserved,
    });
  } catch {
    return trimmed;
  }
}

export type JewelleryListingCtaFilterType = "collection" | "occasion";

/**
 * Build a PLP CTA href for homepage/gifting sections.
 * Prefers explicit Magento slugs (Alankara pattern), then normalizes CMS URLs.
 */
export function buildJewelleryListingCtaHref(options: {
  ctaUrl?: string | null;
  filterSlug?: string | null;
  filterType?: JewelleryListingCtaFilterType | null;
  collectionSlug?: string | null;
  occasionSlug?: string | null;
}): string | undefined {
  const collectionSlug =
    options.collectionSlug?.trim() ||
    (options.filterType === "collection" ? options.filterSlug?.trim() : undefined);
  if (collectionSlug) {
    return buildJewelleryCollectionHref(collectionSlug);
  }

  const occasionSlug =
    options.occasionSlug?.trim() ||
    (options.filterType === "occasion" ? options.filterSlug?.trim() : undefined);
  if (occasionSlug) {
    return buildJewelleryOccasionHref(occasionSlug);
  }

  const ctaUrl = options.ctaUrl?.trim();
  if (!ctaUrl) {
    return undefined;
  }

  if (ctaUrl.includes("occasion=")) {
    return normalizeJewelleryPrimaryListingCtaUrl(normalizeJewelleryOccasionCtaUrl(ctaUrl));
  }

  if (ctaUrl.includes("collection=")) {
    return normalizeJewelleryPrimaryListingCtaUrl(ctaUrl);
  }

  const pathOnly = ctaUrl.split("?")[0]?.replace(/\/$/, "") || "/";
  if (!GENERIC_PRODUCT_LISTING_PATHS.has(pathOnly.toLowerCase())) {
    return ctaUrl;
  }

  return normalizeJewelleryPrimaryListingCtaUrl(ctaUrl);
}

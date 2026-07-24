import { JEWELLERY_PATH } from "./jewelleryRoutes";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";

export function slugifyOccasionTitle(title: string | null | undefined): string {
  return (title ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveOccasionFacetOption(
  occasionSlug: string | null | undefined,
  occasions: readonly JewelleryFilterFacetOption[],
): JewelleryFilterFacetOption | null {
  const normalized = occasionSlug?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return (
    occasions.find((option) => {
      const labelSlug = slugifyOccasionTitle(option.label);
      return (
        option.label.trim().toLowerCase() === normalized ||
        labelSlug === normalized ||
        option.value.trim().toLowerCase() === normalized
      );
    }) ?? null
  );
}

export function buildJewelleryOccasionHref(
  occasionSlug: string | null | undefined,
): string {
  const slug = occasionSlug?.trim();
  if (!slug) {
    return JEWELLERY_PATH;
  }

  return `${JEWELLERY_PATH}?occasion=${encodeURIComponent(slug)}`;
}

const GENERIC_PRODUCT_LISTING_PATHS = new Set([
  "/products",
  "/products/",
  "/jewellery",
  "/jewellery/",
]);

export function buildOccasionCardHref({
  title,
  slug,
  filterSlug,
  ctaUrl,
}: {
  title?: string | null;
  slug?: string | null;
  filterSlug?: string | null;
  ctaUrl?: string | null;
}): string {
  const normalizedCtaUrl = ctaUrl?.trim();
  if (normalizedCtaUrl && !GENERIC_PRODUCT_LISTING_PATHS.has(normalizedCtaUrl.toLowerCase())) {
    return normalizedCtaUrl;
  }

  const occasionSlug =
    filterSlug?.trim() || slug?.trim() || slugifyOccasionTitle(title);
  return buildJewelleryOccasionHref(occasionSlug);
}

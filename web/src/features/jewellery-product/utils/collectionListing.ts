import { JEWELLERY_PATH } from "./jewelleryRoutes";
import type { JewelleryFilterFacetOption } from "@/types/magento/jewelleryListing";
import { resolveMagentoCollectionValue } from "@/services/magento/products/collectionProducts.service";

export function slugifyCollectionSlug(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve a CMS/URL collection slug (or Magento option value) against live Magento options.
 */
export function resolveCollectionFacetOption(
  collectionSlug: string | null | undefined,
  collections: readonly JewelleryFilterFacetOption[] = [],
): JewelleryFilterFacetOption | null {
  const raw = collectionSlug?.trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.toLowerCase();
  const normalizedSlug = slugifyCollectionSlug(raw);
  const normalizedMagentoValue = resolveMagentoCollectionValue(raw);

  return (
    collections.find((option) => {
      const label = option.label.trim().toLowerCase();
      const labelSlug = slugifyCollectionSlug(option.label);
      const value = option.value.trim().toLowerCase();
      const valueSlug = slugifyCollectionSlug(option.value);

      return (
        value === normalized ||
        value === normalizedMagentoValue ||
        valueSlug === normalizedSlug ||
        label === normalized ||
        labelSlug === normalizedSlug
      );
    }) ?? null
  );
}

export function buildJewelleryCollectionHref(
  collectionSlug: string | null | undefined,
): string {
  const slug = slugifyCollectionSlug(collectionSlug);
  if (!slug) {
    return JEWELLERY_PATH;
  }

  return `${JEWELLERY_PATH}?collection=${encodeURIComponent(slug)}`;
}

export function hasCollectionListingSearchParams(searchParams: {
  collection?: string;
}): boolean {
  return Boolean(searchParams.collection?.trim());
}

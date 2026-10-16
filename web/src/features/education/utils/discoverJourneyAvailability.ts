import { buildGiftFinderListingFiltersFromUrl } from "@/features/gifting/utils/giftFinderRoutes";
import { createEmptyFilterState } from "@/features/jewellery-product/data/filters";
import { getMagentoJewelleryProducts } from "@/services/magento/products/products.service";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";

export type DiscoverJourneyPriceRange = {
  minPrice: number;
  maxPrice: number;
};

/** Category-scoped (or all-jewellery) price bounds — matches PLP prefetch clamping. */
export async function fetchDiscoverJourneyListingFacets(
  categoryUrlKey: string | null,
  signal?: AbortSignal,
): Promise<JewelleryFilterFacets> {
  const data = await getMagentoJewelleryProducts({
    categoryUrlKey,
    page: 1,
    pageSize: 1,
    filters: createEmptyFilterState(),
    includeFacets: true,
    signal,
  });

  return data.facets;
}

export function buildDiscoverJourneyListingFilters(
  range: DiscoverJourneyPriceRange,
  diamondShapeSlug: string,
  listingFacets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
) {
  const minRounded = Math.round(range.minPrice);
  const maxRounded = Math.round(range.maxPrice);

  return buildGiftFinderListingFiltersFromUrl(
    {
      minPrice: minRounded > 0 ? String(minRounded) : null,
      maxPrice: maxRounded > 0 ? String(maxRounded) : null,
      diamondShape: diamondShapeSlug.trim() || null,
    },
    listingFacets,
  );
}

/**
 * Availability check aligned with jewellery PLP (category facets, URL-style price clamp,
 * diamond shape slug + Magento attribute resolution).
 */
export async function discoverJourneyHasMatchingProducts({
  categoryUrlKey,
  range,
  diamondShapeSlug = "",
  listingFacets,
  signal,
}: {
  categoryUrlKey: string | null;
  range: DiscoverJourneyPriceRange;
  diamondShapeSlug?: string;
  listingFacets?: JewelleryFilterFacets;
  signal?: AbortSignal;
}): Promise<{ hasProducts: boolean; listingFacets: JewelleryFilterFacets }> {
  const scopedFacets =
    listingFacets ?? (await fetchDiscoverJourneyListingFacets(categoryUrlKey, signal));

  const filters = buildDiscoverJourneyListingFilters(range, diamondShapeSlug, scopedFacets);

  const data = await getMagentoJewelleryProducts({
    categoryUrlKey,
    page: 1,
    pageSize: 1,
    filters,
    facets: scopedFacets,
    includeFacets: false,
    signal,
  });

  return {
    hasProducts: data.totalCount > 0,
    listingFacets: scopedFacets,
  };
}

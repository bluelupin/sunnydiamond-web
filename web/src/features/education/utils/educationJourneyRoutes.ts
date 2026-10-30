import { buildGiftFinderListingFiltersFromUrl } from "@/features/gifting/utils/giftFinderRoutes";
import { applyJewelleryPriceSearchParams } from "@/features/jewellery-product/data/filters";
import { buildJewelleryCategoryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { slugifyDiamondShapeLabel } from "@/features/jewellery-product/utils/diamondShapeListing";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import { buildDiscoverJourneyListingFilters } from "./discoverJourneyAvailability";

export function buildEducationJourneyHref({
  categoryUrlKey,
  minPrice,
  maxPrice,
  diamondShapeLabel,
  listingFacets,
  priceUrlFacets,
}: {
  categoryUrlKey: string | null;
  minPrice: number;
  maxPrice: number;
  diamondShapeLabel: string;
  /** Category/shape-scoped facets for clamping the listing filter state. */
  listingFacets?: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">;
  /**
   * Catalog bounds from step 1 for serializing price query params. Scoped availability
   * facets can match the selected range exactly and would otherwise omit min/max from the URL.
   */
  priceUrlFacets?: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">;
}): string {
  const baseHref = categoryUrlKey
    ? buildJewelleryCategoryHref(categoryUrlKey)
    : "/jewellery";

  const shapeSlug = slugifyDiamondShapeLabel(diamondShapeLabel);
  const params = new URLSearchParams();

  if (shapeSlug) {
    params.set("diamondShape", shapeSlug);
  }

  // Encode the step-1 range only against global catalog bounds — not category/shape-scoped
  // facets, which can cap max (e.g. 300000) below what the user selected in step 1.
  const urlFacetBounds = priceUrlFacets ?? listingFacets;

  if (urlFacetBounds) {
    const filtersForUrl = buildDiscoverJourneyListingFilters(
      { minPrice, maxPrice },
      shapeSlug,
      urlFacetBounds,
    );
    applyJewelleryPriceSearchParams(params, filtersForUrl, urlFacetBounds);
  } else {
    const filters = buildGiftFinderListingFiltersFromUrl({
      minPrice: minPrice > 0 ? String(minPrice) : null,
      maxPrice: maxPrice > 0 ? String(maxPrice) : null,
      diamondShape: shapeSlug || null,
    });

    if (filters.minPrice > 0) {
      params.set("minPrice", String(filters.minPrice));
    }

    if (filters.maxPrice > 0) {
      params.set("maxPrice", String(filters.maxPrice));
    }
  }

  const query = params.toString();
  return query ? `${baseHref}?${query}` : baseHref;
}

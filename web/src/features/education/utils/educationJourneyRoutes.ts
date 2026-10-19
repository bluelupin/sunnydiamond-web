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
}: {
  categoryUrlKey: string | null;
  minPrice: number;
  maxPrice: number;
  diamondShapeLabel: string;
  /** Category-scoped facets so price query params match PLP prefetch/clamping. */
  listingFacets?: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">;
}): string {
  const baseHref = categoryUrlKey
    ? buildJewelleryCategoryHref(categoryUrlKey)
    : "/jewellery";

  const shapeSlug = slugifyDiamondShapeLabel(diamondShapeLabel);
  const params = new URLSearchParams();

  if (shapeSlug) {
    params.set("diamondShape", shapeSlug);
  }

  if (listingFacets) {
    const filters = buildDiscoverJourneyListingFilters(
      { minPrice, maxPrice },
      shapeSlug,
      listingFacets,
    );
    applyJewelleryPriceSearchParams(params, filters, listingFacets);
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

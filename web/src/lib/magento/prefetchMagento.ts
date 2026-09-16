import { cache } from "react";
import {
  createEmptyFilterState,
  parseJewelleryListingSortParam,
} from "@/features/jewellery-product/data/filters";
import {
  buildGiftFinderListingFiltersFromUrl,
  parseGiftFinderPriceParam,
  type GiftFinderSearchParams,
} from "@/features/gifting/utils/giftFinderRoutes";
import { measureJewelleryPlpGraphql } from "@/features/jewellery-product/utils/jewelleryPlpPerformance";
import { getMagentoJewelleryNavCategories } from "@/services/magento/categories/categories.service";
import { getMagentoJewelleryInitialListing } from "@/services/magento/products/products.service";
import type { JewelleryFilterState } from "@/features/jewellery-product/types";
import type { JewelleryListingProductsData } from "@/types/magento/jewelleryListing";

export const getCachedMagentoJewelleryNavCategories = cache(async () =>
  getMagentoJewelleryNavCategories(),
);

export type JewelleryListingPrefetchFilters = GiftFinderSearchParams & {
  sort?: string | null;
};

async function resolveJewelleryListingPrefetchFilters(
  categoryUrlKey: string | null,
  sortValue: string,
  listingFilters: JewelleryListingPrefetchFilters,
): Promise<JewelleryFilterState> {
  const minFromUrl = parseGiftFinderPriceParam(listingFilters.minPrice);
  const maxFromUrl = parseGiftFinderPriceParam(listingFilters.maxPrice);
  const needsPriceClamp = minFromUrl > 0 || maxFromUrl > 0;

  if (!needsPriceClamp) {
    return buildGiftFinderListingFiltersFromUrl(listingFilters);
  }

  const baseFilters = buildGiftFinderListingFiltersFromUrl(listingFilters);
  const { listing } = await getMagentoJewelleryInitialListing({
    categoryUrlKey,
    sortValue,
    filters: {
      ...baseFilters,
      minPrice: 0,
      maxPrice: 0,
    },
    includeFacets: true,
  });

  return buildGiftFinderListingFiltersFromUrl(listingFilters, listing.facets);
}

export const getCachedJewelleryListing = cache(
  async (
    categoryUrlKey: string | null,
    listingFilters?: JewelleryListingPrefetchFilters | null,
  ): Promise<JewelleryListingProductsData> => {
    const sortValue = parseJewelleryListingSortParam(listingFilters?.sort);
    const filters = listingFilters
      ? await resolveJewelleryListingPrefetchFilters(categoryUrlKey, sortValue, listingFilters)
      : createEmptyFilterState();

    const { listing } = await getMagentoJewelleryInitialListing({
      categoryUrlKey,
      sortValue,
      filters,
      includeFacets: true,
    });

    return listing;
  },
);

export async function prefetchMagentoJewelleryNav() {
  try {
    return await getCachedMagentoJewelleryNavCategories();
  } catch {
    return undefined;
  }
}

export async function prefetchJewelleryListing(
  categoryUrlKey: string | null,
  listingFilters?: JewelleryListingPrefetchFilters | null,
) {
  try {
    return await measureJewelleryPlpGraphql(
      "server-listing-prefetch",
      () => getCachedJewelleryListing(categoryUrlKey, listingFilters),
      { category: categoryUrlKey ?? "all" },
    );
  } catch {
    return undefined;
  }
}

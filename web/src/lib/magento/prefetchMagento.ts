import { cache } from "react";
import {
  createEmptyFilterState,
  DEFAULT_JEWELLERY_LISTING_SORT,
} from "@/features/jewellery-product/data/filters";
import { measureJewelleryPlpGraphql } from "@/features/jewellery-product/utils/jewelleryPlpPerformance";
import { getMagentoJewelleryNavCategories } from "@/services/magento/categories/categories.service";
import { getMagentoJewelleryInitialListing } from "@/services/magento/products/products.service";
import type { JewelleryListingProductsData } from "@/types/magento/jewelleryListing";

export const getCachedMagentoJewelleryNavCategories = cache(async () =>
  getMagentoJewelleryNavCategories(),
);

export type JewelleryListingPrefetchFilters = {
  collection?: string | null;
  occasion?: string | null;
};

export const getCachedJewelleryListing = cache(
  async (
    categoryUrlKey: string | null,
    listingFilters?: JewelleryListingPrefetchFilters | null,
  ): Promise<JewelleryListingProductsData> => {
    const filters = createEmptyFilterState();
    const collection = listingFilters?.collection?.trim();
    const occasion = listingFilters?.occasion?.trim();

    if (collection) {
      filters.collection = collection;
    }

    if (occasion) {
      filters.occasion = occasion;
    }

    const { listing } = await getMagentoJewelleryInitialListing({
      categoryUrlKey,
      sortValue: DEFAULT_JEWELLERY_LISTING_SORT,
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

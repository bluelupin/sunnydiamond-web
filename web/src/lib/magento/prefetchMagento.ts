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

export const getCachedJewelleryListing = cache(
  async (categoryUrlKey: string | null): Promise<JewelleryListingProductsData> => {
    const { listing } = await getMagentoJewelleryInitialListing({
      categoryUrlKey,
      sortValue: DEFAULT_JEWELLERY_LISTING_SORT,
      filters: createEmptyFilterState(),
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

export async function prefetchJewelleryListing(categoryUrlKey: string | null) {
  try {
    return await measureJewelleryPlpGraphql(
      "server-listing-prefetch",
      () => getCachedJewelleryListing(categoryUrlKey),
      { category: categoryUrlKey ?? "all" },
    );
  } catch {
    return undefined;
  }
}

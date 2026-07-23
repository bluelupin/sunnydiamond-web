import { cache } from "react";
import { getMagentoJewelleryNavCategories } from "@/services/magento/categories/categories.service";
import { getMagentoTrendingProducts } from "@/services/magento/products/trendingProducts.service";

export const getCachedMagentoJewelleryNavCategories = cache(async () =>
  getMagentoJewelleryNavCategories(),
);

export const getCachedMagentoTrendingProducts = cache(async () => getMagentoTrendingProducts());

export async function prefetchMagentoJewelleryNav() {
  try {
    return await getCachedMagentoJewelleryNavCategories();
  } catch {
    return undefined;
  }
}

export async function prefetchMagentoTrendingProducts() {
  try {
    return await getCachedMagentoTrendingProducts();
  } catch {
    return undefined;
  }
}

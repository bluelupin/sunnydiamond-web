import { unstable_cache } from "next/cache";
import {
  MAGENTO_TRENDING_CACHE_TAG,
  MAGENTO_TRENDING_REVALIDATE_SECONDS,
} from "@/services/magento/config";
import { getMagentoTrendingProducts } from "@/services/magento/products/trendingProducts.service";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export type TrendingProductsSnapshot = {
  products: JewelleryListingProduct[];
  fetchedAt: string;
};

/** Shared prerendered snapshot. Failed or empty refreshes must not replace valid catalog data. */
export const getTrendingProductsCached = unstable_cache(
  async (): Promise<TrendingProductsSnapshot> => {
    const products = await getMagentoTrendingProducts();
    if (products.length === 0) {
      throw new Error("Magento trending products returned no products");
    }
    return { products, fetchedAt: new Date().toISOString() };
  },
  ["magento-trending-products-v2"],
  {
    revalidate: MAGENTO_TRENDING_REVALIDATE_SECONDS,
    tags: [MAGENTO_TRENDING_CACHE_TAG],
  },
);

export async function getTrendingProductsSnapshot(): Promise<TrendingProductsSnapshot> {
  const snapshot = await getTrendingProductsCached();
  const ageMs = Date.now() - Date.parse(snapshot.fetchedAt);
  if (!Number.isFinite(ageMs) || ageMs > MAGENTO_TRENDING_REVALIDATE_SECONDS * 2_000) {
    console.warn("Trending product snapshot is older than 30 minutes", {
      fetchedAt: snapshot.fetchedAt,
      productCount: snapshot.products.length,
    });
  }
  return snapshot;
}

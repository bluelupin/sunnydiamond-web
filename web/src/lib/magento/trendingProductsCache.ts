import { unstable_cache } from "next/cache";
import { MAGENTO_CATALOG_REVALIDATE_SECONDS } from "@/services/magento/config";
import { getMagentoTrendingProducts } from "@/services/magento/products/trendingProducts.service";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

/** Trending catalog scan — long TTL (see MAGENTO_CATALOG_REVALIDATE_SECONDS). CMS uses HOMEPAGE_CMS_REVALIDATE_SECONDS. */
export const getTrendingProductsCached = unstable_cache(
  async (): Promise<JewelleryListingProduct[]> => getMagentoTrendingProducts(),
  ["magento-trending-products"],
  { revalidate: MAGENTO_CATALOG_REVALIDATE_SECONDS },
);

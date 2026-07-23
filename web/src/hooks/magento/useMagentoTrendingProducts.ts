"use client";

import { useCallback } from "react";
import { useCmsSection } from "@/hooks/homepage/useCmsSection";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";
import { MAGENTO_CATALOG_REVALIDATE_SECONDS } from "@/services/magento/config";
import { getMagentoTrendingProducts } from "@/services/magento/products/trendingProducts.service";
import { magentoQueryKeys } from "./queryKeys";

export function useMagentoTrendingProducts() {
  const fetcher = useCallback(
    (signal: AbortSignal) => getMagentoTrendingProducts(undefined, signal),
    [],
  );

  return useCmsSection<JewelleryListingProduct[]>(magentoQueryKeys.trendingProducts, fetcher, {
    staleTimeMs: MAGENTO_CATALOG_REVALIDATE_SECONDS * 1000,
  });
}

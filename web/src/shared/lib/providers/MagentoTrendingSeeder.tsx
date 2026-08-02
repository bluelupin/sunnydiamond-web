"use client";

import { useRef } from "react";
import { magentoQueryKeys } from "@/hooks/magento/queryKeys";
import { seedCmsCacheEntry } from "@/lib/homepage/cmsCache";
import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

type MagentoTrendingSeederProps = {
  trendingProducts?: JewelleryListingProduct[];
};

/** Seeds trending products cache on first render so the homepage carousel avoids a client scan. */
export default function MagentoTrendingSeeder({ trendingProducts }: MagentoTrendingSeederProps) {
  const seededRef = useRef(false);

  if (!seededRef.current && trendingProducts !== undefined) {
    seedCmsCacheEntry(magentoQueryKeys.trendingProducts, trendingProducts);
    seededRef.current = true;
  }

  return null;
}

"use client";

import { useCallback } from "react";
import { useCmsSection } from "@/hooks/homepage/useCmsSection";
import { magentoQueryKeys } from "./queryKeys";
import { getMagentoJewelleryNavCategories } from "@/services/magento/categories/categories.service";
import type { JewelleryNavCategoriesData } from "@/types/magento/jewelleryNav";

const JEWELLERY_NAV_STALE_TIME_MS = 5 * 60 * 1000;

export function useMagentoJewelleryNav() {
  const fetcher = useCallback(
    (signal: AbortSignal) => getMagentoJewelleryNavCategories(signal),
    [],
  );

  return useCmsSection<JewelleryNavCategoriesData>(
    magentoQueryKeys.jewelleryNav,
    fetcher,
    { staleTimeMs: JEWELLERY_NAV_STALE_TIME_MS },
  );
}

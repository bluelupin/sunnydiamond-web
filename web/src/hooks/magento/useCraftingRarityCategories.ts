"use client";

import { useCallback } from "react";
import { useCmsSection } from "@/hooks/homepage/useCmsSection";
import { magentoQueryKeys } from "./queryKeys";
import { getCraftingRarityCategories } from "@/services/magento/products/craftingRarityProducts.service";
import type { CraftingRarityCategoriesData } from "@/services/magento/products/craftingRarityProducts.service";

const CRAFTING_RARITY_STALE_TIME_MS = 5 * 60 * 1000;

export function useCraftingRarityCategories() {
  const fetcher = useCallback(
    (signal: AbortSignal) => getCraftingRarityCategories(signal),
    [],
  );

  return useCmsSection<CraftingRarityCategoriesData>(
    magentoQueryKeys.craftingRarityCategories,
    fetcher,
    { staleTimeMs: CRAFTING_RARITY_STALE_TIME_MS },
  );
}

"use client";

import { useCallback } from "react";
import { useCmsSection } from "./useCmsSection";
import { getHomepageShoppingBlocks } from "@/services/homepage/homepageShoppingBlocks.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageShoppingBlocks() {
  const fetcher = useCallback((signal: AbortSignal) => getHomepageShoppingBlocks(signal), []);

  return useCmsSection(homepageQueryKeys.homePageShoppingBlocks, fetcher);
}

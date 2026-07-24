"use client";

import { useCallback } from "react";
import { useHomepageCmsPrefetched } from "@/shared/lib/providers/HomepageCmsProvider";
import { useCmsSection } from "./useCmsSection";
import { getHomepageShoppingBlocks } from "@/services/homepage/homepageShoppingBlocks.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageShoppingBlocks() {
  const prefetched = useHomepageCmsPrefetched();
  const fetcher = useCallback((signal: AbortSignal) => getHomepageShoppingBlocks(signal), []);
  const section = useCmsSection(homepageQueryKeys.homePageShoppingBlocks, fetcher);

  if (prefetched?.shopping !== undefined) {
    return { data: prefetched.shopping, isLoading: false, error: undefined };
  }

  return section;
}

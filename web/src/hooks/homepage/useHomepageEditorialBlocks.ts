"use client";

import { useCallback } from "react";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import { useHomepageCmsPrefetched } from "@/shared/lib/providers/HomepageCmsProvider";
import { useCmsSection } from "./useCmsSection";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageEditorialBlocks() {
  const prefetched = useHomepageCmsPrefetched();
  const fetcher = useCallback((signal: AbortSignal) => getHomepageEditorialBlocks(signal), []);
  const section = useCmsSection<HomepageEditorialBlocksData>(
    homepageQueryKeys.homePageEditorialBlocks,
    fetcher,
  );

  if (prefetched?.editorial !== undefined) {
    return { data: prefetched.editorial, isLoading: false, error: undefined };
  }

  return section;
}

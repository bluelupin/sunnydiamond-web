"use client";

import { useCallback } from "react";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import { useCmsSection } from "./useCmsSection";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageEditorialBlocks() {
  const fetcher = useCallback((signal: AbortSignal) => getHomepageEditorialBlocks(signal), []);

  return useCmsSection<HomepageEditorialBlocksData>(
    homepageQueryKeys.homePageEditorialBlocks,
    fetcher,
  );
}

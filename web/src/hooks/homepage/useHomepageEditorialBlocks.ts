"use client";

import { useCallback } from "react";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import { useHomepageCmsPrefetched } from "@/shared/lib/providers/HomepageCmsProvider";
import { useCmsSection } from "./useCmsSection";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageEditorialBlocks(options?: { enabled?: boolean }) {
  const enabled = options?.enabled !== false;
  const prefetched = useHomepageCmsPrefetched();
  const fetcher = useCallback((signal: AbortSignal) => getHomepageEditorialBlocks(signal), []);
  const section = useCmsSection<HomepageEditorialBlocksData>(
    homepageQueryKeys.homePageEditorialBlocks,
    fetcher,
    { enabled },
  );

  if (!enabled) {
    return { data: undefined, isLoading: false, error: undefined };
  }

  if (prefetched?.editorial !== undefined) {
    return { data: prefetched.editorial, isLoading: false, error: undefined };
  }

  return section;
}

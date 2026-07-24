"use client";

import { useCallback } from "react";
import { useHomepageCmsPrefetched } from "@/shared/lib/providers/HomepageCmsProvider";
import { useCmsSection } from "./useCmsSection";
import { getHomepageOccasions } from "@/services/homepage/homepageOccasions.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageOccasions() {
  const prefetched = useHomepageCmsPrefetched();
  const fetcher = useCallback((signal: AbortSignal) => getHomepageOccasions(signal), []);
  const section = useCmsSection(homepageQueryKeys.homePageOccasions, fetcher);

  if (prefetched?.standaloneOccasions !== undefined) {
    return { data: prefetched.standaloneOccasions, isLoading: false, error: undefined };
  }

  return section;
}

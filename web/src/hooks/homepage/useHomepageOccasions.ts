"use client";

import { useCallback } from "react";
import { useCmsSection } from "./useCmsSection";
import { getHomepageOccasions } from "@/services/homepage/homepageOccasions.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageOccasions() {
  const fetcher = useCallback((signal: AbortSignal) => getHomepageOccasions(signal), []);

  return useCmsSection(homepageQueryKeys.homePageOccasions, fetcher);
}

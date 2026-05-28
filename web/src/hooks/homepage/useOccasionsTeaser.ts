"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getOccasionsTeaser } from "@/services/homepage/occasionsTeaser.service";
import type { OccasionsTeaserData } from "@/types/homepage/occasionsTeaser";

export function useOccasionsTeaser() {
  const fetcher = useCallback((signal: AbortSignal) => getOccasionsTeaser(signal), []);
  return useCmsSection<OccasionsTeaserData>(homepageQueryKeys.occasionsTeaser, fetcher);
}


"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getTrustBadges } from "@/services/homepage/trustBadges.service";
import type { TrustBadgesData } from "@/types/homepage/trustBadges";

export function useTrustBadges() {
  const fetcher = useCallback((signal: AbortSignal) => getTrustBadges(signal), []);
  return useCmsSection<TrustBadgesData>(homepageQueryKeys.trustBadges, fetcher);
}


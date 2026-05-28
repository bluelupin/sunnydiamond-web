"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getGiftingBanner } from "@/services/homepage/giftingBanner.service";
import type { GiftingBannerData } from "@/types/homepage/giftingBanner";

export function useGiftingBanner() {
  const fetcher = useCallback((signal: AbortSignal) => getGiftingBanner(signal), []);
  return useCmsSection<GiftingBannerData>(homepageQueryKeys.giftingBanner, fetcher);
}


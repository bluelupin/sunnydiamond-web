"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getBespokeForYouCards } from "@/services/homepage/bespokeCards.service";
import type { BespokeForYouCardsData } from "@/types/homepage/bespokeCards";

export function useBespokeForYouCards() {
  const fetcher = useCallback((signal: AbortSignal) => getBespokeForYouCards(signal), []);
  return useCmsSection<BespokeForYouCardsData>(homepageQueryKeys.bespokeCards, fetcher);
}


"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getFeaturedCollectionSection } from "@/services/homepage/featuredCollection.service";
import type { FeaturedCollectionData } from "@/types/homepage/featuredCollection";

export function useFeaturedCollectionSection() {
  const fetcher = useCallback((signal: AbortSignal) => getFeaturedCollectionSection(signal), []);
  return useCmsSection<FeaturedCollectionData>(homepageQueryKeys.featuredCollection, fetcher);
}


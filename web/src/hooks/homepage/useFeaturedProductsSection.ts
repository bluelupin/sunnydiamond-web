"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getFeaturedProductsSection } from "@/services/homepage/featuredProducts.service";
import type { FeaturedProductsData } from "@/types/homepage/featuredProducts";

export function useFeaturedProductsSection() {
  const fetcher = useCallback((signal: AbortSignal) => getFeaturedProductsSection(signal), []);
  return useCmsSection<FeaturedProductsData>(homepageQueryKeys.featuredProducts, fetcher);
}


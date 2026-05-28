"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getHeroSection } from "@/services/homepage/hero.service";
import type { HeroSectionData } from "@/types/homepage/hero";

export function useHeroSection() {
  const fetcher = useCallback((signal: AbortSignal) => getHeroSection(signal), []);
  return useCmsSection<HeroSectionData>(homepageQueryKeys.hero, fetcher);
}


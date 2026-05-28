"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getCategoryNavigationSection } from "@/services/homepage/categoryNavigation.service";
import type { CategoryNavigationSectionData } from "@/types/homepage/categoryNavigation";

export function useCategoryNavigationSection() {
  const fetcher = useCallback((signal: AbortSignal) => getCategoryNavigationSection(signal), []);
  return useCmsSection<CategoryNavigationSectionData>(homepageQueryKeys.categoryNavigation, fetcher);
}


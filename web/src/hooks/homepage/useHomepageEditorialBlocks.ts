"use client";

import { useCallback } from "react";
import { useCmsSection } from "./useCmsSection";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";

export function useHomepageEditorialBlocks() {
  const fetcher = useCallback((signal: AbortSignal) => getHomepageEditorialBlocks(signal), []);

  return useCmsSection("homepage-editorial-blocks", fetcher);
}

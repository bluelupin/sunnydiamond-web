"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getShowroomTeaser } from "@/services/homepage/showroomTeaser.service";
import type { ShowroomTeaserData } from "@/types/homepage/showroomTeaser";

export function useShowroomTeaser() {
  const fetcher = useCallback((signal: AbortSignal) => getShowroomTeaser(signal), []);
  return useCmsSection<ShowroomTeaserData>(homepageQueryKeys.showroomTeaser, fetcher);
}


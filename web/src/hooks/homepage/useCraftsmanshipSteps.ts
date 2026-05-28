"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getCraftsmanshipSteps } from "@/services/homepage/craftsmanshipSteps.service";
import type { CraftsmanshipStepsData } from "@/types/homepage/craftsmanshipSteps";

export function useCraftsmanshipSteps() {
  const fetcher = useCallback((signal: AbortSignal) => getCraftsmanshipSteps(signal), []);
  return useCmsSection<CraftsmanshipStepsData>(homepageQueryKeys.craftsmanshipSteps, fetcher);
}


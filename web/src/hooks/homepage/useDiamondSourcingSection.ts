"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getDiamondSourcingSection } from "@/services/homepage/diamondSourcing.service";
import type { DiamondSourcingData } from "@/types/homepage/diamondSourcing";

export function useDiamondSourcingSection() {
  const fetcher = useCallback((signal: AbortSignal) => getDiamondSourcingSection(signal), []);
  return useCmsSection<DiamondSourcingData>(homepageQueryKeys.diamondSourcing, fetcher);
}


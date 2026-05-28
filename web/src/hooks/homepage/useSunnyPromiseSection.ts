"use client";

import { useCallback } from "react";
import { homepageQueryKeys } from "./queryKeys";
import { useCmsSection } from "./useCmsSection";
import { getSunnyPromiseSection } from "@/services/homepage/sunnyPromise.service";
import type { SunnyPromiseData } from "@/types/homepage/sunnyPromise";

export function useSunnyPromiseSection() {
  const fetcher = useCallback((signal: AbortSignal) => getSunnyPromiseSection(signal), []);
  return useCmsSection<SunnyPromiseData>(homepageQueryKeys.sunnyPromise, fetcher);
}


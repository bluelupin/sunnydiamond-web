"use client";

import { useCallback } from "react";
import { useCmsSection } from "./useCmsSection";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageShell() {
  const fetcher = useCallback((signal: AbortSignal) => getHomepageShell(signal), []);

  return useCmsSection(homepageQueryKeys.homepageShell, fetcher);
}

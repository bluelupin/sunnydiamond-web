"use client";

import { useCallback } from "react";
import { useHomepageCmsPrefetched } from "@/shared/lib/providers/HomepageCmsProvider";
import { useCmsSection } from "./useCmsSection";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";
import { homepageQueryKeys } from "./queryKeys";

export function useHomepageShell() {
  const prefetched = useHomepageCmsPrefetched();
  const fetcher = useCallback((signal: AbortSignal) => getHomepageShell(signal), []);
  const section = useCmsSection(homepageQueryKeys.homepageShell, fetcher);

  if (prefetched?.shell !== undefined) {
    return { data: prefetched.shell, isLoading: false, error: undefined };
  }

  return section;
}

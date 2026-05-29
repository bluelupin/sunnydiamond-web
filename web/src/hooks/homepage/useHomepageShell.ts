"use client";

import { useCallback } from "react";
import { useCmsSection } from "./useCmsSection";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";

export function useHomepageShell() {
  const fetcher = useCallback((signal: AbortSignal) => getHomepageShell(signal), []);

  return useCmsSection("homepage-shell", fetcher);
}

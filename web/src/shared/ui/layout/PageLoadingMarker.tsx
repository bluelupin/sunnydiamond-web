"use client";

import { useEffect } from "react";
import { usePageLoading } from "@/shared/context/PageLoadingContext";

/** Mount inside route `loading.tsx` fallbacks to keep the header in loading styling. */
export default function PageLoadingMarker() {
  const { beginPageLoading, endPageLoading } = usePageLoading();

  useEffect(() => {
    beginPageLoading();
    return () => endPageLoading();
  }, [beginPageLoading, endPageLoading]);

  return null;
}

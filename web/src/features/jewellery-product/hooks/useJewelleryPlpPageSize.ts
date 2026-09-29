"use client";

import { useEffect, useState } from "react";
import { DESKTOP_PAGE_SIZE, MOBILE_PAGE_SIZE } from "../data/filters";

const MD_BREAKPOINT = "(min-width: 768px)";

export function getJewelleryPlpPageSize(isDesktopViewport: boolean): number {
  return isDesktopViewport ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE;
}

function readViewportPageSize(): number {
  if (typeof window === "undefined") {
    return DESKTOP_PAGE_SIZE;
  }

  return getJewelleryPlpPageSize(window.matchMedia(MD_BREAKPOINT).matches);
}

export function useJewelleryPlpPageSize(): number {
  const [pageSize, setPageSize] = useState(readViewportPageSize);

  useEffect(() => {
    const media = window.matchMedia(MD_BREAKPOINT);

    const syncPageSize = () => {
      setPageSize(getJewelleryPlpPageSize(media.matches));
    };

    syncPageSize();
    media.addEventListener("change", syncPageSize);

    return () => {
      media.removeEventListener("change", syncPageSize);
    };
  }, []);

  return pageSize;
}

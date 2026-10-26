"use client";

import { useSyncExternalStore } from "react";

const LG_MEDIA_QUERY = "(min-width: 1024px)";

/** Matches Tailwind `lg:` — avoids mounting hidden `<video>` elements (iOS WebKit breaks on display:none videos). */
export function useMinLgViewport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(LG_MEDIA_QUERY);
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(LG_MEDIA_QUERY).matches,
    () => false,
  );
}

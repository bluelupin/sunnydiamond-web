"use client";

import { useEffect, useState } from "react";
import { TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";

const MOBILE_LAZY_ROOT_MARGIN = "120px 0px 120px 0px";
const DESKTOP_LAZY_ROOT_MARGIN = "280px 0px 280px 0px";

export function useResponsiveLazyRootMargin(override?: string): string {
  const [rootMargin, setRootMargin] = useState(override ?? MOBILE_LAZY_ROOT_MARGIN);

  useEffect(() => {
    if (override) {
      setRootMargin(override);
      return;
    }

    const media = window.matchMedia(TABLET_UP_MEDIA_QUERY);
    const update = () => {
      setRootMargin(media.matches ? DESKTOP_LAZY_ROOT_MARGIN : MOBILE_LAZY_ROOT_MARGIN);
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [override]);

  return rootMargin;
}

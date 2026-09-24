"use client";

import { useEffect, useState } from "react";

const MOBILE_DRAWER_TOP_OFFSET_REM = 3;

/**
 * Keeps a bottom drawer within the visible viewport when the mobile keyboard opens.
 */
export function useMobileDrawerMaxHeight(open: boolean, enabled: boolean) {
  const [maxHeight, setMaxHeight] = useState<string | undefined>();

  useEffect(() => {
    if (!enabled || !open) {
      setMaxHeight(undefined);
      return;
    }

    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }

    const update = () => {
      setMaxHeight(`calc(${Math.round(viewport.height)}px - ${MOBILE_DRAWER_TOP_OFFSET_REM}rem)`);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [enabled, open]);

  return maxHeight;
}

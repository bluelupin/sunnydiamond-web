"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const DEFAULT_CLEARANCE_PX = 320;
/** Extra space so the last field clears the sticky bar comfortably. */
const CLEARANCE_BUFFER_PX = 32;

/**
 * Measures a fixed mobile sticky footer and returns clearance for page content.
 * Pair with `MobileStickyFooterSpacer` — Tailwind cannot generate runtime padding classes.
 */
export function useMobileStickyFooterClearance() {
  const [footerNode, setFooterNode] = useState<HTMLDivElement | null>(null);
  const [clearancePx, setClearancePx] = useState(DEFAULT_CLEARANCE_PX);

  const footerRef = useCallback((node: HTMLDivElement | null) => {
    setFooterNode(node);
  }, []);

  useLayoutEffect(() => {
    if (!footerNode) return;

    const updateClearance = () => {
      const measured = footerNode.getBoundingClientRect().height;
      if (measured > 0) {
        setClearancePx(Math.ceil(measured + CLEARANCE_BUFFER_PX));
      }
    };

    updateClearance();

    const observer = new ResizeObserver(updateClearance);
    observer.observe(footerNode);

    return () => observer.disconnect();
  }, [footerNode]);

  useEffect(() => {
    if (!footerNode) return;

    const updateClearance = () => {
      const measured = footerNode.getBoundingClientRect().height;
      if (measured > 0) {
        setClearancePx(Math.ceil(measured + CLEARANCE_BUFFER_PX));
      }
    };

    window.addEventListener("resize", updateClearance);

    return () => window.removeEventListener("resize", updateClearance);
  }, [footerNode]);

  return { footerRef, clearancePx };
}

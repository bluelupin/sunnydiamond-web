"use client";

import { useEffect } from "react";

/** Clears inline overflow locks left by modals/overlays after navigation. */
export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;

  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("overflow");
}

/**
 * Locks document body scroll while `locked` is true.
 * Restores the previous inline overflow on cleanup and after bfcache restore.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) {
      unlockBodyScroll();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onPageShow = () => {
      if (!locked) {
        unlockBodyScroll();
      }
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.body.style.overflow = previousOverflow;
      unlockBodyScroll();
    };
  }, [locked]);
}

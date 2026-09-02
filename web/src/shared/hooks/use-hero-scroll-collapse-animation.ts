"use client";

import { useEffect, useRef, useState } from "react";

/** Scroll distance over which the hero reaches full inset (0 → 1). */
export const HERO_SCROLL_COLLAPSE_RANGE_PX = 120;

export interface HeroScrollCollapseAnimationState {
  /** Scroll-driven expansion amount from 0 (full bleed) to 1 (fully inset). */
  progress: number;
  /** @deprecated Use `progress` — true when fully expanded (`progress >= 1`). */
  expanded: boolean;
  titleVisible: boolean;
  reducedMotion: boolean;
}

type UseHeroScrollCollapseAnimationOptions = {
  titleDelayMs: number;
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Hero scroll collapse: inset progresses with scroll position down, reverses on scroll up.
 */
export function useHeroScrollCollapseAnimation({
  titleDelayMs,
}: UseHeroScrollCollapseAnimationOptions): HeroScrollCollapseAnimationState {
  const [progress, setProgress] = useState(0);
  const [titleVisible, setTitleVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const progressRef = useRef(0);
  const titleTimerRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearTitleTimer = () => {
      window.clearTimeout(titleTimerRef.current);
      titleTimerRef.current = 0;
    };

    const applyProgress = (nextProgress: number) => {
      const clamped = clampProgress(nextProgress);
      if (clamped === progressRef.current) return;

      progressRef.current = clamped;
      setProgress(clamped);

      if (clamped >= 1) {
        clearTitleTimer();
        titleTimerRef.current = window.setTimeout(() => {
          setTitleVisible(true);
          titleTimerRef.current = 0;
        }, titleDelayMs);
      } else if (clamped <= 0) {
        clearTitleTimer();
        setTitleVisible(true);
      }
    };

    const syncFromScroll = () => {
      applyProgress(window.scrollY / HERO_SCROLL_COLLAPSE_RANGE_PX);
    };

    const onScroll = () => {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        syncFromScroll();
      });
    };

    if (motionQuery.matches) {
      setReducedMotion(true);
      progressRef.current = 0;
      setProgress(0);
      setTitleVisible(true);
      return;
    }

    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      clearTitleTimer();
    };
  }, [titleDelayMs]);

  return {
    progress,
    expanded: progress >= 1,
    titleVisible,
    reducedMotion,
  };
}

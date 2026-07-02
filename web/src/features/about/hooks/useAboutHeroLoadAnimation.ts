"use client";

import { useEffect, useRef, useState } from "react";
import { aboutHeroFigmaSpec } from "../data/content";

export interface AboutHeroLoadAnimationState {
  expanded: boolean;
  titleVisible: boolean;
  reducedMotion: boolean;
}

const { animation } = aboutHeroFigmaSpec;

/** Scroll past this threshold to expand; at or below it the hero returns to collapsed. */
const SCROLL_EXPAND_THRESHOLD_PX = 8;

/**
 * Figma "Hero — Scroll Collapse" (692:26924):
 * Collapsed at top → expanded on scroll down → collapsed again when scrolled back to top.
 */
export function useAboutHeroLoadAnimation(): AboutHeroLoadAnimationState {
  const [expanded, setExpanded] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const expandedRef = useRef(false);
  const titleTimerRef = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearTitleTimer = () => {
      window.clearTimeout(titleTimerRef.current);
      titleTimerRef.current = 0;
    };

    const applyExpandedState = (shouldExpand: boolean) => {
      if (shouldExpand === expandedRef.current) return;

      expandedRef.current = shouldExpand;
      setExpanded(shouldExpand);

      if (shouldExpand) {
        clearTitleTimer();
        titleTimerRef.current = window.setTimeout(() => {
          setTitleVisible(true);
          titleTimerRef.current = 0;
        }, animation.titleDelayMs);
      } else {
        clearTitleTimer();
        setTitleVisible(false);
      }
    };

    const syncFromScroll = () => {
      applyExpandedState(window.scrollY > SCROLL_EXPAND_THRESHOLD_PX);
    };

    if (motionQuery.matches) {
      setReducedMotion(true);
      expandedRef.current = true;
      setExpanded(true);
      setTitleVisible(true);
      return;
    }

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      clearTitleTimer();
    };
  }, []);

  return { expanded, titleVisible, reducedMotion };
}

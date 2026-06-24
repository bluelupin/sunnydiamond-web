"use client";

import { useEffect, useState } from "react";
import { aboutHeroFigmaSpec } from "../data/content";

export interface AboutHeroLoadAnimationState {
  expanded: boolean;
  titleVisible: boolean;
  reducedMotion: boolean;
}

const { animation } = aboutHeroFigmaSpec;

/**
 * Figma "Hero — Scroll Collapse" (692:26924) initial load:
 * State=2-Collapsed → State=1-Expanded via Smart Animate (width + Y).
 */
export function useAboutHeroLoadAnimation(): AboutHeroLoadAnimationState {
  const [expanded, setExpanded] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      setReducedMotion(true);
      setExpanded(true);
      setTitleVisible(true);
      return;
    }

    const expandFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setExpanded(true));
    });

    const titleTimer = window.setTimeout(
      () => setTitleVisible(true),
      animation.titleDelayMs,
    );

    return () => {
      cancelAnimationFrame(expandFrame);
      window.clearTimeout(titleTimer);
    };
  }, []);

  return { expanded, titleVisible, reducedMotion };
}
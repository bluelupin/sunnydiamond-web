"use client";

import { useEffect, useState } from "react";

export interface EducationHeroLoadAnimationState {
  expanded: boolean;
  titleVisible: boolean;
  reducedMotion: boolean;
}

const TITLE_DELAY_MS = 400;

export function useEducationHeroLoadAnimation(): EducationHeroLoadAnimationState {
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

    const titleTimer = window.setTimeout(() => setTitleVisible(true), TITLE_DELAY_MS);

    return () => {
      cancelAnimationFrame(expandFrame);
      window.clearTimeout(titleTimer);
    };
  }, []);

  return { expanded, titleVisible, reducedMotion };
}

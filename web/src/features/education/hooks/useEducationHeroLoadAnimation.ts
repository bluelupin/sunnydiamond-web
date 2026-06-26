"use client";

import { useEffect, useState } from "react";
import { educationHeroFigmaSpec } from "../data/content";

export interface EducationHeroLoadAnimationState {
  expanded: boolean;
  reducedMotion: boolean;
}

const { animation } = educationHeroFigmaSpec;

/**
 * Figma 692:28386 — Hero Diamond Expertise Scroll Collapse.
 * Collapsed on load → expanded on first scroll.
 */
export function useEducationHeroLoadAnimation(): EducationHeroLoadAnimationState {
  const [expanded, setExpanded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      setReducedMotion(true);
      setExpanded(true);
      return;
    }

    let expandFrame = 0;
    let triggered = false;

    const triggerExpand = () => {
      if (triggered) return;
      triggered = true;

      expandFrame = requestAnimationFrame(() => {
        expandFrame = requestAnimationFrame(() => setExpanded(true));
      });
    };

    if (window.scrollY > 0) {
      triggerExpand();
      return () => cancelAnimationFrame(expandFrame);
    }

    const onScroll = () => {
      triggerExpand();
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(expandFrame);
    };
  }, []);

  return { expanded, reducedMotion };
}

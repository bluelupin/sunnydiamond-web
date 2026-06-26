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
 * Figma "Hero — Scroll Collapse" (692:26924):
 * State=2-Collapsed (static on load) → State=1-Expanded on first user scroll.
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

    let expandFrame = 0;
    let titleTimer = 0;
    let triggered = false;

    const triggerExpand = () => {
      if (triggered) return;
      triggered = true;

      expandFrame = requestAnimationFrame(() => {
        expandFrame = requestAnimationFrame(() => setExpanded(true));
      });

      titleTimer = window.setTimeout(
        () => setTitleVisible(true),
        animation.titleDelayMs,
      );
    };

    if (window.scrollY > 0) {
      triggerExpand();
      return () => {
        cancelAnimationFrame(expandFrame);
        window.clearTimeout(titleTimer);
      };
    }

    const onScroll = () => {
      triggerExpand();
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(expandFrame);
      window.clearTimeout(titleTimer);
    };
  }, []);

  return { expanded, titleVisible, reducedMotion };
}

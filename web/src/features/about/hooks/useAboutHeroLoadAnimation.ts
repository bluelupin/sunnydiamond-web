"use client";

import { useHeroScrollCollapseAnimation } from "@/shared/hooks/use-hero-scroll-collapse-animation";
import { aboutHeroFigmaSpec } from "../data/content";

export type AboutHeroLoadAnimationState = ReturnType<
  typeof useAboutHeroLoadAnimation
>;

const { animation } = aboutHeroFigmaSpec;

/** Figma "Hero — Scroll Collapse" (692:26924). */
export function useAboutHeroLoadAnimation() {
  return useHeroScrollCollapseAnimation({
    titleDelayMs: animation.titleDelayMs,
  });
}

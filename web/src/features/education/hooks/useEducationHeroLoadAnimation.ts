"use client";

import { useHeroScrollCollapseAnimation } from "@/shared/hooks/use-hero-scroll-collapse-animation";
import { educationHeroFigmaSpec } from "../data/content";

export type EducationHeroLoadAnimationState = ReturnType<
  typeof useEducationHeroLoadAnimation
>;

const { animation } = educationHeroFigmaSpec;

/** Figma 692:28386 — Hero Diamond Expertise Scroll Collapse. */
export function useEducationHeroLoadAnimation() {
  return useHeroScrollCollapseAnimation({
    titleDelayMs: animation.titleDelayMs,
  });
}

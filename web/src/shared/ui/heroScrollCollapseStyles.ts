import type { CSSProperties } from "react";

/** Figma hero scroll-collapse — full inset targets */
export const HERO_SCROLL_COLLAPSE_HORIZONTAL_INSET_PERCENT = 4;
export const HERO_SCROLL_COLLAPSE_BOTTOM_INSET_PX = 20;

function clampProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

export function getHeroScrollCollapseFrameStyle(progress: number): CSSProperties {
  const amount = clampProgress(progress);

  return {
    top: 0,
    left: `${amount * HERO_SCROLL_COLLAPSE_HORIZONTAL_INSET_PERCENT}%`,
    right: `${amount * HERO_SCROLL_COLLAPSE_HORIZONTAL_INSET_PERCENT}%`,
    bottom: `${amount * HERO_SCROLL_COLLAPSE_BOTTOM_INSET_PX}px`,
  };
}

export function getHeroScrollCollapseTitleStyle(progress: number): CSSProperties {
  const amount = clampProgress(progress);

  return {
    bottom: `${amount * HERO_SCROLL_COLLAPSE_BOTTOM_INSET_PX}px`,
  };
}

export const heroScrollCollapseFrameBaseClass = "absolute overflow-hidden";

export const heroScrollCollapseTitleBaseClass =
  "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5";

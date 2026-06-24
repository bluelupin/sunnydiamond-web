"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { aboutCraftingRarityFigmaSpec } from "../data/content";

export interface CraftingRarityRevealState {
  progress: number;
  headingReveal: number;
  imageReveal: number;
  lineReveal: number;
  lineFill: number;
  bodyReveal: number;
  reducedMotion: boolean;
}

const { animation: animationSpec } = aboutCraftingRarityFigmaSpec;
const { segments } = animationSpec;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const segmentReveal = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));

const fullRevealed = (reducedMotion: boolean): CraftingRarityRevealState => ({
  progress: 1,
  headingReveal: 1,
  imageReveal: 1,
  lineReveal: 1,
  lineFill: 1,
  bodyReveal: 1,
  reducedMotion,
});

const hidden: CraftingRarityRevealState = {
  progress: 0,
  headingReveal: 0,
  imageReveal: 0,
  lineReveal: 0,
  lineFill: 0,
  bodyReveal: 0,
  reducedMotion: false,
};

/**
 * Scroll-scrubbed Reveal V2 — progress 0→1 as the section travels through
 * the viewport (top at viewport bottom → bottom at viewport top).
 */
export function useCraftingRarityScrollReveal(
  sectionRef: RefObject<HTMLElement | null>,
): CraftingRarityRevealState {
  const [state, setState] = useState<CraftingRarityRevealState>(hidden);
  const rafRef = useRef<number | null>(null);
  const sectionNodeRef = useRef<HTMLElement | null>(null);

  const applyProgress = useCallback((progress: number, reducedMotion: boolean) => {
    setState({
      progress,
      headingReveal: segmentReveal(
        progress,
        segments.heading.start,
        segments.heading.end,
      ),
      imageReveal: segmentReveal(
        progress,
        segments.image.start,
        segments.image.end,
      ),
      lineReveal: segmentReveal(
        progress,
        segments.line.start,
        segments.line.end,
      ),
      lineFill: segmentReveal(
        progress,
        segments.lineFill.start,
        segments.lineFill.end,
      ),
      bodyReveal: segmentReveal(
        progress,
        segments.body.start,
        segments.body.end,
      ),
      reducedMotion,
    });
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    sectionNodeRef.current = section;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const computeProgress = () => {
      const node = sectionNodeRef.current;
      if (!node) return 0;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = Math.max(rect.height, 1);

      // 0 when section top meets viewport bottom; 1 when section bottom meets viewport top
      const scrollSpan = viewportHeight + sectionHeight;
      return clamp((viewportHeight - rect.top) / scrollSpan);
    };

    const update = () => {
      rafRef.current = null;
      const progress = computeProgress();

      if (motionQuery.matches) {
        if (progress >= animationSpec.viewportVisibleThreshold) {
          setState(fullRevealed(true));
        } else {
          setState({ ...hidden, reducedMotion: true });
        }
        return;
      }

      applyProgress(progress, false);
    };

    const scheduleUpdate = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    document.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const resizeObserver = new ResizeObserver(() => scheduleUpdate());
    resizeObserver.observe(section);

    const onMotionChange = () => scheduleUpdate();
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      document.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      motionQuery.removeEventListener("change", onMotionChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [applyProgress, sectionRef]);

  return state;
}

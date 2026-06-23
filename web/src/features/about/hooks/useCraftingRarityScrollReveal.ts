"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { aboutCraftingRarityFigmaSpec } from "../data/content";

export interface CraftingRarityRevealState {
  progress: number;
  headingReveal: number;
  imageReveal: number;
  lineReveal: number;
  lineFill: number;
  descriptionReveal: number;
  reducedMotion: boolean;
}

const { animation: animationSpec } = aboutCraftingRarityFigmaSpec;
const { segments } = animationSpec;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const segmentReveal = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));

/**
 * Sticky scroll-track progress for Figma "Crafting Rarity — Reveal V2":
 * Heading mask → Image mask → Line mask + fill → Body fade.
 * Progress begins as soon as the section enters the viewport.
 */
export function useCraftingRarityScrollReveal(
  sectionRef: RefObject<HTMLElement | null>,
): CraftingRarityRevealState {
  const [state, setState] = useState<CraftingRarityRevealState>({
    progress: 0,
    headingReveal: 0,
    imageReveal: 0,
    lineReveal: 0,
    lineFill: 0,
    descriptionReveal: 0,
    reducedMotion: false,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setReducedMotionState = (revealed: boolean) => {
      setState({
        progress: revealed ? 1 : 0,
        headingReveal: revealed ? 1 : 0,
        imageReveal: revealed ? 1 : 0,
        lineReveal: revealed ? 1 : 0,
        lineFill: revealed ? 1 : 0,
        descriptionReveal: revealed ? 1 : 0,
        reducedMotion: true,
      });
    };

    if (motionQuery.matches) {
      const observer = new IntersectionObserver(
        ([entry]) => setReducedMotionState(entry.isIntersecting),
        { threshold: 0.12 },
      );
      observer.observe(section);
      return () => observer.disconnect();
    }

    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const trackHeight = Math.max(section.offsetHeight - viewportHeight, 1);

      // Start at 0 when the section first enters the viewport (top at bottom edge),
      // reach 1 when the sticky scroll track is fully consumed.
      const enterStart = viewportHeight;
      const enterEnd = -trackHeight;
      const scrollRange = enterStart - enterEnd;
      const progress = clamp((enterStart - rect.top) / scrollRange);

      setState({
        progress,
        headingReveal: segmentReveal(progress, segments.heading.start, segments.heading.end),
        imageReveal: segmentReveal(progress, segments.image.start, segments.image.end),
        lineReveal: segmentReveal(progress, segments.line.start, segments.line.end),
        lineFill: segmentReveal(progress, segments.lineFill.start, segments.lineFill.end),
        descriptionReveal: segmentReveal(
          progress,
          segments.description.start,
          segments.description.end,
        ),
        reducedMotion: false,
      });
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onMotionChange = () => {
      if (motionQuery.matches) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        setReducedMotionState(true);
      }
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionQuery.removeEventListener("change", onMotionChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sectionRef]);

  return state;
}

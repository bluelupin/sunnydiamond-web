"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface CraftingRarityRevealState {
  progress: number;
  headingActive: boolean;
  imageActive: boolean;
  lineFill: number;
  descriptionActive: boolean;
  reducedMotion: boolean;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Scroll reveal sequence aligned with Figma "Crafting Rarity — Reveal V2":
 * Heading → Image → Line (0→79px gradient) → Body
 */
export function useCraftingRarityScrollReveal(
  sectionRef: RefObject<HTMLElement | null>,
): CraftingRarityRevealState {
  const [state, setState] = useState<CraftingRarityRevealState>({
    progress: 0,
    headingActive: false,
    imageActive: false,
    lineFill: 0,
    descriptionActive: false,
    reducedMotion: false,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setReducedMotionState = () => {
      setState({
        progress: 1,
        headingActive: true,
        imageActive: true,
        lineFill: 1,
        descriptionActive: true,
        reducedMotion: true,
      });
    };

    if (motionQuery.matches) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setReducedMotionState();
          observer.disconnect();
        },
        { threshold: 0.12 },
      );
      observer.observe(section);
      return () => observer.disconnect();
    }

    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.9;
      const scrollRange = viewportHeight * 0.75 + rect.height * 0.4;
      const progress = clamp((start - rect.top) / scrollRange);

      setState({
        progress,
        headingActive: progress >= 0.06,
        imageActive: progress >= 0.24,
        lineFill: clamp((progress - 0.4) / 0.3),
        descriptionActive: progress >= 0.76,
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
        setReducedMotionState();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
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

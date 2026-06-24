"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { aboutCraftingRarityFigmaSpec } from "../data/content";

export interface CraftingRarityRevealSteps {
  heading: boolean;
  image: boolean;
  line: boolean;
  body: boolean;
  lineFill: number;
  reducedMotion: boolean;
  complete: boolean;
}

const { animation: animationSpec } = aboutCraftingRarityFigmaSpec;

const allRevealed: CraftingRarityRevealSteps = {
  heading: true,
  image: true,
  line: true,
  body: true,
  lineFill: 1,
  reducedMotion: false,
  complete: true,
};

const hidden: CraftingRarityRevealSteps = {
  heading: false,
  image: false,
  line: false,
  body: false,
  lineFill: 0,
  reducedMotion: false,
  complete: false,
};

/**
 * Figma "Crafting Rarity — Reveal V2" (692:26945):
 * Auto-plays once at 25% visibility — Heading → Image → Line → Body.
 * Smart Animate mask height + body opacity. No reverse on scroll up.
 */
export function useCraftingRarityLoadReveal(
  sectionRef: RefObject<HTMLElement | null>,
): CraftingRarityRevealSteps {
  const [steps, setSteps] = useState<CraftingRarityRevealSteps>(hidden);
  const hasPlayedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const belowFoldOnMountRef = useRef(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };

    const schedule = (callback: () => void, delayMs: number) => {
      const id = window.setTimeout(callback, delayMs);
      timersRef.current.push(id);
    };

    const playSequence = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;

      if (motionQuery.matches) {
        setSteps({ ...allRevealed, reducedMotion: true });
        return;
      }

      const { initialDelayMs, stepDurationMs, stepGapMs } = animationSpec;
      let delay = initialDelayMs;

      schedule(() => setSteps((prev) => ({ ...prev, heading: true })), delay);
      delay += stepDurationMs + stepGapMs;

      schedule(() => setSteps((prev) => ({ ...prev, image: true })), delay);
      delay += stepDurationMs + stepGapMs;

      schedule(
        () => setSteps((prev) => ({ ...prev, line: true, lineFill: 1 })),
        delay,
      );
      delay += stepDurationMs + stepGapMs;

      schedule(
        () =>
          setSteps((prev) => ({
            ...prev,
            body: true,
            complete: true,
          })),
        delay,
      );
    };

    const mountRect = section.getBoundingClientRect();
    belowFoldOnMountRef.current = mountRect.top >= window.innerHeight;

    const onScroll = () => {
      hasScrolledRef.current = true;
    };

    const canTrigger = () =>
      belowFoldOnMountRef.current ||
      hasScrolledRef.current ||
      window.scrollY > 0;

    const { viewportVisibleThreshold } = animationSpec;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (hasPlayedRef.current || !entry.isIntersecting) return;
        if (entry.intersectionRatio < viewportVisibleThreshold) return;

        if (motionQuery.matches) {
          playSequence();
          observer.disconnect();
          return;
        }

        if (!canTrigger()) return;

        playSequence();
        observer.disconnect();
      },
      { threshold: [0, viewportVisibleThreshold, 0.5, 0.75] },
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    observer.observe(section);

    const onMotionChange = () => {
      if (motionQuery.matches && hasPlayedRef.current) {
        clearTimers();
        setSteps({ ...allRevealed, reducedMotion: true });
      }
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      clearTimers();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [sectionRef]);

  return steps;
}

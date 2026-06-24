"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface ScrollProgressLineState {
  lineFill: number;
  visible: boolean;
  reducedMotion: boolean;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Bidirectional scroll progress for a centered vertical line (0 → 1 fill on scroll down,
 * reverses smoothly on scroll up). Matches AboutCraftingRaritySection line behavior.
 */
export function useScrollProgressLine(
  sectionRef: RefObject<HTMLElement | null>,
): ScrollProgressLineState {
  const [state, setState] = useState<ScrollProgressLineState>({
    lineFill: 0,
    visible: false,
    reducedMotion: false,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setReducedMotionState = (isVisible: boolean) => {
      setState({
        lineFill: isVisible ? 1 : 0,
        visible: isVisible,
        reducedMotion: true,
      });
    };

    if (motionQuery.matches) {
      const observer = new IntersectionObserver(
        ([entry]) => setReducedMotionState(entry.isIntersecting),
        { threshold: 0.2 },
      );
      observer.observe(section);
      return () => observer.disconnect();
    }

    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const enterStart = viewportHeight * 0.9;
      const fillComplete = viewportHeight * 0.42;
      const scrollRange = enterStart - fillComplete;
      const lineFill = clamp((enterStart - rect.top) / scrollRange);

      setState({
        lineFill,
        visible: lineFill > 0.02,
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
        update();
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

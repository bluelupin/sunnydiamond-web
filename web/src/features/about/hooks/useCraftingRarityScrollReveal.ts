"use client";

import { useLayoutEffect, type RefObject } from "react";
import { aboutCraftingRarityFigmaSpec } from "../data/content";

const { animation: animationSpec, line: lineSpec } = aboutCraftingRarityFigmaSpec;
const { segments } = animationSpec;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const segmentReveal = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));

const applyMaskReveal = (element: HTMLElement, reveal: number) => {
  const value = clamp(reveal);
  const maskHeight = `${value * 100}%`;
  const clip = `inset(0 0 ${(1 - value) * 100}% 0 round 0)`;

  element.style.clipPath = clip;
  element.style.setProperty("-webkit-clip-path", clip);
  element.style.maskImage = "linear-gradient(black, black)";
  element.style.setProperty("-webkit-mask-image", "linear-gradient(black, black)");
  element.style.maskSize = `100% ${maskHeight}`;
  element.style.setProperty("-webkit-mask-size", `100% ${maskHeight}`);
  element.style.maskRepeat = "no-repeat";
  element.style.setProperty("-webkit-mask-repeat", "no-repeat");
  element.style.maskPosition = "top";
  element.style.setProperty("-webkit-mask-position", "top");
};

const clearMaskReveal = (element: HTMLElement) => {
  element.style.clipPath = "";
  element.style.removeProperty("-webkit-clip-path");
  element.style.maskImage = "";
  element.style.removeProperty("-webkit-mask-image");
  element.style.maskSize = "";
  element.style.removeProperty("-webkit-mask-size");
  element.style.maskRepeat = "";
  element.style.removeProperty("-webkit-mask-repeat");
  element.style.maskPosition = "";
  element.style.removeProperty("-webkit-mask-position");
};

/**
 * Scroll-scrubbed Reveal V2 — updates mask styles directly on DOM nodes (no per-frame React state).
 */
export function useCraftingRarityScrollReveal(
  sectionRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headingMask = section.querySelector<HTMLElement>('[data-reveal-mask="heading"]');
    const imageMask = section.querySelector<HTMLElement>('[data-reveal-mask="image"]');
    const lineMask = section.querySelector<HTMLElement>('[data-reveal-mask="line"]');
    const bodyMask = section.querySelector<HTMLElement>('[data-reveal-mask="body"]');
    const lineWrapper = section.querySelector<HTMLElement>('[data-reveal-line="wrapper"]');
    const lineFill = section.querySelector<HTMLElement>('[data-reveal-line="fill"]');

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafRef: number | null = null;

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = Math.max(rect.height, 1);
      const scrollSpan = viewportHeight + sectionHeight;
      return clamp((viewportHeight - rect.top) / scrollSpan);
    };

    const applyFullReveal = () => {
      for (const mask of [headingMask, imageMask, lineMask, bodyMask]) {
        if (mask) clearMaskReveal(mask);
      }
      if (lineWrapper) lineWrapper.style.opacity = "1";
      if (lineFill) lineFill.style.transform = "scaleY(1)";
    };

    const applyHidden = () => {
      for (const mask of [headingMask, imageMask, lineMask, bodyMask]) {
        if (mask) applyMaskReveal(mask, 0);
      }
      if (lineWrapper) lineWrapper.style.opacity = "0";
      if (lineFill) lineFill.style.transform = "scaleY(0)";
    };

    const update = () => {
      rafRef = null;

      if (motionQuery.matches) {
        if (computeProgress() >= animationSpec.viewportVisibleThreshold) {
          applyFullReveal();
        } else {
          applyHidden();
        }
        return;
      }

      const progress = computeProgress();
      if (headingMask) {
        applyMaskReveal(
          headingMask,
          segmentReveal(progress, segments.heading.start, segments.heading.end),
        );
      }
      if (imageMask) {
        applyMaskReveal(
          imageMask,
          segmentReveal(progress, segments.image.start, segments.image.end),
        );
      }
      if (lineMask) {
        const lineReveal = segmentReveal(progress, segments.line.start, segments.line.end);
        applyMaskReveal(lineMask, lineReveal);
        if (lineWrapper) {
          lineWrapper.style.opacity = lineReveal > 0.02 ? "1" : "0";
        }
      }
      if (bodyMask) {
        applyMaskReveal(
          bodyMask,
          segmentReveal(progress, segments.image.start, segments.image.end),
        );
      }
      if (lineFill) {
        lineFill.style.transform = `scaleY(${segmentReveal(
          progress,
          segments.lineFill.start,
          segments.lineFill.end,
        )})`;
      }
    };

    const scheduleUpdate = () => {
      if (rafRef !== null) return;
      rafRef = window.requestAnimationFrame(update);
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
      if (rafRef !== null) window.cancelAnimationFrame(rafRef);
    };
  }, [sectionRef]);
}

export { lineSpec as craftingRarityLineSpec };

"use client";

import { useLayoutEffect, type RefObject } from "react";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/**
 * Pins the Since 1997 gallery while scrolling, scrubbing horizontal translate on the track.
 */
export function useSince1997HorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  viewportRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport) return;

    const spacer = section.querySelector<HTMLElement>("[data-since1997-scroll-spacer]");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    let rafRef: number | null = null;
    let maxOffset = 0;

    const remeasure = () => {
      if (!desktopQuery.matches) {
        if (spacer) spacer.style.height = "0px";
        maxOffset = 0;
        track.style.transform = "";
        return;
      }

      maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const scrollDistance = Math.max(window.innerHeight, maxOffset + 160);
      if (spacer) spacer.style.height = `${scrollDistance}px`;
    };

    const update = () => {
      rafRef = null;

      if (!desktopQuery.matches || motionQuery.matches) {
        track.style.transform = "";
        return;
      }

      const spacerHeight = spacer?.offsetHeight ?? 0;
      if (spacerHeight <= 0 || maxOffset <= 0) {
        track.style.transform = "";
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop > 0) {
        track.style.transform = "";
        return;
      }

      const progress = clamp(-sectionTop / spacerHeight);
      track.style.transform = `translate3d(${(-progress * maxOffset).toFixed(2)}px, 0, 0)`;
    };

    const scheduleUpdate = () => {
      if (rafRef !== null) return;
      rafRef = window.requestAnimationFrame(update);
    };

    const scheduleRemeasure = () => {
      remeasure();
      scheduleUpdate();
    };

    remeasure();
    scheduleUpdate();

    const delayedRemeasureTimers = [150, 600, 1500].map((delay) =>
      window.setTimeout(scheduleRemeasure, delay),
    );

    const resizeObserver = new ResizeObserver(() => scheduleRemeasure());
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);
    if (spacer) resizeObserver.observe(spacer);

    const images = track.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", scheduleRemeasure, { once: true });
      }
    });

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleRemeasure);
    window.addEventListener("load", scheduleRemeasure);

    const onPreferenceChange = () => {
      remeasure();
      scheduleUpdate();
    };

    motionQuery.addEventListener("change", onPreferenceChange);
    desktopQuery.addEventListener("change", onPreferenceChange);

    return () => {
      resizeObserver.disconnect();
      images.forEach((img) => img.removeEventListener("load", scheduleRemeasure));
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleRemeasure);
      window.removeEventListener("load", scheduleRemeasure);
      motionQuery.removeEventListener("change", onPreferenceChange);
      desktopQuery.removeEventListener("change", onPreferenceChange);
      if (rafRef !== null) window.cancelAnimationFrame(rafRef);
      delayedRemeasureTimers.forEach((timer) => window.clearTimeout(timer));
      track.style.transform = "";
    };
  }, [enabled, sectionRef, trackRef, viewportRef]);
}

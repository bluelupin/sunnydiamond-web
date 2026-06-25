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
) {
  useLayoutEffect(() => {
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
      const scrollDistance = Math.max(window.innerHeight * 0.85, maxOffset + 120);
      if (spacer) spacer.style.height = `${scrollDistance}px`;
    };

    const update = () => {
      rafRef = null;

      if (!desktopQuery.matches || motionQuery.matches) {
        track.style.transform = "";
        return;
      }

      const scrollTrack = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-section.getBoundingClientRect().top / scrollTrack);
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

    const resizeObserver = new ResizeObserver(() => scheduleRemeasure());
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleRemeasure);

    const onPreferenceChange = () => {
      remeasure();
      scheduleUpdate();
    };

    motionQuery.addEventListener("change", onPreferenceChange);
    desktopQuery.addEventListener("change", onPreferenceChange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      motionQuery.removeEventListener("change", onPreferenceChange);
      desktopQuery.removeEventListener("change", onPreferenceChange);
      if (rafRef !== null) window.cancelAnimationFrame(rafRef);
      track.style.transform = "";
    };
  }, [sectionRef, trackRef, viewportRef]);
}

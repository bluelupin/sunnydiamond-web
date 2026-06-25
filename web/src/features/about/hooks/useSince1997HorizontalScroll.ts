"use client";

import { useLayoutEffect, type RefObject } from "react";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Visible sliver of the third image before horizontal scroll begins (desktop). */
const DESKTOP_PEEK_PX = 56;

/**
 * Pins the Since 1997 gallery while scrolling, scrubbing horizontal translate on the track.
 * On desktop the third image peeks at the screen edge initially and ends flush to it.
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
    const lastImage = track.querySelector<HTMLElement>("[data-since1997-last-image]");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    let rafRef: number | null = null;
    let scrollRange = 0;
    let startTranslate = 0;
    let endTranslate = 0;
    let useDesktopPeek = false;

    const clearViewportSizing = () => {
      viewport.style.width = "";
    };

    const remeasure = () => {
      useDesktopPeek = desktopQuery.matches && Boolean(lastImage);

      if (useDesktopPeek && lastImage) {
        const viewportLeft = viewport.getBoundingClientRect().left;
        const viewportWidth = window.innerWidth - viewportLeft;
        viewport.style.width = `${viewportWidth}px`;

        const attendingRight = lastImage.offsetLeft + lastImage.offsetWidth;
        const attendingWidth = lastImage.offsetWidth;

        endTranslate = viewportWidth - attendingRight;
        startTranslate =
          viewportWidth - attendingRight + attendingWidth - DESKTOP_PEEK_PX;
        scrollRange = Math.max(0, startTranslate - endTranslate);
      } else {
        clearViewportSizing();
        scrollRange = Math.max(0, track.scrollWidth - viewport.clientWidth);
        startTranslate = 0;
        endTranslate = -scrollRange;
      }

      const scrollDistance = Math.max(
        window.innerHeight * 0.85,
        scrollRange + 160,
      );

      if (spacer) {
        spacer.style.height = scrollRange > 0 ? `${scrollDistance}px` : "0px";
      }

      if (scrollRange <= 0) {
        track.style.transform = "";
      }
    };

    const update = () => {
      rafRef = null;

      if (motionQuery.matches) {
        track.style.transform = "";
        return;
      }

      const spacerHeight = spacer?.offsetHeight ?? 0;
      if (spacerHeight <= 0 || scrollRange <= 0) {
        track.style.transform = useDesktopPeek
          ? `translate3d(${startTranslate.toFixed(2)}px, 0, 0)`
          : "";
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop > 0) {
        track.style.transform = useDesktopPeek
          ? `translate3d(${startTranslate.toFixed(2)}px, 0, 0)`
          : "";
        return;
      }

      const progress = clamp(-sectionTop / spacerHeight);
      const translate = startTranslate + progress * (endTranslate - startTranslate);
      track.style.transform = `translate3d(${translate.toFixed(2)}px, 0, 0)`;
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
      clearViewportSizing();
      track.style.transform = "";
    };
  }, [enabled, sectionRef, trackRef, viewportRef]);
}

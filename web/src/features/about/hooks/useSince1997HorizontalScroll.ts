import { useLayoutEffect, type RefObject } from "react";
import { TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type ScrollLayout = "desktop" | "mobile";

function getActiveLayout(desktopQuery: MediaQueryList): ScrollLayout {
  return desktopQuery.matches ? "desktop" : "mobile";
}

function getLayoutRoot(section: HTMLElement, layout: ScrollLayout) {
  return section.querySelector<HTMLElement>(`[data-since1997-mode="${layout}"]`);
}

/**
 * Pins the Since 1997 gallery while scrolling, scrubbing horizontal translate on the track.
 * Desktop: full track slides from rest (translate 0) until the last image is flush to the screen edge.
 * Mobile: founder stays static; only images 2+3 slide in the original vertical layout.
 */
export function useSince1997HorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);

    let rafRef: number | null = null;
    let scrollRange = 0;
    let endTranslate = 0;
    let useDesktopLayout = false;
    let activeLayout: ScrollLayout = getActiveLayout(desktopQuery);
    let track: HTMLElement | null = null;
    let viewport: HTMLElement | null = null;
    let scrollRoot: HTMLElement | null = null;
    let spacer: HTMLElement | null = null;
    let lastImage: HTMLElement | null = null;

    const bindActiveElements = () => {
      activeLayout = getActiveLayout(desktopQuery);
      const root = getLayoutRoot(section, activeLayout);
      track = root?.querySelector<HTMLElement>("[data-since1997-track]") ?? null;
      viewport = root?.querySelector<HTMLElement>("[data-since1997-viewport]") ?? null;
      spacer = root?.querySelector<HTMLElement>("[data-since1997-scroll-spacer]") ?? null;
      lastImage = track?.querySelector<HTMLElement>("[data-since1997-last-image]") ?? null;
      scrollRoot =
        activeLayout === "mobile"
          ? (root?.querySelector<HTMLElement>("[data-since1997-scroll-zone]") ?? root)
          : root;
    };

    const clearViewportSizing = () => {
      section
        .querySelectorAll<HTMLElement>("[data-since1997-viewport]")
        .forEach((node) => {
          node.style.width = "";
        });
    };

    const resetInactiveTracks = () => {
      section.querySelectorAll<HTMLElement>("[data-since1997-track]").forEach((node) => {
        if (node !== track) node.style.transform = "";
      });
    };

    const remeasure = () => {
      bindActiveElements();
      resetInactiveTracks();

      if (!track || !viewport) {
        scrollRange = 0;
        return;
      }

      useDesktopLayout = activeLayout === "desktop" && Boolean(lastImage);

      if (useDesktopLayout && lastImage) {
        const viewportLeft = viewport.getBoundingClientRect().left;
        const viewportWidth = window.innerWidth - viewportLeft;
        viewport.style.width = `${viewportWidth}px`;

        const attendingRight = lastImage.offsetLeft + lastImage.offsetWidth;
        endTranslate = viewportWidth - attendingRight;
        scrollRange = Math.max(0, -endTranslate);
      } else {
        viewport.style.width = "";
        scrollRange = Math.max(0, track.scrollWidth - viewport.clientWidth);
        endTranslate = -scrollRange;
      }

      const scrollDistance = Math.max(
        window.innerHeight * (activeLayout === "mobile" ? 0.7 : 0.85),
        scrollRange + 160,
      );

      if (spacer) {
        spacer.style.height = scrollRange > 0 ? `${scrollDistance}px` : "0px";
      }

      section
        .querySelectorAll<HTMLElement>("[data-since1997-scroll-spacer]")
        .forEach((node) => {
          if (node !== spacer) node.style.height = "0px";
        });

      if (scrollRange <= 0) {
        track.style.transform = "";
      }
    };

    const update = () => {
      rafRef = null;

      if (!track) return;

      if (motionQuery.matches) {
        track.style.transform = "";
        return;
      }

      const spacerHeight = spacer?.offsetHeight ?? 0;
      if (spacerHeight <= 0 || scrollRange <= 0) {
        track.style.transform = "";
        return;
      }

      const rootTop = (scrollRoot ?? section).getBoundingClientRect().top;
      if (rootTop > 0) {
        track.style.transform = "";
        return;
      }

      const progress = clamp(-rootTop / spacerHeight);
      const translate = progress * endTranslate;
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

    bindActiveElements();
    remeasure();
    scheduleUpdate();

    const delayedRemeasureTimers = [150, 600, 1500].map((delay) =>
      window.setTimeout(scheduleRemeasure, delay),
    );

    const resizeObserver = new ResizeObserver(() => scheduleRemeasure());

    const observeLayoutNodes = () => {
      resizeObserver.disconnect();
      bindActiveElements();
      if (track) resizeObserver.observe(track);
      if (viewport) resizeObserver.observe(viewport);
      if (spacer) resizeObserver.observe(spacer);
    };

    observeLayoutNodes();

    const images = section.querySelectorAll<HTMLImageElement>("[data-since1997-track] img");
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", scheduleRemeasure, { once: true });
      }
    });

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleRemeasure);
    window.addEventListener("load", scheduleRemeasure);

    const onPreferenceChange = () => {
      observeLayoutNodes();
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
      section.querySelectorAll<HTMLElement>("[data-since1997-track]").forEach((node) => {
        node.style.transform = "";
      });
    };
  }, [enabled, sectionRef]);
}

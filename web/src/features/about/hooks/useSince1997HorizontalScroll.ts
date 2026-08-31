import { useLayoutEffect, type RefObject } from "react";
import { DESKTOP_MEDIA_QUERY, TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type ScrollLayout = "desktop" | "mobile";

function getActiveLayout(desktopQuery: MediaQueryList): ScrollLayout {
  return desktopQuery.matches ? "desktop" : "mobile";
}

function getLayoutRoot(section: HTMLElement, layout: ScrollLayout) {
  return section.querySelector<HTMLElement>(`[data-since1997-mode="${layout}"]`);
}

type Since1997ScrollOptions = {
  /** Initial margin-left on the first track item; animates to 0 as scroll progresses. */
  firstStepOffset?: number;
  /** Initial margin-left below `lg` when different from `firstStepOffset`. */
  firstStepOffsetBelowLg?: number;
  /**
   * When set, centers the first-step image in the viewport and overrides fixed offsets.
   * Use with the media width of the first slide image (not the full article width).
   */
  firstStepImageWidth?: number;
  /** `firstStepImageWidth` below `lg` when different. */
  firstStepImageWidthBelowLg?: number;
  /**
   * Fraction of vertical scrub (0–1) used for first-step inset only before horizontal
   * track translate begins. Desktop layout only.
   */
  trackScrollLeadInRatio?: number;
};

/**
 * Pins the Since 1997 gallery while scrolling, scrubbing horizontal translate on the track.
 * Desktop: full track slides from rest (translate 0) until the last image is flush to the screen edge.
 * Mobile: founder stays static; only images 2+3 slide in the original vertical layout.
 */
export function useSince1997HorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  enabled = true,
  options?: Since1997ScrollOptions,
) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);
    const lgQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

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
    let firstStep: HTMLElement | null = null;
    let pageContainer: HTMLElement | null = null;
    let cachedPageContainer: HTMLElement | null = null;
    let initialPageContainerPaddingLeft = 0;
    let appliedPageContainerPaddingLeft = -1;
    const firstStepOffsetLg = options?.firstStepOffset ?? 0;
    const firstStepOffsetBelowLg = options?.firstStepOffsetBelowLg ?? firstStepOffsetLg;
    const firstStepImageWidthLg = options?.firstStepImageWidth ?? 0;
    const firstStepImageWidthBelowLg =
      options?.firstStepImageWidthBelowLg ?? firstStepImageWidthLg;
    const trackScrollLeadInRatio = clamp(options?.trackScrollLeadInRatio ?? 0);

    const getActiveFirstStepOffset = () => {
      const imageWidth = lgQuery.matches ? firstStepImageWidthLg : firstStepImageWidthBelowLg;

      if (imageWidth > 0 && viewport) {
        const viewportLeft = viewport.getBoundingClientRect().left;
        const viewportWidth = window.innerWidth - viewportLeft;
        return Math.max(0, viewportWidth / 2 - imageWidth / 2);
      }

      return lgQuery.matches ? firstStepOffsetLg : firstStepOffsetBelowLg;
    };

    const bindActiveElements = () => {
      activeLayout = getActiveLayout(desktopQuery);
      const root = getLayoutRoot(section, activeLayout);
      track = root?.querySelector<HTMLElement>("[data-since1997-track]") ?? null;
      viewport = root?.querySelector<HTMLElement>("[data-since1997-viewport]") ?? null;
      spacer = root?.querySelector<HTMLElement>("[data-since1997-scroll-spacer]") ?? null;
      lastImage = track?.querySelector<HTMLElement>("[data-since1997-last-image]") ?? null;
      firstStep = track?.querySelector<HTMLElement>("[data-since1997-first-step]") ?? null;
      pageContainer =
        root?.querySelector<HTMLElement>("[data-since1997-page-container]") ?? null;
      if (pageContainer !== cachedPageContainer) {
        initialPageContainerPaddingLeft = 0;
        appliedPageContainerPaddingLeft = -1;
        cachedPageContainer = pageContainer;
      }
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

    const resetFirstStepMargin = () => {
      if (!firstStep || getActiveFirstStepOffset() <= 0) return;
      firstStep.style.marginLeft = "";
    };

    const setFirstStepMargin = (marginProgress: number) => {
      const firstStepOffset = getActiveFirstStepOffset();
      if (!firstStep || firstStepOffset <= 0) return;
      firstStep.style.marginLeft = `${firstStepOffset * (1 - clamp(marginProgress))}px`;
    };

    const measureInitialPageContainerPadding = () => {
      if (!pageContainer) {
        initialPageContainerPaddingLeft = 0;
        return;
      }

      pageContainer.style.paddingLeft = "";
      initialPageContainerPaddingLeft =
        parseFloat(window.getComputedStyle(pageContainer).paddingLeft) || 0;
      appliedPageContainerPaddingLeft = -1;
    };

    const resetPageContainerPadding = () => {
      if (!pageContainer) return;
      pageContainer.style.paddingLeft = "";
      appliedPageContainerPaddingLeft = -1;
    };

    const setPageContainerPadding = (progress: number) => {
      if (!pageContainer || initialPageContainerPaddingLeft <= 0) return;

      const nextPadding = initialPageContainerPaddingLeft * (1 - clamp(progress));

      if (Math.abs(nextPadding - appliedPageContainerPaddingLeft) < 0.5) return;

      pageContainer.style.paddingLeft = `${nextPadding.toFixed(2)}px`;
      appliedPageContainerPaddingLeft = nextPadding;
    };

    const remeasureViewportMetrics = () => {
      if (!track || !viewport) return;

      useDesktopLayout = activeLayout === "desktop" && Boolean(lastImage);

      if (useDesktopLayout && lastImage) {
        const viewportLeft = viewport.getBoundingClientRect().left;
        const viewportWidth = window.innerWidth - viewportLeft;
        viewport.style.width = `${viewportWidth}px`;

        const attendingRight = lastImage.offsetLeft + lastImage.offsetWidth;
        endTranslate = viewportWidth - attendingRight;
        scrollRange = Math.max(0, -endTranslate);
        return;
      }

      viewport.style.width = "";
      scrollRange = Math.max(0, track.scrollWidth - viewport.clientWidth);
      endTranslate = -scrollRange;
    };

    const resetInactiveTracks = () => {
      section.querySelectorAll<HTMLElement>("[data-since1997-track]").forEach((node) => {
        if (node !== track) node.style.transform = "";
      });
      section.querySelectorAll<HTMLElement>("[data-since1997-first-step]").forEach((node) => {
        if (node !== firstStep) node.style.marginLeft = "";
      });
    };

    const remeasure = () => {
      bindActiveElements();
      resetInactiveTracks();

      if (!track || !viewport) {
        scrollRange = 0;
        return;
      }

      measureInitialPageContainerPadding();
      remeasureViewportMetrics();

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
        setFirstStepMargin(0);
      } else if (getActiveFirstStepOffset() > 0) {
        setFirstStepMargin(0);
      }
    };

    const update = () => {
      rafRef = null;

      if (!track) return;

      const rootTop = (scrollRoot ?? section).getBoundingClientRect().top;
      const spacerHeight = spacer?.offsetHeight ?? 0;
      const scrollProgress =
        rootTop > 0 || spacerHeight <= 0 ? 0 : clamp(-rootTop / spacerHeight);

      if (motionQuery.matches) {
        if (rootTop <= 0 && pageContainer) {
          pageContainer.style.paddingLeft = "0px";
          appliedPageContainerPaddingLeft = 0;
          remeasureViewportMetrics();
        } else {
          resetPageContainerPadding();
          remeasureViewportMetrics();
        }

        track.style.transform = "";
        if (getActiveFirstStepOffset() > 0) setFirstStepMargin(0);
        else resetFirstStepMargin();
        return;
      }

      if (scrollProgress <= 0) {
        resetPageContainerPadding();
      } else {
        setPageContainerPadding(scrollProgress);
      }
      remeasureViewportMetrics();

      if (spacerHeight <= 0 || scrollRange <= 0) {
        track.style.transform = "";
        if (getActiveFirstStepOffset() > 0) setFirstStepMargin(0);
        else resetFirstStepMargin();
        return;
      }

      if (rootTop > 0) {
        track.style.transform = "";
        if (getActiveFirstStepOffset() > 0) setFirstStepMargin(0);
        return;
      }

      const progress = scrollProgress;

      if (trackScrollLeadInRatio > 0 && progress < trackScrollLeadInRatio) {
        setFirstStepMargin(progress / trackScrollLeadInRatio);
        track.style.transform = "";
        return;
      }

      const translateProgress =
        trackScrollLeadInRatio > 0
          ? clamp((progress - trackScrollLeadInRatio) / (1 - trackScrollLeadInRatio))
          : progress;

      if (trackScrollLeadInRatio > 0) {
        setFirstStepMargin(1);
      } else if (getActiveFirstStepOffset() > 0) {
        setFirstStepMargin(progress);
      }

      const translate = translateProgress * endTranslate;
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
    lgQuery.addEventListener("change", onPreferenceChange);

    return () => {
      resizeObserver.disconnect();
      images.forEach((img) => img.removeEventListener("load", scheduleRemeasure));
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleRemeasure);
      window.removeEventListener("load", scheduleRemeasure);
      motionQuery.removeEventListener("change", onPreferenceChange);
      desktopQuery.removeEventListener("change", onPreferenceChange);
      lgQuery.removeEventListener("change", onPreferenceChange);
      if (rafRef !== null) window.cancelAnimationFrame(rafRef);
      delayedRemeasureTimers.forEach((timer) => window.clearTimeout(timer));
      clearViewportSizing();
      section.querySelectorAll<HTMLElement>("[data-since1997-track]").forEach((node) => {
        node.style.transform = "";
      });
      section.querySelectorAll<HTMLElement>("[data-since1997-first-step]").forEach((node) => {
        node.style.marginLeft = "";
      });
      section.querySelectorAll<HTMLElement>("[data-since1997-page-container]").forEach((node) => {
        node.style.paddingLeft = "";
      });
    };
  }, [
    enabled,
    options?.firstStepOffset,
    options?.firstStepOffsetBelowLg,
    options?.firstStepImageWidth,
    options?.firstStepImageWidthBelowLg,
    options?.trackScrollLeadInRatio,
    sectionRef,
  ]);
}

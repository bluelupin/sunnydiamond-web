"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const ACCORDION_TRANSITION_MS = 550;
const INTERSECTION_THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1] as const;
const INTERSECTION_ROOT_MARGIN = "-35% 0px -35% 0px";
const PINNED_SCROLL_MIN_WIDTH = "(min-width: 768px)";

type UseLearnAnatomySectionSyncOptions = {
  sectionIds: readonly string[];
  defaultSectionId: string | null;
  containerRef?: RefObject<HTMLElement | null>;
};

type UseLearnAnatomySectionSyncResult = {
  openSectionId: string | null;
  handleSectionClick: (sectionId: string) => void;
  registerSectionRef: (sectionId: string, element: HTMLElement | null) => void;
  usePinnedScroll: boolean;
};

function isPinnedScrollEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  return window.matchMedia(PINNED_SCROLL_MIN_WIDTH).matches;
}

function pickBestVisibleSection(
  sectionIds: readonly string[],
  sectionElements: ReadonlyMap<string, HTMLElement>,
  visibleRatios: ReadonlyMap<string, number>,
): string | null {
  let bestId: string | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const viewportCenter = window.innerHeight / 2;

  for (const sectionId of sectionIds) {
    const ratio = visibleRatios.get(sectionId) ?? 0;
    if (ratio <= 0) {
      continue;
    }

    const element = sectionElements.get(sectionId);
    if (!element) {
      continue;
    }

    const rect = element.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
    const score = ratio * 1000 - distanceFromCenter;

    if (score > bestScore) {
      bestScore = score;
      bestId = sectionId;
    }
  }

  return bestId;
}

export function useLearnAnatomySectionSync({
  sectionIds,
  defaultSectionId,
  containerRef,
}: UseLearnAnatomySectionSyncOptions): UseLearnAnatomySectionSyncResult {
  const [openSectionId, setOpenSectionId] = useState<string | null>(defaultSectionId);
  const [usePinnedScroll, setUsePinnedScroll] = useState(false);
  const sectionElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const visibleRatiosRef = useRef<Map<string, number>>(new Map());
  const clickLockRef = useRef(false);
  const collapseSuppressRef = useRef(false);
  const clickLockTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setOpenSectionIdIfChanged = useCallback((nextSectionId: string) => {
    setOpenSectionId((current) => (current === nextSectionId ? current : nextSectionId));
  }, []);

  const registerSectionRef = useCallback((sectionId: string, element: HTMLElement | null) => {
    if (isPinnedScrollEnabled()) {
      return;
    }

    const previousElement = sectionElementsRef.current.get(sectionId);

    if (previousElement && observerRef.current) {
      observerRef.current.unobserve(previousElement);
    }

    if (element) {
      sectionElementsRef.current.set(sectionId, element);
      observerRef.current?.observe(element);
      return;
    }

    sectionElementsRef.current.delete(sectionId);
    visibleRatiosRef.current.delete(sectionId);
  }, []);

  const scrollToPinnedSection = useCallback(
    (sectionId: string) => {
      const container = containerRef?.current;
      if (!container || !isPinnedScrollEnabled()) {
        return;
      }

      const step = container.querySelector<HTMLElement>(`[data-anatomy-step="${sectionId}"]`);
      if (!step) {
        return;
      }

      step.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [containerRef],
  );

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      setOpenSectionId((current) => {
        const isCollapsing = current === sectionId;

        if (isCollapsing) {
          collapseSuppressRef.current = true;
          clickLockRef.current = false;
          if (clickLockTimerRef.current !== null) {
            window.clearTimeout(clickLockTimerRef.current);
            clickLockTimerRef.current = null;
          }
          return null;
        }

        collapseSuppressRef.current = false;
        clickLockRef.current = true;

        if (clickLockTimerRef.current !== null) {
          window.clearTimeout(clickLockTimerRef.current);
        }

        clickLockTimerRef.current = window.setTimeout(() => {
          clickLockRef.current = false;
          clickLockTimerRef.current = null;
        }, ACCORDION_TRANSITION_MS);

        scrollToPinnedSection(sectionId);

        return sectionId;
      });
    },
    [scrollToPinnedSection],
  );

  useEffect(() => {
    setOpenSectionId(defaultSectionId);
    visibleRatiosRef.current.clear();
  }, [defaultSectionId, sectionIds]);

  useEffect(() => {
    if (sectionIds.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const widthQuery = window.matchMedia(PINNED_SCROLL_MIN_WIDTH);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPinnedScrollState = () => {
      setUsePinnedScroll(isPinnedScrollEnabled());
    };

    syncPinnedScrollState();

    const scheduleActiveSectionUpdate = () => {
      if (clickLockRef.current || collapseSuppressRef.current) {
        return;
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const bestSectionId = pickBestVisibleSection(
          sectionIds,
          sectionElementsRef.current,
          visibleRatiosRef.current,
        );

        if (bestSectionId) {
          setOpenSectionIdIfChanged(bestSectionId);
        }
      });
    };

    const setupObserver = () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      visibleRatiosRef.current.clear();

      const pinned = isPinnedScrollEnabled();
      setUsePinnedScroll(pinned);

      const container = containerRef?.current;

      if (pinned) {
        if (!container) {
          return;
        }

        const steps = Array.from(
          container.querySelectorAll<HTMLElement>("[data-anatomy-step]"),
        );

        if (steps.length === 0) {
          return;
        }

        sectionElementsRef.current = new Map(
          steps.map((step) => {
            const sectionId = step.getAttribute("data-anatomy-step");
            return sectionId ? [sectionId, step] : null;
          }).filter((entry): entry is [string, HTMLElement] => entry !== null),
        );

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const sectionId = entry.target.getAttribute("data-anatomy-step");
              if (!sectionId) {
                continue;
              }

              visibleRatiosRef.current.set(sectionId, entry.intersectionRatio);
            }

            scheduleActiveSectionUpdate();
          },
          {
            root: null,
            rootMargin: INTERSECTION_ROOT_MARGIN,
            threshold: [...INTERSECTION_THRESHOLDS],
          },
        );

        observerRef.current = observer;
        steps.forEach((step) => observer.observe(step));
        return;
      }

      sectionElementsRef.current.clear();

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const sectionId = entry.target.getAttribute("data-anatomy-section-id");
            if (!sectionId) {
              continue;
            }

            visibleRatiosRef.current.set(sectionId, entry.intersectionRatio);
          }

          scheduleActiveSectionUpdate();
        },
        {
          root: null,
          rootMargin: INTERSECTION_ROOT_MARGIN,
          threshold: [...INTERSECTION_THRESHOLDS],
        },
      );

      observerRef.current = observer;

      if (container) {
        const sections = Array.from(
          container.querySelectorAll<HTMLElement>("[data-anatomy-section-id]"),
        );

        for (const section of sections) {
          const sectionId = section.getAttribute("data-anatomy-section-id");
          if (!sectionId) {
            continue;
          }

          sectionElementsRef.current.set(sectionId, section);
          observer.observe(section);
        }
      }
    };

    setupObserver();

    const onScroll = () => {
      if (collapseSuppressRef.current) {
        collapseSuppressRef.current = false;
        scheduleActiveSectionUpdate();
      }
    };

    const onLayoutChange = () => {
      setupObserver();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    widthQuery.addEventListener("change", onLayoutChange);
    motionQuery.addEventListener("change", onLayoutChange);
    window.addEventListener("resize", onLayoutChange);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      window.removeEventListener("scroll", onScroll);
      widthQuery.removeEventListener("change", onLayoutChange);
      motionQuery.removeEventListener("change", onLayoutChange);
      window.removeEventListener("resize", onLayoutChange);

      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
        clickLockTimerRef.current = null;
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [containerRef, sectionIds, setOpenSectionIdIfChanged, usePinnedScroll]);

  return {
    openSectionId,
    handleSectionClick,
    registerSectionRef,
    usePinnedScroll,
  };
}

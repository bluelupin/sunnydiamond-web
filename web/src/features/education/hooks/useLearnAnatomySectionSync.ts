"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const ACCORDION_TRANSITION_MS = 550;
const INTERSECTION_THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1] as const;
const INTERSECTION_ROOT_MARGIN = "-35% 0px -35% 0px";

type UseLearnAnatomySectionSyncOptions = {
  sectionIds: readonly string[];
  defaultSectionId: string | null;
};

type UseLearnAnatomySectionSyncResult = {
  openSectionId: string | null;
  handleSectionClick: (sectionId: string) => void;
  registerSectionRef: (sectionId: string, element: HTMLElement | null) => void;
};

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
}: UseLearnAnatomySectionSyncOptions): UseLearnAnatomySectionSyncResult {
  const [openSectionId, setOpenSectionId] = useState<string | null>(defaultSectionId);
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

  const handleSectionClick = useCallback((sectionId: string) => {
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

      return sectionId;
    });
  }, []);

  useEffect(() => {
    setOpenSectionId(defaultSectionId);
    visibleRatiosRef.current.clear();
  }, [defaultSectionId, sectionIds]);

  useEffect(() => {
    if (sectionIds.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

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

    for (const element of sectionElementsRef.current.values()) {
      observer.observe(element);
    }

    const onScroll = () => {
      if (collapseSuppressRef.current) {
        collapseSuppressRef.current = false;
        scheduleActiveSectionUpdate();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      observerRef.current = null;
      window.removeEventListener("scroll", onScroll);

      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
        clickLockTimerRef.current = null;
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [sectionIds, setOpenSectionIdIfChanged]);

  return {
    openSectionId,
    handleSectionClick,
    registerSectionRef,
  };
}

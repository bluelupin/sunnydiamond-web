"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  resetAboutTimelineHeaderSuppressed,
  setAboutTimelineHeaderSuppressed,
} from "../context/aboutTimelineHeaderBridge";

export type TimelineYear = string;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const CLICK_LOCK_MS = 700;
const WHEEL_STEP_COOLDOWN_MS = 400;
/** One year step once accumulated wheel delta crosses this (trackpad sends many small events). */
const WHEEL_ACCUMULATOR_THRESHOLD = 32;
const WHEEL_ACCUMULATOR_IDLE_MS = 150;
const SCROLL_DRIFT_TOLERANCE_PX = 6;

export interface AboutTimelineScrollState {
  activeYear: TimelineYear;
  progress: number;
  reducedMotion: boolean;
  scrollToYear: (year: TimelineYear) => void;
}

function resolveYearIndex(years: readonly string[], year: string): number {
  const index = years.indexOf(year);
  return index >= 0 ? index : 0;
}

function getPinScrollTop(section: HTMLElement, pinScrollTopRef: { current: number | null }): number {
  const rect = section.getBoundingClientRect();

  if (rect.top <= 0) {
    if (pinScrollTopRef.current === null) {
      pinScrollTopRef.current = window.scrollY;
    }
    return pinScrollTopRef.current;
  }

  pinScrollTopRef.current = null;
  return window.scrollY + rect.top;
}

function getYearIndexFromScroll(
  section: HTMLElement,
  yearCount: number,
  pinScrollTopRef: { current: number | null },
): number {
  if (yearCount <= 1) {
    return 0;
  }

  const viewportHeight = window.innerHeight;
  const pinTop = getPinScrollTop(section, pinScrollTopRef);
  const relative = window.scrollY - pinTop;
  const maxRelative = (yearCount - 1) * viewportHeight;

  if (relative <= viewportHeight * 0.25) {
    return 0;
  }

  if (relative >= maxRelative - viewportHeight * 0.25) {
    return yearCount - 1;
  }

  return Math.min(
    yearCount - 1,
    Math.max(0, Math.round(relative / viewportHeight - 0.5)),
  );
}

function getScrollTopForYearIndex(
  section: HTMLElement,
  index: number,
  pinScrollTopRef: { current: number | null },
): number {
  const pinTop = getPinScrollTop(section, pinScrollTopRef);
  return pinTop + index * window.innerHeight;
}

function isTimelinePinned(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  return rect.top <= 1 && rect.bottom > viewportHeight * 0.5;
}

function normalizeWheelDelta(event: WheelEvent): number {
  let delta = event.deltaY;

  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= window.innerHeight;
  }

  return delta;
}

function shouldScrollYearList(event: WheelEvent): boolean {
  const target = event.target;
  if (!(target instanceof Element)) {
    return false;
  }

  const list = target.closest("[data-timeline-year-list]");
  if (!(list instanceof HTMLElement) || list.scrollHeight <= list.clientHeight + 1) {
    return false;
  }

  const atTop = list.scrollTop <= 0;
  const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

  if (event.deltaY < 0 && !atTop) {
    return true;
  }

  if (event.deltaY > 0 && !atBottom) {
    return true;
  }

  return false;
}

export function useAboutTimelineScroll(
  sectionRef: RefObject<HTMLElement | null>,
  years: readonly string[],
  defaultYear: string,
): AboutTimelineScrollState {
  const [activeYear, setActiveYear] = useState<TimelineYear>(defaultYear);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const clickLockRef = useRef(false);
  const clickLockTimerRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const pinScrollTopRef = useRef<number | null>(null);
  const wheelStepLockRef = useRef(false);
  const wheelStepTimerRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wasPinnedRef = useRef(false);

  const applyActiveIndex = useCallback(
    (index: number) => {
      if (years.length === 0) {
        return;
      }

      const nextIndex = Math.min(years.length - 1, Math.max(0, index));
      if (activeIndexRef.current === nextIndex) {
        return;
      }

      activeIndexRef.current = nextIndex;
      setActiveYear(years[nextIndex]);
    },
    [years],
  );

  const snapScrollToYearIndex = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section) return;

      const top = getScrollTopForYearIndex(section, index, pinScrollTopRef);
      if (Math.abs(window.scrollY - top) <= SCROLL_DRIFT_TOLERANCE_PX) {
        return;
      }

      window.scrollTo({ top, left: 0, behavior: "auto" });
    },
    [sectionRef],
  );

  const setProgressFromIndex = useCallback((index: number, yearCount: number) => {
    if (yearCount <= 1) {
      setProgress(1);
      return;
    }

    setProgress(clamp(index / (yearCount - 1)));
  }, []);

  const syncFromScroll = useCallback(() => {
    scrollRafRef.current = null;

    const section = sectionRef.current;
    if (!section) return;

    const pinned = isTimelinePinned(section);
    setAboutTimelineHeaderSuppressed(pinned);

    const yearCount = years.length;
    if (yearCount === 0) {
      return;
    }

    const maxIndex = yearCount - 1;

    if (!pinned) {
      wasPinnedRef.current = false;
      wheelAccumulatorRef.current = 0;
      return;
    }

    if (!wasPinnedRef.current) {
      wasPinnedRef.current = true;
      wheelAccumulatorRef.current = 0;
      const initialIndex = getYearIndexFromScroll(section, yearCount, pinScrollTopRef);
      applyActiveIndex(initialIndex);
      snapScrollToYearIndex(initialIndex);
      setProgressFromIndex(activeIndexRef.current, yearCount);
      return;
    }

    if (clickLockRef.current) {
      setProgressFromIndex(activeIndexRef.current, yearCount);
      return;
    }

    const lockedIndex = activeIndexRef.current;
    const expectedTop = getScrollTopForYearIndex(section, lockedIndex, pinScrollTopRef);

    if (Math.abs(window.scrollY - expectedTop) > SCROLL_DRIFT_TOLERANCE_PX) {
      if (!wheelStepLockRef.current) {
        window.scrollTo({ top: expectedTop, left: 0, behavior: "auto" });
      }
    }

    setProgressFromIndex(lockedIndex, yearCount);
  }, [applyActiveIndex, sectionRef, setProgressFromIndex, snapScrollToYearIndex, years.length]);

  const scheduleSyncFromScroll = useCallback(() => {
    if (scrollRafRef.current !== null) {
      return;
    }

    scrollRafRef.current = window.requestAnimationFrame(syncFromScroll);
  }, [syncFromScroll]);

  const stepYear = useCallback(
    (direction: 1 | -1) => {
      const section = sectionRef.current;
      if (!section) return;

      const maxIndex = years.length - 1;
      const nextIndex = activeIndexRef.current + direction;

      if (nextIndex < 0 || nextIndex > maxIndex) {
        return;
      }

      wheelAccumulatorRef.current = 0;
      wheelStepLockRef.current = true;
      applyActiveIndex(nextIndex);
      snapScrollToYearIndex(nextIndex);
      setProgressFromIndex(nextIndex, years.length);

      if (wheelStepTimerRef.current !== null) {
        window.clearTimeout(wheelStepTimerRef.current);
      }

      wheelStepTimerRef.current = window.setTimeout(() => {
        wheelStepTimerRef.current = null;
        wheelStepLockRef.current = false;
      }, WHEEL_STEP_COOLDOWN_MS);
    },
    [applyActiveIndex, sectionRef, setProgressFromIndex, snapScrollToYearIndex, years.length],
  );

  const scrollToYear = useCallback(
    (year: TimelineYear) => {
      const section = sectionRef.current;
      if (!section) return;

      const yearIndex = resolveYearIndex(years, year);

      clickLockRef.current = true;
      wheelStepLockRef.current = true;
      activeIndexRef.current = yearIndex;
      setActiveYear(year);
      snapScrollToYearIndex(yearIndex);
      setProgressFromIndex(yearIndex, years.length);

      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }
      if (wheelStepTimerRef.current !== null) {
        window.clearTimeout(wheelStepTimerRef.current);
      }

      clickLockTimerRef.current = window.setTimeout(() => {
        clickLockRef.current = false;
        clickLockTimerRef.current = null;
        wheelStepLockRef.current = false;
        syncFromScroll();
      }, CLICK_LOCK_MS);
    },
    [sectionRef, setProgressFromIndex, snapScrollToYearIndex, syncFromScroll, years],
  );

  useEffect(() => {
    const defaultIndex = resolveYearIndex(years, defaultYear);
    activeIndexRef.current = defaultIndex;
    setActiveYear(defaultYear);
  }, [defaultYear, years]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || years.length === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    let wheelAccumulatorIdleTimer: number | null = null;

    const resetWheelAccumulatorSoon = () => {
      if (wheelAccumulatorIdleTimer !== null) {
        window.clearTimeout(wheelAccumulatorIdleTimer);
      }

      wheelAccumulatorIdleTimer = window.setTimeout(() => {
        wheelAccumulatorIdleTimer = null;
        wheelAccumulatorRef.current = 0;
      }, WHEEL_ACCUMULATOR_IDLE_MS);
    };

    const onWheel = (event: WheelEvent) => {
      if (motionQuery.matches || clickLockRef.current) {
        return;
      }

      if (shouldScrollYearList(event)) {
        return;
      }

      if (!isTimelinePinned(section)) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      const maxIndex = years.length - 1;
      const currentIndex = activeIndexRef.current;
      const delta = normalizeWheelDelta(event);

      if (delta === 0) {
        return;
      }

      const goingDown = delta > 0;
      const goingUp = delta < 0;

      if (goingDown && currentIndex >= maxIndex) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      if (goingUp && currentIndex <= 0) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      event.preventDefault();
      resetWheelAccumulatorSoon();

      if (wheelStepLockRef.current) {
        return;
      }

      wheelAccumulatorRef.current += delta;

      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_ACCUMULATOR_THRESHOLD) {
        return;
      }

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
      wheelAccumulatorRef.current = 0;
      stepYear(direction);
    };

    if (motionQuery.matches) {
      const defaultIndex = resolveYearIndex(years, defaultYear);
      activeIndexRef.current = defaultIndex;
      setActiveYear(defaultYear);
      setProgress(1);

      const observer = new IntersectionObserver(
        ([entry]) => {
          setAboutTimelineHeaderSuppressed(
            Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.45),
          );
        },
        { threshold: [0, 0.45, 0.6, 1] },
      );
      observer.observe(section);

      return () => {
        observer.disconnect();
        resetAboutTimelineHeaderSuppressed();
      };
    }

    syncFromScroll();
    window.addEventListener("scroll", scheduleSyncFromScroll, { passive: true });
    window.addEventListener("resize", scheduleSyncFromScroll);
    window.addEventListener("wheel", onWheel, { passive: false });

    const onMotionChange = () => {
      setReducedMotion(motionQuery.matches);
      if (motionQuery.matches) {
        window.removeEventListener("scroll", scheduleSyncFromScroll);
        window.removeEventListener("resize", scheduleSyncFromScroll);
        window.removeEventListener("wheel", onWheel);
        if (scrollRafRef.current !== null) {
          window.cancelAnimationFrame(scrollRafRef.current);
          scrollRafRef.current = null;
        }
        const defaultIndex = resolveYearIndex(years, defaultYear);
        activeIndexRef.current = defaultIndex;
        setActiveYear(defaultYear);
        setProgress(1);
        return;
      }

      syncFromScroll();
      window.addEventListener("scroll", scheduleSyncFromScroll, { passive: true });
      window.addEventListener("resize", scheduleSyncFromScroll);
      window.addEventListener("wheel", onWheel, { passive: false });
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", scheduleSyncFromScroll);
      window.removeEventListener("resize", scheduleSyncFromScroll);
      window.removeEventListener("wheel", onWheel);
      motionQuery.removeEventListener("change", onMotionChange);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }
      if (wheelStepTimerRef.current !== null) {
        window.clearTimeout(wheelStepTimerRef.current);
      }
      if (wheelAccumulatorIdleTimer !== null) {
        window.clearTimeout(wheelAccumulatorIdleTimer);
      }
      resetAboutTimelineHeaderSuppressed();
    };
  }, [
    sectionRef,
    syncFromScroll,
    scheduleSyncFromScroll,
    stepYear,
    years,
    defaultYear,
  ]);

  return {
    activeYear,
    progress,
    reducedMotion,
    scrollToYear,
  };
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export type TimelineYear = string;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const CLICK_LOCK_MS = 700;

export interface AboutTimelineScrollState {
  activeYear: TimelineYear;
  progress: number;
  reducedMotion: boolean;
  scrollToYear: (year: TimelineYear) => void;
}

function resolveActiveYearIndex(progress: number, yearCount: number): number {
  if (yearCount <= 1) {
    return 0;
  }

  return Math.min(yearCount - 1, Math.max(0, Math.floor(progress * yearCount)));
}

function resolveYearIndex(years: readonly string[], year: string): number {
  const index = years.indexOf(year);
  return index >= 0 ? index : 0;
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
  const targetIndexRef = useRef(0);
  const stepRafRef = useRef<number | null>(null);

  const stopSequentialStepping = useCallback(() => {
    if (stepRafRef.current !== null) {
      window.cancelAnimationFrame(stepRafRef.current);
      stepRafRef.current = null;
    }
  }, []);

  const stepTowardTarget = useCallback(() => {
    stepRafRef.current = null;

    if (clickLockRef.current || years.length === 0) {
      return;
    }

    const current = activeIndexRef.current;
    const target = targetIndexRef.current;

    if (current === target) {
      return;
    }

    const next = current + (target > current ? 1 : -1);
    activeIndexRef.current = next;
    setActiveYear(years[next]);

    if (next !== target) {
      stepRafRef.current = window.requestAnimationFrame(stepTowardTarget);
    }
  }, [years]);

  const scheduleSequentialStep = useCallback(() => {
    if (stepRafRef.current !== null) {
      return;
    }

    stepRafRef.current = window.requestAnimationFrame(stepTowardTarget);
  }, [stepTowardTarget]);

  const syncFromScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollTrack = section.offsetHeight - viewportHeight;

    let nextProgress = 0;

    if (scrollTrack <= 0) {
      nextProgress = rect.top <= viewportHeight * 0.5 ? 1 : 0;
    } else {
      nextProgress = clamp(-rect.top / scrollTrack);
    }

    setProgress(nextProgress);

    if (years.length === 0) {
      return;
    }

    const targetIndex = resolveActiveYearIndex(nextProgress, years.length);
    targetIndexRef.current = targetIndex;

    if (clickLockRef.current) {
      return;
    }

    if (activeIndexRef.current !== targetIndex) {
      scheduleSequentialStep();
    }
  }, [sectionRef, years, scheduleSequentialStep]);

  const scrollToYear = useCallback(
    (year: TimelineYear) => {
      const section = sectionRef.current;
      if (!section) return;

      const step = section.querySelector<HTMLElement>(`[data-timeline-step="${year}"]`);
      if (!step) return;

      const yearIndex = resolveYearIndex(years, year);

      clickLockRef.current = true;
      stopSequentialStepping();
      activeIndexRef.current = yearIndex;
      targetIndexRef.current = yearIndex;
      setActiveYear(year);

      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }

      step.scrollIntoView({ behavior: "smooth", block: "center" });
      clickLockTimerRef.current = window.setTimeout(() => {
        clickLockRef.current = false;
        clickLockTimerRef.current = null;
        syncFromScroll();
      }, CLICK_LOCK_MS);
    },
    [sectionRef, syncFromScroll, stopSequentialStepping, years],
  );

  useEffect(() => {
    const defaultIndex = resolveYearIndex(years, defaultYear);
    activeIndexRef.current = defaultIndex;
    targetIndexRef.current = defaultIndex;
    setActiveYear(defaultYear);
  }, [defaultYear, years]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || years.length === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    if (motionQuery.matches) {
      const defaultIndex = resolveYearIndex(years, defaultYear);
      activeIndexRef.current = defaultIndex;
      targetIndexRef.current = defaultIndex;
      setActiveYear(defaultYear);
      setProgress(1);
      return;
    }

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);

    const onMotionChange = () => {
      setReducedMotion(motionQuery.matches);
      if (motionQuery.matches) {
        window.removeEventListener("scroll", syncFromScroll);
        window.removeEventListener("resize", syncFromScroll);
        stopSequentialStepping();
        const defaultIndex = resolveYearIndex(years, defaultYear);
        activeIndexRef.current = defaultIndex;
        targetIndexRef.current = defaultIndex;
        setActiveYear(defaultYear);
        setProgress(1);
        return;
      }

      syncFromScroll();
      window.addEventListener("scroll", syncFromScroll, { passive: true });
      window.addEventListener("resize", syncFromScroll);
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
      motionQuery.removeEventListener("change", onMotionChange);
      stopSequentialStepping();
      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }
    };
  }, [
    sectionRef,
    syncFromScroll,
    years,
    defaultYear,
    stopSequentialStepping,
  ]);

  return {
    activeYear,
    progress,
    reducedMotion,
    scrollToYear,
  };
}

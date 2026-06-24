"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { aboutTimelineYears } from "../data/content";

export type TimelineYear = (typeof aboutTimelineYears)[number];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export interface AboutTimelineScrollState {
  activeYear: TimelineYear;
  progress: number;
  reducedMotion: boolean;
  scrollToYear: (year: TimelineYear) => void;
}

export function useAboutTimelineScroll(
  sectionRef: RefObject<HTMLElement | null>,
): AboutTimelineScrollState {
  const [activeYear, setActiveYear] = useState<TimelineYear>("2008");
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const clickLockRef = useRef(false);
  const clickLockTimerRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollTrack = section.offsetHeight - viewportHeight;

    if (scrollTrack <= 0) {
      setProgress(rect.top <= viewportHeight * 0.5 ? 1 : 0);
      return;
    }

    setProgress(clamp(-rect.top / scrollTrack));
  }, [sectionRef]);

  const scrollToYear = useCallback((year: TimelineYear) => {
    const section = sectionRef.current;
    if (!section) return;

    const step = section.querySelector<HTMLElement>(`[data-timeline-step="${year}"]`);
    if (!step) return;

    clickLockRef.current = true;
    setActiveYear(year);

    if (clickLockTimerRef.current !== null) {
      window.clearTimeout(clickLockTimerRef.current);
    }

    step.scrollIntoView({ behavior: "smooth", block: "center" });
    clickLockTimerRef.current = window.setTimeout(() => {
      clickLockRef.current = false;
      clickLockTimerRef.current = null;
    }, 700);
  }, [sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    if (motionQuery.matches) {
      setActiveYear("2008");
      setProgress(1);
      return;
    }

    const steps = Array.from(
      section.querySelectorAll<HTMLElement>("[data-timeline-step]"),
    );

    if (steps.length === 0) return;

    const pickActiveFromEntries = (entries: IntersectionObserverEntry[]) => {
      if (clickLockRef.current) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      const best = visible[0];
      if (!best?.target) return;

      const year = best.target.getAttribute("data-timeline-step") as TimelineYear | null;
      if (year) {
        setActiveYear(year);
      }
    };

    const observer = new IntersectionObserver(pickActiveFromEntries, {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    steps.forEach((step) => observer.observe(step));

    const onScroll = () => updateProgress();
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onMotionChange = () => {
      setReducedMotion(motionQuery.matches);
      if (motionQuery.matches) {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        setProgress(1);
      }
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionQuery.removeEventListener("change", onMotionChange);
      if (clickLockTimerRef.current !== null) {
        window.clearTimeout(clickLockTimerRef.current);
      }
    };
  }, [sectionRef, updateProgress]);

  return {
    activeYear,
    progress,
    reducedMotion,
    scrollToYear,
  };
}

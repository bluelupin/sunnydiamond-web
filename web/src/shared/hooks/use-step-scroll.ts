import { useEffect, useRef, useState } from "react";

function getViewportHeight() {
  if (typeof window === "undefined") {
    return 0;
  }

  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Maps scroll progress through a tall section to a step index and 0–1 progress.
 * Pass `enabled: false` while the section is not mounted (e.g. CMS loading).
 */
export function useStepScroll(stepCount: number, enabled = true) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    let raf = 0;
    let sectionHeight = Math.max(1, container.offsetHeight - getViewportHeight());

    const refreshGeom = () => {
      sectionHeight = Math.max(1, container.offsetHeight - getViewportHeight());
      compute();
    };

    const compute = () => {
      raf = 0;
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const index = Math.min(stepCount - 1, Math.floor(p * stepCount));
      setActiveIndex(index);
      setProgress(p);
    };

    const handleScroll = () => {
      if (raf) {
        return;
      }
      raf = requestAnimationFrame(compute);
    };

    const ro = new ResizeObserver(refreshGeom);
    ro.observe(container);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", refreshGeom, { passive: true });
    window.addEventListener("load", refreshGeom);

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", refreshGeom);
    visualViewport?.addEventListener("scroll", handleScroll);

    refreshGeom();

    const initialTimer = window.setTimeout(refreshGeom, 100);
    const settleTimer = window.setTimeout(refreshGeom, 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(initialTimer);
      clearTimeout(settleTimer);
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", refreshGeom);
      window.removeEventListener("load", refreshGeom);
      visualViewport?.removeEventListener("resize", refreshGeom);
      visualViewport?.removeEventListener("scroll", handleScroll);
    };
  }, [stepCount, enabled]);

  return { activeIndex, progress, containerRef };
}

import { useEffect, useRef, useState } from "react";

/** Ease with zero velocity at 0 and 1 — softer crossfade at step boundaries. */
function smootherstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function useStepScroll(stepCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepBlend, setStepBlend] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let sectionHeight = Math.max(1, container.scrollHeight - window.innerHeight);

    const compute = () => {
      raf = 0;
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const nextProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const safeStepCount = Math.max(1, stepCount);
      const continuousStep = Math.min(safeStepCount, nextProgress * safeStepCount);
      const index = Math.min(safeStepCount - 1, Math.floor(continuousStep));
      const blend = continuousStep - index;

      setProgress(nextProgress);
      setActiveIndex(index);
      setStepBlend(smootherstep(blend));
    };

    const scheduleCompute = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    const refreshGeom = () => {
      sectionHeight = Math.max(1, container.scrollHeight - window.innerHeight);
      scheduleCompute();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          scheduleCompute();
        }
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(container);

    const ro = new ResizeObserver(refreshGeom);
    ro.observe(container);

    window.addEventListener("scroll", scheduleCompute, { passive: true });
    window.addEventListener("resize", refreshGeom, { passive: true });
    window.addEventListener("load", refreshGeom);

    const initialTimer = setTimeout(refreshGeom, 100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(initialTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", scheduleCompute);
      window.removeEventListener("resize", refreshGeom);
      window.removeEventListener("load", refreshGeom);
    };
  }, [stepCount]);

  return {
    activeIndex,
    progress,
    stepBlend,
    containerRef,
  };
}

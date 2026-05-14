import { useEffect, useRef, useState } from "react";

export function useStepScroll(stepCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let inView = false;
    // Cache scrollHeight; only refresh on resize.
    let sectionHeight = Math.max(1, container.scrollHeight - window.innerHeight);

    const refreshGeom = () => {
      sectionHeight = Math.max(1, container.scrollHeight - window.innerHeight);
    };

    const compute = () => {
      raf = 0;
      if (!inView) return;
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / sectionHeight));
      const index = Math.min(stepCount - 1, Math.floor(p * stepCount));
      setActiveIndex(index);
      setProgress(p);
    };

    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) handleScroll();
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(container);

    const ro = new ResizeObserver(refreshGeom);
    ro.observe(container);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", refreshGeom, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", refreshGeom);
    };
  }, [stepCount]);

  return { activeIndex, progress, containerRef };
}

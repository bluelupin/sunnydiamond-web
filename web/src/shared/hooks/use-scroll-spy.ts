import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  sectionIds: readonly string[];
  visibilityThresholdIndex?: number;
}

export function useScrollSpy({ sectionIds, visibilityThresholdIndex = 3 }: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const visibleSections = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const thresholdEl = document.getElementById(sectionIds[visibilityThresholdIndex]);

    const compute = () => {
      rafRef.current = null;

      // Skip when nothing is on screen.
      if (visibleSections.current.size === 0 && !thresholdEl) return;

      const viewportH = window.innerHeight;
      const mid = viewportH * 0.4;

      // ---- READ phase: collect all geometry first ----
      const thresholdTop = thresholdEl ? thresholdEl.getBoundingClientRect().top : Infinity;
      const rects = elements.map((el) => el.getBoundingClientRect());

      // ---- COMPUTE ----
      const next: Record<string, number> = {};
      let active = sectionIds[0];
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = rects[i];
        const total = rect.height;
        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / Math.max(1, total - viewportH * 0.25)));
        next[el.id] = p;
        if (rect.top <= mid) active = el.id;
      }

      // ---- WRITE phase: batch state updates last ----
      setIsVisible(thresholdTop < viewportH * 0.6);
      setProgress(next);
      setActiveId(active);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(compute);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.current.add(entry.target.id);
          else visibleSections.current.delete(entry.target.id);
        });
        onScroll();
      },
      { threshold: [0, 0.15, 0.5, 1], rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionIds, visibilityThresholdIndex]);

  return { activeId, isVisible, progress };
}

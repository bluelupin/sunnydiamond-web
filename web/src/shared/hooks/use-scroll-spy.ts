import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  sectionIds: readonly string[];
  visibilityThresholdIndex?: number;
}

export function useScrollSpy({ sectionIds, visibilityThresholdIndex = 3 }: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const visibleSections = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const navUnlockedRef = useRef(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const thresholdEl = document.getElementById(sectionIds[visibilityThresholdIndex]);
    navUnlockedRef.current = false;
    lastScrollYRef.current = window.scrollY;

    const compute = () => {
      rafRef.current = null;

      const scrollY = window.scrollY;
      const scrollingUp = scrollY < lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      const viewportH = window.innerHeight;
      const mid = viewportH * 0.4;

      // ---- READ phase: collect all geometry first ----
      const rects = elements.map((el) => el.getBoundingClientRect());

      // ---- COMPUTE ----
      const next: Record<string, number> = {};
      let active = sectionIds[0] ?? "";
      // Progress 0→1 as the section scrolls through the viewport (enter → exit).
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = rects[i];
        const scrollSpan = Math.max(1, rect.height + viewportH);
        const p = Math.max(0, Math.min(1, (viewportH - rect.top) / scrollSpan));
        next[el.id] = p;
        if (rect.top <= mid) active = el.id;
      }

      // ---- WRITE phase: batch state updates last ----
      // Unlock after passing Alankara; stay visible through all sections below.
      // Hide again only when scrolling back up into Alankara (or above it).
      const thresholdRect = thresholdEl?.getBoundingClientRect();
      if (thresholdRect) {
        if (thresholdRect.bottom <= 0) {
          navUnlockedRef.current = true;
        } else if (scrollingUp) {
          navUnlockedRef.current = false;
        }
      }

      setIsVisible(navUnlockedRef.current);
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

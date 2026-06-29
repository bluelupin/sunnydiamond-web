import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  sectionIds: readonly string[];
  visibilityThresholdIndex?: number;
  /** Section id that unlocks the nav when it fully fills the viewport (e.g. alankara). */
  navStartSectionId?: string;
}

const NAV_START_VIEWPORT_OFFSET = 110;

export function useScrollSpy({
  sectionIds,
  visibilityThresholdIndex = 3,
  navStartSectionId,
}: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const visibleSections = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const navUnlockedRef = useRef(false);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const thresholdEl = navStartSectionId
      ? document.getElementById(navStartSectionId)
      : document.getElementById(sectionIds[visibilityThresholdIndex] ?? sectionIds[0] ?? "");

    const compute = () => {
      rafRef.current = null;

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
      // Show nav once Alankara fully fills the viewport (below fixed header).
      // Stay visible after unlock until the user scrolls back above the section.
      const thresholdRect = thresholdEl?.getBoundingClientRect();
      if (thresholdRect) {
        const availableHeight = viewportH - NAV_START_VIEWPORT_OFFSET;
        const fitsInViewport = thresholdRect.height <= availableHeight;
        const isFullyInViewport = fitsInViewport
          ? thresholdRect.top >= NAV_START_VIEWPORT_OFFSET - 1 &&
            thresholdRect.bottom <= viewportH + 1
          : thresholdRect.top <= NAV_START_VIEWPORT_OFFSET + 1 &&
            thresholdRect.bottom >= viewportH - 1;
        const isAboveStartSection = thresholdRect.top >= viewportH;

        if (isFullyInViewport) {
          navUnlockedRef.current = true;
        } else if (isAboveStartSection) {
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
  }, [sectionIds, visibilityThresholdIndex, navStartSectionId]);

  return { activeId, isVisible, progress };
}

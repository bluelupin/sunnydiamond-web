import { useState, useEffect, useRef } from "react";

interface UseScrollSpyOptions {
  sectionIds: readonly string[];
  visibilityThresholdIndex?: number;
  /** Section id that unlocks the nav when it fully fills the viewport (e.g. alankara). */
  navStartSectionId?: string;
}

const NAV_START_VIEWPORT_OFFSET = 110;

function isStartSectionFullyInViewport(
  rect: DOMRect,
  viewportH: number,
): boolean {
  const availableHeight = viewportH - NAV_START_VIEWPORT_OFFSET;
  const fitsInViewport = rect.height <= availableHeight;

  if (fitsInViewport) {
    return (
      rect.top >= NAV_START_VIEWPORT_OFFSET - 1 &&
      rect.bottom <= viewportH + 1
    );
  }

  return (
    rect.top <= NAV_START_VIEWPORT_OFFSET + 1 &&
    rect.bottom >= viewportH - 1
  );
}

export function useScrollSpy({
  sectionIds,
  visibilityThresholdIndex = 3,
  navStartSectionId,
}: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const rafRef = useRef<number | null>(null);
  const navUnlockedRef = useRef(false);

  useEffect(() => {
    const compute = () => {
      rafRef.current = null;

      const viewportH = window.innerHeight;
      const mid = viewportH * 0.4;

      const next: Record<string, number> = {};
      let active = sectionIds[0] ?? "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const scrollSpan = Math.max(1, rect.height + viewportH);
        next[id] = Math.max(0, Math.min(1, (viewportH - rect.top) / scrollSpan));

        if (rect.top <= mid) {
          active = id;
        }
      }

      const thresholdEl = navStartSectionId
        ? document.getElementById(navStartSectionId)
        : document.getElementById(sectionIds[visibilityThresholdIndex] ?? sectionIds[0] ?? "");

      const thresholdRect = thresholdEl?.getBoundingClientRect();
      if (thresholdRect) {
        const isFullyInViewport = isStartSectionFullyInViewport(thresholdRect, viewportH);
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

    const mutationObserver = new MutationObserver(onScroll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();

    const hydrationTimers = [300, 1000, 2500].map((delay) =>
      window.setTimeout(onScroll, delay),
    );

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      hydrationTimers.forEach((timer) => window.clearTimeout(timer));
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionIds, visibilityThresholdIndex, navStartSectionId]);

  return { activeId, isVisible, progress };
}

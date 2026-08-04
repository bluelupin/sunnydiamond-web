import { useState, useEffect, useRef } from "react";
import {
  getSavedHomeActiveSection,
  SCROLL_RESTORED_EVENT,
} from "@/shared/lib/browserBackScrollRestore";

interface UseScrollSpyOptions {
  sectionIds: readonly string[];
  visibilityThresholdIndex?: number;
  /** Section id that unlocks the nav when it fully fills the viewport (e.g. alankara). */
  navStartSectionId?: string;
}

const NAV_START_VIEWPORT_OFFSET = 110;
const NAV_UNLOCK_STORAGE_KEY = "sd:home-section-nav-unlocked";

function readInitialActiveSection(sectionIds: readonly string[]): string {
  const saved = getSavedHomeActiveSection();
  if (saved && sectionIds.includes(saved)) {
    return saved;
  }

  return sectionIds[0] ?? "";
}

function readPersistedNavUnlock(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(NAV_UNLOCK_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function persistNavUnlock(unlocked: boolean): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(NAV_UNLOCK_STORAGE_KEY, unlocked ? "true" : "false");
  } catch {
    /* ignore quota / privacy errors */
  }
}

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

/**
 * When the nav-start section is lazy-loaded (not in DOM yet), infer unlock state
 * from always-mounted above-fold sections or scroll offset.
 */
function inferNavUnlockWithoutStartSection(
  viewportH: number,
  scrollY: number,
): boolean | null {
  const craftingEl = document.getElementById("crafting-rarity");
  if (craftingEl) {
    const rect = craftingEl.getBoundingClientRect();
    if (rect.bottom <= NAV_START_VIEWPORT_OFFSET) {
      return true;
    }
    if (rect.top >= viewportH && scrollY < 50) {
      return false;
    }
  }

  if (scrollY > viewportH * 1.2) {
    return true;
  }

  if (scrollY < 50) {
    return false;
  }

  return null;
}

function resolveNavUnlockState(
  thresholdRect: DOMRect | undefined,
  viewportH: number,
  scrollY: number,
  previous: boolean,
): boolean {
  if (thresholdRect) {
    const isFullyInViewport = isStartSectionFullyInViewport(thresholdRect, viewportH);
    const isAboveStartSection = thresholdRect.top >= viewportH;
    const isPastStartSection = thresholdRect.top < NAV_START_VIEWPORT_OFFSET;

    if (isFullyInViewport || isPastStartSection) {
      return true;
    }

    if (isAboveStartSection) {
      return false;
    }

    return previous;
  }

  const inferred = inferNavUnlockWithoutStartSection(viewportH, scrollY);
  if (inferred != null) {
    return inferred;
  }

  return previous;
}

export function useScrollSpy({
  sectionIds,
  visibilityThresholdIndex = 3,
  navStartSectionId,
}: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState<string>(() => readInitialActiveSection(sectionIds));
  const [isVisible, setIsVisible] = useState(() => readPersistedNavUnlock());
  const [progress, setProgress] = useState<Record<string, number>>({});
  const rafRef = useRef<number | null>(null);
  const navUnlockedRef = useRef(readPersistedNavUnlock());

  useEffect(() => {
    navUnlockedRef.current = readPersistedNavUnlock();
    setIsVisible(navUnlockedRef.current);

    const compute = () => {
      rafRef.current = null;

      const viewportH = window.innerHeight;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
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

      const nextUnlocked = resolveNavUnlockState(
        thresholdEl?.getBoundingClientRect(),
        viewportH,
        scrollY,
        navUnlockedRef.current,
      );

      navUnlockedRef.current = nextUnlocked;
      persistNavUnlock(nextUnlocked);
      setIsVisible(nextUnlocked);
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
    window.addEventListener("popstate", onScroll);
    window.addEventListener(SCROLL_RESTORED_EVENT, onScroll);

    compute();

    const hydrationTimers = [0, 50, 150, 300, 600, 1000, 2000, 3500].map((delay) =>
      window.setTimeout(onScroll, delay),
    );

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("popstate", onScroll);
      window.removeEventListener(SCROLL_RESTORED_EVENT, onScroll);
      hydrationTimers.forEach((timer) => window.clearTimeout(timer));
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionIds, visibilityThresholdIndex, navStartSectionId]);

  return { activeId, isVisible, progress };
}

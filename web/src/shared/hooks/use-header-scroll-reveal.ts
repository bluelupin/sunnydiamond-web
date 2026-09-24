import { useEffect, useRef, useState } from "react";

const SCROLL_DELTA_THRESHOLD_PX = 6;
const TOP_ALWAYS_VISIBLE_PX = 32;

type UseHeaderScrollRevealOptions = {
  enabled?: boolean;
  useMainScrollContainer?: boolean;
};

function readScrollY(useMainScrollContainer: boolean): number {
  if (useMainScrollContainer) {
    const main = document.querySelector("main");
    if (main) {
      return main.scrollTop;
    }
  }

  return window.scrollY || document.documentElement.scrollTop || 0;
}

/** Hide the header while scrolling down; reveal it as soon as the user scrolls up. */
export function useHeaderScrollReveal({
  enabled = true,
  useMainScrollContainer = false,
}: UseHeaderScrollRevealOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPastTop, setIsPastTop] = useState(false);
  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);
  const isPastTopRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      isVisibleRef.current = true;
      isPastTopRef.current = false;
      setIsVisible(true);
      setIsPastTop(false);
      return;
    }

    const update = () => {
      rafRef.current = null;
      const scrollY = readScrollY(useMainScrollContainer);
      const nextPastTop = scrollY > TOP_ALWAYS_VISIBLE_PX;

      if (nextPastTop !== isPastTopRef.current) {
        isPastTopRef.current = nextPastTop;
        setIsPastTop(nextPastTop);
      }

      if (scrollY <= TOP_ALWAYS_VISIBLE_PX) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        lastScrollYRef.current = scrollY;
        return;
      }

      const delta = scrollY - lastScrollYRef.current;
      if (Math.abs(delta) < SCROLL_DELTA_THRESHOLD_PX) {
        return;
      }

      const nextVisible = delta < 0;
      if (nextVisible !== isVisibleRef.current) {
        isVisibleRef.current = nextVisible;
        setIsVisible(nextVisible);
      }

      lastScrollYRef.current = scrollY;
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    lastScrollYRef.current = readScrollY(useMainScrollContainer);
    isVisibleRef.current = true;
    isPastTopRef.current = lastScrollYRef.current > TOP_ALWAYS_VISIBLE_PX;
    setIsVisible(true);
    setIsPastTop(isPastTopRef.current);

    const main = useMainScrollContainer ? document.querySelector("main") : null;
    main?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      main?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, useMainScrollContainer]);

  return { isVisible, isPastTop };
}

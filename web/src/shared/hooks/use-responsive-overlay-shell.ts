import { useEffect, useRef, useState } from "react";

/**
 * Locks mobile vs desktop overlay shell at open time so resize mid-transition
 * does not swap Drawer/Sheet and cause flicker or double overlays.
 */
export function useResponsiveOverlayShell(open: boolean, mediaQuery: string) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(mediaQuery).matches,
  );
  const [useMobileShell, setUseMobileShell] = useState(isMobile);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia(mediaQuery);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [mediaQuery]);

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    if (justOpened) {
      setUseMobileShell(isMobile);
    }
    wasOpenRef.current = open;
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) {
      setUseMobileShell(isMobile);
    }
  }, [isMobile, open]);

  const showMobileShell = open ? useMobileShell : isMobile;

  return { isMobile, showMobileShell };
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  consumePopstateRestore,
  getCurrentScrollStorageKey,
  isInternalNavigationHref,
  markPopstateNavigation,
  readScrollOffset,
  restoreScrollPosition,
  saveScrollPosition,
} from "@/shared/lib/browserBackScrollRestore";
import { scrollToTopBeforeClientNavigation } from "@/shared/utils/navigation";

const SAVE_DEBOUNCE_MS = 150;

/**
 * Restores exact scroll position when the user returns via browser Back/Forward.
 * Normal link navigation, refresh, and direct URL visits are unaffected.
 */
export default function BrowserBackScrollRestore() {
  const pathname = usePathname() ?? "/";
  const cancelRestoreRef = useRef<(() => void) | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const scrollKeyRef = useRef(getCurrentScrollStorageKey(pathname));
  const hasMountedRef = useRef(false);

  scrollKeyRef.current = getCurrentScrollStorageKey(pathname);

  const persistScrollPosition = () => {
    saveScrollPosition(scrollKeyRef.current, readScrollOffset());
  };

  const schedulePersistScrollPosition = () => {
    if (saveTimeoutRef.current != null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      saveTimeoutRef.current = null;
      persistScrollPosition();
    }, SAVE_DEBOUNCE_MS);
  };

  useEffect(() => {
    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }

    const onPopstate = () => {
      markPopstateNavigation();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        markPopstateNavigation();
      }
    };

    window.addEventListener("popstate", onPopstate);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("popstate", onPopstate);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => schedulePersistScrollPosition();

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });

    const main = document.querySelector("main");
    main?.addEventListener("scroll", onScroll, { passive: true });

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank") return;

      if (!isInternalNavigationHref(anchor.getAttribute("href"))) return;

      persistScrollPosition();
    };

    document.addEventListener("click", onDocumentClick, true);

    const onPageHide = () => persistScrollPosition();
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      main?.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("pagehide", onPageHide);

      if (saveTimeoutRef.current != null) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      persistScrollPosition();
    };
  }, [pathname]);

  useEffect(() => {
    cancelRestoreRef.current?.();
    cancelRestoreRef.current = null;

    if (consumePopstateRestore()) {
      const key = getCurrentScrollStorageKey(pathname);
      cancelRestoreRef.current = restoreScrollPosition(key);

      return () => {
        cancelRestoreRef.current?.();
        cancelRestoreRef.current = null;
      };
    }

    if (hasMountedRef.current) {
      scrollToTopBeforeClientNavigation();
    } else {
      hasMountedRef.current = true;
    }

    return () => {
      cancelRestoreRef.current?.();
      cancelRestoreRef.current = null;
    };
  }, [pathname]);

  useEffect(
    () => () => {
      cancelRestoreRef.current?.();
      cancelRestoreRef.current = null;
    },
    [],
  );

  return null;
}

"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  consumePopstateRestore,
  getCurrentScrollStorageKey,
  getSavedScrollPosition,
  isInternalNavigationHref,
  markHomeEagerSectionLoad,
  markPopstateNavigation,
  prepareHomeBackNavigationRestore,
  readScrollOffset,
  restoreHomeActiveSection,
  restoreScrollPosition,
  saveHomeActiveSection,
  saveScrollPosition,
} from "@/shared/lib/browserBackScrollRestore";
import { scrollToTopBeforeClientNavigation } from "@/shared/utils/navigation";
import { useHomeSidebarSectionIds } from "@/hooks/homepage/useHomeSidebarNavigation";
import { isHomePathname, resolveActiveHomeSection } from "@/shared/utils/homeSectionScroll";

const SAVE_DEBOUNCE_MS = 150;

/**
 * Restores exact scroll position when the user returns via browser Back/Forward.
 * Normal link navigation, refresh, and direct URL visits are unaffected.
 */
export default function BrowserBackScrollRestore() {
  const pathname = usePathname() ?? "/";
  const sidebarSectionIds = useHomeSidebarSectionIds();
  const cancelRestoreRef = useRef<(() => void) | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const scrollKeyRef = useRef(getCurrentScrollStorageKey(pathname));
  const hasMountedRef = useRef(false);

  scrollKeyRef.current = getCurrentScrollStorageKey(pathname);

  const persistScrollPosition = () => {
    saveScrollPosition(scrollKeyRef.current, readScrollOffset());

    if (isHomePathname(pathname) && sidebarSectionIds.length > 0) {
      const activeSection = resolveActiveHomeSection(sidebarSectionIds);
      if (activeSection) {
        saveHomeActiveSection(activeSection);
      }
    }
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

      if (isHomePathname(window.location.pathname)) {
        prepareHomeBackNavigationRestore();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        markPopstateNavigation();

        if (isHomePathname(window.location.pathname)) {
          prepareHomeBackNavigationRestore();
        }
      }
    };

    window.addEventListener("popstate", onPopstate, true);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("popstate", onPopstate, true);
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
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persistScrollPosition();
      }
    };

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      main?.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (saveTimeoutRef.current != null) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      persistScrollPosition();
    };
  }, [pathname, sidebarSectionIds]);

  useLayoutEffect(() => {
    cancelRestoreRef.current?.();
    cancelRestoreRef.current = null;

    if (consumePopstateRestore()) {
      const key = getCurrentScrollStorageKey(pathname);
      const savedScroll = getSavedScrollPosition(key);

      if (isHomePathname(pathname)) {
        markHomeEagerSectionLoad();
      }

      const cancelScrollRestore =
        savedScroll != null ? restoreScrollPosition(key) : () => {};
      const cancelSectionRestore =
        isHomePathname(pathname) && savedScroll == null && sidebarSectionIds.length > 0
          ? restoreHomeActiveSection(sidebarSectionIds)
          : () => {};

      cancelRestoreRef.current = () => {
        cancelScrollRestore();
        cancelSectionRestore();
      };

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
  }, [pathname, sidebarSectionIds]);

  useEffect(
    () => () => {
      cancelRestoreRef.current?.();
      cancelRestoreRef.current = null;
    },
    [],
  );

  return null;
}

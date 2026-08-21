"use client";

import { useEffect, useState } from "react";
import { useHomeSidebarNavigation } from "@/hooks/homepage/useHomeSidebarNavigation";
import type { HomeSidebarNavSection } from "@/shared/lib/shellNavigation";

function getSectionsInDom(navSections: readonly HomeSidebarNavSection[]): HomeSidebarNavSection[] {
  if (typeof document === "undefined") return [];
  return navSections.filter((section) => document.getElementById(section.sectionId) != null);
}

/** Nav anchors limited to CMS sidebar sections currently rendered in the DOM. */
export function useVisibleHomeSections() {
  const navSections = useHomeSidebarNavigation();
  const [visibleSections, setVisibleSections] = useState<HomeSidebarNavSection[]>([]);

  useEffect(() => {
    let debounceId: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      setVisibleSections(getSectionsInDom(navSections));
    };

    const debouncedSync = () => {
      if (debounceId) clearTimeout(debounceId);
      debounceId = setTimeout(sync, 120);
    };

    sync();

    const observer = new MutationObserver(debouncedSync);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", debouncedSync);

    const hydrationTimers = [300, 1000, 2500].map((delay) =>
      window.setTimeout(sync, delay),
    );

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", debouncedSync);
      if (debounceId) clearTimeout(debounceId);
      hydrationTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [navSections]);

  return visibleSections;
}

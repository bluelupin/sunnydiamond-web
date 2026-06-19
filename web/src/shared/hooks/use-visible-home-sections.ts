"use client";

import { useEffect, useState } from "react";
import { homeSections } from "@/features/cms/data/content";

export type HomeSection = (typeof homeSections)[number];

function getSectionsInDom(): HomeSection[] {
  if (typeof document === "undefined") return [];
  return homeSections.filter((section) => document.getElementById(section.id) != null);
}

/** Nav anchors limited to sections currently rendered in the DOM (CMS-driven visibility). */
export function useVisibleHomeSections() {
  const [visibleSections, setVisibleSections] = useState<HomeSection[]>([]);

  useEffect(() => {
    let debounceId: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      setVisibleSections(getSectionsInDom());
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
  }, []);

  return visibleSections;
}

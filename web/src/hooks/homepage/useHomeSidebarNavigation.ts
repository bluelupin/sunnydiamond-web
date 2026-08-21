"use client";

import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import {
  resolveShellSidebarNavigation,
  type HomeSidebarNavSection,
} from "@/shared/lib/shellNavigation";

export function useHomeSidebarNavigation(): HomeSidebarNavSection[] {
  const { data: shellData } = useHomepageShell();

  return useMemo(
    () => resolveShellSidebarNavigation(shellData?.global?.sidebarNavigation),
    [shellData?.global?.sidebarNavigation],
  );
}

export function useHomeSidebarSectionIds(): string[] {
  const navSections = useHomeSidebarNavigation();

  return useMemo(
    () => navSections.map((section) => section.sectionId),
    [navSections],
  );
}

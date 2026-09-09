"use client";

import { useUiPlatformContext } from "@/shared/context/UiPlatformContext";
import { detectUiPlatform } from "@/shared/utils/detectUiPlatform";

/**
 * Global device key for UI tweaks.
 *
 * @example
 * const { windows } = useUiPlatform();
 * className={cn("flex items-center", !windows && "-translate-y-0.5")}
 */
export function useUiPlatform() {
  const context = useUiPlatformContext();

  if (context) {
    return context;
  }

  if (typeof navigator === "undefined") {
    return { windows: false, platform: "other" };
  }

  const platform = detectUiPlatform(
    navigator.userAgent,
    navigator.platform,
    navigator.maxTouchPoints,
  );

  return {
    windows: platform === "windows",
    platform,
  };
}

/** Shorthand for `!windows ? nonWindowsClass : windowsClass` */
export function platformClass(
  windows: boolean,
  nonWindowsClass: string,
  windowsClass = "",
): string {
  return windows ? windowsClass : nonWindowsClass;
}

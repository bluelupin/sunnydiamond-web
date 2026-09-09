"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { detectUiPlatform, type UiPlatform } from "@/shared/utils/detectUiPlatform";

export type UiPlatformContextValue = {
  /** `true` on Windows — use for `!windows ? "your-class" : ""` alignment tweaks. */
  windows: boolean;
  platform: UiPlatform;
};

const UiPlatformContext = createContext<UiPlatformContextValue | null>(null);

function readPlatformFromDocument(): UiPlatform {
  if (typeof document === "undefined") {
    return "other";
  }

  const fromDom = document.documentElement.getAttribute("data-ui-platform");
  if (fromDom === "windows" || fromDom === "apple" || fromDom === "other") {
    return fromDom;
  }

  return detectUiPlatform(
    navigator.userAgent,
    navigator.platform,
    navigator.maxTouchPoints,
  );
}

export function UiPlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<UiPlatform>(readPlatformFromDocument);

  useLayoutEffect(() => {
    const detected = detectUiPlatform(
      navigator.userAgent,
      navigator.platform,
      navigator.maxTouchPoints,
    );

    document.documentElement.setAttribute("data-ui-platform", detected);
    setPlatform(detected);
  }, []);

  const value = useMemo<UiPlatformContextValue>(
    () => ({
      windows: platform === "windows",
      platform,
    }),
    [platform],
  );

  return <UiPlatformContext.Provider value={value}>{children}</UiPlatformContext.Provider>;
}

export function useUiPlatformContext() {
  return useContext(UiPlatformContext);
}

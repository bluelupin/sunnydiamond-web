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

function readPlatformFromDocument(fallback: UiPlatform): UiPlatform {
  if (typeof document === "undefined") {
    return fallback;
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

type UiPlatformProviderProps = {
  children: ReactNode;
  /** Server-detected platform so SSR markup matches the first client render. */
  initialPlatform?: UiPlatform;
};

export function UiPlatformProvider({
  children,
  initialPlatform = "other",
}: UiPlatformProviderProps) {
  const [platform, setPlatform] = useState<UiPlatform>(() =>
    readPlatformFromDocument(initialPlatform),
  );

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

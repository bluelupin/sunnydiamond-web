"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { detectUiPlatform, type UiPlatform } from "@/shared/utils/detectUiPlatform";

export type UiPlatformContextValue = {
  /** `true` on Windows — use for `!windows ? "your-class" : ""` alignment tweaks. */
  windows: boolean;
  platform: UiPlatform;
};

const UiPlatformContext = createContext<UiPlatformContextValue | null>(null);

function readPlatform(): UiPlatform {
  const value = document.documentElement.getAttribute("data-ui-platform");
  if (value === "windows" || value === "apple" || value === "other") {
    return value;
  }
  return detectUiPlatform(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
}

function subscribeToPlatform(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-ui-platform"],
  });
  return () => observer.disconnect();
}

type UiPlatformProviderProps = {
  children: ReactNode;
  /** Static server fallback so SSR markup matches the first client render. */
  initialPlatform?: UiPlatform;
};

export function UiPlatformProvider({
  children,
  initialPlatform = "other",
}: UiPlatformProviderProps) {
  const platform = useSyncExternalStore(
    subscribeToPlatform,
    readPlatform,
    () => initialPlatform,
  );

  useLayoutEffect(() => {
    const detected = detectUiPlatform(
      navigator.userAgent,
      navigator.platform,
      navigator.maxTouchPoints,
    );

    document.documentElement.setAttribute("data-ui-platform", detected);
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

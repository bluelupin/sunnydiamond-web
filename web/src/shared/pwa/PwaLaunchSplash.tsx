"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GlobalRouteLoaderFrame } from "@/shared/ui/layout/GlobalRouteLoader";
import { usePageLoading } from "@/shared/context/PageLoadingContext";
import { isPwaStandaloneDisplayMode } from "./pwaInstallPrompt";
import { PWA_LAUNCH_SPLASH_MAX_MS, PWA_LAUNCH_SPLASH_MIN_MS } from "./pwaLaunchSplashTiming";
import { completePwaLaunchSplash } from "./pwaLaunchSplashCritical";

type SplashPhase = "idle" | "visible" | "hidden";

const STATIC_SPLASH_ID = "pwa-launch-splash-static";

/**
 * Installed PWA cold start — continues {@link PwaLaunchSplashStatic} after hydration.
 * Regular browser / responsive web never enters the visible phase.
 */
export default function PwaLaunchSplash() {
  const { isPageLoading } = usePageLoading();
  const [phase, setPhase] = useState<SplashPhase>("idle");
  const mountAtRef = useRef(0);
  const dismissedRef = useRef(false);

  useLayoutEffect(() => {
    if (!isPwaStandaloneDisplayMode()) {
      setPhase("hidden");
      completePwaLaunchSplash();
      return;
    }
    mountAtRef.current = Date.now();
    setPhase("visible");
    document.getElementById(STATIC_SPLASH_ID)?.remove();
  }, []);

  useEffect(() => {
    if (phase !== "visible" || dismissedRef.current) {
      return;
    }

    let cancelled = false;
    let minDelayTimer: ReturnType<typeof setTimeout> | undefined;

    const dismiss = () => {
      if (cancelled || dismissedRef.current) {
        return;
      }
      dismissedRef.current = true;
      completePwaLaunchSplash();
      setPhase("hidden");
    };

    const scheduleDismissWhenReady = () => {
      if (cancelled || dismissedRef.current) {
        return;
      }

      const documentReady = document.readyState === "complete";
      const appShellReady = documentReady && !isPageLoading;
      if (!appShellReady) {
        return;
      }

      const elapsed = Date.now() - mountAtRef.current;
      const waitMs = Math.max(0, PWA_LAUNCH_SPLASH_MIN_MS - elapsed);

      if (minDelayTimer) {
        clearTimeout(minDelayTimer);
      }
      minDelayTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(dismiss);
        });
      }, waitMs);
    };

    scheduleDismissWhenReady();

    const poll = window.setInterval(scheduleDismissWhenReady, 80);
    const onLoad = () => scheduleDismissWhenReady();
    window.addEventListener("load", onLoad);

    const maxTimer = window.setTimeout(dismiss, PWA_LAUNCH_SPLASH_MAX_MS);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(maxTimer);
      if (minDelayTimer) {
        clearTimeout(minDelayTimer);
      }
    };
  }, [phase, isPageLoading]);

  if (phase !== "visible") {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[2147483647] touch-none bg-white"
      role="presentation"
      aria-hidden={false}
    >
      <GlobalRouteLoaderFrame fixed={false} className="relative h-full w-full bg-white" />
    </div>
  );
}

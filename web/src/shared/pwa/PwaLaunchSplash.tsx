"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GlobalRouteLoader from "@/shared/ui/layout/GlobalRouteLoader";
import { usePageLoading } from "@/shared/context/PageLoadingContext";
import { isPwaStandaloneDisplayMode } from "./pwaInstallPrompt";
import { PWA_LAUNCH_SPLASH_MAX_MS, PWA_LAUNCH_SPLASH_MIN_MS } from "./pwaLaunchSplash";

type SplashPhase = "idle" | "visible" | "hidden";

/**
 * Installed PWA cold start only — reuses {@link GlobalRouteLoader} until the app shell is ready.
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
      return;
    }
    mountAtRef.current = Date.now();
    setPhase("visible");
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
      className="fixed inset-0 z-[200] touch-none bg-background"
      role="presentation"
      aria-hidden={false}
    >
      <GlobalRouteLoader />
    </div>
  );
}

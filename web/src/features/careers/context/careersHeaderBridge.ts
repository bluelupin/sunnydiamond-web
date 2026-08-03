import { useLayoutEffect, useState } from "react";
import type { CareersHeaderMode } from "./CareersJobsContext";

let careersHeaderMode: CareersHeaderMode = "overlay";
const listeners = new Set<() => void>();

export function setCareersHeaderMode(mode: CareersHeaderMode) {
  careersHeaderMode = mode;
  listeners.forEach((listener) => listener());
}

export function resetCareersHeaderMode() {
  setCareersHeaderMode("overlay");
}

export function getCareersHeaderMode() {
  return careersHeaderMode;
}

export function subscribeCareersHeaderMode(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Header lives outside CareersJobsProvider; sync header mode on careers routes. */
export function useCareersHeaderMode(pathname: string): CareersHeaderMode | null {
  const [, setRevision] = useState(0);
  const isCareersLanding = pathname === "/careers";
  const isCareersJobDetail = pathname.startsWith("/careers/");

  useLayoutEffect(() => {
    if (!isCareersLanding) {
      return;
    }

    return subscribeCareersHeaderMode(() => setRevision((value) => value + 1));
  }, [isCareersLanding]);

  if (isCareersJobDetail) {
    return "solid";
  }

  if (!isCareersLanding) {
    return null;
  }

  return getCareersHeaderMode();
}

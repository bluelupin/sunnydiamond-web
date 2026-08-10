import { useLayoutEffect, useState } from "react";
import {
  CAREERS_ALL_OPENINGS_ROUTE,
  CAREERS_ROUTE,
} from "@/features/careers/constants/careersRoutes";
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

function isCareersHeaderManagedRoute(pathname: string): boolean {
  return pathname === CAREERS_ROUTE || pathname === CAREERS_ALL_OPENINGS_ROUTE;
}

/** Header lives outside CareersJobsProvider; sync header mode on careers routes. */
export function useCareersHeaderMode(pathname: string): CareersHeaderMode | null {
  const [, setRevision] = useState(0);
  const isManagedRoute = isCareersHeaderManagedRoute(pathname);
  const isCareersJobDetail =
    pathname.startsWith("/careers/") && pathname !== CAREERS_ALL_OPENINGS_ROUTE;

  useLayoutEffect(() => {
    if (!isManagedRoute) {
      return;
    }

    return subscribeCareersHeaderMode(() => setRevision((value) => value + 1));
  }, [isManagedRoute]);

  if (isCareersJobDetail) {
    return "solid";
  }

  if (!isManagedRoute) {
    return null;
  }

  return getCareersHeaderMode();
}

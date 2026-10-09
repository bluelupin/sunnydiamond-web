import { useLayoutEffect, useState } from "react";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";

let aboutTimelineHeaderSuppressed = false;
const listeners = new Set<() => void>();

export function setAboutTimelineHeaderSuppressed(suppressed: boolean) {
  if (aboutTimelineHeaderSuppressed === suppressed) {
    return;
  }

  aboutTimelineHeaderSuppressed = suppressed;
  listeners.forEach((listener) => listener());
}

export function resetAboutTimelineHeaderSuppressed() {
  setAboutTimelineHeaderSuppressed(false);
}

function getAboutTimelineHeaderSuppressed() {
  return aboutTimelineHeaderSuppressed;
}

function subscribeAboutTimelineHeaderSuppressed(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Header is outside AboutTimelineSection; hide it while the pinned timeline is active. */
export function useAboutTimelineHeaderSuppressed(pathname: string): boolean {
  const [, setRevision] = useState(0);
  const onAboutPage = pathname === WORLD_OF_SUNNY_PATH;

  useLayoutEffect(() => {
    if (!onAboutPage) {
      resetAboutTimelineHeaderSuppressed();
      return;
    }

    return subscribeAboutTimelineHeaderSuppressed(() => setRevision((value) => value + 1));
  }, [onAboutPage]);

  return onAboutPage && getAboutTimelineHeaderSuppressed();
}

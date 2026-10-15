import { useSyncExternalStore } from "react";

const MOBILE_HEADER_MEDIA_QUERY = "(max-width: 767px), (orientation: portrait)";

function subscribeMobileHeaderLayout(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_HEADER_MEDIA_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileHeaderLayoutSnapshot() {
  return window.matchMedia(MOBILE_HEADER_MEDIA_QUERY).matches;
}

/** Matches header `md:landscape:hidden` — mobile bar on small screens and portrait tablet. */
export function useMobileHeaderLayout() {
  return useSyncExternalStore(
    subscribeMobileHeaderLayout,
    getMobileHeaderLayoutSnapshot,
    () => false,
  );
}

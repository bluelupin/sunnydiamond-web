import { JEWELLERY_PATH } from "@/features/jewellery-product/utils/jewelleryRoutes";

/** Query key CMS may embed in footer link URLs (`/jewellery?plpToast=try-at-home`). */
export const PLP_FOOTER_TOAST_QUERY = "plpToast";

export type PlpFooterToastIntent = "try-at-home" | "schedule-video-call";

export type FooterLinkPlpToastFields = {
  url: string;
  targetType?: string | null;
};

export const PLP_FOOTER_TOAST_MESSAGES: Record<PlpFooterToastIntent, string> = {
  "try-at-home": "Select a product to Try at Home",
  "schedule-video-call": "Select a product to Schedule a Video Call",
};

const PLP_TOAST_TARGET_TYPES: Record<string, PlpFooterToastIntent> = {
  "try-at-home": "try-at-home",
  "plp-try-at-home": "try-at-home",
  "schedule-video-call": "schedule-video-call",
  "schedule-a-video-call": "schedule-video-call",
  "plp-schedule-video-call": "schedule-video-call",
  "product-video-call": "schedule-video-call",
};

const PLP_TOAST_PATH_INTENTS: Record<string, PlpFooterToastIntent> = {
  "/try-at-home": "try-at-home",
  "/schedule-a-video-call": "schedule-video-call",
  "/schedule-video-call": "schedule-video-call",
};

function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0]?.split("#")[0] ?? path;
  const withLeading = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return withLeading.replace(/\/$/, "") || "/";
}

export function resolvePlpFooterToastIntent(
  link: FooterLinkPlpToastFields,
): PlpFooterToastIntent | null {
  const targetType = link.targetType?.trim().toLowerCase();
  if (targetType && PLP_TOAST_TARGET_TYPES[targetType]) {
    return PLP_TOAST_TARGET_TYPES[targetType];
  }

  const trimmedUrl = link.url.trim();
  if (!trimmedUrl) {
    return null;
  }

  try {
    const url = new URL(trimmedUrl, "http://footer.local");
    const fromQuery = url.searchParams.get(PLP_FOOTER_TOAST_QUERY)?.trim().toLowerCase();
    if (fromQuery === "try-at-home" || fromQuery === "schedule-video-call") {
      return fromQuery;
    }

    const pathIntent = PLP_TOAST_PATH_INTENTS[normalizePath(url.pathname)];
    if (pathIntent) {
      return pathIntent;
    }

    const hashIntent = url.hash.replace(/^#/, "").trim().toLowerCase();
    if (hashIntent === "try-at-home" || hashIntent === "schedule-video-call") {
      return hashIntent;
    }

    const lower = trimmedUrl.toLowerCase();
    if (lower.includes("try-at-home") || lower.includes("try_at_home")) {
      return "try-at-home";
    }
    if (
      lower.includes("schedule-a-video-call") ||
      lower.includes("schedule-video-call") ||
      lower.includes("video-call") ||
      lower.includes("videocall")
    ) {
      return "schedule-video-call";
    }
  } catch {
    const pathIntent = PLP_TOAST_PATH_INTENTS[normalizePath(trimmedUrl)];
    if (pathIntent) {
      return pathIntent;
    }
  }

  return null;
}

export function getPlpFooterToastMessage(intent: PlpFooterToastIntent): string {
  return PLP_FOOTER_TOAST_MESSAGES[intent];
}

export function isFooterPlpToastLink(link: FooterLinkPlpToastFields): boolean {
  return resolvePlpFooterToastIntent(link) !== null;
}

/**
 * Footer PLP toast links always land on `/jewellery` with `plpToast` set.
 * Preserves other query params when CMS URL already targets the jewellery PLP.
 */
export function buildFooterPlpToastHref(link: FooterLinkPlpToastFields): string {
  const intent = resolvePlpFooterToastIntent(link);
  if (!intent) {
    return link.url;
  }

  const trimmed = link.url.trim();
  let params = new URLSearchParams();

  try {
    const parsed = new URL(trimmed, "http://footer.local");
    params = new URLSearchParams(parsed.search);
  } catch {
    // keep empty params
  }

  params.set(PLP_FOOTER_TOAST_QUERY, intent);
  const query = params.toString();
  return query ? `${JEWELLERY_PATH}?${query}` : `${JEWELLERY_PATH}?${PLP_FOOTER_TOAST_QUERY}=${intent}`;
}

export function readPlpFooterToastIntentFromSearch(
  searchParams: URLSearchParams,
): PlpFooterToastIntent | null {
  const value = searchParams.get(PLP_FOOTER_TOAST_QUERY)?.trim().toLowerCase();
  if (value === "try-at-home" || value === "schedule-video-call") {
    return value;
  }
  return null;
}

const PLP_FOOTER_TOAST_INTENT_STORAGE_KEY = "sunny.plpFooterToastIntent";

/** Same-tab navigation stash — survives Next.js Suspense remounts on the PLP. */
let pendingFooterPlpToastIntent: PlpFooterToastIntent | null = null;

function parseStoredFooterPlpToastIntent(raw: string | null): PlpFooterToastIntent | null {
  const value = raw?.trim().toLowerCase();
  if (value === "try-at-home" || value === "schedule-video-call") {
    return value;
  }
  return null;
}

/** Survives PLP URL sync that drops unknown query keys before React reads them. */
export function stashPlpFooterToastIntent(intent: PlpFooterToastIntent): void {
  pendingFooterPlpToastIntent = intent;

  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(PLP_FOOTER_TOAST_INTENT_STORAGE_KEY, intent);
  } catch {
    // ignore
  }
}

export function peekPlpFooterToastIntent(): PlpFooterToastIntent | null {
  if (pendingFooterPlpToastIntent) {
    return pendingFooterPlpToastIntent;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return parseStoredFooterPlpToastIntent(
      sessionStorage.getItem(PLP_FOOTER_TOAST_INTENT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

/** Prefer in-memory intent (footer click), then one-shot session storage. */
export function takePlpFooterToastIntent(): PlpFooterToastIntent | null {
  if (pendingFooterPlpToastIntent) {
    const intent = pendingFooterPlpToastIntent;
    pendingFooterPlpToastIntent = null;
    clearStoredFooterPlpToastIntent();
    return intent;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const intent = parseStoredFooterPlpToastIntent(
      sessionStorage.getItem(PLP_FOOTER_TOAST_INTENT_STORAGE_KEY),
    );
    if (intent) {
      sessionStorage.removeItem(PLP_FOOTER_TOAST_INTENT_STORAGE_KEY);
    }
    return intent;
  } catch {
    return null;
  }
}

export function clearStoredFooterPlpToastIntent(): void {
  pendingFooterPlpToastIntent = null;
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.removeItem(PLP_FOOTER_TOAST_INTENT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function stripPlpFooterToastFromBrowserUrl(): void {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (!params.has(PLP_FOOTER_TOAST_QUERY)) {
    return;
  }

  params.delete(PLP_FOOTER_TOAST_QUERY);
  const query = params.toString();
  const next = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(window.history.state, "", next);
}

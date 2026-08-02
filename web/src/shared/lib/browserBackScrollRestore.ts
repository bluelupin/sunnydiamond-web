const STORAGE_KEY = "sd:browser-back-scroll-positions";
const MAX_ENTRIES = 80;
const RESTORE_RETRY_DELAYS_MS = [0, 50, 150, 300, 600, 1000, 2000, 3500];

type ScrollPositions = Record<string, number>;

let memoryCache: ScrollPositions | null = null;
let pendingPopstateRestore = false;

export function markPopstateNavigation(): void {
  pendingPopstateRestore = true;
}

export function consumePopstateRestore(): boolean {
  if (!pendingPopstateRestore) return false;
  pendingPopstateRestore = false;
  return true;
}

export function getScrollStorageKey(
  pathname: string,
  search = "",
  hash = "",
): string {
  return `${pathname}${search}${hash}`;
}

function readCache(): ScrollPositions {
  if (memoryCache) return memoryCache;

  if (typeof window === "undefined") {
    memoryCache = {};
    return memoryCache;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    memoryCache = raw ? (JSON.parse(raw) as ScrollPositions) : {};
  } catch {
    memoryCache = {};
  }

  return memoryCache;
}

function writeCache(cache: ScrollPositions): void {
  memoryCache = cache;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function saveScrollPosition(key: string, scrollY: number): void {
  if (!key) return;

  const cache = readCache();
  cache[key] = Math.max(0, scrollY);

  const keys = Object.keys(cache);
  if (keys.length > MAX_ENTRIES) {
    for (let index = 0; index < keys.length - MAX_ENTRIES; index += 1) {
      delete cache[keys[index]!];
    }
  }

  writeCache(cache);
}

export function getSavedScrollPosition(key: string): number | null {
  const scrollY = readCache()[key];
  return typeof scrollY === "number" && Number.isFinite(scrollY) ? scrollY : null;
}

/** Auth routes scroll inside `<main>`; other routes use the window. */
export function resolveScrollRoot(): Window | HTMLElement {
  if (typeof document === "undefined") return window;

  const main = document.querySelector("main");
  if (main instanceof HTMLElement) {
    const overflowY = window.getComputedStyle(main).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return main;
    }
  }

  return window;
}

export function readScrollOffset(root: Window | HTMLElement = resolveScrollRoot()): number {
  if (root === window) {
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  return (root as HTMLElement).scrollTop;
}

export function writeScrollOffset(
  scrollY: number,
  root: Window | HTMLElement = resolveScrollRoot(),
): void {
  const top = Math.max(0, scrollY);

  if (root === window) {
    window.scrollTo({ top, left: 0, behavior: "auto" });
    return;
  }

  (root as HTMLElement).scrollTop = top;
}

export function getMaxScrollOffset(root: Window | HTMLElement = resolveScrollRoot()): number {
  if (root === window) {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  const element = root as HTMLElement;
  return Math.max(0, element.scrollHeight - element.clientHeight);
}

export function restoreScrollPosition(key: string): () => void {
  const targetY = getSavedScrollPosition(key);
  if (targetY == null) {
    return () => {};
  }

  const timers: number[] = [];
  let cancelled = false;

  const applyRestore = () => {
    if (cancelled) return;

    const root = resolveScrollRoot();
    const maxScroll = getMaxScrollOffset(root);
    writeScrollOffset(Math.min(targetY, maxScroll), root);
  };

  for (const delay of RESTORE_RETRY_DELAYS_MS) {
    timers.push(window.setTimeout(applyRestore, delay));
  }

  return () => {
    cancelled = true;
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

export function getCurrentScrollStorageKey(pathname: string): string {
  if (typeof window === "undefined") {
    return getScrollStorageKey(pathname);
  }

  return getScrollStorageKey(
    pathname,
    window.location.search,
    window.location.hash,
  );
}

export function isInternalNavigationHref(href: string | null): href is string {
  if (!href) return false;

  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("javascript:")
  ) {
    return false;
  }

  try {
    const url = new URL(trimmed, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

const STORAGE_KEY = "sd:browser-back-scroll-positions";
const POPSTATE_RESTORE_FLAG = "sd:pending-popstate-restore";
const HOME_EAGER_SECTIONS_FLAG = "sd:home-eager-sections";
const MAX_ENTRIES = 80;
const RESTORE_MAX_DURATION_MS = 5000;
const RESTORE_FALLBACK_DELAYS_MS = [50, 150, 300, 600, 1000, 2000, 3500];

export const SCROLL_RESTORED_EVENT = "sd:scroll-restored";
const HOME_ACTIVE_SECTION_KEY = "sd:home-active-section";

type ScrollPositions = Record<string, number>;

let memoryCache: ScrollPositions | null = null;
let pendingPopstateRestore = false;

export function markPopstateNavigation(): void {
  pendingPopstateRestore = true;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(POPSTATE_RESTORE_FLAG, "1");
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function consumePopstateRestore(): boolean {
  if (pendingPopstateRestore) {
    pendingPopstateRestore = false;
    clearPopstateRestoreFlag();
    return true;
  }

  if (typeof window === "undefined") return false;

  try {
    if (window.sessionStorage.getItem(POPSTATE_RESTORE_FLAG) === "1") {
      clearPopstateRestoreFlag();
      return true;
    }
  } catch {
    /* ignore quota / privacy errors */
  }

  return false;
}

function clearPopstateRestoreFlag(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(POPSTATE_RESTORE_FLAG);
  } catch {
    /* ignore quota / privacy errors */
  }
}

/** Mount below-fold home sections immediately during browser-back restore. */
export function markHomeEagerSectionLoad(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(HOME_EAGER_SECTIONS_FLAG, "1");
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function shouldEagerLoadHomeSections(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(HOME_EAGER_SECTIONS_FLAG) === "1";
  } catch {
    return false;
  }
}

export function clearHomeEagerSectionLoad(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(HOME_EAGER_SECTIONS_FLAG);
  } catch {
    /* ignore quota / privacy errors */
  }
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

export function saveHomeActiveSection(sectionId: string): void {
  if (!sectionId || typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(HOME_ACTIVE_SECTION_KEY, sectionId);
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function getSavedHomeActiveSection(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.sessionStorage.getItem(HOME_ACTIVE_SECTION_KEY);
    return value?.trim() || null;
  } catch {
    return null;
  }
}

function dispatchScrollRestored(): void {
  if (typeof window === "undefined") return;

  const root = resolveScrollRoot();
  const target = root === window ? window : root;
  target.dispatchEvent(new Event("scroll", { bubbles: true }));
  window.dispatchEvent(new Event(SCROLL_RESTORED_EVENT));
}

function createScrollRestoreSession(targetY: number) {
  let cancelled = false;
  let finished = false;
  let rafId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let stableFrames = 0;
  const startTime = Date.now();
  const timers: number[] = [];

  const finish = () => {
    if (finished || cancelled) return;
    finished = true;
    clearHomeEagerSectionLoad();
    dispatchScrollRestored();
  };

  const applyRestore = (): boolean => {
    if (cancelled || finished) return true;

    const root = resolveScrollRoot();
    const maxScroll = getMaxScrollOffset(root);
    const nextY = Math.min(targetY, maxScroll);
    const currentY = readScrollOffset(root);

    if (Math.abs(currentY - nextY) > 1) {
      writeScrollOffset(nextY, root);
      stableFrames = 0;
    } else {
      stableFrames += 1;
    }

    const reachedTarget = Math.abs(readScrollOffset(root) - nextY) <= 1;
    const canReachTarget = maxScroll >= targetY - 1;
    const timedOut = Date.now() - startTime >= RESTORE_MAX_DURATION_MS;

    if ((reachedTarget && canReachTarget && stableFrames >= 2) || timedOut) {
      finish();
      return true;
    }

    return false;
  };

  const scheduleFrame = () => {
    if (cancelled || finished) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      if (applyRestore()) return;
      scheduleFrame();
    });
  };

  applyRestore();
  scheduleFrame();

  if (typeof ResizeObserver !== "undefined" && typeof document !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      applyRestore();
    });
    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }
  }

  for (const delay of RESTORE_FALLBACK_DELAYS_MS) {
    timers.push(
      window.setTimeout(() => {
        applyRestore();
      }, delay),
    );
  }

  timers.push(
    window.setTimeout(() => {
      finish();
    }, RESTORE_MAX_DURATION_MS + 50),
  );

  return () => {
    cancelled = true;
    if (rafId != null) {
      window.cancelAnimationFrame(rafId);
    }
    resizeObserver?.disconnect();
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

export function restoreHomeActiveSection(sectionIds: readonly string[]): () => void {
  const sectionId = getSavedHomeActiveSection();
  if (!sectionId || !sectionIds.includes(sectionId)) {
    return () => {};
  }

  markHomeEagerSectionLoad();

  const timers: number[] = [];
  let cancelled = false;

  const applyRestore = () => {
    if (cancelled) return;

    const element = document.getElementById(sectionId);
    if (!element) return;

    const isTabletPortrait = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px) and (orientation: portrait)",
    ).matches;

    element.scrollIntoView({
      behavior: "auto",
      block: isTabletPortrait ? "center" : "start",
    });
  };

  const finish = () => {
    if (cancelled) return;
    cancelled = true;
    clearHomeEagerSectionLoad();
    dispatchScrollRestored();
  };

  for (const delay of RESTORE_FALLBACK_DELAYS_MS) {
    timers.push(
      window.setTimeout(() => {
        applyRestore();
      }, delay),
    );
  }

  timers.push(window.setTimeout(finish, RESTORE_MAX_DURATION_MS + 50));

  return () => {
    cancelled = true;
    timers.forEach((timer) => window.clearTimeout(timer));
  };
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

  return createScrollRestoreSession(targetY);
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

export function prepareHomeBackNavigationRestore(): void {
  if (typeof window === "undefined") return;

  if (getSavedScrollPosition(getScrollStorageKey(window.location.pathname)) != null) {
    markHomeEagerSectionLoad();
  } else if (getSavedHomeActiveSection()) {
    markHomeEagerSectionLoad();
  }
}

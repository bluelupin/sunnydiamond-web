const TABLET_PORTRAIT_SCROLL_MQ =
  "(min-width: 768px) and (max-width: 1023px) and (orientation: portrait)";

export function resolveActiveHomeSection(sectionIds: readonly string[]): string | null {
  if (typeof window === "undefined" || sectionIds.length === 0) return null;

  const viewportH = window.innerHeight;
  const mid = viewportH * 0.4;
  let active = sectionIds[0] ?? null;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;

    if (el.getBoundingClientRect().top <= mid) {
      active = id;
    }
  }

  return active;
}

export function scrollToHomeSection(id: string): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTabletPortrait = window.matchMedia(TABLET_PORTRAIT_SCROLL_MQ).matches;

  element.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: isTabletPortrait ? "center" : "start",
  });

  return true;
}

export function isHomePathname(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

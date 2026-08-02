/** True when any part of the element is visible, optionally expanded by margin (px). */
export function isElementInViewport(element: Element, marginPx = 0): boolean {
  const rect = element.getBoundingClientRect();
  const viewHeight = window.innerHeight;

  return rect.top < viewHeight + marginPx && rect.bottom > -marginPx;
}

/** Parse vertical root margin values from LazyInView-style shorthand (top/right/bottom/left). */
export function parseVerticalRootMarginPx(rootMargin: string): { top: number; bottom: number } {
  const parts = rootMargin.trim().split(/\s+/);

  const toPx = (value: string) => {
    if (value.endsWith("px")) {
      return Number.parseFloat(value) || 0;
    }

    if (value.endsWith("%")) {
      return ((Number.parseFloat(value) || 0) / 100) * window.innerHeight;
    }

    return 0;
  };

  if (parts.length === 1) {
    const margin = toPx(parts[0]);
    return { top: margin, bottom: margin };
  }

  if (parts.length === 2) {
    const vertical = toPx(parts[0]);
    return { top: vertical, bottom: vertical };
  }

  if (parts.length === 3) {
    return { top: toPx(parts[0]), bottom: toPx(parts[2]) };
  }

  return { top: toPx(parts[0]), bottom: toPx(parts[2]) };
}

export function isElementInViewportWithRootMargin(element: Element, rootMargin: string): boolean {
  const { top, bottom } = parseVerticalRootMarginPx(rootMargin);
  const rect = element.getBoundingClientRect();
  const viewHeight = window.innerHeight;

  return rect.top < viewHeight + bottom && rect.bottom > -top;
}

/**
 * IntersectionObserver only accepts px and % in rootMargin — not vh/vw/rem.
 * Invalid values throw synchronously and can take down a route error boundary.
 */
export function normalizeIntersectionRootMargin(rootMargin: string): string {
  if (typeof window === "undefined") {
    return rootMargin.replace(/\d+(?:\.\d+)?vh/gi, "800px");
  }

  const viewportHeight = window.innerHeight || 800;
  const viewportWidth = window.innerWidth || 1280;

  const convertUnit = (value: string, unit: string) => {
    const amount = Number.parseFloat(value) || 0;

    if (unit === "vh") {
      return `${Math.round((amount / 100) * viewportHeight)}px`;
    }

    if (unit === "vw") {
      return `${Math.round((amount / 100) * viewportWidth)}px`;
    }

    if (unit === "px" || unit === "%") {
      return `${amount}${unit}`;
    }

    return `${amount}px`;
  };

  return rootMargin
    .trim()
    .split(/\s+/)
    .map((token) => {
      const match = token.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw)?$/i);
      if (!match) {
        return token;
      }

      const [, amount, unit = "px"] = match;
      return convertUnit(amount, unit.toLowerCase());
    })
    .join(" ");
}

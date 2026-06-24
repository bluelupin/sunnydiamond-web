const MOBILE_LIFESTYLE_INDICES = new Set([1, 2, 7, 9]);
const DESKTOP_LIFESTYLE_INDICES = new Set([3, 5, 9]);
const CENTER_BADGE_INDICES = new Set([3, 8]);

export type CardVariant = "default" | "lifestyle";
export type BestsellerBadgeStyle = "top-gold" | "center-white";

export function getMobileCardVariant(index: number): CardVariant {
  return MOBILE_LIFESTYLE_INDICES.has(index % 10) ? "lifestyle" : "default";
}

export function getDesktopCardVariant(index: number): CardVariant {
  return DESKTOP_LIFESTYLE_INDICES.has(index % 12) ? "lifestyle" : "default";
}

export function getMobileBestsellerBadgeStyle(index: number): BestsellerBadgeStyle {
  return CENTER_BADGE_INDICES.has(index) ? "center-white" : "top-gold";
}

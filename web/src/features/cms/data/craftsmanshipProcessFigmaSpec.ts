/**
 * Craftsmanship section backgrounds — Figma 2556:943 (desktop) / 2556:1238 (responsive).
 * Radial overlay values from Figma 684:3025 SVG export.
 */
export const craftsmanshipProcessFigmaSpec = {
  desktop: {
    /** Figma 684:3024 — silk ripple texture */
    texture: {
      height: 700,
      topOffsetPx: 0.08,
      imageWidth: 700,
      imageHeight: 1440,
      minSpan: 1440,
    },
    /** Figma 684:3025 — radial fade (750×1440 user space, rotated 90° in layout) */
    radial: {
      layerHeight: 750,
      viewWidth: 750,
      viewHeight: 1440,
      ellipseWidth: 390,
      ellipseHeight: 364,
      centerX: 390,
      centerY: 460,
      from: "rgba(244, 243, 238, 0)",
      to: "rgb(251, 250, 246)",
    },
  },
  mobile: {
    /** Figma 684:3332 — silk texture (top-anchored, full-bleed) */
    texture: {
      height: 651,
      imageWidth: 651,
      imageHeight: 1339,
      minSpan: 1339,
      anchor: "top" as const,
    },
    /** Figma 684:3332 — radial fade (proportional to 684:3025) */
    radial: {
      layerHeight: 700,
      viewWidth: 651,
      viewHeight: 1339,
      ellipseWidth: 338,
      ellipseHeight: 316,
      centerX: 338,
      centerY: 399,
      from: "rgba(244, 243, 238, 0)",
      to: "rgb(251, 250, 246)",
    },
  },
} as const;

type CraftsmanshipRadialGradientInput = {
  ellipseWidth: number;
  ellipseHeight: number;
  centerX: number;
  centerY: number;
  from: string;
  to: string;
};

export function craftsmanshipRadialGradientStyle(radial: CraftsmanshipRadialGradientInput) {
  const {
    ellipseWidth,
    ellipseHeight,
    centerX,
    centerY,
    from,
    to,
  } = radial;

  return {
    backgroundImage: `radial-gradient(ellipse ${ellipseWidth}px ${ellipseHeight}px at ${centerX}px ${centerY}px, ${from} 0%, ${to} 100%)`,
  } as const;
}

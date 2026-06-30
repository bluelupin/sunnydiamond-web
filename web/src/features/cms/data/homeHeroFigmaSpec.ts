/** Figma 684:2808 — Homepage hero linear gradient overlays over video/image. */
export const homeHeroFigmaSpec = {
  /** Full-frame left-to-right scrim for nav contrast and depth. */
  horizontalScrim: {
    from: "hsl(var(--charcoal) / 0.55)",
    via: "hsl(var(--charcoal) / 0.15)",
    to: "transparent",
  },
  /** Mobile — bottom-half fade for centered copy + trust bar. */
  bottomMobile: {
    heightRatio: 0.5,
    from: "hsl(var(--charcoal) / 0.4)",
    to: "transparent",
  },
  /**
   * Desktop — full-width bottom linear gradient (Figma stop at 53.563%).
   * Same pattern as Occasions / Alankara overlays in frame 684.
   */
  bottomDesktop: {
    from: "rgba(0, 0, 0, 0.7)",
    to: "rgba(0, 0, 0, 0)",
    fadeEnd: "53.563%",
  },
} as const;

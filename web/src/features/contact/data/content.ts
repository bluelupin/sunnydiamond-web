export const contactMobileFigmaSpec = {
  /** Figma node 1480:177909 — mobile contact page */
  contentPadding: {
    x: 16,
    y: 64,
  },
  sectionGap: 64,
  hero: {
    height: 240,
    titleSize: 32,
    imageCrop: {
      left: "-41.17%",
      width: "182.42%",
      top: "2.34%",
      height: "100%",
    },
  },
} as const;

export const contactHeroFigmaSpec = {
  /** Figma node 1480:178047 — contact page hero banner */
  height: {
    mobile: 240,
    desktop: 320,
  },
  imageCrop: {
    heightScale: "253.26%",
    topOffset: "-108.25%",
  },
  overlayOpacity: 0.4,
  titleTop: {
    mobile: 152,
    desktop: 203,
  },
} as const;

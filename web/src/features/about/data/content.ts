/** Exact measurements from Figma node 692:27408 — Hero — Scroll Collapse (State=1-Expanded) */
export const aboutHeroFigmaSpec = {
  section: {
    width: 1440,
    height: 640,
    background: "#FBFAF6",
  },
  image: {
    width: 1802,
    height: 1802,
    x: -181,
    y: -755,
    imageRef: "e95bffb6c59e47ebe9d8c64bda7f471821dfdd3c",
  },
  title: {
    text: "Our Story",
    x: 277,
    y: 512,
    width: 886,
    height: 53,
    fontFamily: "Larken",
    fontWeight: 300,
    fontSize: 48,
    lineHeight: 110,
    color: "#FFFFFF",
    textAlign: "center" as const,
    /** Figma 692:27431 — mobile title */
    mobile: {
      fontSize: 32,
      paddingBottom: 64,
    },
  },
  /** Bottom gradient for title legibility over hero image */
  overlay: {
    gradient: "bottom" as const,
  },
  /**
   * Figma component 692:26924 — Hero Scroll Collapse.
   * Collapsed (static on load) → Expanded on first user scroll (Smart Animate: width + Y together).
   * Desktop expanded: full width, hero_inner top 100px (chalk band under nav).
   * Mobile expanded: full width, flush top — image swipe only.
   */
  animation: {
    collapsedWidthRatio: 1360 / 1440,
    expandedOffsetY: 100,
    durationMs: 500,
    titleDelayMs: 300,
    titleDurationMs: 500,
    mobile: {
      sectionHeight: 580,
      imageSwipeY: 32,
    },
  },
  /** Figma 692:27431 mobile artboard hero height */
  mobileSection: {
    width: 375,
    height: 520,
  },
} as const;

/** Local decorative / layout assets only — section content comes from CMS. */
export const aboutHandcraftedAssets = {
  flourish: "/images/about/handcrafted-flourish.svg",
} as const;

/** Figma node 692:27430 — Crafting Rarity — Reveal V2 */
export const aboutCraftingRarityFigmaSpec = {
  container: { width: 817, height: 745 },
  heading: {
    fontSize: 90,
    lineHeight: 110,
    offsetY: 20,
    height: 198,
  },
  image: {
    width: 354,
    height: 354,
    offsetY: 222,
    gapAfterHeading: 4,
  },
  line: {
    width: 1,
    height: 79,
    offsetY: 599,
    gapAfterImage: 23,
    gradientFrom: "#722257",
    gradientTo: "#DDA957",
  },
  body: {
    width: 523,
    offsetY: 691,
    gapAfterLine: 13,
    fontSize: 20,
    lineHeight: 110,
    color: "#0A0A0A",
  },
  /**
   * Scroll-scrubbed Reveal V2 — progress 0→1 as the section travels through
   * the viewport (top at bottom edge → bottom at top edge).
   */
  animation: {
    viewportVisibleThreshold: 0.25,
    segments: {
      heading: { start: 0, end: 0.25 },
      image: { start: 0.2, end: 0.45 },
      line: { start: 0.4, end: 0.65 },
      lineFill: { start: 0.45, end: 0.7 },
      body: { start: 0.65, end: 1 },
    },
  },
} as const;

/** Figma Component 228 — team card hover overlay */
export const aboutFacesFigmaSpec = {
  overlay: {
    gradient: "bottom-strong" as const,
  },
} as const;

/** Mosaic text-card layout only — copy comes from CMS craftMosaicSection tiles. */
export const aboutHandcraftedTileLayout = {
  cards: [
    {
      position: { left: "20.17%", top: "0" },
      gap: 12,
    },
    {
      position: { left: "40.43%", top: "34.04%" },
      gap: 12,
    },
    {
      position: { left: "20.09%", top: "67.97%" },
      gap: 10,
    },
  ],
} as const;

/** Figma node 692:27322 — Handcrafted Brilliance */
export const aboutHandcraftedFigmaSpec = {
  section: {
    width: 1440,
    height: 1417,
    background: "#FFFFFF",
  },
  hero: {
    width: 1360,
    height: 700,
    paddingX: 40,
    overlayOpacity: 0.3,
    titleOffsetY: 315,
    titleGap: 16,
    lineWidth: 440,
    titleFontSize: 48,
    titleColor: "#FFFFFF",
    lineColor: "#CCCCCC",
  },
  cardsGroup: {
    width: 1160,
    height: 693,
    overlapHero: 24,
  },
  /** Figma node 692:27493 — mobile 3-2-3 tile grid (375px artboard) */
  mobileGrid: {
    frameWidth: 375,
    gap: 2,
    gutterColor: "#EFE7D4",
    cardBackground: "#F8F4EC",
    cardFontSize: 14,
    cardIconGap: 10,
    mosaicCols: 5,
    mosaicRows: 3,
  },
  card: {
    width: 222,
    height: 222,
    gap: 12,
    background: "#F8F4EC",
    iconWidth: 16,
    iconHeight: 15,
    textWidth: 177,
    fontSize: 24,
    textColor: "#0A0A0A",
  },
  centerImage: {
    width: 1440,
    height: 873,
    offsetX: -140,
    offsetY: -89,
    shadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
} as const;

/** Figma node 692:27191 — Timeline section */
export const aboutTimelineFigmaSpec = {
  section: {
    width: 1440,
    height: 700,
    imageHeight: 810,
    imageOffsetY: -86,
  },
  overlayOpacity: 0.4,
  nav: {
    gap: 32,
    itemGap: 8,
    lineWidth: 64,
    offsetTop: 148,
  },
  year: {
    activeFontSize: 24,
    inactiveFontSize: 20,
    activeColor: "#FFFFFF",
    inactiveColor: "#F2F2F2",
    inactiveOpacity: 0.4,
  },
  content: {
    width: 445,
    paddingTop: 32,
    paddingRight: 80,
    paddingBottom: 32,
    paddingLeft: 32,
    gap: 24,
    titleFontSize: 32,
    bodyFontSize: 20,
  },
  animation: {
    durationMs: 500,
  },
} as const;

/** Figma node 692:27229 — Heirloom quote */
export const aboutHeirloomFigmaSpec = {
  section: {
    width: 1440,
    background: "#FFFFFF",
    paddingY: 100,
    paddingX: 10,
  },
  row: {
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  flourish: {
    width: 20,
    height: 19,
  },
  quote: {
    fontFamily: "Larken",
    fontSize: 48,
    fontWeight: 300,
    lineHeight: "110%",
    letterSpacing: "0%",
    color: "#0A0A0A",
    textAlign: "center",
  },
} as const;

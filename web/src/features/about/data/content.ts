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
   * Collapsed → Expanded on initial load (Smart Animate: width + Y together).
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

export const aboutPageImages = {
  heroDesktop: "/images/about/hero-desktop.png",
  heroMobile: "/images/about/hero-mobile.png",
  craftingDiamond: "/images/about/crafting-diamond.png",
  teamMemberDesktop1: "/images/about/team-member-desktop-1.png",
  teamMemberMobile1: "/images/about/team-member-mobile-1.png",
  teamMemberDesktop2: "/images/about/team-member-desktop-2.png",
  teamMemberMobile2: "/images/about/team-member-mobile-2.png",
  teamMemberDesktop3: "/images/about/team-member-desktop-3.png",
  teamMemberMobile3: "/images/about/team-member-mobile-3.png",
  storyFounderDesktop: "/images/about/story-founder-desktop.png",
  storyFounderMobile: "/images/about/story-founder-mobile.png",
  storyEventDesktop: "/images/about/story-event-desktop.png",
  storyEventMobile: "/images/about/story-event-mobile.png",
  storyAttendingDesktop: "/images/about/story-attending-desktop.png",
  storyAttendingMobile: "/images/about/story-attending-mobile.png",
  handcraftedBg: "/images/about/handcrafted-bg.png",
  craftsmanship: "/images/about/craftsmanship-764d7a.png",
  store: "/images/about/store.png",
} as const;

export const aboutHeroContent = {
  title: aboutHeroFigmaSpec.title.text,
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

export const aboutSince1997Content = {
  title: "Since 1997",
  story:
    "The story dates back to 3 generations where Sunny Diamonds has exemplified the singular refinement of rare, original, exclusive jewellery. The flag continued to fly high and proud primarily because we the fine craftsmanship, goodwill and love.",
  gallery: [
    {
      desktopImage: aboutPageImages.storyFounderDesktop,
      mobileImage: aboutPageImages.storyFounderMobile,
      alt: "Mr. P.P. Sunny with his sons",
      caption: "Mr. P.P. Sunny with his sons",
      width: 549,
      height: 600, 
    },
    {
      desktopImage: aboutPageImages.storyEventDesktop,
      mobileImage: aboutPageImages.storyEventMobile,
      alt: "At an event hosted by Webandcrafts",
      caption: "At an event hosted by Webandcrafts",
      width: 320,
      height: 417,
    },
    {
      desktopImage: aboutPageImages.storyAttendingDesktop,
      mobileImage: aboutPageImages.storyAttendingMobile,
      alt: "P.P. Sunny attending",
      caption: "P.P. Sunny attending",
      width: 463,
      height: 600,
    },
  ],
} as const;

/** Figma Component 228 — team card hover overlay */
export const aboutFacesFigmaSpec = {
  overlay: {
    gradient: "bottom-strong" as const,
  },
} as const;

export const aboutHandcraftedContent = {
  title: "Handcrafted Brilliance",
  cards: [
    {
      title: "Ethically Sourced, conflict free diamonds",
      position: { left: "20.17%", top: "0" },
      gap: 12,
    },
    {
      title: "Pinnacle of Craftsmanship and Artistry",
      position: { left: "40.43%", top: "34.04%" },
      gap: 12,
    },
    {
      title: "Highest Level of Quality Checks",
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

export const aboutHandcraftedAssets = {
  gridMask: "/images/about/handcrafted-grid-mask.svg",
  flourish: "/images/about/handcrafted-flourish.svg",
  /** Mosaic photo grid for mobile tiles (Figma 692:27493) */
  intersect: "/images/about/handcrafted-intersect.png",
  /** Handcrafted hero background video */
  heroVideo: "/videos/handcrafted-bg.mp4",
} as const;

/** Mobile tile layout — Figma 692:27493 (3-2-3 rows, mosaic sprite positions) */
export const aboutHandcraftedMobileLayout = {
  row1: [
    { type: "photo" as const, mosaicCol: 0, mosaicRow: 0 },
    { type: "card" as const, cardIndex: 1 },
    { type: "photo" as const, mosaicCol: 4, mosaicRow: 0 },
  ],
  row2: [
    { type: "photo" as const, mosaicCol: 1, mosaicRow: 1 },
    { type: "photo" as const, mosaicCol: 3, mosaicRow: 1 },
  ],
  row3: [
    { type: "card" as const, cardIndex: 0 },
    { type: "photo" as const, mosaicCol: 3, mosaicRow: 2 },
    { type: "card" as const, cardIndex: 2 },
  ],
} as const;

/** Figma node 692:27386 — vertical divider below Handcrafted (Line 1512) */
export const aboutHandcraftedProgressLineSpec = {
  height: 105,
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

// const timelineDescription =
//   "We source and transform the rarest Internally Flawless diamonds into timeless masterpieces, crafted with uncompromising precision for those for those who seek the truly exceptional.";

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

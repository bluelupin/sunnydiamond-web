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
  },
  /** Bottom gradient for title legibility over hero image */
  overlay: {
    gradient: "bottom" as const,
  },
} as const;

export const aboutPageImages = {
  hero: "/images/about/hero.png",
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

export const aboutCraftingRarityContent = {
  heading: "Crafting rarity\ninto timeless brilliance",
  description:
    "We source Internally Flawless Diamonds from Belgium and craft them into timeless masterpieces, creating jewellery that resonates with you.",
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
  /** Figma prototype scroll storytelling — Crafting Rarity Reveal V2 */
  animation: {
    scrollTrackVh: 200,
    /** Reveal begins once this fraction of the section is visible in the viewport */
    viewportVisibleThreshold: 0.2,
    headingMaskHeight: 218,
    imageMaskHeight: 354,
    lineMaskHeight: 79,
    bodyMaskHeight: 88,
    segments: {
      heading: { start: 0.05, end: 0.28 },
      image: { start: 0.24, end: 0.44 },
      line: { start: 0.4, end: 0.72 },
      lineFill: { start: 0.44, end: 0.68 },
      description: { start: 0.66, end: 0.94 },
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

export const aboutFacesContent = {
  title: "Faces Behind the Brilliance",
  description:
    "We source Internally Flawless Diamonds from Belgium and craft them into timeless masterpieces, creating jewellery that resonates with you.",
  members: [
    {
      desktopImage: aboutPageImages.teamMemberDesktop1,
      mobileImage: aboutPageImages.teamMemberMobile1,
      alt: "Sunny Diamonds team member",
      name: "P.P. Sunny",
      role: "Founder",
      width: 478,
      height: 600,
    },
    {
      desktopImage: aboutPageImages.teamMemberDesktop2,
      mobileImage: aboutPageImages.teamMemberMobile2,
      alt: "Sunny Diamonds team member",
      name: "Suresh Kumar",
      role: "Managing Director",
      width: 478,
      height: 600,
    },
    {
      desktopImage: aboutPageImages.teamMemberDesktop3,
      mobileImage: aboutPageImages.teamMemberMobile3,
      alt: "Sunny Diamonds team member",
      name: "Arjun Nair",
      role: "Creative Director",
      width: 478,
      height: 600,
    },
  ],
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

export const aboutTimelineYears = [
  "1997",
  "2006",
  "2008",
  "2010",
  "2012",
  "2016",
  "2022",
  "2025",
] as const;

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

const timelineDescription =
  "We source and transform the rarest Internally Flawless diamonds into timeless masterpieces, crafted with uncompromising precision for those for those who seek the truly exceptional.";

export const aboutTimelineContent = {
  defaultYear: "2008",
  milestones: {
    "1997": {
      title: "Since 1997",
      description: timelineDescription,
    },
    "2006": {
      title: "Growing the Legacy",
      description: timelineDescription,
    },
    "2008": {
      title: "Found in Chalakkudy",
      description: timelineDescription,
    },
    "2010": {
      title: "Crafting Brilliance",
      description: timelineDescription,
    },
    "2012": {
      title: "Expanding Horizons",
      description: timelineDescription,
    },
    "2016": {
      title: "Elevating Excellence",
      description: timelineDescription,
    },
    "2022": {
      title: "A New Era",
      description: timelineDescription,
    },
    "2025": {
      title: "Looking Ahead",
      description: timelineDescription,
    },
  },
} as const;

/** Figma node 692:27431 — Mobile About page (375px artboard) */
export const aboutResponsiveFigmaSpec = {
  frameWidth: 375,
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1440,
  },
} as const;

export const aboutHeirloomContent = {
  quote: "Crafting family heirlooms at the pinnacle of diamond clarity",
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

export const aboutHeirloomAssets = {
  flourishIcon: "/images/about/heirloom-flourish-left.svg"
} as const;

export const aboutGuaranteesFigmaSpec = {
  section: {
    width: 1440,
    contentWidth: 1360,
    paddingY: 64,
    paddingX: 40,
    background: "#FBFAF6",
  },
  item: {
    width: 260,
    height: 136,
    gap: 12,
    padding: 12,
    borderRadius: 2,
  },
  icon: {
    defaultSize: 64,
    hallmarkWidth: 60,
    hallmarkHeight: 64,
  },
  divider: {
    height: 136,
    strokeWidth: 0.5,
    color: "#999999",
  },
  label: {
    fontFamily: "Gill Sans",
    fontSize: 20,
    fontWeight: 400,
    lineHeight: "110%",
    letterSpacing: "0%",
    color: "#0A0A0A",
    textAlign: "center",
  },
  responsive: {
    /** Desktop artboard — preserve exact row below this viewport via horizontal scroll */
    desktopMinWidth: 1440,
    paddingYMobile: 40,
    paddingYTablet: 48,
  },
} as const;

export const aboutGuaranteeIconPaths = {
  diamond: "/images/about/guarantees/diamond.svg",
  moneyback: "/images/about/guarantees/moneyback.svg",
  hallmark: "/images/about/guarantees/hallmark.svg",
  return: "/images/about/guarantees/return.svg",
  cod: "/images/about/guarantees/cod.svg",
} as const;

export const aboutGuarantees = [
  { label: "Eternally Flawless Diamonds", icon: "diamond" },
  { label: "100% Moneyback Guarantee", icon: "moneyback" },
  { label: "BIS Halmark for Jewellery", icon: "hallmark" },
  { label: "15 Days Return Policy", icon: "return" },
  { label: "Cash on Delivery", icon: "cod" },
] as const;

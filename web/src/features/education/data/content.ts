export const educationPageImages = {
  panelTexture: "/images/education/panel-texture.png",
  certifiedHandBg: "/images/education/certified-hand-bg.png",
  certifiedDivider: "/images/education/certified-divider.svg",
  certifiedCalloutLine: "/images/education/certified-callout-line.svg",
  certifiedDividerMobile: "/images/education/certified-divider-mobile.svg",
  certifiedCalloutLineMobile: "/images/education/certified-callout-line-mobile.svg",
  anatomySparkle: "/images/education/scroll-arrow.svg",
  learnArrowLeft: "/images/education/learn-arrow-left.svg",
  learnArrowRight: "/images/education/learn-arrow-right.svg",
  learnArrowLeftMobile: "/images/education/learn-arrow-left-mobile.svg",
  learnArrowRightMobile: "/images/education/learn-arrow-right-mobile.svg",
  scrollArrow: "/images/education/scroll-arrow.svg",
  claritySliderThumb: "/images/education/clarity-slider-thumb.svg",
  caratDiamond: "/images/education/carat-diamond.png",
} as const;

/** Figma 692:29026 / 692:29042 / 692:29044 — C4 carat hand + diamond */
export const educationCaratVisualSpec = {
  referenceCarat: 1.0,
  minCarat: 0.5,
  maxCarat: 4.0,
  handOpacity: 0.35,
  desktop: {
    frameWidth: 528,
    handAreaHeight: 296,
    diamondLeft: 230,
    diamondTop: 72,
    diamondBaseSize: 40,
    diamondMinSize: 8,
    diamondMaxSize: 66,
  },
  /** Figma mweb 692:28716 / 692:28720 */
  mobile: {
    frameWidth: 311,
    handAreaHeight: 220,
    diamondLeft: 168,
    diamondTop: 58,
    diamondBaseSize: 26,
    diamondMinSize: 6,
    diamondMaxSize: 43,
  },
} as const;

export type EducationSliderSpec = {
  width: number;
  height: number;
  trackLeft: number;
  trackTop: number;
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
  labelTop: number;
  dotCenters: readonly number[];
  labelLeft: readonly number[];
  sublabelTop?: number;
  sublabelLeft?: readonly number[];
  /** Gap between track segments at interior dots (default 10) */
  trackDotGap?: number;
  /** "active" shows only the selected label under the thumb; "endpoints" pins start/end labels */
  labelDisplay?: "all" | "active" | "endpoints";
  /** When false, renders a continuous track without dot markers */
  showDots?: boolean;
  /** When true, only the first and last dot markers are rendered */
  endpointDotsOnly?: boolean;
  /** Taller slider area on mobile when labels wrap to multiple lines */
  mobileHeight?: number;
  /** Mobile content width — labels align to dots below this breakpoint */
  mobileWidth?: number;
  mobileLabelFontSize?: number;
  ariaLabel: string;
};

/** C4 carat slider — 0.5 ct to 4.0 ct in 1 ct steps (0.5, 1, 2, 3, 4) */
export const educationCaratWeights = [0.5, 1.0, 2.0, 3.0, 4.0] as const;

const buildCaratDotCenters = (
  weights: readonly number[],
  start: number,
  end: number,
  minWeight: number,
  maxWeight: number,
) =>
  weights.map((weight) => {
    const range = maxWeight - minWeight;
    if (range <= 0) return start;
    return start + ((weight - minWeight) / range) * (end - start);
  });

const caratSliderTrackLeft = 21;
const caratSliderTrackWidth = 482;
/** Inset snap range so thumb/dots have breathing room like clarity/cut/colour sliders */
const caratSliderDotStart = 19;
const caratSliderDotEnd = 502;
const caratSliderDotCenters = buildCaratDotCenters(
  educationCaratWeights,
  caratSliderDotStart,
  caratSliderDotEnd,
  educationCaratWeights[0],
  educationCaratWeights[educationCaratWeights.length - 1],
);

const MOBILE_SLIDER_WIDTH = 323;

export const educationSliderSpecs: Record<string, EducationSliderSpec> = {
  clarity: {
    width: 521.21,
    height: 50.5,
    mobileWidth: MOBILE_SLIDER_WIDTH,
    mobileLabelFontSize: 12,
    trackLeft: 10.61,
    trackTop: 8.75,
    trackWidth: 504,
    trackHeight: 1.5,
    thumbSize: 18,
    labelTop: 32.5,
    dotCenters: [10.61, 82.61, 154.61, 226.61, 298.61, 370.61, 442.61, 514.61],
    labelLeft: [0, 72.31, 141.87, 213.73, 280.59, 352.45, 436.05, 505.21],
    labelDisplay: "all",
    ariaLabel: "Diamond clarity grade",
  },
  cut: {
    width: 593.04,
    height: 50,
    mobileHeight: 64,
    mobileWidth: MOBILE_SLIDER_WIDTH,
    mobileLabelFontSize: 12,
    trackLeft: 19,
    trackTop: 8,
    trackWidth: 544,
    trackHeight: 1.5,
    thumbSize: 18,
    labelTop: 32,
    dotCenters: [17, 153, 290, 427, 564],
    labelLeft: [0, 141.03, 270.42, 390.66, 534.04],
    ariaLabel: "Diamond cut grade",
  },
  colour: {
    width: 528,
    height: 114.88,
    mobileWidth: MOBILE_SLIDER_WIDTH,
    mobileLabelFontSize: 12,
    trackLeft: 21,
    trackTop: 8.19,
    trackWidth: 475,
    trackHeight: 1.5,
    thumbSize: 18,
    labelTop: 32.25,
    dotCenters: [19, 139, 260, 381, 502],
    labelLeft: [7.04, 125.05, 245.2, 368.37, 481.5],
    sublabelTop: 68.38,
    sublabelLeft: [0, 109, 242, 343, 464],
    ariaLabel: "Diamond colour grade",
  },
  carat: {
    width: 517.84,
    height: 50.51,
    mobileWidth: MOBILE_SLIDER_WIDTH,
    mobileLabelFontSize: 12,
    trackLeft: caratSliderTrackLeft,
    trackTop: 8,
    trackWidth: caratSliderTrackWidth,
    trackHeight: 1.5,
    thumbSize: 18,
    labelTop: 32.51,
    labelDisplay: "all",
    showDots: true,
    dotCenters: caratSliderDotCenters,
    labelLeft: caratSliderDotCenters.map((center) => center - 20),
    ariaLabel: "Diamond carat weight",
  },
};

/** Evenly space slider dots flush to track ends (matches Figma clarity SVG). */
export function buildSliderSpecForOptionCount(
  baseSpec: EducationSliderSpec,
  optionCount: number,
): EducationSliderSpec {
  if (optionCount <= 0 || optionCount === baseSpec.dotCenters.length) {
    return baseSpec;
  }

  const dotCenters =
    optionCount === 1
      ? [baseSpec.trackLeft + baseSpec.trackWidth / 2]
      : Array.from({ length: optionCount }, (_, index) =>
          baseSpec.trackLeft + (baseSpec.trackWidth * index) / (optionCount - 1),
        );

  return {
    ...baseSpec,
    dotCenters,
    labelLeft: dotCenters.map((center) => Math.max(0, center - 20)),
    ...(baseSpec.sublabelLeft
      ? { sublabelLeft: dotCenters.map((center) => Math.max(0, center - 10)) }
      : {}),
  };
}

export function buildCaratSliderSpecForWeights(
  weights: readonly number[],
): EducationSliderSpec {
  const baseSpec = educationSliderSpecs.carat;
  if (weights.length === 0) return baseSpec;

  const dotCenters = buildCaratDotCenters(
    weights,
    caratSliderDotStart,
    caratSliderDotEnd,
    weights[0]!,
    weights[weights.length - 1]!,
  );

  return {
    ...baseSpec,
    labelDisplay: "all",
    endpointDotsOnly: false,
    dotCenters,
    labelLeft: dotCenters.map((center) => center - 20),
  };
}

/** Figma node 692:29131 — hero media dimensions + scroll-collapse animation */
export const educationHeroFigmaSpec = {
  image: {
    width: 1498,
    height: 659,
  },
  animation: {
    collapsedWidthRatio: 1360 / 1440,
    collapsedOffsetY: 100,
    collapsedInsetX: 40,
    durationMs: 500,
    titleDelayMs: 300,
  },
} as const;

/** Figma nodes 692:29024 (desktop) + 692:28579 (mobile intro stack) */
export const educationFourCsIntroSpec = {
  sectionClassName:
    "flex flex-col bg-white px-4 py-16 md:px-8 lg:px-10 lg:py-25",
  contentClassName: "mx-auto flex w-full max-w-680 flex-col items-center",
  stackClassName: "flex flex-col items-center gap-6 lg:gap-8",
  titleClassName:
    "block w-full text-center font-larken text-32 font-light leading-110 text-darkblack lg:text-48",
  imageClassName:
    "relative h-130 w-40 overflow-hidden rounded-full lg:h-202 lg:w-250",
  imageSizes: "(max-width: 1024px) 160px, 250px",
  verticalRuleClassName: "h-55 w-px bg-darkblack/40",
  descriptionClassName:
    "max-w-350 text-center font-gill text-base font-light leading-110 text-darkblack lg:max-w-523 lg:text-xl",
  /** Figma brand divider — horizontal variant of Crafting Rarity line (#722257 → #DDA957) */
  gradientRule: {
    mobileWidth: 250,
    desktopWidth: 421,
    background: "linear-gradient(90deg, #722257 0%, #DDA957 100%)",
  },
  gradientRuleClassName: "h-px w-250 lg:w-[421px]",
  pillarsClassName:
    "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-gill text-xl leading-110 text-darkblack lg:flex-nowrap lg:gap-x-text-2xlt-2xl",
  scrollArrowClassName: "h-4 w-4 lg:h-[23px] lg:w-6",
} as const;

/** Shared scroll-arrow sizing (intro hint + panel footnotes). */
export const educationScrollArrowClassName = educationFourCsIntroSpec.scrollArrowClassName;

export type EducationSliderOption = {
  label: string;
  /** Renders as stacked lines on mobile only (desktop uses `label`) */
  mobileLabelLines?: readonly [string, string];
  highlight?: boolean;
  sublabel?: string | string[];
  image?: string;
  caratWeight?: number;
};

export type EducationFourCsPanelContent = {
  id: string;
  code: string;
  title: string;
  description: string;
  footnote: string;
  mediaPosition: "left" | "right";
  background: "chalk" | "white";
  slider: {
    defaultIndex: number;
    options: EducationSliderOption[];
    image?: string;
    dualImages?: [string, string];
  };
};

export type EducationFourCsPanelLayout = {
  id: string;
  code: string;
  mediaPosition: "left" | "right";
  background: "chalk" | "white";
};

/** Panel order + layout only — copy and slider data come from CMS. */
export const educationFourCsPanelLayouts: EducationFourCsPanelLayout[] = [
  { id: "clarity", code: "C1", mediaPosition: "left", background: "chalk" },
  { id: "cut", code: "C2", mediaPosition: "right", background: "chalk" },
  { id: "colour", code: "C3", mediaPosition: "left", background: "chalk" },
  { id: "carat", code: "C4", mediaPosition: "right", background: "chalk" },
];

/** Logo layout classes only — labels and logos come from CMS certificateSection. */
export const educationCertificationLogoStyles = {
  certifications: [
    {
      id: "gia",
      logoClassName: "h-[74px] w-[76px]",
      mobileLogoClassName: "h-[59.297px] w-[60.868px]",
      imageClassName: "h-full w-[297%] max-w-none object-cover object-left",
    },
    {
      id: "ags",
      logoClassName: "h-[74px] w-[76px]",
      mobileLogoClassName: "h-[59.294px] w-[60.882px]",
      imageClassName: "h-full w-[177%] max-w-none object-cover object-left -left-[38%]",
    },
    {
      id: "hrd",
      logoClassName: "h-16 w-[127px]",
      mobileLogoClassName: "h-[51.2px] w-[101.262px]",
      imageClassName: "h-[165%] w-[136%] max-w-none object-cover object-left -left-[15%] -top-[28%]",
      logoWrapClassName: "flex h-[90px] w-[142px] items-center justify-center",
    },
    {
      id: "kimberley",
      logoClassName: "size-[79px]",
      mobileLogoClassName: "size-[59.286px]",
      imageClassName: "size-full object-cover",
    },
  ],
} as const;

/** Figma 692:28885 (section) — 692:29096 (desktop) + 692:28735 (mobile) */
export const educationCertifiedSpec = {
  section: {
    desktop: {
      background: "#F4F3EE",
      paddingX: 40,
      paddingY: 104,
      blockGap: 40,
      height: 791,
    },
    mobile: {
      background: "#FFFFFF",
      paddingX: 16,
      paddingY: 64,
      blockGap: 32,
      height: 900,
    },
  },
  title: {
    desktopSize: 48,
    mobileSize: 32,
  },
  logos: {
    desktop: {
      maxWidth: 1360,
      columnMinHeight: 122,
      labelSize: 16,
    },
    mobile: {
      rowGap: 24,
      labelSize: 14,
      rowMinHeight: 101,
    },
  },
  copy: {
    desktop: {
      width: 647,
      blockGap: 40,
      itemGap: 12,
      titleSize: 24,
      bodySize: 20,
      bodyMaxWidth: 546,
      bodyColor: "#4D4D4D",
    },
    mobile: {
      blockGap: 24,
      itemGap: 12,
      titleSize: 16,
      bodySize: 14,
      bodyColor: "#0A0A0A",
      dividerWidth: 350,
    },
  },
  visual: {
    desktop: {
      width: 641,
      height: 548,
      left: 700,
      top: -189,
      calloutSize: 133.567,
      calloutLeft: 66,
      calloutTop: 262,
      calloutBorder: 1.91,
      calloutBorderColor: "#999999",
      calloutCropHeight: "123.85%",
      calloutCropWidth: "124.29%",
      calloutCropLeft: "-13.53%",
      calloutCropTop: "-10.91%",
      lineLeft: 133,
      lineTop: 396,
      lineWidth: 209,
      lineHeight: 109,
    },
    mobile: {
      calloutLeft: 85,
      calloutTop: 666,
      calloutSize: 96,
      calloutBorder: 1.373,
      lineLeft: 130,
      lineTop: 698,
      lineWidth: 141,
      lineHeight: 78,
    },
    calloutCropHeight: "123.85%",
    calloutCropWidth: "124.29%",
    calloutCropLeft: "-13.53%",
    calloutCropTop: "-10.91%",
  },
  background: {
    desktop: {
      handRotate: -12.62,
      handWidth: 1830,
      handHeight: 1530,
      handLeft: -393,
      handTop: -443,
      /** Rotation bounding box scale from Figma 692:29096 */
      handWrapperWidthScale: 1.16,
      handWrapperHeightScale: 1.24,
    },
    mobile: {
      handLeft: -495,
      handTop: 151,
      handWidth: 1091,
      handHeight: 912,
    },
  },
} as const;

/** Figma nodes 692:29130 (desktop) + 692:28766 (mobile) */
export const educationLearnMoreSpec = {
  section: {
    desktop: {
      height: 957,
      paddingY: 104,
      paddingX: 40,
      blockGap: 64,
    },
    mobile: {
      height: 681,
      paddingY: 64,
      paddingX: 16,
      blockGap: 24,
    },
  },
  header: {
    desktop: {
      maxWidth: 1360,
      titleTabGap: 40,
      titleDescriptionGap: 64,
      titleSize: 48,
      descriptionMaxWidth: 700,
      descriptionSize: 20,
      descriptionColor: "#4D4D4D",
    },
    mobile: {
      titleSize: 32,
      descriptionSize: 16,
      descriptionColor: "#0A0A0A",
      descriptionCarouselGap: 49,
    },
  },
  tabs: {
    desktop: {
      maxWidth: 1200,
      paddingY: 24,
      fontSize: 20,
      gap: 0,
    },
    mobile: {
      height: 75,
      paddingY: 24,
      fontSize: 16,
      gap: 40,
    },
    borderWidth: 0.4,
    activePaddingY: 8,
    activeColor: "#AB863B",
  },
  carousel: {
    desktop: {
      columnGap: 250,
      centerColumnWidth: 526,
      centerControlsGap: 64,
      centerButtonGap: 12,
    },
    mobile: {
      height: 252,
      imageWidth: 196.457,
      imageHeight: 172,
      buttonGap: 24,
      arrowTop: 74,
      arrowLeft: 16,
      arrowRowWidth: 311,
    },
    navIconWidth: 24,
    slots: {
      left: {
        width: 350,
        height: 328,
        cropHeight: "128.74%",
        cropWidth: "125.89%",
        cropLeft: "-11.31%",
        cropTop: "-15.03%",
        flip: false,
      },
      center: {
        width: 350,
        height: 330,
        cropHeight: "116.26%",
        cropWidth: "125.34%",
        cropLeft: "-11.54%",
        cropTop: "-3.98%",
        flip: false,
      },
      right: {
        width: 350,
        height: 314,
        cropHeight: "127.2%",
        cropWidth: "122.36%",
        cropLeft: "-7.99%",
        cropTop: "-12.99%",
        flip: true,
      },
    },
  },
  cta: {
    height: 56,
    paddingX: 28,
    paddingY: 20,
    fontSize: 14,
    borderWidth: 0.8,
  },
  careGrid: {
    /** Figma 692:29135 (desktop) / 692:28766 (mobile) — 6-col staggered grid */
    desktop: {
      maxWidth: 906,
      descriptionGap: 64,
      rowGap: 56,
      columnSpan: 2,
      iconSize: 80,
      labelGap: 24,
      labelSize: 14,
      labelColor: "#4D4D4D",
      labelLineHeight: 1.1,
    },
    mobile: {
      descriptionGap: 32,
      rowGap: 32,
      iconSize: 64,
      labelGap: 16,
      labelSize: 12,
    },
  },
  anatomyDetail: {
    desktop: {
      maxWidth: 1200,
      columnGap: 120,
      imageWidth: 350,
      imageHeight: 300,
      titleSize: 32,
      titleGap: 16,
      listGap: 24,
      dividerColor: "#E5E5E5",
    },
    mobile: {
      columnGap: 32,
      imageWidth: 280,
      imageHeight: 240,
      titleSize: 24,
      listGap: 20,
    },
  },
} as const;

/** Figma nodes 692:29075 (desktop) + 692:28767 (mobile) */
export const educationDiscoverSpec = {
  section: {
    desktopHeight: 615,
    mobileMinHeight: 743,
    background: "#F4F3EE",
  },
  image: {
    desktop: {
      width: 621,
      height: 585,
      cropHeight: "100.24%",
      cropWidth: "178.53%",
      cropLeft: "0.05%",
      cropTop: "-0.04%",
    },
    mobile: {
      width: 326,
      height: 307,
      left: 114,
      top: 436,
      cropHeight: "100.24%",
      cropWidth: "178.53%",
      cropLeft: "0.05%",
      cropTop: "-0.04%",
    },
  },
  content: {
    desktop: {
      width: 585,
      offsetX: 294.5,
    },
    mobile: {
      paddingX: 16,
      paddingY: 64,
      gap: 32,
    },
    blockGap: 40,
  },
  header: {
    desktop: {
      titleSize: 48,
      descriptionSize: 20,
      descriptionMaxWidth: 531,
      descriptionColor: "#4D4D4D",
      gap: 16,
    },
    mobile: {
      titleSize: 32,
      descriptionSize: 16,
      descriptionColor: "#0A0A0A",
      gap: 12,
    },
  },
  steps: {
    columnGap: 16,
    desktop: {
      pillWidth: 16,
      pillHeight: 26,
      pillGap: 40,
      lineHeight: 158,
      lineLeft: 8,
      textSize: 20,
      numberSize: 14,
    },
    mobile: {
      pillGap: 40,
      lineHeight: 158,
      textSize: 16,
      numberSize: 12,
    },
  },
  cta: {
    height: 56,
    paddingX: 28,
    paddingY: 20,
    fontSize: 14,
    minWidth: 199,
  },
} as const;

/** Shared section title → content spacing (32px mobile, 40px desktop). */
export const educationSectionTitleSpacingClassName = "mb-8 lg:mb-10";

export const educationPageImages = {
  diamondOval: "/images/education/diamond-oval.png",
  star: "/images/education/star.svg",
  panelTexture: "/images/education/panel-texture.png",
  diamondRating: "/images/education/diamond-rating.png",
  cutDiamondExcellent: "/images/education/cut-diamond-excellent.png",
  cutDiamondGood: "/images/education/cut-diamond-good.png",
  decorativeDiamond: "/images/education/decorative-diamond.png",
  discoverImage: "/images/education/discover-image.png",
  discoverStepLine: "/images/education/discover-step-line.svg",
  discoverStepLineMobile: "/images/education/discover-step-line-mobile.svg",
  faqIconPlus: "/images/education/faq-icon-plus.svg",
  faqIconMinus: "/images/education/faq-icon-minus.svg",
  certifiedBg: "/images/education/certified-bg.png",
  certifiedHandBg: "/images/education/certified-hand-bg.png",
  certifiedDivider: "/images/education/certified-divider.svg",
  certifiedCalloutLine: "/images/education/certified-callout-line.svg",
  certifiedDividerMobile: "/images/education/certified-divider-mobile.svg",
  certifiedCalloutLineMobile: "/images/education/certified-callout-line-mobile.svg",
  giaLogo: "/images/education/gia-logo.png",
  agsLogo: "/images/education/ags-logo.png",
  hrdLogo: "/images/education/hrd-logo.png",
  kimberleyLogo: "/images/education/kimberley-logo.png",
  girdleScreenshot: "/images/education/girdle-screenshot.png",
  shapeLeft: "/images/education/shape-left.png",
  shapeCenter: "/images/education/shape-center.png",
  shapeRight: "/images/education/shape-right.png",
  learnArrowLeft: "/images/education/learn-arrow-left.svg",
  learnArrowRight: "/images/education/learn-arrow-right.svg",
  learnArrowLeftMobile: "/images/education/learn-arrow-left-mobile.svg",
  learnArrowRightMobile: "/images/education/learn-arrow-right-mobile.svg",
  scrollArrow: "/images/education/scroll-arrow.svg",
  claritySliderTrack: "/images/education/clarity-slider-track.svg",
  claritySliderDots: "/images/education/clarity-slider-dots.svg",
  claritySliderThumb: "/images/education/clarity-slider-thumb.svg",
  caratHand: "/images/education/carat-hand-gray.png",
  caratDiamond: "/images/education/carat-diamond.png",
} as const;

/** Figma mweb 692:28579 — mobile 4Cs panel stack */
export const educationFourCsMobileSpec = {
  panelHeight: 725,
  copyHeight: 355,
  mediaHeight: 370,
  copyPaddingTop: 40,
  copyPaddingBottom: 24,
  copyPaddingX: 20,
  copyCodeGap: 24,
  copyTitleGap: 12,
  copyDescriptionSize: 16,
  mediaContentWidth: 323,
  diamondToSliderGap: 40,
  sliderToFootnoteGap: 40,
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

/** Shared 4Cs panel layout — Figma 692:28887+ */
export const educationFourCsPanelLayoutSpec = {
  height: 633,
  caratHeight: 610,
  background: "#F4F3EE",
  mediaContentWidth: 528,
  diamondSize: 200,
  diamondToSliderGap: 40,
  sliderToFootnoteGap: 64,
  footnoteWidth: 481,
  footnoteGap: 24,
  footnoteFontSize: 16,
  footnoteColor: "#4D4D4D",
  copyMaxWidth: 441,
  copyCodeGap: 32,
  copyTitleGap: 16,
  codeFontSize: 110,
  titleFontSize: 32,
  descriptionFontSize: 20,
  sliderActiveColor: "#AB863B",
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

const formatCaratLabel = (weight: number) =>
  `${Number.isInteger(weight) ? weight : weight.toFixed(1).replace(/\.0$/, "")} ct`;

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

export const educationCaratSliderOptions: EducationSliderOption[] = educationCaratWeights.map(
  (weight) => ({
    label: formatCaratLabel(weight),
    caratWeight: weight,
    highlight: weight === 1.0,
  }),
);

export const educationCaratDefaultIndex = educationCaratWeights.indexOf(1.0);

const MOBILE_SLIDER_WIDTH = 323;

export const educationSliderSpecs: Record<string, EducationSliderSpec> = {
  clarity: {
    width: 521.21,
    height: 50.5,
    mobileWidth: MOBILE_SLIDER_WIDTH,
    mobileLabelFontSize: 12,
    trackLeft: 10.61,
    trackTop: 8.75,
    trackWidth: 501,
    trackHeight: 1.5,
    thumbSize: 18,
    labelTop: 32.5,
    dotCenters: [10.61, 82.61, 154.61, 226.61, 298.61, 370.61, 442.61, 514.61],
    labelLeft: [0, 72.31, 141.87, 213.73, 280.59, 352.45, 436.05, 505.21],
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
    labelDisplay: "endpoints",
    showDots: true,
    endpointDotsOnly: true,
    dotCenters: caratSliderDotCenters,
    labelLeft: caratSliderDotCenters.map((center) => center - 20),
    ariaLabel: "Diamond carat weight",
  },
};

const SLIDER_EDGE_PADDING = 10;

/** Evenly space slider dots when CMS grade-stop count differs from the Figma spec. */
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
      : Array.from({ length: optionCount }, (_, index) => {
          const span = baseSpec.trackWidth - SLIDER_EDGE_PADDING * 2;
          return (
            baseSpec.trackLeft +
            SLIDER_EDGE_PADDING +
            (span * index) / (optionCount - 1)
          );
        });

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
    dotCenters,
    labelLeft: dotCenters.map((center) => center - 20),
  };
}

/** @deprecated Use educationFourCsPanelLayoutSpec + educationSliderSpecs */
export const educationClarityPanelSpec = {
  ...educationFourCsPanelLayoutSpec,
  sliderWidth: educationSliderSpecs.clarity.width,
  sliderHeight: educationSliderSpecs.clarity.height,
  sliderTrackWidth: educationSliderSpecs.clarity.trackWidth,
  sliderTrackHeight: educationSliderSpecs.clarity.trackHeight,
  sliderTrackLeft: educationSliderSpecs.clarity.trackLeft,
  sliderTrackTop: educationSliderSpecs.clarity.trackTop,
  sliderDotsLeft: 7.61,
  sliderDotsTop: 6,
  sliderDotsWidth: 510,
  sliderDotsHeight: 6,
  sliderThumbSize: educationSliderSpecs.clarity.thumbSize,
  sliderLabelTop: educationSliderSpecs.clarity.labelTop,
  sliderLabelFontSize: 16,
  sliderActiveColor: "#AB863B",
  sliderDotCenters: educationSliderSpecs.clarity.dotCenters,
  sliderLabelLeft: educationSliderSpecs.clarity.labelLeft,
  copyWidth: 716,
  codeColor: "#AB863B",
  codeOpacity: 0.5,
  textColor: "#0A0A0A",
} as const;

/** Figma node 692:29131 — education hero scroll collapse (desktop) */
export const educationHeroFigmaSpec = {
  section: {
    height: 640,
    background: "#FFFFFF",
  },
  image: {
    width: 1498,
    height: 659,
    alt: "Hands presenting a brilliant-cut diamond on black velvet",
  },
  title: {
    text: "Diamond Expertise",
    bottom: 70,
    fontSize: 60,
    mobileFontSize: 32,
    color: "#FFFFFF",
    lineHeight: 100,
  },
  overlay: {
    gradient: "bottom-strong" as const,
  },
  /** Figma component 692:28386 — collapsed on load, expands on scroll */
  animation: {
    collapsedWidthRatio: 1360 / 1440,
    collapsedOffsetY: 100,
    collapsedInsetX: 40,
    durationMs: 500,
    titleDelayMs: 300,
  },
} as const;

export const educationFourCsIntroContent = {
  desktopTitle: "What You See And Don’t See: 4Cs",
  mobileTitle: "When You See And Don’t See: 4Cs",
  description:
    "Every diamond, like a human fingerprint, has certain distinguishing characteristics. The 4Cs - globally accepted standards for assessing the quality of a diamond",
  pillars: ["Cut", "Colour", "Carat", "Clarity"] as const,
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
    "max-w-350 text-center font-gill text-base font-light leading-110 text-darkblack lg:max-w-523 lg:text-20",
  gradientRuleClassName:
    "h-px w-250 bg-gradient-to-r from-darkMagenta to-goldAccent lg:w-420",
  pillarsClassName:
    "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-gill text-20 leading-110 text-darkblack lg:flex-nowrap lg:gap-x-text-2xlt-2xl",
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

export const educationFourCsPanels: EducationFourCsPanelContent[] = [
  {
    id: "clarity",
    code: "C1",
    title: "CLARITY",
    description:
      "Clarity measures how free a diamond is from inclusions (internal imperfections) and blemishes (surface flaws).",
    footnote:
      "At Sunny you get the best of clarity, with most of our diamonds being Internally Flawless",
    mediaPosition: "left",
    background: "chalk",
    slider: {
      defaultIndex: 6,
      image: educationPageImages.diamondRating,
      options: [
        { label: "SI2", image: educationPageImages.cutDiamondGood },
        { label: "SI1", image: educationPageImages.cutDiamondGood },
        { label: "VS2", image: educationPageImages.cutDiamondGood },
        { label: "VS1", image: educationPageImages.diamondRating },
        { label: "VVS2", image: educationPageImages.diamondRating },
        { label: "VVS1", image: educationPageImages.diamondRating },
        { label: "IF", highlight: true, image: educationPageImages.diamondRating },
        { label: "FL", image: educationPageImages.cutDiamondExcellent },
      ],
    },
  },
  {
    id: "cut",
    code: "C2",
    title: "CUT",
    description:
      "A diamond's cut is a measure of how well its facets interact with light. Precise proportions, symmetry, and polish give a diamond its brilliance.",
    footnote:
      "We craft our jewellery with Excellent Cut, Polish, and Symmetry, the triple exceptional EX/EX/EX standard.",
    mediaPosition: "right",
    background: "chalk",
    slider: {
      defaultIndex: 4,
      options: [
        { label: "Poor", image: educationPageImages.cutDiamondGood },
        { label: "Fair", image: educationPageImages.cutDiamondGood },
        { label: "Good", image: educationPageImages.cutDiamondGood },
        { label: "Very Good", mobileLabelLines: ["Very", "Good"], image: educationPageImages.cutDiamondGood },
        { label: "Excellent", highlight: true, image: educationPageImages.cutDiamondExcellent },
      ],
    },
  },
  {
    id: "colour",
    code: "C3",
    title: "COLOUR",
    description:
      "Diamond colour is graded on a D to Z scale, measuring the absence of colour. D is perfectly colourless which is the rarest and most valued.",
    footnote: "",
    mediaPosition: "left",
    background: "chalk",
    slider: {
      defaultIndex: 4,
      image: educationPageImages.diamondRating,
      options: [
        { label: "S-Z", sublabel: ["Light", "Yellow"] },
        { label: "N-R", sublabel: ["Very Light", "Yellow"] },
        { label: "K-M", sublabel: ["Faint", "Yellow"] },
        { label: "G-J", sublabel: ["Near", "Colorless"] },
        { label: "D-E-F", highlight: true, sublabel: "Colorless" },
      ],
    },
  },
  {
    id: "carat",
    code: "C4",
    title: "CARAT",
    description:
      "Carat is the measure of a diamond's weight. Carat does not directly equal a visually bigger diamond, because shape and cut proportions influence perceived size.",
    footnote: "",
    mediaPosition: "right",
    background: "chalk",
    slider: {
      defaultIndex: educationCaratDefaultIndex,
      options: educationCaratSliderOptions,
    },
  },
];

export type EducationLearnTab = {
  id: string;
  label: string;
  description: string[];
  ctaLabel: string;
  ctaHref: string;
  slides: { src: string; alt: string }[];
};

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
} as const;

export const educationLearnTabs: EducationLearnTab[] = [
  {
    id: "shape",
    label: "SHAPE",
    description: [
      "Shape and cut are not the same. Shape refers to the diamond’s form.",
      "At Sunny, it is a reflection of personality, presence, and poetic symmetry.",
    ],
    ctaLabel: "SHOP CUSHION SHAPED DIAMONDS",
    ctaHref: "/products",
    slides: [
      { src: educationPageImages.shapeLeft, alt: "Round diamond shape" },
      { src: educationPageImages.shapeCenter, alt: "Cushion diamond shape" },
      { src: educationPageImages.shapeRight, alt: "Pear diamond shape" },
    ],
  },
  {
    id: "fancy-colour",
    label: "FANCY COLOUR",
    description: [
      "Fancy colour diamonds express rarity through hue, tone, and saturation.",
      "Each stone carries a distinct character beyond traditional colourless grading.",
    ],
    ctaLabel: "SHOP FANCY COLOUR DIAMONDS",
    ctaHref: "/products",
    slides: [
      { src: educationPageImages.shapeLeft, alt: "Fancy colour diamond" },
      { src: educationPageImages.shapeCenter, alt: "Fancy colour diamond detail" },
      { src: educationPageImages.shapeRight, alt: "Fancy colour diamond ring" },
    ],
  },
  {
    id: "diamond-anatomy",
    label: "DIAMOND ANATOMY",
    description: [
      "Understanding table, crown, girdle, and pavilion helps you read a diamond’s proportions.",
      "Each facet plays a role in how light travels through the stone.",
    ],
    ctaLabel: "EXPLORE DIAMOND ANATOMY",
    ctaHref: "/products",
    slides: [
      { src: educationPageImages.shapeLeft, alt: "Diamond anatomy side view" },
      { src: educationPageImages.shapeCenter, alt: "Diamond anatomy diagram" },
      { src: educationPageImages.shapeRight, alt: "Diamond anatomy top view" },
    ],
  },
  {
    id: "diamond-care",
    label: "DIAMOND CARE",
    description: [
      "Proper care preserves brilliance and protects settings over time.",
      "Simple routines keep your diamonds luminous for generations.",
    ],
    ctaLabel: "VIEW DIAMOND CARE GUIDE",
    ctaHref: "/products",
    slides: [
      { src: educationPageImages.shapeLeft, alt: "Diamond care" },
      { src: educationPageImages.shapeCenter, alt: "Cleaning diamond jewellery" },
      { src: educationPageImages.shapeRight, alt: "Storing diamond jewellery" },
    ],
  },
];

export const educationCertifiedContent = {
  title: "Certified Brilliance",
  certifications: [
    {
      id: "gia",
      logo: educationPageImages.giaLogo,
      label: "THE GEMOLOGICAL INSTITUTE OF AMERICA",
      logoClassName: "h-[74px] w-[76px]",
      mobileLogoClassName: "h-[59.297px] w-[60.868px]",
      imageClassName: "h-full w-[297%] max-w-none object-cover object-left",
    },
    {
      id: "ags",
      logo: educationPageImages.agsLogo,
      label: "AMERICAN GEM SOCIETY",
      logoClassName: "h-[74px] w-[76px]",
      mobileLogoClassName: "h-[59.294px] w-[60.882px]",
      imageClassName: "h-full w-[177%] max-w-none object-cover object-left -left-[38%]",
    },
    {
      id: "hrd",
      logo: educationPageImages.hrdLogo,
      label: "THE HOGE RAADVOOR DIAMANT",
      mobileLabelLines: ["THE HOGE RAADVOOR", "DIAMANT"] as const,
      logoClassName: "h-16 w-[127px]",
      mobileLogoClassName: "h-[51.2px] w-[101.262px]",
      imageClassName: "h-[165%] w-[136%] max-w-none object-cover object-left -left-[15%] -top-[28%]",
      logoWrapClassName: "flex h-[90px] w-[142px] items-center justify-center",
    },
    {
      id: "kimberley",
      logo: educationPageImages.kimberleyLogo,
      label: "THE KIMBERLY PROCESS",
      mobileLabelLines: ["THE KIMBERLY ", "PROCESS"] as const,
      logoClassName: "size-[79px]",
      mobileLogoClassName: "size-[59.286px]",
      imageClassName: "size-full object-cover",
    },
  ],
  mobileLogoOrder: ["ags", "gia", "hrd", "kimberley"] as const,
  whyTitle: "Why Certifications Matter?",
  whyDescription:
    "Certification gives you confidence about what you’re investing in. It ensures the quality of the diamond is graded fairly.",
  howTitle: "How to check authenticity?",
  howDescription:
    "Each Solitaire carries a laser inscription on its girdle, linking it directly to its report.",
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

export const educationDiscoverContent = {
  title: "Discover What Speaks to You",
  mobileTitleLines: ["Discover What Speaks ", "to You"] as const,
  description:
    "Tell us what you’re looking for, and we’ll curate a selection tailored to your style, occasion, and preferences.",
  steps: [
    "Define your price range",
    "Choose your jewellery type",
    "Pick your preferred diamond shape",
  ],
  ctaLabel: "BEGIN YOUR JOURNEY",
  ctaHref: "/book-an-appointment",
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

export type EducationFaqItem = {
  id: string;
  question: string;
  answer?: string;
};

/** Shared section title → content spacing (32px mobile, 40px desktop). */
export const educationSectionTitleSpacingClassName = "mb-8 lg:mb-40";

/** Figma nodes 692:29045 (desktop) + 692:28787 (mobile) */
export const educationFaqSpec = {
  section: {
    desktop: {
      paddingX: 40,
      paddingY: 104,
      titleGap: 40,
    },
    mobile: {
      paddingX: 16,
      paddingY: 64,
      titleGap: 32,
    },
    background: "#FFFFFF",
  },
  title: {
    desktop: {
      fontSize: 48,
      align: "center" as const,
    },
    mobile: {
      fontSize: 32,
      align: "left" as const,
    },
    color: "#0A0A0A",
  },
  list: {
    desktopWidth: 910,
    itemGap: 16,
  },
  item: {
    desktop: {
      closedHeight: 56,
      questionSize: 20,
      answerSize: 20,
      rowAlign: "center" as const,
    },
    mobile: {
      questionSize: 16,
      answerSize: 14,
      rowAlign: "start" as const,
    },
    questionAnswerGap: 16,
    questionIconGap: 8,
    iconSize: 24,
    dividerHeight: 0.5,
    dividerColor: "#CCCCCC",
  },
} as const;

export const educationFaqItems: EducationFaqItem[] = [
  {
    id: "value",
    question: "What factors determine a diamond's overall value?",
    answer:
      "A diamond's value is determined by the 4Cs — cut, colour, clarity, and carat — along with certification, fluorescence, and market demand. At Sunny Diamonds, we prioritize cut quality and clarity to ensure exceptional brilliance.",
  },
  {
    id: "authenticity",
    question: "How can I verify the authenticity of my diamond?",
    answer:
      "To verify your diamond's authenticity, check for a laser inscription on the girdle that matches its grading report from a reputable gemological lab like GIA or AGS. You can also request to view the diamond's original certificate and cross-reference the details online.",
  },
  {
    id: "cuts",
    question: "What are the different diamond cuts offered at Sunny Diamonds?",
    answer:
      "Sunny Diamonds offers round brilliant, cushion, oval, pear, emerald, princess, and marquise cuts — each selected for exceptional light performance and proportion.",
  },
  {
    id: "storage",
    question: "How do I properly store my diamonds to prevent damage?",
    answer:
      "Store diamonds separately in soft pouches or lined compartments to prevent scratching other jewellery. Avoid exposing them to harsh chemicals and have settings inspected periodically.",
  },
];

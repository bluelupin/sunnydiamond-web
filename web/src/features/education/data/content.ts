export const educationPageImages = {
  heroDesktop: "/images/education/hero-desktop.webp",
  heroMobile: "/images/education/hero-desktop.webp",
  diamondOval: "/images/education/diamond-oval.png",
  star: "/images/education/star.svg",
  panelTexture: "/images/education/panel-texture.png",
  diamondRating: "/images/education/diamond-rating.png",
  cutDiamondExcellent: "/images/education/cut-diamond-excellent.png",
  cutDiamondGood: "/images/education/cut-diamond-good.png",
  decorativeDiamond: "/images/education/decorative-diamond.png",
  discoverImage: "/images/education/discover-image.png",
  certifiedBg: "/images/education/certified-bg.png",
  giaLogo: "/images/education/gia-logo.png",
  agsLogo: "/images/education/ags-logo.png",
  hrdLogo: "/images/education/hrd-logo.png",
  kimberleyLogo: "/images/education/kimberley-logo.png",
  girdleScreenshot: "/images/education/girdle-screenshot.png",
  shapeLeft: "/images/education/shape-left.png",
  shapeCenter: "/images/education/shape-center.png",
  shapeRight: "/images/education/shape-right.png",
  scrollArrow: "/images/education/scroll-arrow.svg",
  claritySliderTrack: "/images/education/clarity-slider-track.svg",
  claritySliderDots: "/images/education/clarity-slider-dots.svg",
  claritySliderThumb: "/images/education/clarity-slider-thumb.svg",
  caratHand: "/images/education/carat-hand.png",
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
  referenceCarat: 3.0,
  minCarat: 0.1,
  maxCarat: 5.0,
  handOpacity: 0.35,
  desktop: {
    frameWidth: 718,
    handAreaHeight: 403,
    diamondLeft: 305,
    diamondTop: 178,
    diamondBaseSize: 40,
    diamondMinSize: 8,
    diamondMaxSize: 66,
  },
  /** Figma mweb 692:28716 / 692:28720 */
  mobile: {
    frameWidth: 343,
    handAreaHeight: 220,
    diamondLeft: 175,
    diamondTop: 97,
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
  /** "active" shows only the selected carat label under the thumb */
  labelDisplay?: "all" | "active";
  ariaLabel: string;
};

/** C4 carat slider stops — evenly spaced on track, diamond scales with weight */
export const educationCaratWeights = [
  0.1, 0.15, 0.2, 0.25, 0.3, 0.33, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0, 1.25, 1.5,
  1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.5, 4.0, 4.5, 5.0,
] as const;

const formatCaratLabel = (weight: number) => `${weight.toFixed(2)} ct`;

const buildEvenDotCenters = (count: number, start: number, end: number) =>
  Array.from({ length: count }, (_, index) =>
    count <= 1 ? start : start + (index / (count - 1)) * (end - start),
  );

const caratSliderDotStart = 18;
const caratSliderDotEnd = 505;
const caratSliderDotCenters = buildEvenDotCenters(
  educationCaratWeights.length,
  caratSliderDotStart,
  caratSliderDotEnd,
);

export const educationCaratSliderOptions: EducationSliderOption[] = educationCaratWeights.map(
  (weight) => ({
    label: formatCaratLabel(weight),
    caratWeight: weight,
    highlight: weight === 3.0,
  }),
);

export const educationCaratDefaultIndex = educationCaratWeights.indexOf(3.0);

export const educationSliderSpecs: Record<string, EducationSliderSpec> = {
  clarity: {
    width: 521.21,
    height: 50.5,
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
    trackLeft: 21,
    trackTop: 8,
    trackWidth: 482,
    trackHeight: 1.5,
    thumbSize: 18,
    labelTop: 32.51,
    trackDotGap: 4,
    labelDisplay: "active",
    dotCenters: caratSliderDotCenters,
    labelLeft: caratSliderDotCenters.map((center) => center - 20),
    ariaLabel: "Diamond carat weight",
  },
};

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
    bottom: 128,
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

export const educationHeroContent = {
  title: educationHeroFigmaSpec.title.text,
} as const;

export const educationFourCsIntroContent = {
  desktopTitle: "What You See And Don’t See: 4Cs",
  mobileTitle: "When You See And Don’t See: 4Cs",
  description:
    "Every diamond, like a human fingerprint, has certain distinguishing characteristics. The 4Cs - globally accepted standards for assessing the quality of a diamond",
  pillars: ["Cut", "Colour", "Carat", "Clarity"] as const,
} as const;

export type EducationSliderOption = {
  label: string;
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
        { label: "Very Good", image: educationPageImages.cutDiamondGood },
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
    background: "white",
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
      logo: educationPageImages.giaLogo,
      label: "THE GEMOLOGICAL INSTITUTE OF AMERICA",
      logoClassName: "h-[74px] w-[76px]",
      imageClassName: "h-full w-[297%] max-w-none object-cover object-left",
    },
    {
      logo: educationPageImages.agsLogo,
      label: "AMERICAN GEM SOCIETY",
      logoClassName: "h-[74px] w-[76px]",
      imageClassName: "h-full w-[177%] max-w-none object-cover object-left",
    },
    {
      logo: educationPageImages.hrdLogo,
      label: "HRD ANTWERP",
      logoClassName: "h-[51px] w-[101px]",
      imageClassName: "h-[165%] w-[136%] max-w-none object-cover object-left -top-[28%] -left-[15%]",
    },
    {
      logo: educationPageImages.kimberleyLogo,
      label: "THE KIMBERLY PROCESS",
      logoClassName: "h-[74px] w-[76px]",
      imageClassName: "size-full object-contain",
    },
  ],
  whyTitle: "Why Certifications Matter?",
  whyDescription:
    "Certification gives you confidence about what you’re investing in. It ensures the quality of the diamond is graded fairly.",
  howTitle: "How to check authenticity?",
  howDescription:
    "Each Solitaire carries a laser inscription on its girdle, linking it directly to its report.",
} as const;

export const educationDiscoverContent = {
  title: "Discover What Speaks to You",
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

export type EducationFaqItem = {
  id: string;
  question: string;
  answer?: string;
};

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

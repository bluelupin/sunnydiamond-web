/** Figma node 150:3356 — Designed around your story (Rough Design) */
export const bespokeStoryFigmaSpec = {
  figmaNode: "150:3356",
  sectionPaddingY: 104,
  sectionPaddingX: 40,
  headerGap: 16,
  contentGap: 48,
  stepGap: 40,
  imageTextGap: 16,
  gridMaxWidth: 1360,
  visibleWindowWidth: 658,
  /** First-step media width; scroll hook centers this under the section title */
  imageWidth: 658,
  /** Vertical scrub fraction for first-step inset before horizontal track translate */
  trackScrollLeadInRatio: 0.35,
  imageAspect: 496 / 658,
  textMaxWidth: 296,
  stepNumberSize: 48,
  stepTitleSize: 32,
  bodySize: 20,
  ctaWidth: 284,
  ctaHeight: 56,
  /** Figma node 2083:18264 — mobile / responsive story section (Sunny Diamond <> Dev) */
  mobile: {
    sectionPaddingY: 64,
    headerGap: 16,
    headerBottomGap: 32,
    stepsGap: 48,
    stepImageTextGap: 24,
    stepTextGap: 12,
    titleSize: 32,
    subtitleSize: 16,
    stepNumberSize: 48,
    stepTitleSize: 32,
    bodySize: 16,
  },
} as const;

/** Figma node 2083:18760 — Bespoke Jewellery page */
export const bespokePageFigmaSpec = {
  figmaNode: "2083:18760",
  heroDesktopHeight: 640,
  heroMobileHeight: 580,
  storySectionPaddingY: bespokeStoryFigmaSpec.sectionPaddingY,
  storySectionPaddingX: bespokeStoryFigmaSpec.sectionPaddingX,
  storyImageWidth: bespokeStoryFigmaSpec.imageWidth,
  storyImageHeight: 496,
  featuredStoryHeight: 420,
  featuredSectionHeight: 817,
  interestedHeight: 432,
  contentMaxWidth: 1360,
} as const;

/** Figma node 2574:60792 — Featured Stories section */
export const bespokeFeaturedStoriesFigmaSpec = {
  figmaNode: "2574:60792",
  sectionHeight: 817,
  backgroundColor: "#FBFAF6",
  heroHeight: 559,
  heroWidth: 1467,
  titleTop: 177,
  titleSize: 48,
  galleryTop: 270,
  galleryGap: 16,
  sideWidth: 400,
  sideHeight: 300,
  centerWidth: 560,
  centerHeight: 360,
  ctaBottom: 40,
  ctaMaxWidth: 1360,
  ctaOuterGap: 40,
  ctaInnerGap: 32,
  ctaWidth: 284,
  ctaHeight: 56,
  ctaFontSize: 14,
  overlayHorizontal: "rgba(0, 0, 0, 0.3)",
  overlayVertical: "linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 53.563%)",
  bottomGradient: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
} as const;

/** Figma node 2574:60926 — Featured story detail side panel */
export const bespokeFeaturedStoryModalFigmaSpec = {
  figmaNode: "2574:60926",
  panelMaxWidth: 480,
  overlayColor: "rgba(30, 30, 30, 0.75)",
  overlayBlur: 10,
  contentPaddingX: 24,
  contentPaddingBottom: 40,
  titleSize: 32,
  bodySize: 16,
  closeIconSize: 24,
  paginationActiveWidth: 32,
  paginationDotSize: 6,
  slideDurationMs: 400,
  swipeThresholdPx: 48,
} as const;

/** Figma — Past Creations full-screen masonry gallery */
export const bespokePastCreationsFigmaSpec = {
  columnGap: 8,
  closeIconSize: 24,
  closeTop: 24,
  closeRight: 24,
} as const;

export type BespokePastCreationImage = {
  /** Strapi past-creation / featured-story documentId for Save as Inspiration. */
  documentId?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const resolvePastCreationStory = (
  slides: readonly {
    src: string;
    modalImages: readonly { src: string }[];
  }[],
  imageSrc: string,
  defaultSlideIndex: number,
): { slideIndex: number; imageIndex: number } => {
  for (let slideIndex = 0; slideIndex < slides.length; slideIndex += 1) {
    const slide = slides[slideIndex];
    const imageIndex = slide.modalImages.findIndex((image) => image.src === imageSrc);
    if (imageIndex >= 0) {
      return { slideIndex, imageIndex };
    }
    if (slide.src === imageSrc) {
      return { slideIndex, imageIndex: 0 };
    }
  }

  return { slideIndex: defaultSlideIndex, imageIndex: 0 };
};

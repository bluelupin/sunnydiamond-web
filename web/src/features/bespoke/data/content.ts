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
  imageWidth: 658,
  /** Figma 1440px — initial left inset for step 01; animates to 0 on scroll */
  firstStepOffset: 350,
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
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const bespokePastCreationsImages: readonly BespokePastCreationImage[] = [
  { src: "/images/bespoke/featured-gallery-left-1.png", alt: "Gold ring on silk fabric", width: 400, height: 520 },
  { src: "/images/bespoke/featured-left-1.jpg", alt: "Hand wearing bespoke diamond ring", width: 400, height: 560 },
  { src: "/images/bespoke/featured-gallery-center.png", alt: "Bespoke bracelet with henna", width: 400, height: 640 },
  { src: "/images/bespoke/featured-center.jpg", alt: "Bespoke bracelet detail", width: 400, height: 480 },
  { src: "/images/bespoke/featured-gallery-left-2.png", alt: "Gold ring close-up on fabric", width: 400, height: 360 },
  { src: "/images/bespoke/featured-left-2.jpg", alt: "Bespoke ring craftsmanship", width: 400, height: 500 },
  { src: "/images/bespoke/featured-gallery-right-1.png", alt: "Bespoke ring detail", width: 400, height: 440 },
  { src: "/images/bespoke/featured-right-1.jpg", alt: "Bespoke ring finish", width: 400, height: 580 },
  { src: "/images/bespoke/featured-gallery-right-2.png", alt: "Bespoke ring alternate angle", width: 400, height: 380 },
  { src: "/images/bespoke/featured-right-2.jpg", alt: "Bespoke ring on hand", width: 400, height: 520 },
  { src: "/images/bespoke/featured-background.jpg", alt: "Bespoke jewellery styling", width: 400, height: 460 },
  { src: "/images/bespoke/story-step-01.jpg", alt: "Hand sketching a bespoke design", width: 400, height: 300 },
  { src: "/images/bespoke/story-step-02.jpg", alt: "Craftsman working on bespoke jewellery", width: 400, height: 300 },
  { src: "/images/bespoke/story-step-03.jpg", alt: "Finished bespoke jewellery piece", width: 400, height: 300 },
  { src: "/images/jewellery/plp/modal-lifestyle-1.webp", alt: "Model wearing diamond necklace", width: 400, height: 620 },
  { src: "/images/jewellery/plp/modal-lifestyle-2.webp", alt: "Model wearing emerald jewellery", width: 400, height: 540 },
  { src: "/images/home/featured-products/featured-product-left.png", alt: "Featured diamond ring", width: 400, height: 480 },
  { src: "/images/home/featured-products/featured-product-center.png", alt: "Featured pendant necklace", width: 400, height: 560 },
  { src: "/images/home/featured-products/featured-product-right.png", alt: "Featured earrings", width: 400, height: 420 },
  { src: "/images/collection/thumb-1.webp", alt: "Bridal jewellery collection", width: 400, height: 500 },
  { src: "/images/collection/thumb-2.png", alt: "Diamond necklace collection", width: 400, height: 380 },
  { src: "/images/collection/thumb-3.webp", alt: "Gold ring collection", width: 400, height: 460 },
  { src: "/images/collection/thumb-4.webp", alt: "Emerald jewellery collection", width: 400, height: 540 },
  { src: "/images/collection/thumb-5.png", alt: "Ruby pendant collection", width: 400, height: 400 },
  { src: "/images/about/craftsmanship-764d7a.webp", alt: "Jewellery craftsmanship detail", width: 400, height: 320 },
  { src: "/images/about/handcrafted-intersect.webp", alt: "Handcrafted jewellery process", width: 400, height: 480 },
  { src: "/images/products/pdp/gallery-product-image-lifestyle.png", alt: "Lifestyle jewellery photography", width: 400, height: 580 },
  { src: "/images/home/crafting-rarity-necklace.png", alt: "Crafted diamond necklace", width: 400, height: 440 },
  { src: "/images/home/valentine-rings.png", alt: "Diamond rings collection", width: 400, height: 360 },
  { src: "/images/bespoke/hero.jpg", alt: "Model wearing bespoke diamond earrings", width: 400, height: 520 },
] as const;

export const bespokePageContent = {
  hero: {
    title: "Bespoke Jewellery",
    image: {
      desktop: "/images/bespoke/hero.jpg",
      mobile: "/images/bespoke/hero.jpg",
      alt: "Model wearing bespoke diamond earrings",
    },
  },
  story: {
    title: "Designed around your story",
    subtitle: "Pieces crafted by turning your inspiration into something personal.",
    steps: [
      {
        number: "01",
        title: "Inspired Design",
        description:
          "Every aspect of your unique story is translated through detailed sketches drawn from your imagination.",
        image: {
          src: "/images/bespoke/story-step-01.jpg",
          alt: "Hand sketching a bespoke jewellery design",
        },
      },
      {
        number: "02",
        title: "Crafted to Perfection",
        description:
          "Your design is brought alive through master craftsmanship with painstaking attention to detail and finish.",
        image: {
          src: "/images/bespoke/story-step-02.jpg",
          alt: "Craftsman working on bespoke jewellery",
        },
      },
      {
        number: "03",
        title: "Uniquely Yours",
        description:
          "A promise of excellence fulfilled through a journey of creation, unveiled in jewellery that is as unique as you are.",
        image: {
          src: "/images/bespoke/story-step-03.jpg",
          alt: "Finished bespoke jewellery piece",
        },
      },
    ] as const,
    ctaLabel: "Share Your Vision",
    ctaHref: "/contact",
  },
  featuredStories: {
    title: "Featured Stories",
    /** Default center slide index on first load */
    defaultSlideIndex: 2,
    modalCtaLabel: "Save as Inspiration",
    modalCtaHref: "/wishlist",
    slides: [
      {
        src: "/images/bespoke/featured-gallery-left-1.png",
        alt: "Bespoke ring on hand",
        modalTitle: "A Promise in Gold",
        modalDescription:
          "Inspired by a couple's shared journey, this bespoke ring was designed to capture a moment of commitment—translated through hand sketches, refined proportions, and a diamond chosen for its quiet brilliance.",
        modalImages: [
          { src: "/images/bespoke/featured-gallery-left-1.png", alt: "Bespoke ring on hand" },
          { src: "/images/bespoke/featured-left-1.jpg", alt: "Bespoke ring on hand detail" },
          { src: "/images/bespoke/featured-gallery-left-2.png", alt: "Bespoke ring alternate angle" },
          { src: "/images/bespoke/featured-left-2.jpg", alt: "Bespoke ring craftsmanship" },
          { src: "/images/bespoke/featured-background.jpg", alt: "Bespoke jewellery styling" },
        ],
      },
      {
        src: "/images/bespoke/featured-gallery-left-2.png",
        alt: "Bespoke ring on hand",
        modalTitle: "Crafted for the Occasion",
        modalDescription:
          "Created for a milestone celebration, every curve of this piece was shaped around the wearer's story—from initial inspiration to the final polish that makes it unmistakably personal.",
        modalImages: [
          { src: "/images/bespoke/featured-gallery-left-2.png", alt: "Bespoke ring on hand" },
          { src: "/images/bespoke/featured-left-2.jpg", alt: "Bespoke ring detail" },
          { src: "/images/bespoke/featured-gallery-left-1.png", alt: "Bespoke ring alternate view" },
          { src: "/images/bespoke/featured-left-1.jpg", alt: "Bespoke ring close-up" },
          { src: "/images/bespoke/featured-background.jpg", alt: "Bespoke jewellery styling" },
        ],
      },
      {
        src: "/images/bespoke/featured-gallery-center.png",
        alt: "Bespoke bracelet with henna",
        modalTitle: "Uniquely Yours",
        modalDescription:
          "We wanted to celebrate our 25th anniversary with something bespoke. This pendant was just how I wanted it!",
        modalImages: [
          { src: "/images/bespoke/featured-gallery-center.png", alt: "Bespoke bracelet with henna" },
          { src: "/images/bespoke/featured-center.jpg", alt: "Bespoke bracelet detail" },
          { src: "/images/bespoke/featured-gallery-left-1.png", alt: "Bespoke ring styling" },
          { src: "/images/bespoke/featured-gallery-right-1.png", alt: "Bespoke ring detail" },
          { src: "/images/bespoke/featured-background.jpg", alt: "Bespoke jewellery backdrop" },
        ],
      },
      {
        src: "/images/bespoke/featured-gallery-right-1.png",
        alt: "Bespoke ring detail",
        modalTitle: "Details That Endure",
        modalDescription:
          "From the first sketch to the final setting, this design celebrates precision—where each facet, each line, and each finish reflects the care invested in bespoke creation.",
        modalImages: [
          { src: "/images/bespoke/featured-gallery-right-1.png", alt: "Bespoke ring detail" },
          { src: "/images/bespoke/featured-right-1.jpg", alt: "Bespoke ring craftsmanship" },
          { src: "/images/bespoke/featured-gallery-right-2.png", alt: "Bespoke ring alternate angle" },
          { src: "/images/bespoke/featured-right-2.jpg", alt: "Bespoke ring finish" },
          { src: "/images/bespoke/featured-background.jpg", alt: "Bespoke jewellery styling" },
        ],
      },
      {
        src: "/images/bespoke/featured-gallery-right-2.png",
        alt: "Bespoke ring detail",
        modalTitle: "Brilliance, Personalised",
        modalDescription:
          "A one-of-a-kind ring born from conversation and imagination—crafted to sit beautifully in everyday life while carrying the meaning of the story behind it.",
        modalImages: [
          { src: "/images/bespoke/featured-gallery-right-2.png", alt: "Bespoke ring detail" },
          { src: "/images/bespoke/featured-right-2.jpg", alt: "Bespoke ring finish" },
          { src: "/images/bespoke/featured-gallery-right-1.png", alt: "Bespoke ring side view" },
          { src: "/images/bespoke/featured-right-1.jpg", alt: "Bespoke ring craftsmanship" },
          { src: "/images/bespoke/featured-background.jpg", alt: "Bespoke jewellery backdrop" },
        ],
      },
    ] as const,
    primaryCtaLabel: "Behind This Design",
    primaryCtaHref: "/about",
    secondaryCtaLabel: "See Past Creations",
  },
  pastCreations: {
    title: "Past Creations",
    images: bespokePastCreationsImages,
  },
  guarantees: [
    {
      iconSrc: "/images/about/guarantees/monyback-Guarantee.svg",
      label: "100% Moneyback Guarantee",
    },
    {
      iconSrc: "/images/about/guarantees/Return-policy.svg",
      label: "15 Days Return Policy",
    },
    {
      iconSrc: "/images/about/guarantees/cash-on-delivery.svg",
      label: "Cash on Delivery",
    },
  ] as const,
  interested: {
    id: "bespoke-interested",
    title: "Interested?",
    description:
      "Begin your bespoke journey with a conversation, let's create something personal together.",
    ctaLabel: "Get in Touch",
    ctaHref: "/contact",
    image: {
      desktop: "/images/bespoke/interested.jpg",
      mobile: "/images/bespoke/interested.jpg",
      alt: "Diamond ring held with tweezers",
    },
  },
} as const;

type FeaturedStorySlide = (typeof bespokePageContent.featuredStories.slides)[number];

export const resolvePastCreationStory = (
  slides: readonly FeaturedStorySlide[],
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

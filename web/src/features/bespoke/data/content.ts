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
    slides: [
      {
        src: "/images/bespoke/featured-gallery-left-1.png",
        alt: "Bespoke ring on hand",
      },
      {
        src: "/images/bespoke/featured-gallery-left-2.png",
        alt: "Bespoke ring on hand",
      },
      {
        src: "/images/bespoke/featured-gallery-center.png",
        alt: "Bespoke bracelet with henna",
      },
      {
        src: "/images/bespoke/featured-gallery-right-1.png",
        alt: "Bespoke ring detail",
      },
      {
        src: "/images/bespoke/featured-gallery-right-2.png",
        alt: "Bespoke ring detail",
      },
    ] as const,
    primaryCtaLabel: "Behind This Design",
    primaryCtaHref: "/about",
    secondaryCtaLabel: "See Past Creations",
    secondaryCtaHref: "/products",
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

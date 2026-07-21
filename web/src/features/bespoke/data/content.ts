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
    background: {
      desktop: "/images/bespoke/featured-background.jpg",
      mobile: "/images/bespoke/featured-background.jpg",
      alt: "Hands adorned with henna and jewellery",
    },
    items: [
      {
        src: "/images/bespoke/featured-left-1.jpg",
        alt: "Bespoke ring on hand",
        featured: false,
      },
      {
        src: "/images/bespoke/featured-center.jpg",
        alt: "Bespoke bracelet with henna",
        featured: true,
      },
      {
        src: "/images/bespoke/featured-right-1.jpg",
        alt: "Bespoke ring detail",
        featured: false,
      },
    ] as const,
    primaryCtaLabel: "Behind the Design",
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

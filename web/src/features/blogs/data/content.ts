const IMAGE_BASE = "/images/blogs";

/** UI chrome + fallbacks when CMS media/labels are missing. Not article content. */
export const blogsPageContent = {
  hero: {
    title: "The Diamond Guide",
    image: {
      desktopUrl: `${IMAGE_BASE}/hero.png`,
      mobileUrl: `${IMAGE_BASE}/hero.png`,
      alt: "Diamond jewellery editorial",
    },
  },
  filterLabel: "Filter by:",
  loadMore: {
    buttonLabel: "LOAD MORE",
  },
  featured: {
    backgroundSrc: `${IMAGE_BASE}/featured-bg.svg`,
    readNowLabel: "READ NOW",
  },
  /** Preferred filter chip order when categories are inferred from posts. */
  categoryOrder: [
    "bridal",
    "buying-guides",
    "occasion",
    "gifting",
    "jewellery",
    "styling",
    "education",
  ] as const,
  categoryLabels: {
    bridal: "Bridal",
    "buying-guides": "Buying Guides",
    occasion: "Occasion",
    gifting: "Gifting",
    jewellery: "Jewellery",
    styling: "Styling",
    education: "Education",
  } as Record<string, string>,
  /** Placeholders when CMS hero/cover images are empty. */
  cardImageFallbacks: [
    { src: `${IMAGE_BASE}/card-styling.png`, alt: "Diamond jewellery" },
    { src: `${IMAGE_BASE}/card-onam.png`, alt: "Diamond jewellery" },
    { src: `${IMAGE_BASE}/card-emerald.png`, alt: "Diamond jewellery" },
    { src: `${IMAGE_BASE}/card-rings.png`, alt: "Diamond jewellery" },
    { src: `${IMAGE_BASE}/card-gifting.png`, alt: "Diamond jewellery" },
    { src: `${IMAGE_BASE}/card-wedding.png`, alt: "Diamond jewellery" },
  ],
} as const;

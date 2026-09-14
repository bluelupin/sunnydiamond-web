/** UI chrome labels for blogs. Images come from CMS only. */
export const blogsPageContent = {
  hero: {
    title: "The Diamond Guide",
  },
  filterLabel: "Explore Topics",
  loadMore: {
    buttonLabel: "LOAD MORE",
  },
  featured: {
    readNowLabel: "READ NOW",
  },
  /** Figma filter chip order. Known ids stay in this sequence; new CMS categories append after. */
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
} as const;

/** UI chrome labels for blogs. Images come from CMS only. */
export const blogsPageContent = {
  hero: {
    title: "The Diamond Guide",
  },
  filterLabel: "Filter by:",
  loadMore: {
    buttonLabel: "LOAD MORE",
  },
  featured: {
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
} as const;

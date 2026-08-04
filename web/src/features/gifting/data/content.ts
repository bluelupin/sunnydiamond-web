/**
 * Gifting landing visuals come from CMS (`getGiftingPage`).
 * Gift-finder category/occasion options come from Magento.
 * This file keeps only UI chrome + static price ranges (not in Magento facets as labeled bands).
 */
export const giftingPageContent = {
  products: {
    ctaLabel: "VIEW PRODUCT",
  },
  discover: {
    categoryLabel: "I am looking for",
    categoryPlaceholder: "Select category",
    priceLabel: "Within",
    pricePlaceholder: "Select Price Range",
    occasionLabel: "By Occasion",
    occasionPlaceholder: "Select Occasion",
    priceRanges: [
      { label: "Under ₹25,000", min: 0, max: 25000 },
      { label: "₹25,000 – ₹50,000", min: 25000, max: 50000 },
      { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
      { label: "Above ₹1,00,000", min: 100000, max: 500000 },
    ],
  },
} as const;

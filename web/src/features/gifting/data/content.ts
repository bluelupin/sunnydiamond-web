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
    priceLabel: "Up to",
    pricePlaceholder: "Select Price Range",
    occasionLabel: "By Occasion",
    occasionPlaceholder: "Select Occasion",
    priceRanges: [
      { label: "Under ₹25,000", min: 0, max: 24999 },
      { label: "₹25,000 – ₹50,000", min: 25000, max: 49999 },
      { label: "₹50,000 – ₹1,00,000", min: 50000, max: 99999 },
      { label: "₹1,00,000 – ₹2,50,000", min: 100000, max: 250000 },
      { label: "Above ₹2,50,000", min: 250001, max: 0 },
    ],
  },
} as const;

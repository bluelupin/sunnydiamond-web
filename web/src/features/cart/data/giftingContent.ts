/** Static gifting panel content — image URLs can be swapped from API during integration. */
export const giftingContent = {
  bagHero: {
    single: "/images/cart/personalise-gifting-web.avif",
    separate: "/images/cart/personalise-gifting-web.avif",
    alt: "Sunny Diamonds signature gift bag",
    width: 424,
    height: 192,
    offsetTop: -26,
  },
  copy: {
    singleBag: "Your order will arrive in a single signature gift bag.",
    separateBags: "Your order will arrive in separate bags",
    giftNoteRequiresSelection:
      "Please select at least one item as a gift to add a gift note.",
    giftNoteRequiresItemSelection:
      "Please select this item as a gift to add a gift note.",
  },
} as const;

/** Static gifting panel content — image URLs can be swapped from API during integration. */
export const giftingContent = {
  bagHero: {
    single: "/images/cart/gifting-bag-hero.png",
    separate: "/images/cart/gifting-bag-hero.png",
    alt: "Sunny Diamonds signature gift bag",
    width: 424,
    height: 192,
    offsetTop: -26,
  },
  copy: {
    singleBag: "Your items will be gift wrapped in a single bag",
    separateBags: "Each of your items will be delivered in separate bags",
  },
} as const;

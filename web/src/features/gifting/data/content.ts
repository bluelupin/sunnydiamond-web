import { buildJewelleryCategoryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { buildJewelleryOccasionHref } from "@/features/jewellery-product/utils/occasionListing";

export const giftingPageContent = {
  intro: {
    title: "The Art of Gifting",
    description:
      "Celebrate life's most meaningful moments with diamond jewellery crafted to be treasured forever.",
    image: {
      desktopUrl: "/images/home/valentine-rings.png",
      mobileUrl: "/images/home/valentine-rings.png",
      alt: "Diamond jewellery gift collection by Sunny Diamonds",
    },
  },
  occasions: {
    title: "Occasion Led Gifts",
    description:
      "From milestones to everyday celebrations, find a piece that speaks to the moment.",
    cards: [
      {
        id: "anniversary",
        title: "Anniversary",
        description: "Timeless symbols of enduring love and commitment.",
        image: {
          desktopUrl: "/images/home/crafting-rarity-necklace.png",
          mobileUrl: "/images/home/crafting-rarity-necklace.png",
          alt: "Anniversary diamond jewellery",
        },
        href: buildJewelleryOccasionHref("anniversary"),
      },
      {
        id: "birthday",
        title: "Birthday",
        description: "Radiant pieces to mark another year of brilliance.",
        image: {
          desktopUrl: "/images/home/featured-products/featured-product-center.png",
          mobileUrl: "/images/home/featured-products/featured-product-center.png",
          alt: "Birthday diamond jewellery",
        },
        href: buildJewelleryOccasionHref("birthday"),
      },
      {
        id: "wedding",
        title: "Wedding",
        description: "Elegant designs for vows, receptions, and forever.",
        image: {
          desktopUrl: "/images/home/valentine-rings.png",
          mobileUrl: "/images/home/valentine-rings.png",
          alt: "Wedding diamond jewellery",
        },
        href: buildJewelleryOccasionHref("wedding"),
      },
      {
        id: "engagement",
        title: "Engagement",
        description: "Exceptional rings for the beginning of your story.",
        image: {
          desktopUrl: "/images/home/featured-products/featured-product-left.png",
          mobileUrl: "/images/home/featured-products/featured-product-left.png",
          alt: "Engagement diamond rings",
        },
        href: buildJewelleryCategoryHref("diamond-rings"),
      },
    ],
  },
  products: {
    title: "Curated for Gifting",
    description:
      "Handpicked diamond jewellery — each piece arrives in our signature packaging, ready to delight.",
    cta: { label: "View All Jewellery", href: "/jewellery" },
  },
  discover: {
    title: "Discover Your Ideal Gift",
    description:
      "Not sure where to begin? Speak with our consultants or explore by occasion and style to find the perfect piece.",
    primaryCta: { label: "Book a Consultation", href: "/book-an-appointment" },
    secondaryCta: { label: "Shop Jewellery", href: "/jewellery" },
    image: {
      desktopUrl: "/images/cart/gifting-bag-hero.png",
      mobileUrl: "/images/cart/gifting-bag-hero.png",
      alt: "Sunny Diamonds signature gift packaging",
    },
  },
  giftCard: {
    title: "Send a Gift Card",
    description:
      "Let them choose their own treasure. Sunny Diamonds gift cards are delivered instantly and never expire.",
    cta: { label: "Purchase Gift Card", href: "/gift-card" },
    image: {
      desktopUrl: "/images/home/bespoke-for-you-bg.webp",
      mobileUrl: "/images/home/bespoke-for-you-bg.webp",
      alt: "Sunny Diamonds gift card",
    },
  },
  promise: {
    title: "Sunny's Promise",
    description:
      "Every Sunny Diamonds gift is backed by GIA-certified quality, ethical sourcing, and our lifetime craftsmanship guarantee.",
    cta: { label: "View Our Story", href: "/about" },
  },
} as const;

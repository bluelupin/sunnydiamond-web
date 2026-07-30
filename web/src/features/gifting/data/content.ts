import { buildJewelleryCategoryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { buildJewelleryOccasionHref } from "@/features/jewellery-product/utils/occasionListing";

const GIFTING_IMAGE_BASE = "/images/gifting";

export const giftingPageContent = {
  /** Figma node 1049:50957 */
  intro: {
    title: "The Joy of Gifting",
    image: {
      desktopUrl: `${GIFTING_IMAGE_BASE}/hero.png`,
      mobileUrl: `${GIFTING_IMAGE_BASE}/hero.png`,
      alt: "Sunny Diamonds gift packaging",
    },
  },
  withLove: {
    title: "With love",
    description:
      "Explore and find creations designed to celebrate the people and moments that matter most.",
    background: {
      src: `${GIFTING_IMAGE_BASE}/with-love-bg.png`,
      alt: "",
    },
  },
  occasions: {
    viewCollectionLabel: "VIEW COLLECTION",
    cards: [
      {
        id: "bridal",
        title: "Bridal",
        description: "For the day you'll never forget",
        image: {
          desktopUrl: `${GIFTING_IMAGE_BASE}/occasion-bridal.png`,
          mobileUrl: `${GIFTING_IMAGE_BASE}/occasion-bridal.png`,
          alt: "Bridal diamond jewellery",
        },
        href: buildJewelleryOccasionHref("wedding"),
      },
      {
        id: "everyday",
        title: "Everyday & work",
        description: "From desk to dinner",
        image: {
          desktopUrl: `${GIFTING_IMAGE_BASE}/occasion-everyday.png`,
          mobileUrl: `${GIFTING_IMAGE_BASE}/occasion-everyday.png`,
          alt: "Everyday diamond jewellery",
        },
        href: buildJewelleryCategoryHref("diamond-earrings"),
      },
      {
        id: "festive",
        title: "Festive",
        description: "Dressed for every celebration",
        image: {
          desktopUrl: `${GIFTING_IMAGE_BASE}/occasion-festive.png`,
          mobileUrl: `${GIFTING_IMAGE_BASE}/occasion-festive.png`,
          alt: "Festive diamond jewellery",
        },
        href: buildJewelleryOccasionHref("festive"),
      },
      {
        id: "evenings",
        title: "Evenings & Parties",
        description: "For the nights that call for more",
        image: {
          desktopUrl: `${GIFTING_IMAGE_BASE}/occasion-evenings.png`,
          mobileUrl: `${GIFTING_IMAGE_BASE}/occasion-evenings.png`,
          alt: "Evening diamond jewellery",
        },
        href: buildJewelleryOccasionHref("party"),
      },
    ],
  },
  products: {
    title: "Your Perfect Gift",
    description: "Discover timeless diamond pieces that speak straight from the heart",
    ctaLabel: "VIEW PRODUCT",
  },
  discover: {
    title: "Discover the Ideal Gift",
    description: "Find the perfect expression of emotion for your loved ones",
    categoryLabel: "I am looking for",
    categoryPlaceholder: "Select category",
    priceLabel: "Within",
    pricePlaceholder: "Select Price Range",
    occasionLabel: "By Occasion",
    occasionPlaceholder: "Select Occasion",
    submitLabel: "FIND PRODUCTS",
    image: {
      src: `${GIFTING_IMAGE_BASE}/discover-gift-box.png`,
      alt: "Sunny Diamonds gift box with personalised note",
    },
    categories: [
      { label: "Diamond Bangles", value: "diamond-bangles" },
      { label: "Diamond Necklaces", value: "diamond-necklaces" },
      { label: "Diamond Rings", value: "diamond-rings" },
      { label: "Diamond Pendants", value: "diamond-pendants" },
      { label: "Diamond Earrings", value: "diamond-earrings" },
      { label: "Diamond Bracelets", value: "diamond-bracelets" },
    ],
    priceRanges: [
      { label: "Under ₹25,000", min: 0, max: 25000 },
      { label: "₹25,000 – ₹50,000", min: 25000, max: 50000 },
      { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
      { label: "Above ₹1,00,000", min: 100000, max: 500000 },
    ],
    occasions: [
      { label: "Wedding", value: "wedding" },
      { label: "Anniversary", value: "anniversary" },
      { label: "Birthday", value: "birthday" },
      { label: "Festive", value: "festive" },
    ],
  },
  giftCard: {
    title: "Gift of Choice",
    description: "Give them the freedom to choose a piece they'll truly treasure",
    cta: { label: "SEND A GIFT CARD", href: "/gift-card" },
    background: {
      src: `${GIFTING_IMAGE_BASE}/gift-card-bg.png`,
      alt: "",
    },
    image: {
      src: `${GIFTING_IMAGE_BASE}/gift-cards.png`,
      alt: "Sunny Diamonds gift cards",
    },
  },
  finishingTouch: {
    /** Figma node 1049:51053 */
    title: "The Finishing Touch",
    description: "Traditional mastery bringing every diamond to radiant, eternal life.",
    items: [
      {
        id: "engraving",
        title: "Engraving",
        description: "Add a heartfelt note to your gift and express to them",
        image: {
          src: `${GIFTING_IMAGE_BASE}/finishing-engraving.png`,
          alt: "Engraved diamond ring",
        },
      },
      {
        id: "gift-wrap",
        title: "Gift Wrap",
        description: "Wrap your emotions beautifully and make it even more iconic",
        image: {
          src: `${GIFTING_IMAGE_BASE}/finishing-gift-wrap.png`,
          alt: "Sunny Diamonds gift wrap",
        },
      },
      {
        id: "personalised-notes",
        title: "Personalised Notes",
        description: "Add a heartfelt note to your gift and express to them",
        image: {
          src: `${GIFTING_IMAGE_BASE}/finishing-notes.png`,
          alt: "Personalised gift note",
        },
      },
    ],
  },
} as const;

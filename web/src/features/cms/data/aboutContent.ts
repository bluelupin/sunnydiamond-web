import type { AboutPageContent } from "@/types/about/aboutPage";

/**
 * Seeded placeholder images via Picsum.
 * `next.config.ts` already allows `https://**` remote patterns.
 * Swap these out for real Strapi/CDN assets when available.
 */
const ph = (seed: string, width: number, height: number): string =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const aboutPageContent: AboutPageContent = {
  hero: {
    title: "Our Story",
    image: {
      desktopSrc: ph("sunny-hero", 1920, 1080),
      mobileSrc: ph("sunny-hero", 828, 1100),
      alt: "Woman wearing a Sunny Diamonds gold necklace with a diamond pendant",
    },
  },
  history: {
    title: "Since 1997",
    body: "Founded in Chalakkudy, Sunny Diamonds began as a family vision to bring internally flawless diamonds within reach of discerning jewellery lovers across Kerala. What started as a single showroom has grown into a trusted name, guided by the same values of transparency, craftsmanship, and uncompromising quality that defined our very first piece of jewellery. Three decades on, every creation still carries that founding promise.",
    primaryImage: {
      desktopSrc: ph("sunny-founders", 720, 900),
      alt: "Sunny Diamonds founding team in formal attire",
      caption: "The founders, since 1997",
    },
    secondaryImage: {
      desktopSrc: ph("sunny-heritage", 540, 720),
      alt: "Sunny Diamonds leadership walking together",
      caption: "A legacy that walks forward",
    },
  },
  leadership: {
    title: "Faces Behind the Brilliance",
    description:
      "Our leadership brings decades of expertise in diamond sourcing, jewellery design, and retail excellence, ensuring every Sunny Diamonds piece meets the highest standards of clarity and craftsmanship.",
    members: [
      {
        id: "leader-1",
        name: "Managing Director",
        role: "Managing Director",
        image: {
          desktopSrc: ph("sunny-leader-1", 600, 800),
          alt: "Sunny Diamonds managing director portrait",
        },
      },
      {
        id: "leader-2",
        name: "Creative Director",
        role: "Creative Director",
        image: {
          desktopSrc: ph("sunny-leader-2", 600, 800),
          alt: "Sunny Diamonds creative director portrait",
        },
      },
      {
        id: "leader-3",
        name: "Operations Director",
        role: "Operations Director",
        image: {
          desktopSrc: ph("sunny-leader-3", 600, 800),
          alt: "Sunny Diamonds operations director portrait",
        },
      },
    ],
  },
  craftsmanship: {
    bannerTitle: "Handcrafted Brilliance",
    bannerImage: {
      desktopSrc: ph("sunny-craft-banner", 1920, 900),
      mobileSrc: ph("sunny-craft-banner", 828, 620),
      alt: "Craftsman's hands working at a jewellery bench",
    },
    cells: [
      {
        id: "craft-1",
        type: "image",
        image: {
          desktopSrc: ph("sunny-craft-1", 600, 600),
          alt: "Close-up of loose diamonds on cloth",
        },
      },
      {
        id: "craft-2",
        type: "text",
        title: "Ethically Sourced, conflict-free diamonds",
      },
      {
        id: "craft-3",
        type: "image",
        image: {
          desktopSrc: ph("sunny-craft-2", 600, 600),
          alt: "Diamond inspected under magnification",
        },
      },
      {
        id: "craft-4",
        type: "image",
        image: {
          desktopSrc: ph("sunny-craft-3", 600, 600),
          alt: "Artisan polishing a diamond ring",
        },
      },
      {
        id: "craft-5",
        type: "text",
        title: "Pinnacle of Craftsmanship and Artistry",
      },
      {
        id: "craft-6",
        type: "image",
        image: {
          desktopSrc: ph("sunny-craft-4", 600, 600),
          alt: "Finished diamond jewellery on display",
        },
      },
      {
        id: "craft-7",
        type: "text",
        title: "Highest Level of Quality Checks",
      },
      {
        id: "craft-8",
        type: "image",
        image: {
          desktopSrc: ph("sunny-craft-5", 600, 600),
          alt: "Quality inspection of a diamond necklace",
        },
      },
      {
        id: "craft-9",
        type: "image",
        image: {
          desktopSrc: ph("sunny-craft-6", 600, 600),
          alt: "Craftsman assembling a jewellery piece",
        },
      },
    ],
  },
  store: {
    title: "Found in Chalakkudy",
    description:
      "Visit our flagship showroom to experience our collections in person, from solitaire rings to bespoke bridal sets, guided by our expert consultants.",
    image: {
      desktopSrc: ph("sunny-store", 1920, 1080),
      mobileSrc: ph("sunny-store", 828, 900),
      alt: "Sunny Diamonds storefront at night in Chalakkudy",
    },
  },
  trustBadges: [
    { id: "trust-1", label: "Internally Flawless Diamonds", icon: "diamond" },
    { id: "trust-2", label: "100% Moneyback Guarantee", icon: "shield" },
    { id: "trust-3", label: "Best Buyback for Jewellery", icon: "rotate" },
    { id: "trust-4", label: "15 Days Return Policy", icon: "calendar" },
    { id: "trust-5", label: "Cash on Delivery", icon: "truck" },
  ],
  tagline: {
    text: "Crafting family heirlooms at the pinnacle of diamond clarity.",
  },
} as const;

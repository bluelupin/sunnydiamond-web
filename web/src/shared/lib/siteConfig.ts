import { getPublicSiteUrl } from "@/api/config";

export const siteConfig = {
  brand: {
    name: "Sunny Diamonds",
    displayName: "SUNNY DIAMONDS",
    tagline: "Crafting Brilliance Since 1987",
    taglineExtended: "Crafting timeless diamond jewellery since 1987. Each piece tells a story of elegance and brilliance.",
    description:
      "Discover our curated collection of premium and custom diamond jewellery, crafted for moments that last forever.",
  },
  contact: {
    email: "hello@sunnydiamonds.com",
    phone: "+1 (555) 123-4567",
    address: "123 Diamond Avenue, New York, NY 10001",
    hours: "Mon–Sat: 10am – 7pm",
  },
  social: {
    instagram: "https://instagram.com/sunnydiamonds",
    pinterest: "https://pinterest.com/sunnydiamonds",
    facebook: "https://facebook.com/sunnydiamonds",
  },
  seo: {
    defaultTitle: "Sunny Diamonds — Premium Diamond Jewellery",
    defaultDescription:
      "Handcrafted premium and custom diamond jewellery. Explore GIA-certified diamonds, bespoke designs, and timeless elegance.",
    siteUrl: getPublicSiteUrl(),
    ogImage: "/og-image.jpg",
  },
} as const;

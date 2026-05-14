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
    titleTemplate: "%s | Sunny Diamonds",
    defaultDescription:
      "Handcrafted premium and custom diamond jewellery. Explore GIA-certified diamonds, bespoke designs, and timeless elegance.",
    siteUrl: "https://sunnydiamonds.com",
    ogImage: "/og-image.jpg",
  },
  navigation: {
    main: [
      { to: "/products", label: "Jewellery" },
      { to: "/products", label: "Collection" },
      { to: "/products", label: "Gifting" },
      { to: "/contact", label: "Bespoke" },
      { to: "/about", label: "World of Sunny" },
    ],
    footer: {
      columns: [
        {
          heading: "Our Company",
          links: [
            { to: "/about", label: "About Us" },
            { to: "/about", label: "Learn About Diamonds" },
            { to: "/about", label: "Diamonds For Everyone" },
            { to: "/about", label: "Careers" },
            { to: "/about", label: "News" },
          ],
        },
        {
          heading: "Support",
          links: [
            { to: "/contact", label: "Contact Us" },
            { to: "/contact", label: "Store Locator" },
            { to: "/contact", label: "FAQs" },
          ],
        },
        {
          heading: "Services",
          links: [
            { to: "/contact", label: "Book an Appointment" },
            { to: "/contact", label: "Bespoke Jewellery" },
          ],
        },
        {
          heading: "Legal",
          links: [
            { to: "/about", label: "Returns and Cancellations" },
            { to: "/about", label: "Exchange and Resizing" },
            { to: "/about", label: "Shipping & Delivery" },
            { to: "/about", label: "Cash on Delivery Policy" },
            { to: "/about", label: "Old Gold Purchase Policy (Kerala Only)" },
            { to: "/about", label: "Privacy Policy" },
            { to: "/about", label: "Terms & Conditions" },
          ],
        },
      ],
      trustSignals: [
        "BIS HALMARK FOR JEWELLERY",
        "CASH ON DELIVERY",
        "INTERNALLY FLAWLESS DIAMONDS",
        "100% MONEYBACK GUARANTEE",
      ],
      paymentMethods: ["Visa", "Mastercard", "Amex", "Maestro", "UPI", "Paytm", "RuPay"],
    },
  },
  ga: {
    measurementId: "G-XXXXXXXXXX", // Replace with your GA4 Measurement ID
  },
} as const;

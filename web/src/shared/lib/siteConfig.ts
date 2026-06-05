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
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunnydiamonds.com").replace(/\/$/, ""),
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
            { to: "/education", label: "Learn About Diamonds" },
            { to: "/diamonds-for-everyone", label: "Diamonds For Everyone" },
            { to: "/careers", label: "Careers" },
            { to: "/news", label: "News" },
            { to: "/blogs", label: "Blog" },
          ],
        },
        {
          heading: "Support",
          links: [
            { to: "/contact", label: "Contact Us" },
            { to: "/store-locator", label: "Store Locator" },
            { to: "/faqs", label: "FAQs" },
            { to: "/help-and-support", label: "Help and Support" },
          ],
        },
        {
          heading: "Services",
          links: [
            { to: "/book-an-appointment", label: "Book an Appointment" },
            { to: "/bespoke-jewellery", label: "Bespoke Jewellery" },
            { to: "/monthly-plans", label: "Monthly Plans" },
            { to: "/gift-card", label: "Gift Card" },
            { to: "/finance-options", label: "Finance Options" },
          ],
        },
        {
          heading: "Legal",
          links: [
            { to: "/returns-and-cancellations", label: "Returns and Cancellations" },
            { to: "/exchange-and-resizing", label: "Exchange and Resizing" },
            { to: "/shipping-delivery", label: "Shipping & Delivery" },
            { to: "/cash-on-delivery-policy", label: "Cash on Delivery Policy" },
            { to: "/old-gold-purchase-policy-kerala-only", label: "Old Gold Purchase Policy (Kerala Only)" },
            { to: "/privacy-policy", label: "Privacy Policy" },
            { to: "/terms-and-conditions", label: "Terms & Conditions" },
            { to: "/policy-and-certification", label: "Policy and Certification" },
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

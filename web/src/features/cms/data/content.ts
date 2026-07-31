export const homeSections = [
  { id: "alankara", label: "Collections" },
  { id: "categories", label: "By Occasions" },
  { id: "diamond-awaits", label: "Category" },
  { id: "valentine", label: "Gifting" },
  { id: "promise", label: "The Sunny Promise" },
  { id: "bespoke-for-you", label: "For You" },
  { id: "diamonds-for-everyone", label: "Diamonds for Everyone" },
  { id: "craftsmanship", label: "Know Your Diamonds" },
  { id: "showrooms", label: "Showrooms" },
] as const;

export const homeContent = {
  whyUs: {
    subtitle: "Why Sunny Diamonds",
    title: "What Sets Us Apart",
    items: [
      {
        icon: "Award" as const,
        title: "GIA Certified",
        description: "Every diamond is independently certified by the Gemological Institute of America for quality assurance.",
      },
      {
        icon: "Leaf" as const,
        title: "Ethically Sourced",
        description: "We are committed to conflict-free diamonds and responsible sourcing throughout our supply chain.",
      },
      {
        icon: "Users" as const,
        title: "Master Artisans",
        description: "Our team of 50+ skilled craftspeople bring decades of experience to every piece they create.",
      },
      {
        icon: "Shield" as const,
        title: "Lifetime Guarantee",
        description: "Every purchase is backed by our comprehensive lifetime warranty and complimentary maintenance.",
      },
    ],
  },
  alankara: {
    collection: {
      title: "Alankara Collection",
      description:
        "Guided by tradition and perfected by expertise, our craftsmen bring every diamond to life with",
      cta: { label: "View Collection", to: "/jewellery" },
    },
    productIds: ["1", "3", "5", "6", "2"],
    product: {
      cta: { label: "Discover" },
    },
    gifting: {
      title: "For Your Valentine",
      description:
        "Honoring a lifetime of connection through rare, masterfully crafted jewelry designed for the moments that matter.",
      mobileDescription:
        "Traditional mastery bringing every diamond to radiant, eternal life.",
      cta: { label: "Shop Now", to: "/jewellery" },
    },
  },
  craftsmanship: {
    subtitle: "Our Process",
    title: "From Vision to Masterpiece",
    steps: [
      {
        number: "01",
        title: "Design",
        description: "Collaborate with our designers to sketch your perfect piece, tailored to your style and story.",
      },
      {
        number: "02",
        title: "Source",
        description: "We hand-select GIA-certified, conflict-free diamonds that meet our exacting standards.",
      },
      {
        number: "03",
        title: "Craft",
        description: "Master artisans bring the design to life using traditional techniques and modern precision.",
      },
      {
        number: "04",
        title: "Deliver",
        description: "Your finished piece arrives in luxury packaging with full certification and insurance.",
      },
    ],
  },
  transparency: {
    subtitle: "Trust & Transparency",
    title: "Your Confidence, Our Priority",
    items: [
      {
        icon: "RotateCcw" as const,
        title: "Free Returns",
        description: "30-day hassle-free returns on all orders",
      },
      {
        icon: "MessageCircle" as const,
        title: "Live Assistance",
        description: "Expert jewellery consultants available 7 days a week",
      },
      {
        icon: "Lock" as const,
        title: "Secure Payment",
        description: "Bank-grade encryption on every transaction",
      },
      {
        icon: "FileCheck" as const,
        title: "Full Certification",
        description: "GIA reports and authenticity certificates included",
      },
    ],
  },
  gifting: {
    subtitle: "The Art of Gifting",
    title: "Make Every Moment Shine",
    description:
      "From birthdays to anniversaries, our luxury gift packaging and personalisation options make each present unforgettable.",
    cta: { label: "Shop Gifts", to: "/jewellery" },
  },
  customJewellery: {
    subtitle: "Bespoke Service",
    title: "Design Your Own Masterpiece",
    description:
      "Work one-on-one with our designers to create a piece that is uniquely yours. From concept sketches to the finished jewel, we bring your vision to life.",
    cta: { label: "Start Your Design", to: "/bespoke-jewellery" },
  },
  brandStory: {
    subtitle: "Our Heritage",
    title: "Crafting Brilliance Since 1987",
    description:
      "For over 35 years, Sunny Diamonds has been transforming the world's finest diamonds into wearable works of art. Our atelier combines centuries-old techniques with contemporary design to create pieces that transcend time.",
    cta: { label: "Read Our Story", to: "/world-of-sunny" },
  },
  promise: {
    title: "THE SUNNY PROMISE",
    description:
      "Guided by heritage and perfected by pride every setting a masterpiece of expert precision.",
    cta: { label: "View Our Story", to: "/world-of-sunny" },
  },
} as const;

export const contactContent = {
  header: {
    subtitle: "Get in Touch",
    title: "Contact Us",
  },
  description:
    "Whether you're looking for the perfect piece or want to discuss a custom design, our team is here to help.",
} as const;

export const seoContent = {
  home: {
    title: "Sunny Diamonds — Premium Diamond Jewellery",
    description:
      "Handcrafted premium and custom diamond jewellery. Explore GIA-certified diamonds, bespoke designs, and timeless elegance.",
  },
  about: {
    title: "Our Story",
    description:
      "Discover Sunny Diamonds' legacy since 1997 — three generations of internally flawless diamonds, master craftsmanship, and timeless jewellery from Chalakkudy to the world.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with Sunny Diamonds for custom diamond jewellery designs, inquiries, and appointments.",
  },
  cart: {
    title: "Shopping Bag",
    description: "Review your selected diamond jewellery pieces before checkout.",
  },
  checkout: {
    title: "Checkout",
    description: "Complete your purchase of premium diamond jewellery from Sunny Diamonds.",
  },
  login: {
    title: "Sign In",
    description: "Sign in or create your Sunny Diamonds account with your mobile number.",
  },
  wishlist: {
    title: "Wishlist",
    description: "View and manage your saved diamond jewellery pieces.",
  },
  profile: {
    title: "My Profile",
    description: "Manage your Sunny Diamonds account, orders, addresses, and appointments.",
  },
  orderTracking: {
    title: "Order Tracking",
    description: "Track your Sunny Diamonds order status, shipment updates, and delivery details.",
  },
} as const;

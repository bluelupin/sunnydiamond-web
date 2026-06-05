export const homeSections = [
  { id: "alankara", label: "Alankara" },
  { id: "diamond-awaits", label: "Your Diamond" },
  { id: "categories", label: "Categories" },
  { id: "craftsmanship", label: "Craftsmanship" },
  { id: "promise", label: "Promise" },
  { id: "for-you", label: "For You" },
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
      cta: { label: "Explore Collection", to: "/products" },
    },
    productIds: ["1", "5", "2", "4"],
    product: {
      cta: { label: "Discover" },
    },
    gifting: {
      title: "Gifting For Your Valentine",
      cta: { label: "Shop Now", to: "/products" },
      secondary: { label: "Send a Gift Card Instead", to: "/contact" },
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
    cta: { label: "Shop Gifts", to: "/products" },
  },
  customJewellery: {
    subtitle: "Bespoke Service",
    title: "Design Your Own Masterpiece",
    description:
      "Work one-on-one with our designers to create a piece that is uniquely yours. From concept sketches to the finished jewel, we bring your vision to life.",
    cta: { label: "Start Your Design", to: "/contact" },
  },
  brandStory: {
    subtitle: "Our Heritage",
    title: "Crafting Brilliance Since 1987",
    description:
      "For over 35 years, Sunny Diamonds has been transforming the world's finest diamonds into wearable works of art. Our atelier combines centuries-old techniques with contemporary design to create pieces that transcend time.",
    cta: { label: "Read Our Story", to: "/about" },
  },
  forYouForever: {
    title: "For you, Forever",
    cards: [
      {
        image: "foryou-bespoke",
        title: "BESPOKE JEWELLERY",
        subtitle:
          "Designs thoughtfully crafted to bring your vision to life",
      },
      {
        image: "foryou-diamonds",
        title: "DIAMONDS FOR EVERYONE",
        subtitle:
          "Save monthly towards your timeless diamond",
      },
    ],
  },
 promise: {
    title: "THE SUNNY PROMISE",
    description:
      "Guided by heritage and perfected by pride every setting a masterpiece of expert precision.",
    cta: { label: "View Our Story", to: "/about" },
  },
} as const;

export const aboutContent = {
  header: {
    subtitle: "Our Story",
    title: "Crafting Brilliance Since 1987",
  },
  paragraphs: [
    "At Sunny Diamonds, we believe every diamond carries a universe of light within it. Founded in 1987 by master jeweller Antoine Delacroix, our atelier has been dedicated to transforming the world's finest diamonds into wearable works of art.",
    "Each piece in our collection is meticulously handcrafted by our team of skilled artisans, combining centuries-old techniques with contemporary design sensibilities. We source only conflict-free, GIA-certified diamonds, ensuring that every stone meets our exacting standards for cut, clarity, color, and carat.",
    "Our custom design service allows you to collaborate directly with our designers to create a piece that is uniquely yours. From engagement rings that capture your love story to heirloom pieces that will be treasured for generations, we bring your vision to life with unparalleled craftsmanship.",
  ],
  stats: [
    { value: "35+", label: "Years of Excellence" },
    { value: "10,000+", label: "Pieces Crafted" },
    { value: "50+", label: "Master Artisans" },
  ],
  closingParagraph:
    "We invite you to visit our flagship boutique or explore our online collection. Every purchase comes with complimentary shipping, a lifetime warranty, and the assurance that you are wearing something truly exceptional.",
} as const;

export const productsContent = {
  header: {
    subtitle: "Our Collection",
    title: "Diamond Jewellery",
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
  products: {
    title: "Diamond Jewellery Collection",
    description:
      "Browse our curated collection of rings, necklaces, earrings, and bracelets featuring GIA-certified diamonds.",
  },
  about: {
    title: "Our Story",
    description:
      "Learn about Sunny Diamonds' 35+ year legacy of crafting premium diamond jewellery with master artisans.",
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
} as const;

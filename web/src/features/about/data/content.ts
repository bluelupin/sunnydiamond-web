/** Exact measurements from Figma node 692:27408 — Hero — Scroll Collapse (State=1-Expanded) */
export const aboutHeroFigmaSpec = {
  section: {
    width: 1440,
    height: 640,
    background: "#FBFAF6",
  },
  image: {
    width: 1802,
    height: 1802,
    x: -181,
    y: -755,
    imageRef: "e95bffb6c59e47ebe9d8c64bda7f471821dfdd3c",
  },
  title: {
    text: "Our Story",
    x: 277,
    y: 512,
    width: 886,
    height: 53,
    fontFamily: "Larken",
    fontWeight: 300,
    fontSize: 48,
    lineHeight: 110,
    color: "#FFFFFF",
    textAlign: "center" as const,
  },
} as const;

export const aboutPageImages = {
  hero: "/images/about/hero.png",
  craftingDiamond: "/images/about/crafting-diamond.png",
  teamMember1: "/images/about/team-member-1-276bea.png",
  teamMember2: "/images/about/team-member-2.png",
  teamMember3: "/images/about/team-member-3.png",
  storyFounder: "/images/about/story-founder-61ad79.png",
  storyEvent: "/images/about/story-event-399795.png",
  storyAttending: "/images/about/story-attending-12c26b.png",
  handcraftedBg: "/images/about/handcrafted-bg.png",
  craftsmanship: "/images/about/craftsmanship-764d7a.png",
  store: "/images/about/store.png",
} as const;

export const aboutHeroContent = {
  title: aboutHeroFigmaSpec.title.text,
} as const;

export const aboutCraftingRarityContent = {
  heading: "Crafting rarity\ninto timeless brilliance",
  description:
    "We source Internally Flawless Diamonds from Belgium and craft them into timeless masterpieces, creating jewellery that resonates with you.",
} as const;

/** Figma node 692:27430 — Crafting Rarity — Reveal V2 */
export const aboutCraftingRarityFigmaSpec = {
  container: { width: 817, height: 745 },
  heading: {
    fontSize: 90,
    lineHeight: 110,
    offsetY: 20,
    height: 198,
  },
  image: {
    width: 354,
    height: 354,
    offsetY: 222,
    gapAfterHeading: 4,
  },
  line: {
    width: 1,
    height: 79,
    offsetY: 599,
    gapAfterImage: 23,
    gradientFrom: "#722257",
    gradientTo: "#DDA957",
  },
  body: {
    width: 523,
    offsetY: 691,
    gapAfterLine: 13,
    fontSize: 20,
    lineHeight: 110,
    color: "#0A0A0A",
  },
} as const;

export const aboutSince1997Content = {
  title: "Since 1997",
  story:
    "The story dates back to 3 generations where Sunny Diamonds has exemplified the singular refinement of rare, original, exclusive jewellery. The flag continued to fly high and proud primarily because we the fine craftsmanship, goodwill and love.",
  gallery: [
    {
      image: aboutPageImages.storyFounder,
      alt: "Mr. P.P. Sunny with his sons",
      caption: "Mr. P.P. Sunny with his sons",
      width: 549,
      height: 600,
    },
    {
      image: aboutPageImages.storyEvent,
      alt: "At an event hosted by Webandcrafts",
      caption: "At an event hosted by Webandcrafts",
      width: 320,
      height: 417,
    },
    {
      image: aboutPageImages.storyAttending,
      alt: "P.P. Sunny attending",
      caption: "P.P. Sunny attending",
      width: 463,
      height: 600,
    },
  ],
} as const;

export const aboutFacesContent = {
  title: "Faces Behind the Brilliance",
  description:
    "We source Internally Flawless Diamonds from Belgium and craft them into timeless masterpieces, creating jewellery that resonates with you.",
  members: [
    {
      image: aboutPageImages.teamMember1,
      alt: "Sunny Diamonds team member",
      name: "P.P. Sunny",
      role: "Founder",
      width: 478,
      height: 600,
    },
    {
      image: aboutPageImages.teamMember2,
      alt: "Sunny Diamonds team member",
      name: "Suresh Kumar",
      role: "Managing Director",
      width: 478,
      height: 600,
    },
    {
      image: aboutPageImages.teamMember3,
      alt: "Sunny Diamonds team member",
      name: "Arjun Nair",
      role: "Creative Director",
      width: 478,
      height: 600,
    },
  ],
} as const;

export const aboutHandcraftedContent = {
  title: "Handcrafted Brilliance",
  cards: [
    {
      title: "Pinnacle of Craftsmanship and Artistry",
    },
    {
      title: "Highest Level of Quality Checks",
    },
    {
      title: "Ethically Sourced, conflict free diamonds",
    },
  ],
} as const;

export const aboutTimelineYears = [
  "1997",
  "2006",
  "2008",
  "2010",
  "2012",
  "2016",
  "2022",
  "2025",
] as const;

export const aboutTimelineContent = {
  defaultYear: "2008",
  milestones: {
    "2008": {
      title: "Found in Chalakkudy",
      description:
        "We source and transform the rarest Internally Flawless diamonds into timeless masterpieces, crafted with uncompromising precision for those for those who seek the truly exceptional.",
    },
  },
} as const;

export const aboutHeirloomContent = {
  quote: "Crafting family heirlooms at the pinnacle of diamond clarity",
} as const;

export const aboutGuarantees = [
  { label: "Eternally Flawless Diamonds", icon: "diamond" },
  { label: "100% Moneyback Guarantee", icon: "moneyback" },
  { label: "BIS Halmark for Jewellery", icon: "hallmark" },
  { label: "15 Days Return Policy", icon: "return" },
  { label: "Cash on Delivery", icon: "cod" },
] as const;

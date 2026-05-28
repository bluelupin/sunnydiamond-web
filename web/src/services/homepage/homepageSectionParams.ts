export const homepagePopulateParams = {
  hero: {
    populate: {
      hero: {
        populate: {
          image: { populate: "*" },
        },
      },
    },
  },
  trustBadges: {
    populate: "trustBadges",
  },
  categoryNavigation: {
    populate: "categoryNavigation",
  },
  diamondSourcingSection: {
    populate: "diamondSourcingSection",
  },
  featuredCollectionSection: {
    populate: "featuredCollectionSection",
  },
  giftingBanner: {
    populate: "giftingBanner",
  },
  featuredProductsSection: {
    populate: "featuredProductsSection",
  },
  occasionsTeaser: {
    populate: "occasionsTeaser",
  },
  craftsmanshipSteps: {
    populate: "craftsmanshipSteps",
  },
  sunnyPromiseSection: {
    populate: "sunnyPromiseSection",
  },
  bespokeForYouCards: {
    populate: "bespokeForYouCards",
  },
  showroomTeaser: {
    populate: "showroomTeaser",
  },
  seo: {
    populate: "seo",
  },
} as const;


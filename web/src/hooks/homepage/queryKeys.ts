export const homepageQueryKeys = {
  hero: "homepage:hero",
  trustBadges: "homepage:trustBadges",
  categoryNavigation: "homepage:categoryNavigation",
  diamondSourcing: "homepage:diamondSourcingSection",
  featuredCollection: "homepage:featuredCollectionSection",
  giftingBanner: "homepage:giftingBanner",
  featuredProducts: "homepage:featuredProductsSection",
  occasionsTeaser: "homepage:occasionsTeaser",
  craftsmanshipSteps: "homepage:craftsmanshipSteps",
  sunnyPromise: "homepage:sunnyPromiseSection",
  bespokeCards: "homepage:bespokeForYouCards",
  showroomTeaser: "homepage:showroomTeaser",
  seo: "homepage:seo",
} as const;

export type HomepageQueryKey = (typeof homepageQueryKeys)[keyof typeof homepageQueryKeys];

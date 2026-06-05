export const homepageQueryKeys = {
  categoryNavigation: "homepage:categoryNavigation",
  showroomTeaser: "homepage:showroomTeaser",
  homepageShell: "homepage:homepageShell",
  homePageShoppingBlocks: "homepage:homePageShoppingBlocks",
  homePageEditorialBlocks: "homepage:homePageEditorialBlocks",
  homePageOccasions: "homepage:homePageOccasions",
} as const;

export type HomepageQueryKey = (typeof homepageQueryKeys)[keyof typeof homepageQueryKeys];

export const magentoQueryKeys = {
  jewelleryNav: "magento:jewelleryNav",
  craftingRarityCategories: "magento:craftingRarityCategories",
  trendingProducts: "magento:trendingProducts",
} as const;

export type MagentoQueryKey = (typeof magentoQueryKeys)[keyof typeof magentoQueryKeys];

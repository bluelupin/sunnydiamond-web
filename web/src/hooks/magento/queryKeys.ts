export const magentoQueryKeys = {
  jewelleryNav: "magento:jewelleryNav",
  trendingProducts: "magento:trendingProducts",
} as const;

export type MagentoQueryKey = (typeof magentoQueryKeys)[keyof typeof magentoQueryKeys];

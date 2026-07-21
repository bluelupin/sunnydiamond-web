export const magentoQueryKeys = {
  jewelleryNav: "magento:jewelleryNav",
} as const;

export type MagentoQueryKey = (typeof magentoQueryKeys)[keyof typeof magentoQueryKeys];

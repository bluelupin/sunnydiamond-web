export type MetalColorOption = {
  id: string;
  label: string;
  color: string;
};

export type ProductDetailAccordion = {
  id: string;
  title: string;
  content: string;
};

export type ProductDetailContent = {
  attributes: string[];
  metalColors: MetalColorOption[];
  accordions: ProductDetailAccordion[];
  heroBannerImage: string;
  heroBannerVideo?: string;
};

import type { ProductPriceBreakupComponents } from "@/services/magento/products/productPriceBreakup.utils";

export type ProductDetailPricing = {
  price: number;
  originalPrice?: number;
  breakup?: ProductPriceBreakupComponents;
};

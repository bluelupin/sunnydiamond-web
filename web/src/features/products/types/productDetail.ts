import type { StaticImageData } from "next/image";

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
  ringSizes: string[];
  engravingPreviewImage: string | StaticImageData;
  benefits: {
    label: string;
    mobileLabel: string;
    lines: [string, string];
    icon: string;
  }[];
  accordions: ProductDetailAccordion[];
  heroBannerImage: string;
  heroBannerVideo?: string;
  visitUsImage: string;
  personaliseImage: string;
};

export type ProductDetailPricing = {
  price: number;
  originalPrice: number;
};

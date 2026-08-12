import productRing from "@/assets/product-ring.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import type { StaticImageData } from "next/image";
import type { ProductSeo } from "@/shared/lib/seo/productSeo";
import type { ProductEngravingConfig } from "@/features/products/constants/engraving";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import type { ProductPriceBreakupComponents } from "@/services/magento/products/productPriceBreakup.utils";
import { buildProductSeo } from "@/shared/lib/seo/productSeo";
import {
  PRODUCT_DETAIL_GALLERY_HERO_IMAGE,
  PRODUCT_DETAIL_GALLERY_LIFESTYLE_IMAGE,
  PRODUCT_DETAIL_GALLERY_SECOND_IMAGE,
  PRODUCT_DETAIL_GALLERY_THIRD_IMAGE,
} from "@/features/products/data/productGalleryContent";

export type ProductConfigurableOptionValue = {
  /** Normalized id used by PDP swatches (e.g. rose-gold). */
  id: string;
  label: string;
  /** Magento configurable option value UID for addProductsToCart.selected_options. */
  uid: string;
  /** Magento Visual Swatch hex (ColorSwatchData.value), when configured in Admin. */
  swatchColor?: string;
};

export type ProductConfigurableOption = {
  attributeCode: string;
  label: string;
  values: ProductConfigurableOptionValue[];
};

export type ProductConfigurableVariant = {
  sku: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  inStock: boolean;
  /** attribute_code → option label (e.g. sd_metal_color → rose-gold). */
  attributes: Record<string, string>;
  /** Configurable value UIDs required when adding the parent SKU to cart. */
  optionUids: string[];
  priceBreakup?: ProductPriceBreakupComponents;
};

export type ProductConfigurable = {
  options: ProductConfigurableOption[];
  variants: ProductConfigurableVariant[];
};

export interface Product {
  id: string;
  urlKey: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  /** Magento jewellery category `url_key` (e.g. diamond-rings). */
  categoryUrlKey?: string;
  /** App jewellery slug (e.g. rings) — used to match Strapi size-guide `name`. */
  categorySlug?: string;
  image: string | StaticImageData;
  images: Array<string | StaticImageData>;
  lifestyleImage?: string | StaticImageData;
  cardVariant?: "lifestyle";
  carat: string;
  metal: string;
  /** Magento `sd_metal_color` slug (e.g. rose-gold). */
  metalColorValue?: string;
  inStock: boolean;
  featured: boolean;
  bestseller?: boolean;
  rating: number;
  reviews: number;
  detailAttributes?: string[];
  engraving?: ProductEngravingConfig;
  customOptions?: ProductCustomOptions;
  /** Present when Magento product is ConfigurableProduct (e.g. gold color variants). */
  configurable?: ProductConfigurable;
  /** Magento component prices for the Price Breakup panel. */
  priceBreakup?: ProductPriceBreakupComponents;
  productVideoUrl?: string;
  /**
   * PDP accordion copy from Magento product attributes:
   * product_specification, quality_certificate, shipping_policies,
   * care_maintenance, manufactured_by.
   */
  detailSections?: {
    specifications?: string;
    qualityCertifications?: string;
    shippingPolicies?: string;
    careMaintenance?: string;
    manufacturedBy?: string;
  };
  seo: ProductSeo;
}

function withProductSeo(product: Omit<Product, "seo">): Product {
  return {
    ...product,
    seo: buildProductSeo({
      name: product.name,
      urlKey: product.urlKey,
      shortDescription: product.shortDescription,
    }),
  };
}

export const products: Product[] = [
  withProductSeo({
    id: "1",
    urlKey: "celestial-solitaire-ring",
    name: "Celestial Solitaire Ring",
    price: 4500,
    originalPrice: 5200,
    description: "A breathtaking solitaire ring featuring a 1.5-carat round brilliant diamond set in 18K rose gold. The delicate pavé band adds subtle sparkle, making this piece perfect for engagements or milestone celebrations.",
    shortDescription: "1.5ct round brilliant diamond in 18K rose gold",
    category: "Rings",
    image: productRing,
    images: [
      PRODUCT_DETAIL_GALLERY_HERO_IMAGE,
      PRODUCT_DETAIL_GALLERY_SECOND_IMAGE,
      PRODUCT_DETAIL_GALLERY_THIRD_IMAGE,
    ],
    lifestyleImage: PRODUCT_DETAIL_GALLERY_LIFESTYLE_IMAGE,
    carat: "1.5 ct",
    metal: "18K Rose Gold",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 127,
  }),
  withProductSeo({
    id: "2",
    urlKey: "lumiere-pendant-necklace",
    name: "Lumière Pendant Necklace",
    price: 3200,
    description: "An elegant pendant necklace showcasing a stunning round diamond suspended from a delicate rose gold chain. The minimalist design lets the diamond's brilliance take center stage.",
    shortDescription: "Round diamond pendant on rose gold chain",
    category: "Necklaces",
    image: productNecklace,
    images: [productNecklace, productNecklace, productNecklace],
    carat: "1.0 ct",
    metal: "18K Rose Gold",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 89,
  }),
  withProductSeo({
    id: "3",
    urlKey: "etoile-diamond-studs",
    name: "Étoile Diamond Studs",
    price: 2800,
    description: "Classic diamond stud earrings featuring matched round brilliant diamonds in a four-prong setting. These timeless studs are the perfect everyday luxury accessory.",
    shortDescription: "Matched round brilliant diamond studs",
    category: "Earrings",
    image: productEarrings,
    images: [productEarrings, productEarrings, productEarrings],
    carat: "1.0 ct TW",
    metal: "18K White Gold",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 203,
  }),
  withProductSeo({
    id: "4",
    urlKey: "riviere-tennis-bracelet",
    name: "Rivière Tennis Bracelet",
    price: 8500,
    description: "A stunning tennis bracelet featuring a continuous line of graduated round brilliant diamonds set in rose gold. Each diamond is hand-selected for exceptional brilliance and fire.",
    shortDescription: "Graduated diamond tennis bracelet",
    category: "Bracelets",
    image: productBracelet,
    images: [productBracelet, productBracelet, productBracelet],
    carat: "5.0 ct TW",
    metal: "18K Rose Gold",
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 56,
  }),
  withProductSeo({
    id: "5",
    urlKey: "aurora-halo-ring",
    name: "Aurora Halo Ring",
    price: 6200,
    description: "A magnificent halo engagement ring featuring a 2-carat cushion-cut center diamond surrounded by a delicate halo of smaller diamonds set in platinum.",
    shortDescription: "2ct cushion-cut with diamond halo",
    category: "Rings",
    image: productRing,
    images: [productRing, productRing, productRing],
    carat: "2.0 ct",
    metal: "Platinum",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 74,
  }),
  withProductSeo({
    id: "6",
    urlKey: "cascade-drop-earrings",
    name: "Cascade Drop Earrings",
    price: 5100,
    description: "Exquisite drop earrings featuring cascading diamonds that catch the light with every movement. Set in 18K white gold for a cool, contemporary feel.",
    shortDescription: "Diamond cascade drops in white gold",
    category: "Earrings",
    image: productEarrings,
    images: [productEarrings, productEarrings, productEarrings],
    carat: "2.5 ct TW",
    metal: "18K White Gold",
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 45,
  }),
];

export function getProductByUrlKey(urlKey: string): Product | undefined {
  return products.find((product) => product.urlKey === urlKey || product.id === urlKey);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id || product.urlKey === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

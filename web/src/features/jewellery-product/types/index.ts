import type { StaticImageData } from "next/image";

export type JewelleryCategorySlug =
  | "all"
  | "rings"
  | "earrings"
  | "necklace"
  | "pendants"
  | "bracelets"
  | "bangles"
  | "nosepins";

export interface JewelleryCategory {
  slug: JewelleryCategorySlug;
  label: string;
  /** Magento category url_key; null for the "All" tab. */
  urlKey: string | null;
}

export interface JewelleryFilterState {
  minPrice: number;
  maxPrice: number;
  categories: string[];
  metalTypes: string[];
  metalPurities: string[];
  gemstoneType: string;
  /** Magento `sd_occasions` option value (e.g. "46"). */
  occasion: string;
  /** Magento `sd_diamond_shape` option value (e.g. "66"). */
  diamondShape: string;
  /** Magento `sd_fancy_colour` option value (e.g. "71"). */
  fancyColour: string;
}

export interface JewellerySortOption {
  value: string;
  label: string;
}

export interface JewelleryListingProduct {
  id: string;
  sku: string;
  urlKey: string;
  name: string;
  price: number;
  primaryImage: string | StaticImageData;
  /** Model / lifestyle image — mobile swipe & desktop hover (`model_wear_image`, else l_/t_ gallery). */
  modalImage?: string | StaticImageData;
  hoverImage?: string | StaticImageData;
  category: string;
  metalType?: string;
  metalPurity?: string;
  gemstoneType?: string;
  isBestseller?: boolean;
}

export interface ProductCardProps {
  title: string;
  category: string;
  price: number;
  primaryImage: string | StaticImageData;
  hoverImage: string | StaticImageData;
  href: string;
  isBestseller?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

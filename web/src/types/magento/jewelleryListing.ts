import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export type JewelleryFilterFacetOption = {
  label: string;
  value: string;
  count?: number;
  /** Hex swatch for PLP metal color variant chips (from Magento or PDP fallbacks). */
  swatchColor?: string;
};

export type JewelleryMetalTypeFilterAttribute = "sd_metal_color" | "sd_metal_type";

/** Magento `price` aggregation buckets (gift-finder / experimental consumers). */
export type JewelleryPriceBucket = {
  min: number;
  max: number;
  label: string;
};

export type JewelleryFilterFacets = {
  minPrice: number;
  maxPrice: number;
  /** Discrete Magento price aggregation bands when available. */
  priceBuckets: JewelleryPriceBucket[];
  categories: JewelleryFilterFacetOption[];
  metalTypes: JewelleryFilterFacetOption[];
  /** Magento attribute used for drawer metal type / color filtering. */
  metalTypeAttributeCode: JewelleryMetalTypeFilterAttribute;
  metalPurities: JewelleryFilterFacetOption[];
  gemstoneTypes: JewelleryFilterFacetOption[];
  occasions: JewelleryFilterFacetOption[];
  diamondShapes: JewelleryFilterFacetOption[];
  fancyColours: JewelleryFilterFacetOption[];
  collections: JewelleryFilterFacetOption[];
};

export type JewelleryListingProductsData = {
  products: JewelleryListingProduct[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  facets: JewelleryFilterFacets;
  /** Overflow from the initial multi-page fetch, shown on subsequent load-more clicks. */
  pendingProducts?: JewelleryListingProduct[];
};

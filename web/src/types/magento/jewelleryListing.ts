import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export type JewelleryFilterFacetOption = {
  label: string;
  value: string;
  count?: number;
};

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
  metalPurities: JewelleryFilterFacetOption[];
  gemstoneTypes: JewelleryFilterFacetOption[];
  occasions: JewelleryFilterFacetOption[];
  diamondShapes: JewelleryFilterFacetOption[];
  fancyColours: JewelleryFilterFacetOption[];
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

import type { JewelleryListingProduct } from "@/features/jewellery-product/types";

export type JewelleryFilterFacetOption = {
  label: string;
  value: string;
  count?: number;
};

export type JewelleryFilterFacets = {
  minPrice: number;
  maxPrice: number;
  categories: JewelleryFilterFacetOption[];
  metalTypes: JewelleryFilterFacetOption[];
  metalPurities: JewelleryFilterFacetOption[];
  gemstoneTypes: JewelleryFilterFacetOption[];
  occasions: JewelleryFilterFacetOption[];
};

export type JewelleryListingProductsData = {
  products: JewelleryListingProduct[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  facets: JewelleryFilterFacets;
};

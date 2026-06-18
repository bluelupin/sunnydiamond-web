import type { JewelleryFilterState, JewellerySortOption } from "../types";

export const DEFAULT_MIN_PRICE = 9880;
export const DEFAULT_MAX_PRICE = 200000;
export const PAGE_SIZE = 9;

export const filterCategoryOptions = [
  "Bangles",
  "Necklaces",
  "Rings",
  "Pendants",
  "Nose Pins",
  "Earrings",
];

export const filterMetalTypeOptions = ["Silver", "Gold"];
export const filterMetalPurityOptions = ["18k", "22k"];

export const sortOptions: JewellerySortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export const defaultFilterState: JewelleryFilterState = {
  minPrice: DEFAULT_MIN_PRICE,
  maxPrice: DEFAULT_MAX_PRICE,
  categories: [],
  metalTypes: [],
  metalPurities: [],
};

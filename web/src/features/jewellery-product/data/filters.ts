import type { JewelleryFilterState, JewellerySortOption } from "../types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";

export const PAGE_SIZE = 9;

/** Not wired to Magento — UI only until catalog supports metal type filtering. */
export const filterMetalTypeOptions = ["Silver", "Gold"];

/** Not wired to Magento — UI only until catalog gemstone data is normalized. */
export const filterGemstoneOptions = [
  { value: "", label: "Select" },
  { value: "diamond", label: "Diamond" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "sapphire", label: "Sapphire" },
  { value: "pearl", label: "Pearl" },
] as const;

export const sortOptions: JewellerySortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function getAvailableCategoryLabels(facets: JewelleryFilterFacets): string[] {
  return facets.categories.filter((category) => category.value).map((category) => category.label);
}

export function getAvailableMetalPurityLabels(facets: JewelleryFilterFacets): string[] {
  return facets.metalPurities.map((purity) => purity.label);
}

export function hasMagentoFilterFacets(facets: JewelleryFilterFacets): boolean {
  return (
    facets.maxPrice > facets.minPrice ||
    getAvailableCategoryLabels(facets).length > 0 ||
    facets.metalPurities.length > 0
  );
}

export function createEmptyFilterState(): JewelleryFilterState {
  return {
    minPrice: 0,
    maxPrice: 0,
    categories: [],
    metalTypes: [...filterMetalTypeOptions],
    metalPurities: [],
    gemstoneType: "",
  };
}

export function createDefaultFilterState(facets: JewelleryFilterFacets): JewelleryFilterState {
  return {
    minPrice: facets.minPrice,
    maxPrice: facets.maxPrice,
    categories: getAvailableCategoryLabels(facets),
    metalTypes: [...filterMetalTypeOptions],
    metalPurities: getAvailableMetalPurityLabels(facets),
    gemstoneType: "",
  };
}

export function isAllCategoriesSelected(
  categories: string[],
  facets: JewelleryFilterFacets,
): boolean {
  const available = getAvailableCategoryLabels(facets);
  if (available.length === 0) {
    return true;
  }

  return categories.length === 0 || categories.length >= available.length;
}

export function isAllMetalTypesSelected(metalTypes: string[]): boolean {
  return metalTypes.length === 0 || metalTypes.length >= filterMetalTypeOptions.length;
}

export function isAllMetalPuritiesSelected(
  metalPurities: string[],
  facets: JewelleryFilterFacets,
): boolean {
  const available = getAvailableMetalPurityLabels(facets);
  if (available.length === 0) {
    return true;
  }

  return metalPurities.length === 0 || metalPurities.length >= available.length;
}

export function isDefaultPriceRange(
  filters: JewelleryFilterState,
  facets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
): boolean {
  if (facets.maxPrice <= facets.minPrice) {
    return true;
  }

  return filters.minPrice <= facets.minPrice && filters.maxPrice >= facets.maxPrice;
}

export function chunkFilterOptions<T>(items: T[], chunkSize: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    rows.push(items.slice(index, index + chunkSize));
  }

  return rows;
}

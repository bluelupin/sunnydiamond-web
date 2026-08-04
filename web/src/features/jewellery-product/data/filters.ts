import type { JewelleryFilterState, JewellerySortOption } from "../types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";

export const PAGE_SIZE = 9;
/** Products shown on first PLP paint; fetched via multiple Magento pages at {@link PAGE_SIZE}. */
export const INITIAL_PLP_PRODUCT_COUNT = 30;
export const INITIAL_PLP_PAGE_COUNT = Math.ceil(INITIAL_PLP_PRODUCT_COUNT / PAGE_SIZE);

export const DEFAULT_JEWELLERY_LISTING_SORT = "featured";

export const sortOptions: JewellerySortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function getAvailableCategoryLabels(facets: JewelleryFilterFacets): string[] {
  return facets.categories.filter((category) => category.value).map((category) => category.label);
}

export function getAvailableMetalTypeLabels(facets: JewelleryFilterFacets): string[] {
  return facets.metalTypes.map((metalType) => metalType.label);
}

export function getAvailableMetalPurityLabels(facets: JewelleryFilterFacets): string[] {
  return facets.metalPurities.map((purity) => purity.label);
}

export function getAvailableGemstoneTypeLabels(facets: JewelleryFilterFacets): string[] {
  return facets.gemstoneTypes.map((gemstoneType) => gemstoneType.label);
}

export function hasMagentoFilterFacets(facets: JewelleryFilterFacets): boolean {
  return (
    facets.maxPrice > facets.minPrice ||
    getAvailableCategoryLabels(facets).length > 0 ||
    facets.metalTypes.length > 0 ||
    facets.metalPurities.length > 0 ||
    facets.gemstoneTypes.length > 0 ||
    facets.occasions.length > 0 ||
    facets.diamondShapes.length > 0 ||
    facets.fancyColours.length > 0
  );
}

export function createEmptyFilterState(): JewelleryFilterState {
  return {
    minPrice: 0,
    maxPrice: 0,
    categories: [],
    metalTypes: [],
    metalPurities: [],
    gemstoneType: "",
    occasion: "",
    diamondShape: "",
    fancyColour: "",
  };
}

export function createDefaultFilterState(facets: JewelleryFilterFacets): JewelleryFilterState {
  return {
    minPrice: facets.minPrice,
    maxPrice: facets.maxPrice,
    categories: [],
    metalTypes: [],
    metalPurities: [],
    gemstoneType: "",
    occasion: "",
    diamondShape: "",
    fancyColour: "",
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

export function isAllMetalTypesSelected(
  metalTypes: string[],
  facets: JewelleryFilterFacets,
): boolean {
  const available = getAvailableMetalTypeLabels(facets);
  if (available.length === 0) {
    return true;
  }

  return metalTypes.length === 0 || metalTypes.length >= available.length;
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

  // createEmptyFilterState() uses 0/0 until the user applies a price range.
  if (filters.minPrice === 0 && filters.maxPrice === 0) {
    return true;
  }

  return filters.minPrice <= facets.minPrice && filters.maxPrice >= facets.maxPrice;
}

/** Stable key for listing refetch — treats default / empty price ranges as equivalent. */
export function getJewelleryListingFiltersKey(
  filters: JewelleryFilterState,
  facets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
): string {
  const normalized =
    isDefaultPriceRange(filters, facets)
      ? { ...filters, minPrice: 0, maxPrice: 0 }
      : filters;

  return JSON.stringify(normalized);
}

export function hasFilterChanges(
  next: JewelleryFilterState,
  current: JewelleryFilterState,
  facets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
): boolean {
  return getJewelleryListingFiltersKey(next, facets) !== getJewelleryListingFiltersKey(current, facets);
}

export function hasActiveFilters(
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
): boolean {
  if (!isDefaultPriceRange(filters, facets)) {
    return true;
  }

  if (!isAllCategoriesSelected(filters.categories, facets)) {
    return true;
  }

  if (!isAllMetalTypesSelected(filters.metalTypes, facets)) {
    return true;
  }

  if (!isAllMetalPuritiesSelected(filters.metalPurities, facets)) {
    return true;
  }

  return (
    filters.gemstoneType.trim().length > 0 ||
    filters.occasion.trim().length > 0 ||
    filters.diamondShape.trim().length > 0 ||
    filters.fancyColour.trim().length > 0
  );
}

export function parseJewelleryPriceInput(value: string, fallback: number): number {
  const trimmed = value.replace(/,/g, "").trim();

  if (!trimmed) {
    return fallback;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.round(parsed));
}

/** Keeps min/max within facet bounds and ensures max is never below min. */
export function normalizeJewelleryPriceRange(
  minPrice: number,
  maxPrice: number,
  facets: Pick<JewelleryFilterFacets, "minPrice" | "maxPrice">,
): { minPrice: number; maxPrice: number } {
  const facetMin = facets.minPrice;
  const facetMax = facets.maxPrice;

  if (facetMax <= facetMin) {
    return { minPrice: facetMin, maxPrice: facetMax };
  }

  const nextMin = Math.min(Math.max(minPrice, facetMin), facetMax);
  const nextMax = Math.min(Math.max(maxPrice, facetMin), facetMax);

  return {
    minPrice: nextMin,
    maxPrice: Math.max(nextMax, nextMin),
  };
}

export function chunkFilterOptions<T>(items: T[], chunkSize: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    rows.push(items.slice(index, index + chunkSize));
  }

  return rows;
}

import type { JewelleryFilterState, JewelleryListingProduct } from "../types";
import { categorySlugToProductCategory } from "../data/categories";
import type { JewelleryCategorySlug } from "../types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import {
  isAllCategoriesSelected,
  isAllMetalPuritiesSelected,
  isAllMetalTypesSelected,
} from "../data/filters";

export function filterJewelleryProducts(
  products: JewelleryListingProduct[],
  activeCategory: JewelleryCategorySlug,
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
): JewelleryListingProduct[] {
  return products.filter((product) => {
    if (activeCategory !== "all") {
      const mappedCategory = categorySlugToProductCategory[activeCategory];
      if (mappedCategory && product.category !== mappedCategory) {
        return false;
      }
    }

    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    if (
      !isAllCategoriesSelected(filters.categories, facets) &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    if (!isAllMetalTypesSelected(filters.metalTypes, facets)) {
      const metal = product.metalType?.toLowerCase() ?? "";
      const matchesMetal = filters.metalTypes.some((type) => metal.includes(type.toLowerCase()));
      if (!matchesMetal) {
        return false;
      }
    }

    if (!isAllMetalPuritiesSelected(filters.metalPurities, facets)) {
      const metal = product.metalPurity?.toLowerCase() ?? "";
      const matchesPurity = filters.metalPurities.some((purity) => metal.includes(purity.toLowerCase()));
      if (!matchesPurity) {
        return false;
      }
    }

    if (filters.gemstoneType) {
      const gemstone = product.gemstoneType?.toLowerCase() ?? "";
      if (gemstone !== filters.gemstoneType.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}

export function sortJewelleryProducts(
  products: JewelleryListingProduct[],
  sortValue: string,
): JewelleryListingProduct[] {
  const sorted = [...products];

  switch (sortValue) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

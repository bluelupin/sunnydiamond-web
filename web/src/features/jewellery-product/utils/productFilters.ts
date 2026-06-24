import type { JewelleryFilterState, JewelleryListingProduct } from "../types";
import { categorySlugToProductCategory } from "../data/categories";
import type { JewelleryCategorySlug } from "../types";

export function filterJewelleryProducts(
  products: JewelleryListingProduct[],
  activeCategory: JewelleryCategorySlug,
  filters: JewelleryFilterState,
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

    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
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

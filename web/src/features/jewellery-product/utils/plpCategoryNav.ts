import type { JewelleryCategory, JewelleryCategorySlug } from "../types";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";
import { categoryIconSrc } from "../data/categoryIcons";

const PLP_NAV_SLUGS = new Set(Object.keys(categoryIconSrc) as JewelleryCategorySlug[]);

/** Magento jewellery categories for PLP tab nav — "All" first, labels from API, icons resolved on the client. */
export function mapMagentoCategoriesToPlpNav(categories: JewelleryNavCategory[]): JewelleryCategory[] {
  const allItem = categories.find((category) => category.slug === "all");
  const rest = categories
    .filter(
      (category): category is JewelleryNavCategory & { slug: JewelleryCategorySlug } =>
        category.slug != null &&
        category.slug !== "all" &&
        PLP_NAV_SLUGS.has(category.slug),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));

  const items: JewelleryCategory[] = [];

  if (allItem) {
    items.push({ slug: "all", label: "All", urlKey: null });
  }

  for (const category of rest) {
    items.push({
      slug: category.slug,
      label: category.label,
      urlKey: category.urlKey,
    });
  }

  return items;
}

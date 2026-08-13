import type { JewelleryCategory, JewelleryCategorySlug, JewelleryFilterState } from "../types";
import type { JewelleryFilterFacets } from "@/types/magento/jewelleryListing";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";
import { isAllCategoriesSelected } from "../data/filters";
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

/** When the filter drawer narrows to one PLP category, return its nav slug for tab highlighting. */
export function resolveActiveCategorySlugFromFilters(
  filters: JewelleryFilterState,
  facets: JewelleryFilterFacets,
  navCategories: JewelleryNavCategory[],
): JewelleryCategorySlug | null {
  if (isAllCategoriesSelected(filters.categories, facets)) {
    return null;
  }

  const selectedLabels = filters.categories;
  if (selectedLabels.length === 0) {
    return null;
  }

  const facetByLabel = new Map(
    facets.categories
      .filter((category) => category.label && category.value)
      .map((category) => [category.label, category]),
  );
  const navById = new Map(navCategories.map((category) => [category.id, category]));
  const navByLabel = new Map(
    navCategories
      .filter((category) => category.slug && category.slug !== "all")
      .map((category) => [category.label.trim().toLowerCase(), category]),
  );

  const resolvedSlugs: JewelleryCategorySlug[] = [];

  for (const label of selectedLabels) {
    const facet = facetByLabel.get(label);

    if (facet?.value) {
      const navMatch = navById.get(facet.value);
      if (navMatch?.slug && navMatch.slug !== "all") {
        resolvedSlugs.push(navMatch.slug);
        continue;
      }
    }

    const navLabelMatch = navByLabel.get(label.trim().toLowerCase());
    if (navLabelMatch?.slug) {
      resolvedSlugs.push(navLabelMatch.slug);
    }
  }

  if (resolvedSlugs.length === 1) {
    return resolvedSlugs[0];
  }

  return "all";
}

/**
 * When the all-jewellery drawer selects exactly one main PLP category,
 * return its Magento url_key so apply can navigate like the category tabs.
 */
export function resolveMainCategoryUrlKeyFromDrawerSelection(
  selectedLabels: readonly string[],
  facets: JewelleryFilterFacets,
  navCategories: JewelleryNavCategory[],
): string | null {
  if (selectedLabels.length !== 1) {
    return null;
  }

  const label = selectedLabels[0]?.trim();
  if (!label) {
    return null;
  }

  const facet = facets.categories.find((category) => category.label === label);
  const navById = new Map(navCategories.map((category) => [category.id, category]));
  const nav =
    (facet?.value ? navById.get(facet.value) : undefined) ??
    navCategories.find(
      (category) =>
        Boolean(category.slug) &&
        category.slug !== "all" &&
        category.label.trim().toLowerCase() === label.toLowerCase(),
    );

  if (!nav?.urlKey || !nav.slug || nav.slug === "all") {
    return null;
  }

  return nav.urlKey;
}

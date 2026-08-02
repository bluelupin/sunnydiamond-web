import type { JewelleryCategorySlug } from "@/features/jewellery-product/types";

export type JewelleryNavCategory = {
  id: string;
  label: string;
  href: string;
  image: string | null;
  /** Magento category url_key; null for synthetic items (e.g. All Products). */
  urlKey: string | null;
  /** Magento numeric category id for product filtering; null when unknown. */
  categoryId: string | null;
  /** PLP slug when mapped from Magento url_key; null for unmapped categories. */
  slug: JewelleryCategorySlug | null;
  productCount: number;
  sortOrder: number;
};

export type JewelleryNavCategoriesData = {
  categories: JewelleryNavCategory[];
};

import { buildJewelleryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import type { JewelleryCategorySlug } from "@/features/jewellery-product/types";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";
import type { MagentoCategoryNode } from "./magentoCategory.types";

const MAGENTO_URL_KEY_TO_SLUG: Record<string, JewelleryCategorySlug> = {
  "diamond-bangles": "bangles",
  "diamond-necklaces": "necklace",
  "diamond-rings": "rings",
  "diamond-pendants": "pendants",
  "diamond-nose-pins": "nosepins",
  "diamond-earrings": "earrings",
  "diamond-bracelets": "bracelets",
};

const MAGENTO_URL_KEY_SORT_ORDER: Record<string, number> = {
  "diamond-bangles": 0,
  "diamond-necklaces": 1,
  "diamond-rings": 2,
  "diamond-pendants": 3,
  "diamond-nose-pins": 4,
  "diamond-earrings": 5,
  "diamond-bracelets": 6,
  accessories: 7,
  "loose-solitaires": 8,
};

function resolveCategoryHref(slug: JewelleryCategorySlug | null, urlPath?: string | null): string {
  if (slug) {
    return buildJewelleryHref(slug);
  }

  if (urlPath) {
    return `/jewellery?magentoCategory=${encodeURIComponent(urlPath)}`;
  }

  return buildJewelleryHref("all");
}

function mapMagentoCategoryNode(node: MagentoCategoryNode): JewelleryNavCategory | null {
  const urlKey = node.url_key?.trim();
  const label = node.name?.trim();

  if (!urlKey || !label) {
    return null;
  }

  const slug = MAGENTO_URL_KEY_TO_SLUG[urlKey] ?? null;

  return {
    id: String(node.uid ?? node.id ?? urlKey),
    label,
    href: resolveCategoryHref(slug, node.url_path),
    image: node.image?.trim() || null,
    slug,
    productCount: node.product_count ?? 0,
    sortOrder: MAGENTO_URL_KEY_SORT_ORDER[urlKey] ?? 100,
  };
}

export function mapMagentoCategoryListToJewelleryNav(
  categoryList: MagentoCategoryNode[] | null | undefined,
): JewelleryNavCategory[] {
  const root = categoryList?.[0];
  const children = root?.children ?? [];

  const mapped = children
    .map(mapMagentoCategoryNode)
    .filter((category): category is JewelleryNavCategory => category != null)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));

  if (mapped.length === 0) {
    return [];
  }

  return [
    ...mapped,
    {
      id: "all-products",
      label: "All Products",
      href: buildJewelleryHref("all"),
      image: null,
      slug: "all",
      productCount: root?.product_count ?? 0,
      sortOrder: 999,
    },
  ];
}

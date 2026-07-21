import type { JewelleryCategorySlug } from "../types";

export const JEWELLERY_PATH = "/jewellery";

const VALID_CATEGORY_SLUGS: readonly JewelleryCategorySlug[] = [
  "all",
  "rings",
  "earrings",
  "necklace",
  "pendants",
  "bracelets",
  "bangles",
  "nosepins",
];

/** Magento category url_key → PLP filter slug */
export const MAGENTO_URL_KEY_TO_SLUG: Record<string, JewelleryCategorySlug> = {
  "diamond-bangles": "bangles",
  "diamond-necklaces": "necklace",
  "diamond-rings": "rings",
  "diamond-pendants": "pendants",
  "diamond-nose-pins": "nosepins",
  "diamond-earrings": "earrings",
  "diamond-bracelets": "bracelets",
};

export const JEWELLERY_SLUG_TO_URL_KEY = Object.fromEntries(
  Object.entries(MAGENTO_URL_KEY_TO_SLUG).map(([urlKey, slug]) => [slug, urlKey]),
) as Partial<Record<JewelleryCategorySlug, string>>;

/** Legacy mega-menu path segments → PLP category slugs */
export const JEWELLERY_PATH_SEGMENT_TO_SLUG: Record<string, JewelleryCategorySlug> = {
  bangles: "bangles",
  necklaces: "necklace",
  rings: "rings",
  pendants: "pendants",
  "nose-pins": "nosepins",
  earrings: "earrings",
  bracelets: "bracelets",
};

export function parseJewelleryCategorySlug(value: string | null | undefined): JewelleryCategorySlug | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  const fromSegment = JEWELLERY_PATH_SEGMENT_TO_SLUG[normalized];

  if (fromSegment) {
    return fromSegment;
  }

  const fromMagentoUrlKey = MAGENTO_URL_KEY_TO_SLUG[normalized];
  if (fromMagentoUrlKey) {
    return fromMagentoUrlKey;
  }

  return VALID_CATEGORY_SLUGS.includes(normalized as JewelleryCategorySlug)
    ? (normalized as JewelleryCategorySlug)
    : null;
}

export function buildJewelleryCategoryHref(urlKey?: string | null): string {
  const normalized = urlKey?.trim();
  if (!normalized) {
    return JEWELLERY_PATH;
  }

  return `${JEWELLERY_PATH}/${encodeURIComponent(normalized)}`;
}

export function buildJewelleryHref(category: JewelleryCategorySlug = "all"): string {
  if (category === "all") {
    return JEWELLERY_PATH;
  }

  const urlKey = JEWELLERY_SLUG_TO_URL_KEY[category];
  if (urlKey) {
    return buildJewelleryCategoryHref(urlKey);
  }

  return `${JEWELLERY_PATH}?category=${category}`;
}

export type JewelleryMegaMenuLink = {
  label: string;
  category: JewelleryCategorySlug;
  image: string | null;
};

export const JEWELLERY_MEGA_MENU_LINKS: JewelleryMegaMenuLink[] = [
  { label: "Bangles", category: "bangles", image: "/images/navigation/jewellery/bangles.png" },
  { label: "Necklaces", category: "necklace", image: "/images/navigation/jewellery/necklaces-2.png" },
  { label: "Rings", category: "rings", image: "/images/navigation/jewellery/rings-1.png" },
  { label: "Pendants", category: "pendants", image: "/images/navigation/jewellery/pendants.png" },
  { label: "Nose pins", category: "nosepins", image: "/images/navigation/jewellery/nose-pins.png" },
  { label: "Earrings", category: "earrings", image: "/images/navigation/jewellery/earrings.png" },
  { label: "Bracelets", category: "bracelets", image: "/images/navigation/jewellery/bracelets.png" },
  { label: "All Products", category: "all", image: null },
];

export type JewelleryNavVariant = "desktop" | "mobile";

/** Desktop mega menu — two rows of four */
export const JEWELLERY_NAV_DESKTOP_ROWS: JewelleryCategorySlug[][] = [
  ["bangles", "necklace", "rings", "pendants"],
  ["nosepins", "earrings", "bracelets", "all"],
];

/** Mobile jewellery panel — four rows of two */
export const JEWELLERY_NAV_MOBILE_ROWS: JewelleryCategorySlug[][] = [
  ["bangles", "necklace"],
  ["nosepins", "earrings"],
  ["rings", "pendants"],
  ["bracelets", "all"],
];

export function getJewelleryNavRows(variant: JewelleryNavVariant): JewelleryCategorySlug[][] {
  return variant === "desktop" ? JEWELLERY_NAV_DESKTOP_ROWS : JEWELLERY_NAV_MOBILE_ROWS;
}

export function buildJewelleryNavRows<T>(items: T[], variant: JewelleryNavVariant): T[][] {
  const chunkSize = variant === "desktop" ? 4 : 2;
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    rows.push(items.slice(index, index + chunkSize));
  }

  return rows;
}

export type ResolvedJewelleryNavItem = JewelleryMegaMenuLink & {
  href: string;
};

export function resolveJewelleryNavItem(category: JewelleryCategorySlug): ResolvedJewelleryNavItem {
  const link = JEWELLERY_MEGA_MENU_LINKS.find((item) => item.category === category);

  if (!link) {
    throw new Error(`Unknown jewellery nav category: ${category}`);
  }

  return {
    ...link,
    href: buildJewelleryHref(category),
  };
}

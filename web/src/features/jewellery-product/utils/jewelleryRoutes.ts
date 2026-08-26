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

export const JEWELLERY_CATEGORY_URL_KEYS = Object.keys(MAGENTO_URL_KEY_TO_SLUG);

export function isJewelleryCategoryUrlKey(urlKey: string | null | undefined): boolean {
  if (!urlKey?.trim()) {
    return false;
  }

  return MAGENTO_URL_KEY_TO_SLUG[urlKey.trim().toLowerCase()] != null;
}

export function isJewelleryCategoryPath(pathname: string): boolean {
  if (pathname === JEWELLERY_PATH || pathname === `${JEWELLERY_PATH}/`) {
    return true;
  }

  const segment = pathname.replace(/^\//, "").split("/")[0];
  if (!segment || pathname.includes("/", 1)) {
    return false;
  }

  return isJewelleryCategoryUrlKey(segment);
}

export function buildJewelleryCategoryHref(urlKey?: string | null): string {
  const normalized = urlKey?.trim();
  if (!normalized) {
    return JEWELLERY_PATH;
  }

  return `/${encodeURIComponent(normalized)}`;
}

export function resolveCategoryUrlKeyFromPathname(pathname: string): string | null {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  if (normalizedPath === JEWELLERY_PATH) {
    return null;
  }

  const segment = normalizedPath.replace(/^\//, "").split("/")[0];
  if (!segment || normalizedPath.includes("/", 1)) {
    return null;
  }

  const decoded = decodeURIComponent(segment);
  return isJewelleryCategoryUrlKey(decoded) ? decoded : null;
}

export function replaceJewelleryCategoryUrl(urlKey?: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(window.history.state, "", buildJewelleryCategoryHref(urlKey));
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

export type JewelleryNavVariant = "desktop" | "mobile";

export function buildJewelleryNavRows<T>(items: T[], variant: JewelleryNavVariant): T[][] {
  const chunkSize = variant === "desktop" ? 4 : 2;
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    rows.push(items.slice(index, index + chunkSize));
  }

  return rows;
}

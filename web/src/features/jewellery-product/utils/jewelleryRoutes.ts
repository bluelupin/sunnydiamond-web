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

/** Query params preserved when switching PLP category tabs (collection, gift-finder, etc.). */
export const PRESERVED_JEWELLERY_LISTING_SEARCH_PARAMS = [
  "collection",
  "occasion",
  "diamondShape",
  "fancyColour",
  "minPrice",
  "maxPrice",
] as const;

/** Prefer the live browser query string — tab changes use `replaceState`, so Next `searchParams` can be stale. */
export function readJewelleryListingUrlParams(
  fallbackSearch?: URLSearchParams | string | null,
): URLSearchParams {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }

  const source =
    typeof fallbackSearch === "string"
      ? fallbackSearch
      : fallbackSearch?.toString() ?? "";

  return new URLSearchParams(source);
}

export function preserveJewelleryListingSearchParams(
  source?: URLSearchParams | string | null,
): URLSearchParams {
  const params =
    typeof source === "string"
      ? new URLSearchParams(source)
      : new URLSearchParams(source?.toString() ?? "");

  const preserved = new URLSearchParams();

  for (const key of PRESERVED_JEWELLERY_LISTING_SEARCH_PARAMS) {
    const value = params.get(key)?.trim();
    if (value) {
      preserved.set(key, value);
    }
  }

  return preserved;
}

export const JEWELLERY_CATEGORY_QUERY_PARAM = "category";

export function hasCollectionListingContext(
  searchParams?: URLSearchParams | string | null,
): boolean {
  const params =
    typeof searchParams === "string"
      ? new URLSearchParams(searchParams)
      : searchParams ?? new URLSearchParams();

  return Boolean(params.get("collection")?.trim());
}

export function resolveCategoryUrlKeyFromQueryParam(
  categoryParam: string | null | undefined,
): string | null {
  const slug = parseJewelleryCategorySlug(categoryParam);
  if (!slug || slug === "all") {
    return null;
  }

  return JEWELLERY_SLUG_TO_URL_KEY[slug] ?? null;
}

export function resolveCategoryQueryParamFromUrlKey(
  urlKey: string | null | undefined,
): string | null {
  const slug = parseJewelleryCategorySlug(urlKey);
  if (!slug || slug === "all") {
    return null;
  }

  return slug;
}

/**
 * Build a PLP href. When `collection` is active, keep `/jewellery` and encode category
 * as `?category=` so collection stays first in the URL and tab changes avoid route swaps.
 */
export function buildJewelleryListingHref(options: {
  categoryUrlKey?: string | null;
  searchParams?: URLSearchParams | string | null;
}): string {
  const preserved = preserveJewelleryListingSearchParams(options.searchParams);
  const collectionActive = hasCollectionListingContext(preserved);

  if (collectionActive) {
    const categorySlug = resolveCategoryQueryParamFromUrlKey(options.categoryUrlKey);
    if (categorySlug) {
      preserved.set(JEWELLERY_CATEGORY_QUERY_PARAM, categorySlug);
    } else {
      preserved.delete(JEWELLERY_CATEGORY_QUERY_PARAM);
    }

    const query = preserved.toString();
    return query ? `${JEWELLERY_PATH}?${query}` : JEWELLERY_PATH;
  }

  return buildJewelleryCategoryHref(options.categoryUrlKey, preserved);
}

export function buildJewelleryCategoryHref(
  urlKey?: string | null,
  searchParams?: URLSearchParams | null,
): string {
  const normalized = urlKey?.trim();
  const base = normalized ? `/${encodeURIComponent(normalized)}` : JEWELLERY_PATH;
  const query = searchParams?.toString();

  return query ? `${base}?${query}` : base;
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

export function replaceJewelleryCategoryUrl(
  urlKey?: string | null,
  searchParams?: URLSearchParams | null,
): void {
  replaceJewelleryListingUrl(urlKey, searchParams);
}

export function replaceJewelleryListingUrl(
  categoryUrlKey?: string | null,
  searchParams?: URLSearchParams | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const source =
    searchParams ??
    (typeof window !== "undefined" ? window.location.search : null);

  window.history.replaceState(
    window.history.state,
    "",
    buildJewelleryListingHref({ categoryUrlKey, searchParams: source }),
  );
}

function resolveCategoryUrlKeyFromSearch(
  searchParams?: URLSearchParams | string | null,
): string | null {
  const params =
    typeof searchParams === "string"
      ? new URLSearchParams(searchParams)
      : searchParams ?? new URLSearchParams();

  if (!hasCollectionListingContext(params)) {
    return null;
  }

  return resolveCategoryUrlKeyFromQueryParam(params.get(JEWELLERY_CATEGORY_QUERY_PARAM));
}

/** Prefer the live browser URL so client-side tab changes stay in sync after history.replaceState. */
export function resolveSelectedCategoryUrlKey(
  pathname: string | null | undefined,
  categoryUrlKeyFromRoute: string | null,
  search?: URLSearchParams | string | null,
): string | null {
  const browserSearch =
    typeof window !== "undefined" ? window.location.search : (typeof search === "string" ? search : search?.toString() ?? "");

  const fromCollectionCategory = resolveCategoryUrlKeyFromSearch(browserSearch);
  if (fromCollectionCategory != null || hasCollectionListingContext(browserSearch)) {
    return fromCollectionCategory;
  }

  if (typeof window !== "undefined") {
    const browserPath = window.location.pathname;
    if (isJewelleryCategoryPath(browserPath)) {
      return resolveCategoryUrlKeyFromPathname(browserPath);
    }
  }

  const normalizedPath = pathname?.replace(/\/$/, "") ?? "";
  if (normalizedPath === JEWELLERY_PATH || isJewelleryCategoryPath(normalizedPath)) {
    return resolveCategoryUrlKeyFromPathname(normalizedPath);
  }

  return categoryUrlKeyFromRoute;
}

export function shouldSyncCategoryFromRouterPathname(
  pathname: string | null | undefined,
): boolean {
  if (typeof window === "undefined") {
    return Boolean(pathname);
  }

  const browserPath = window.location.pathname.replace(/\/$/, "") || "/";
  const routerPath = pathname?.replace(/\/$/, "") || "/";

  return browserPath === routerPath;
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

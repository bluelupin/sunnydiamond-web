/** Shared by the search overlay and the /api/search/quick route. */

export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_LENGTH = 100;

export type SearchLink = { label: string; href: string; detail?: string };

export type QuickSearchProduct = {
  sku: string;
  name: string;
  href: string;
  image: string | null;
  price: number;
  /** True when variants differ in price, so the card reads "From ₹X". */
  fromPrice: boolean;
};

export type QuickSearchResult = {
  query: string;
  products: QuickSearchProduct[];
  categories: SearchLink[];
  articles: SearchLink[];
  services: SearchLink[];
};

export type SearchSuggestions = { popular: SearchLink[] };

/** Search input is untrusted: drop control characters, collapse spaces, cap at 100. */
export function cleanSearchQuery(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/\p{C}+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SEARCH_LENGTH);
}

export function searchResultsHref(query: string): string {
  return `/search?q=${encodeURIComponent(cleanSearchQuery(query))}`;
}

/** Typeahead — recent search rows while the shopper types (popular/suggested not shown in overlay). */
export function searchTermMatchesInput(label: string, query: string): boolean {
  const normalizedLabel = label.trim().toLowerCase();
  const normalizedQuery = cleanSearchQuery(query).toLowerCase();
  if (!normalizedLabel || !normalizedQuery) return false;
  return normalizedLabel.includes(normalizedQuery);
}

export type SearchQueryTextSegment = { text: string; match: boolean };

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Case-insensitive segments for typeahead — matched spans use stronger weight in UI. */
export function splitLabelBySearchQuery(label: string, query: string): SearchQueryTextSegment[] {
  const normalizedQuery = cleanSearchQuery(query);
  if (!normalizedQuery) {
    return [{ text: label, match: false }];
  }

  const pattern = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");
  const parts = label.split(pattern).filter((part) => part.length > 0);
  if (parts.length === 0) {
    return [{ text: label, match: false }];
  }

  const normalizedQueryLower = normalizedQuery.toLowerCase();
  return parts.map((text) => ({
    text,
    match: text.toLowerCase() === normalizedQueryLower,
  }));
}

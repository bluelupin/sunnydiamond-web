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

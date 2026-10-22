import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";
import {
  storeLocatorIncompletePincodeMessage,
  storeLocatorInvalidPincodeMessage,
} from "@/features/stores/data/storeLocatorContent";

export type StoreLocatorPincodeSearchErrorOptions = {
  /** Set after blur, Enter, or idle while the query is digits-only and shorter than 6. */
  pincodeInputCommitted?: boolean;
};

const INDIAN_PINCODE_PATTERN = /\b(\d{6})\b/;

/** Preserve location text and pincode characters while removing pasted control characters. */
export function sanitizeStoreLocatorSearchInput(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, "");
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "New Delhi",
  "Delhi",
] as const;

export function extractPincodeFromAddress(address?: string | null): string | undefined {
  const match = address?.match(INDIAN_PINCODE_PATTERN);
  return match?.[1];
}

/** Address line with the CMS pincode appended, unless the address already contains it. */
export function formatAddressWithPincode(address: string, pincode?: string | null): string {
  const pin = pincode?.trim();
  return pin && !address.includes(pin) ? `${address} ${pin}` : address;
}

export function inferStateFromAddress(address?: string | null): string | undefined {
  if (!address) return undefined;

  const normalizedAddress = address.toLowerCase();
  for (const state of INDIAN_STATES) {
    if (normalizedAddress.includes(state.toLowerCase())) {
      return state === "Delhi" ? "New Delhi" : state;
    }
  }

  return undefined;
}

function normalizeFilterText(value?: string | null): string {
  return value?.trim().toLowerCase() ?? "";
}

function getStoreState(store: BookStoreVisitStore): string {
  const raw = store.state?.trim() || inferStateFromAddress(store.address);
  const normalized = normalizeFilterText(raw);
  // CMS may store "Delhi" while the location filter label is "New Delhi".
  if (normalized === "delhi") return "new delhi";
  return normalized;
}

/**
 * State tabs match showroom `state` (and `city` when the tab is a place name
 * like "New Delhi"). Exact match only — substring checks caused false hits
 * (e.g. `"".includes` / `"maharashtra".includes("")`).
 */
function storeMatchesStateFilter(
  store: BookStoreVisitStore,
  stateFilter: string,
): boolean {
  if (!stateFilter) return true;

  const storeState = getStoreState(store);
  if (storeState && storeState === stateFilter) return true;

  const city = normalizeFilterText(store.city);
  if (city && city === stateFilter) return true;

  return false;
}

function getStoreSearchHaystack(store: BookStoreVisitStore): string {
  return [
    store.storeName,
    store.tabLabel,
    store.address,
    store.city,
    store.state,
    store.pincode,
    inferStateFromAddress(store.address),
    extractPincodeFromAddress(store.address),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function filterBookStoreVisitStores(
  stores: BookStoreVisitStore[],
  searchQuery: string,
  selectedState: string | null,
): BookStoreVisitStore[] {
  const query = searchQuery.trim().toLowerCase();
  const stateFilter = normalizeFilterText(selectedState);
  // Search must work across state tabs — only apply the tab filter when the
  // search box is empty.
  const applyStateFilter = Boolean(stateFilter) && !query;

  return stores.filter((store) => {
    if (applyStateFilter && !storeMatchesStateFilter(store, stateFilter)) {
      return false;
    }

    if (!query) {
      return true;
    }

    if (/^\d{1,6}$/.test(query)) {
      const pincode =
        normalizeFilterText(store.pincode ?? extractPincodeFromAddress(store.address));
      if (pincode.includes(query)) {
        return true;
      }
      // Digit-only queries are pincode searches — don't fall through to
      // haystack matching (avoids false hits on phone numbers, etc.).
      return false;
    }

    return getStoreSearchHaystack(store).includes(query);
  });
}

/** True when the query is a completed digit/pincode attempt (6+ digits). */
export function isStoreLocatorPincodeSearchQuery(searchQuery: string): boolean {
  const query = searchQuery.trim();
  return /^\d+$/.test(query) && query.length >= 6;
}

function isValidIndianPincode(query: string): boolean {
  return /^\d{6}$/.test(query) && !query.startsWith("0");
}

/**
 * Store Locator search — Figma State 3 under the field.
 * Only malformed digit queries. A valid 6-digit miss is State 4, not this error.
 */
export function getStoreLocatorPincodeSearchError(
  searchQuery: string,
  invalidPincodeMessage?: string | null,
  options?: StoreLocatorPincodeSearchErrorOptions,
): string | undefined {
  const query = searchQuery.trim();
  const isDigitsOnly = /^\d+$/.test(query);

  if (
    options?.pincodeInputCommitted &&
    isDigitsOnly &&
    query.length >= 1 &&
    query.length < 6
  ) {
    return storeLocatorIncompletePincodeMessage;
  }

  if (!isStoreLocatorPincodeSearchQuery(searchQuery)) {
    return undefined;
  }

  if (!isValidIndianPincode(query)) {
    return invalidPincodeMessage?.trim() || storeLocatorInvalidPincodeMessage;
  }

  return undefined;
}

/**
 * Valid 6-digit pincode with no matching showroom — Figma State 4 nearby list.
 */
export function shouldSuggestNearbyStores(
  searchQuery: string,
  matchingStoreCount: number,
): boolean {
  const query = searchQuery.trim();
  return isValidIndianPincode(query) && matchingStoreCount === 0;
}

/** Geo lookup outcome for a format-valid PIN with no showroom text match (State 4 probe). */
export type StoreLocatorPinGeoLookupOutcome =
  | "idle"
  | "loading"
  | "found"
  | "unknown-pin"
  | "unavailable";

/**
 * Under-field error when the PIN passes format checks but does not exist (India Post / geo).
 * Uses the same copy as malformed PINs so State 4 nearby UX only runs for real PINs.
 */
export function getStoreLocatorPinGeoLookupFieldError(
  searchQuery: string,
  matchingStoreCount: number,
  outcome: StoreLocatorPinGeoLookupOutcome,
  invalidPincodeMessage?: string | null,
): string | undefined {
  if (!shouldSuggestNearbyStores(searchQuery, matchingStoreCount)) {
    return undefined;
  }

  if (outcome !== "unknown-pin") {
    return undefined;
  }

  return invalidPincodeMessage?.trim() || storeLocatorInvalidPincodeMessage;
}

/** Valid 6-digit pincode search that matched one or more showrooms. */
export function shouldShowPincodeMatchResults(
  searchQuery: string,
  matchingStoreCount: number,
): boolean {
  if (!isStoreLocatorPincodeSearchQuery(searchQuery) || matchingStoreCount <= 0) {
    return false;
  }

  const query = searchQuery.trim();
  return isValidIndianPincode(query);
}

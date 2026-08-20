import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";

const INDIAN_PINCODE_PATTERN = /\b(\d{6})\b/;
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
  return normalizeFilterText(store.state ?? inferStateFromAddress(store.address));
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
    if (applyStateFilter) {
      const storeState = getStoreState(store);
      if (storeState !== stateFilter && !storeState.includes(stateFilter)) {
        return false;
      }
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
): string | undefined {
  if (!isStoreLocatorPincodeSearchQuery(searchQuery)) {
    return undefined;
  }

  const query = searchQuery.trim();
  if (!isValidIndianPincode(query)) {
    return invalidPincodeMessage?.trim() || undefined;
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

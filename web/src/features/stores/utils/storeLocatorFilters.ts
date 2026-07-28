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

  return stores.filter((store) => {
    if (stateFilter) {
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
    }

    return getStoreSearchHaystack(store).includes(query);
  });
}

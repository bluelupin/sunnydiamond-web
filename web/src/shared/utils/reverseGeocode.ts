import { TRY_AT_HOME_INDIAN_STATES } from "@/features/products/data/tryAtHomeContent";

export type ParsedAddress = {
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  hamlet?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  state_district?: string;
  postcode?: string;
};

const emptyAddress = (): ParsedAddress => ({
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
});

export const resolveIndianState = (
  value: string | undefined,
  states: readonly string[] = TRY_AT_HOME_INDIAN_STATES,
): string => {
  if (!value?.trim()) {
    return "";
  }

  const normalized = value.trim().toLowerCase();

  const exactMatch = states.find((state) => state.toLowerCase() === normalized);
  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = states.find(
    (state) =>
      normalized.includes(state.toLowerCase()) || state.toLowerCase().includes(normalized),
  );

  return partialMatch ?? value.trim();
};

const buildAddressLine1 = (address: NominatimAddress): string => {
  const primary = [address.house_number, address.road].filter(Boolean).join(" ");
  const locality = [address.neighbourhood, address.suburb, address.quarter, address.hamlet]
    .filter(Boolean)
    .join(", ");

  if (primary && locality) {
    return `${primary}, ${locality}`;
  }

  return primary || locality;
};

const buildAddressLine2 = (address: NominatimAddress): string => {
  const district = address.state_district?.trim();
  const county = address.county?.trim();

  if (district && county && district !== county) {
    return `${district}, ${county}`;
  }

  return district || county || "";
};

const resolveCity = (address: NominatimAddress): string =>
  address.city ||
  address.town ||
  address.village ||
  address.municipality ||
  address.suburb ||
  address.county ||
  "";

export const parseNominatimAddress = (address: NominatimAddress | undefined): ParsedAddress => {
  if (!address) {
    return emptyAddress();
  }

  return {
    addressLine1: buildAddressLine1(address),
    addressLine2: buildAddressLine2(address),
    pincode: address.postcode?.trim() ?? "",
    city: resolveCity(address),
    state: resolveIndianState(address.state),
  };
};

export const getGeolocationErrorMessage = (code: number): { title: string; description: string } => {
  switch (code) {
    case 1:
      return {
        title: "Location access denied",
        description: "Allow location access in your browser settings, or enter your address manually.",
      };
    case 2:
      return {
        title: "Location unavailable",
        description: "We couldn't detect your current location. Please enter your address manually.",
      };
    case 3:
      return {
        title: "Location request timed out",
        description: "Location detection took too long. Please try again or enter your address manually.",
      };
    default:
      return {
        title: "Location detection failed",
        description: "Please enter your address manually.",
      };
  }
};

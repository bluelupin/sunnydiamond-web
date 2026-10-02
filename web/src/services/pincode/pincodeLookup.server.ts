import { INDIAN_STATES } from "@/features/checkout/constants/indianStates";
import { parseNominatimAddress, resolveIndianState } from "@/shared/utils/reverseGeocode";
import { validateIndianPincode } from "@/shared/utils/formValidation";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const INDIA_POST_PINCODE_URL = "https://api.postalpincode.in/pincode";
export const NOMINATIM_MIN_GAP_MS = 1000;
export const NOMINATIM_TIMEOUT_MS = 5000;
export const INDIA_POST_TIMEOUT_MS = 5000;
export const NOMINATIM_MAX_WAITING = 5;
export const PIN_CACHE_SECONDS = 60 * 60 * 24 * 30;

export class NominatimBusyError extends Error {}

export type PincodeGeoLookup =
  | {
      lat: number;
      lng: number;
      city: string;
      state: string;
    }
  | { notFound: true };

type NominatimSearchHit = {
  lat?: string;
  lon?: string;
  address?: Record<string, string | undefined>;
};

type IndiaPostResponse = Array<{
  Status?: string;
  PostOffice?: Array<{
    District?: string | null;
    State?: string | null;
  }> | null;
}>;

let nextSlotAt = 0;
let waiting = 0;

/** Waits for the next 1 s dispatch slot; refuses once NOMINATIM_MAX_WAITING are already waiting. */
export async function waitForNominatimSlot(): Promise<void> {
  if (waiting >= NOMINATIM_MAX_WAITING) {
    throw new NominatimBusyError();
  }

  const slotAt = Math.max(Date.now(), nextSlotAt);
  nextSlotAt = slotAt + NOMINATIM_MIN_GAP_MS;
  waiting += 1;
  try {
    await new Promise((resolve) => setTimeout(resolve, slotAt - Date.now()));
  } finally {
    waiting -= 1;
  }
}

function resolvePincodeLookupCity(address: Record<string, string | undefined> | undefined): string {
  const parsed = parseNominatimAddress(address);
  const fromParsed = parsed.city.trim();
  if (fromParsed && !/\bward\b/i.test(fromParsed)) {
    return fromParsed;
  }

  const stateDistrict = address?.state_district?.trim();
  if (stateDistrict) {
    const normalized = stateDistrict
      .replace(/\s*(City\s+)?District$/i, "")
      .replace(/\s+Division$/i, "")
      .trim();
    if (normalized) {
      return normalized;
    }
  }

  return fromParsed || address?.county?.trim() || address?.suburb?.trim() || "";
}

async function lookupIndiaPostAddress(
  pin: string,
): Promise<{ city: string; state: string } | null> {
  const response = await fetch(`${INDIA_POST_PINCODE_URL}/${encodeURIComponent(pin)}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(INDIA_POST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as IndiaPostResponse;
  const entry = payload[0];
  if (entry?.Status !== "Success" || !entry.PostOffice?.length) {
    return null;
  }

  const office = entry.PostOffice[0];
  const city = office?.District?.trim() ?? "";
  const state = resolveIndianState(office?.State?.trim(), INDIAN_STATES).trim();

  if (!city && !state) {
    return null;
  }

  return { city, state };
}

async function fetchNominatimPincodeHit(pin: string): Promise<NominatimSearchHit | null> {
  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("postalcode", pin);
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  await waitForNominatimSlot();
  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "SunnyDiamondsWeb/1.0 (https://sunnydiamonds.com)",
    },
    signal: AbortSignal.timeout(NOMINATIM_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Nominatim ${response.status}`);
  }

  const results = (await response.json()) as NominatimSearchHit[];
  return results[0] ?? null;
}

export async function lookupIndianPincodeGeo(pin: string): Promise<PincodeGeoLookup> {
  const trimmed = pin.trim();
  if (!validateIndianPincode(trimmed).valid) {
    throw new Error("Invalid pincode");
  }

  const [postAddress, nominatimHit] = await Promise.all([
    lookupIndiaPostAddress(trimmed).catch(() => null),
    fetchNominatimPincodeHit(trimmed).catch(() => null),
  ]);

  if (!nominatimHit) {
    return { notFound: true };
  }

  const lat = Number(nominatimHit.lat);
  const lng = Number(nominatimHit.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Nominatim returned no coordinates");
  }

  const parsed = parseNominatimAddress(nominatimHit.address);
  const city = (postAddress?.city || resolvePincodeLookupCity(nominatimHit.address) || parsed.city).trim();
  const state = (
    postAddress?.state ||
    resolveIndianState(parsed.state, INDIAN_STATES) ||
    parsed.state
  ).trim();

  return {
    lat,
    lng,
    city,
    state,
  };
}

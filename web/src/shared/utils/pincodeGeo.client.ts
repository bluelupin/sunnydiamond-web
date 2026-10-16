const PIN_LOOKUP_TIMEOUT_MS = 10000;

type PincodeGeoResponse = {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
};

/** Client lookup: Indian PIN → city/state (same API as checkout). Failures return null. */
export async function fetchPincodeCityState(
  pin: string,
  signal: AbortSignal = AbortSignal.timeout(PIN_LOOKUP_TIMEOUT_MS),
): Promise<{ city: string; state: string } | null> {
  try {
    const response = await fetch(`/api/pincode-geo/${encodeURIComponent(pin)}`, { signal });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as PincodeGeoResponse;
    const city = payload.city?.trim() ?? "";
    const state = payload.state?.trim() ?? "";
    if (!city && !state) {
      return null;
    }

    return { city, state };
  } catch {
    return null;
  }
}

export const PIN_LOOKUP_DEBOUNCE_MS = 400;

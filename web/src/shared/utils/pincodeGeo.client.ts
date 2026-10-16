const PIN_LOOKUP_TIMEOUT_MS = 10000;

type PincodeGeoResponse = {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
};

function createPinLookupAbortSignal(): AbortSignal {
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(PIN_LOOKUP_TIMEOUT_MS);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), PIN_LOOKUP_TIMEOUT_MS);
  return controller.signal;
}

/** Client lookup: Indian PIN → city/state (same API as checkout). Failures return null. */
export async function fetchPincodeCityState(
  pin: string,
  signal: AbortSignal = createPinLookupAbortSignal(),
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

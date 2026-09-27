import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { validateIndianPincode } from "@/shared/utils/formValidation";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_MIN_GAP_MS = 1000;
const NOMINATIM_TIMEOUT_MS = 5000;
const NOMINATIM_MAX_WAITING = 5;
const PIN_CACHE_SECONDS = 60 * 60 * 24 * 30;

type RouteContext = {
  params: Promise<{ pin: string }>;
};

type PincodeLookup = { lat: number; lng: number } | { notFound: true };

class NominatimBusyError extends Error {}

// ponytail: per-process throttle (PM2 runs the site as 1 fork process, checked 27 Sep) —
// Nominatim allows 1 request/s, so the ceiling is a handful of concurrent new PINs;
// upgrade path = bundled PIN-centroid table.
let nextSlotAt = 0;
let waiting = 0;

/** Waits for the next 1 s dispatch slot; refuses once NOMINATIM_MAX_WAITING are already waiting. */
async function waitForNominatimSlot(): Promise<void> {
  if (waiting >= NOMINATIM_MAX_WAITING) {
    throw new NominatimBusyError();
  }

  // Spacing counts from dispatch, so a slow or hung call never holds up the next one.
  const slotAt = Math.max(Date.now(), nextSlotAt);
  nextSlotAt = slotAt + NOMINATIM_MIN_GAP_MS;
  waiting += 1;
  try {
    await new Promise((resolve) => setTimeout(resolve, slotAt - Date.now()));
  } finally {
    waiting -= 1;
  }
}

async function lookupPincode(pin: string): Promise<PincodeLookup> {
  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("postalcode", pin);
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("format", "jsonv2");
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

  const results = (await response.json()) as Array<{ lat?: string; lon?: string }>;
  const first = results[0];
  if (!first) {
    return { notFound: true };
  }

  const lat = Number(first.lat);
  const lng = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Nominatim returned no coordinates");
  }

  return { lat, lng };
}

// Server cache (.next/cache, kept across `next build` and restarts); misses are cached too,
// errors (including "busy") are not, so a failed lookup is retried on the next request.
const cachedLookupPincode = unstable_cache(lookupPincode, ["pincode-geo"], {
  revalidate: PIN_CACHE_SECONDS,
});

/** GET /api/pincode-geo/:pin — Indian PIN code → approximate { lat, lng }. */
export async function GET(_request: Request, context: RouteContext) {
  const { pin } = await context.params;
  const trimmed = pin.trim();

  if (!validateIndianPincode(trimmed).valid) {
    return NextResponse.json({ error: "Enter a valid 6-digit pincode" }, { status: 400 });
  }

  try {
    const result = await cachedLookupPincode(trimmed);
    if ("notFound" in result) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NominatimBusyError) {
      return NextResponse.json({ error: "busy" }, { status: 503 });
    }
    return NextResponse.json({ error: "Pincode lookup failed" }, { status: 502 });
  }
}

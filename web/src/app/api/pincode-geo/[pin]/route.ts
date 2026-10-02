import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import {
  lookupIndianPincodeGeo,
  NominatimBusyError,
  PIN_CACHE_SECONDS,
} from "@/services/pincode/pincodeLookup.server";
import { validateIndianPincode } from "@/shared/utils/formValidation";

type RouteContext = {
  params: Promise<{ pin: string }>;
};

const cachedLookupPincode = unstable_cache(lookupIndianPincodeGeo, ["pincode-geo-v3"], {
  revalidate: PIN_CACHE_SECONDS,
});

/** GET /api/pincode-geo/:pin — Indian PIN → { lat, lng, city, state }. */
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

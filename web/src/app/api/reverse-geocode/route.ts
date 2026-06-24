import { NextRequest, NextResponse } from "next/server";
import { parseNominatimAddress } from "@/shared/utils/reverseGeocode";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Coordinates out of range" }, { status: 400 });
  }

  try {
    const url = new URL(NOMINATIM_REVERSE_URL);
    url.searchParams.set("format", "json");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "SunnyDiamondsWeb/1.0 (https://sunnydiamonds.com)",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Reverse geocoding failed" }, { status: 502 });
    }

    const data = (await response.json()) as { address?: Record<string, string> };
    const parsedAddress = parseNominatimAddress(data.address);

    if (!parsedAddress.addressLine1 && !parsedAddress.city && !parsedAddress.state) {
      return NextResponse.json({ error: "Address not found for this location" }, { status: 404 });
    }

    return NextResponse.json(parsedAddress);
  } catch {
    return NextResponse.json({ error: "Reverse geocoding failed" }, { status: 502 });
  }
}

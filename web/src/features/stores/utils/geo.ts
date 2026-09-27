// Pure distance helpers — no path-alias imports so scripts/run-nearest-store-test-cases.mjs can load it.

export type GeoPoint = { lat: number; lng: number };

type StoreWithCoordinates = { latitude?: number | null; longitude?: number | null };

export type StoreWithDistance<T> = { store: T; distanceKm: number };

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance in km. */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Stores within `radiusKm` of `point`, nearest first. Stores without coordinates are skipped. */
export function nearestStores<T extends StoreWithCoordinates>(
  stores: T[],
  point: GeoPoint,
  radiusKm: number,
): StoreWithDistance<T>[] {
  const results: StoreWithDistance<T>[] = [];

  for (const store of stores) {
    const lat = store.latitude;
    const lng = store.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const distanceKm = haversineKm(point, { lat, lng });
    if (distanceKm <= radiusKm) {
      results.push({ store, distanceKm });
    }
  }

  return results.sort((a, b) => a.distanceKm - b.distanceKm);
}

/** "2.4 km away" under 10 km, "12 km away" from there. */
export function formatDistanceKm(distanceKm: number): string {
  const oneDecimal = Math.round(distanceKm * 10) / 10;
  const value = oneDecimal < 10 ? oneDecimal.toFixed(1) : String(Math.round(distanceKm));
  return `${value} km away`;
}

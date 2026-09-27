/**
 * Self-check for the nearest-store distance logic (CR-C6 NS-9).
 * Run: npm run test:nearest-store
 *      npm run test:nearest-store -- --base https://sunnydiamonds-web-dev.on-forge.com
 * With --base it also checks the PIN lookup route on that deployed site.
 */
import assert from "node:assert/strict";
import {
  formatDistanceKm,
  haversineKm,
  nearestStores,
} from "../src/features/stores/utils/geo.ts";

const stores = [
  { id: "kochi", latitude: 9.9784983, longitude: 76.2824039 },
  { id: "trivandrum", latitude: 8.5188383, longitude: 76.9423012 },
  { id: "calicut", latitude: 11.2579924, longitude: 75.798338 },
  { id: "thrissur", latitude: 10.5223913, longitude: 76.2019176 },
  { id: "coimbatore", latitude: 11.00387, longitude: 76.9782124 },
  { id: "chandigarh", latitude: null, longitude: null },
];

const kochiPoint = { lat: 9.978485, lng: 76.28305 };
const bengaluru = { lat: 12.9797, lng: 77.5947 };

// Kochi 682035: Kochi store is essentially here.
const within50 = nearestStores(stores, kochiPoint, 50);
assert.equal(within50[0]?.store.id, "kochi");
assert.ok(within50[0].distanceKm < 1, `Kochi should be ~0 km, got ${within50[0].distanceKm}`);

// Thrissur is 61–70 km out: excluded at 50, included at 100 and sorted after Kochi.
const thrissurKm = haversineKm(kochiPoint, { lat: 10.5223913, lng: 76.2019176 });
assert.ok(thrissurKm > 61 && thrissurKm < 70, `Thrissur distance ${thrissurKm}`);
assert.ok(!within50.some((result) => result.store.id === "thrissur"));
const within100 = nearestStores(stores, kochiPoint, 100);
assert.deepEqual(
  within100.map((result) => result.store.id).slice(0, 2),
  ["kochi", "thrissur"],
);
for (let i = 1; i < within100.length; i += 1) {
  assert.ok(within100[i - 1].distanceKm <= within100[i].distanceKm, "sorted by distance");
}

// A store without coordinates never appears, even at a huge radius.
assert.ok(!nearestStores(stores, kochiPoint, 100000).some((result) => result.store.id === "chandigarh"));

// Bengaluru: no showroom within 50 km.
assert.equal(nearestStores(stores, bengaluru, 50).length, 0);

// Distance label: one decimal under 10 km, whole km from there.
assert.equal(formatDistanceKm(0.04), "0.0 km away");
assert.equal(formatDistanceKm(2.46), "2.5 km away");
assert.equal(formatDistanceKm(9.96), "10 km away");
assert.equal(formatDistanceKm(12.4), "12 km away");

console.log("nearest-store: distance checks passed");

const baseIndex = process.argv.indexOf("--base");
const base = baseIndex > -1 ? process.argv[baseIndex + 1]?.replace(/\/+$/, "") : "";

if (base) {
  const kochiPin = await fetch(`${base}/api/pincode-geo/682035`);
  assert.equal(kochiPin.status, 200, `682035 status ${kochiPin.status}`);
  const point = await kochiPin.json();
  const fromKochiStore = haversineKm(point, { lat: 9.9784983, lng: 76.2824039 });
  assert.ok(fromKochiStore < 15, `682035 resolved ${fromKochiStore} km from the Kochi store`);

  const invalidPin = await fetch(`${base}/api/pincode-geo/000000`);
  assert.equal(invalidPin.status, 400, `000000 status ${invalidPin.status}`);

  console.log(`nearest-store: PIN route checks passed on ${base}`);
}

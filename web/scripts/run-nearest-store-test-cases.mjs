/**
 * Self-check for the nearest-store distance logic (CR-C6 NS-9).
 * Run: npm run test:nearest-store
 *      npm run test:nearest-store -- --base https://sunnydiamonds-web-dev.on-forge.com
 * With --base it also checks the PIN lookup route on that deployed site.
 */
import assert from "node:assert/strict";
import { register } from "node:module";
import {
  formatDistanceKm,
  haversineKm,
  nearestStores,
} from "../src/features/stores/utils/geo.ts";

// Lets Node load the app's own TS modules: "@/..." → src/..., extensionless → .ts / .tsx.
const aliasHooks = `
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
const SRC = ${JSON.stringify(new URL("../src/", import.meta.url).href)};
const isFile = (url) => { try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; } };
export async function resolve(specifier, context, next) {
  const aliased = specifier.startsWith("@/");
  if (!aliased && !specifier.startsWith(".")) return next(specifier, context);
  const base = aliased ? new URL(specifier.slice(2), SRC).href : new URL(specifier, context.parentURL).href;
  for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
    if (isFile(base + suffix)) return next(base + suffix, context);
  }
  return next(specifier, context);
}`;
register(`data:text/javascript,${encodeURIComponent(aliasHooks)}`);

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

// The strip's own conversion on a real-shaped /api/store-locator/showrooms payload (captured
// from dev, 27 Sep): coordinates must survive mapStoreLocatorShowroomToBookStoreVisit.
const { mapStoreLocatorShowroomToBookStoreVisit } = await import(
  "../src/features/products/utils/bookStoreVisitStores.ts"
);
const showroomsPayload = {
  nearestStoreRadiusKm: 50,
  showrooms: [
    {
      id: "36",
      documentId: "su5xgmp3mlywbh377z8trkxa",
      name: "Kochi",
      slug: "kochi",
      address: "Sunny Diamonds Kochi 40/9134 B & C, Rajaji Rd, Ernakulam, Kerala",
      city: "Kochi",
      state: "Kerala",
      phone: "+91 97443 55555",
      email: "sd-showroom-kochi@yopmail.com",
      pincode: "682035",
      mapUrl: "https://maps.google.com/?q=Sunny+Diamonds+Kochi",
      mapEmbed: null,
      openingHours: "Mon-Sat: 10:00 AM - 8:00 PM",
      latitude: 9.9784983,
      longitude: 76.2824039,
      desktopImageUrl: "https://d1gf9vo4d2b63b.cloudfront.net/cms/Frame_2147226283_2ccc2e762d.png",
      mobileImageUrl: "https://d1gf9vo4d2b63b.cloudfront.net/cms/Frame_2147226283_2ccc2e762d.png",
      imageAlt: "Kochi Location Store",
    },
    {
      id: "52",
      documentId: "rs8gu2cx01c87cuv4h1bsk18",
      name: "Thrissur",
      slug: "thrissur",
      address: "Sunny Diamonds Thrissur, Kerala",
      city: "Thrissur",
      state: "Kerala",
      phone: "+91 97443 55555",
      email: null,
      pincode: "680004",
      mapUrl: "https://maps.google.com/?q=Sunny+Diamonds+Thrissur",
      mapEmbed: null,
      openingHours: "Mon-Sat: 10:00 AM - 8:00 PM",
      latitude: 10.5223913,
      longitude: 76.2019176,
      desktopImageUrl: "https://d1gf9vo4d2b63b.cloudfront.net/cms/showroom_thrissur_3639ed8c84.jpg",
      mobileImageUrl: "https://d1gf9vo4d2b63b.cloudfront.net/cms/showroom_thrissur_3639ed8c84.jpg",
      imageAlt: "Thrissur Store Location",
    },
  ],
};
// Same round trip the browser does: JSON over the wire, then the strip's map.
const convertedStores = JSON.parse(JSON.stringify(showroomsPayload)).showrooms.map(
  mapStoreLocatorShowroomToBookStoreVisit,
);
assert.equal(convertedStores[0].latitude, 9.9784983);
assert.equal(convertedStores[0].longitude, 76.2824039);
const fromConverted = nearestStores(convertedStores, kochiPoint, showroomsPayload.nearestStoreRadiusKm);
assert.deepEqual(fromConverted.map((result) => result.store.storeName), ["Kochi"]);

console.log("nearest-store: showroom conversion checks passed");

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

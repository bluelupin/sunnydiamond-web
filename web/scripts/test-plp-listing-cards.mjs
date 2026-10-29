import assert from "node:assert/strict";
import test from "node:test";
import {
  buildJewelleryPlpGridItems,
  countProductsRequiredBeforeSlot,
  filterEligibleListingCardPositions,
} from "../src/features/jewellery-product/utils/plpListingCards.ts";

const product = (id) => ({
  id: String(id),
  name: `Product ${id}`,
  urlKey: `product-${id}`,
  price: 1000,
  primaryImage: "/a.jpg",
});

const card = (id, desktopPosition, mobilePosition = desktopPosition) => ({
  id,
  description: `Card ${id}`,
  desktopPosition,
  mobilePosition,
  cta: { label: "Explore", url: "/dfe" },
  image: { desktopUrl: "/d.jpg", mobileUrl: "/m.jpg", alt: "DFE" },
});

test("countProductsRequiredBeforeSlot", () => {
  const positions = [7, 14];
  assert.equal(countProductsRequiredBeforeSlot(7, positions), 6);
  assert.equal(countProductsRequiredBeforeSlot(14, positions), 12);
});

test("filterEligibleListingCardPositions skips promos that need more products than a segment has", () => {
  const positions = [7, 14];
  assert.deepEqual(filterEligibleListingCardPositions(positions, 10), [7]);
  assert.deepEqual(filterEligibleListingCardPositions(positions, 20), [7, 14]);
  assert.deepEqual(filterEligibleListingCardPositions(positions, 5), []);
});

test("repeats listing cards per pageSize segment with end fallback for ineligible slots", () => {
  const products = Array.from({ length: 20 }, (_, index) => product(index + 1));
  const listingCards = [card("dfe-a", 7), card("dfe-b", 14)];

  const items = buildJewelleryPlpGridItems(products, listingCards, "desktop", 10);
  const promos = items.filter((item) => item.kind === "listing-card");

  assert.equal(promos.length, 4);
  assert.deepEqual(
    promos.map((item) => [item.segmentIndex, item.card.id]),
    [
      [0, "dfe-a"],
      [0, "dfe-b"],
      [1, "dfe-a"],
      [1, "dfe-b"],
    ],
  );
});

test("partial last segment appends ineligible promos at end", () => {
  const products = Array.from({ length: 13 }, (_, index) => product(index + 1));
  const listingCards = [card("dfe-a", 7)];

  const items = buildJewelleryPlpGridItems(products, listingCards, "desktop", 10);
  const promos = items.filter((item) => item.kind === "listing-card");

  assert.equal(promos.length, 2);
  assert.equal(promos[0]?.segmentIndex, 0);
  assert.equal(promos[1]?.segmentIndex, 1);
  assert.equal(promos[1]?.card.id, "dfe-a");

  const lastItem = items.at(-1);
  assert.equal(lastItem?.kind, "listing-card");
});

test("short listing appends all promos after products when none are in-grid eligible", () => {
  const products = [product(1), product(2), product(3)];
  const listingCards = [card("dfe-a", 7), card("dfe-b", 14)];

  const items = buildJewelleryPlpGridItems(products, listingCards, "desktop", 10);
  const promos = items.filter((item) => item.kind === "listing-card");

  assert.equal(items.length, 5);
  assert.equal(items[0]?.kind, "product");
  assert.equal(items[2]?.kind, "product");
  assert.deepEqual(
    promos.map((item) => item.card.id),
    ["dfe-a", "dfe-b"],
  );
});

test("returns empty when there are no products", () => {
  const listingCards = [card("dfe-a", 7)];
  assert.deepEqual(buildJewelleryPlpGridItems([], listingCards, "desktop", 10), []);
});

test("returns products only when there are no listing cards", () => {
  const products = [product(1), product(2)];
  const items = buildJewelleryPlpGridItems(products, [], "desktop", 10);

  assert.equal(items.length, 2);
  assert.equal(items[0]?.kind, "product");
  assert.equal(items[1]?.productIndex, 1);
});

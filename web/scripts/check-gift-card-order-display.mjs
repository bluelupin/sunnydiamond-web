/**
 * Self-check: how gift card orders show in My Orders (gift card success-to-profile flow, 30 Sep).
 * Run: npm run test:gift-card-orders
 */
import assert from "node:assert/strict";
import { register } from "node:module";

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

const { mapCustomerOrderToProfileUi } = await import("../src/features/account/utils/profileDisplayMappers.ts");
const { giftCardSuccessHref } = await import("../src/features/gift-card/utils/giftCardCta.utils.ts");

// Both success screen buttons open the placed order in My Orders.
assert.equal(giftCardSuccessHref("000000246"), "/profile?section=orders&order=000000246");
assert.equal(giftCardSuccessHref(""), "/profile?section=orders");

const actions = {
  canTrack: true,
  canCancel: true,
  canReturn: true,
  canDownloadInvoice: true,
  canContactSupport: true,
  canChangeSize: false,
  canChangeEngraving: false,
};

// Real orders carry the OrderFlow status: a paid digital card is Magento "complete" but IN_PROGRESS here.
const order = (sku, status = "complete", sunnyStatus = "IN_PROGRESS") => ({
  id: "1",
  number: "000000101",
  orderDate: "2026-09-30 10:00:00",
  status,
  grandTotal: 5000,
  currency: "INR",
  items: [
    {
      productName: "Sunny Diamonds Gift Card",
      quantity: 1,
      productUrlKey: null,
      productSku: sku,
      imageUrl: null,
      selectedOptions: [],
      enteredOptions: [],
      isGift: false,
      sunnyTag: null,
      giftMessage: null,
    },
  ],
  sunnyStatus,
  sunnyDelivery: { estimatedDeliveryAt: "2026-10-08", deliveredAt: null, returnableTill: null },
  sunnyActions: actions,
});

const digital = mapCustomerOrderToProfileUi(order("sd-gift-card-digital"));
assert.equal(digital.category, "in_progress", "fixture matches a real paid digital card");
assert.equal(digital.items[0].subtitle, "Digital Card");
assert.deepEqual(
  [digital.showTrack, digital.showCancel, digital.showReturn, digital.showContactUs, digital.showDownloadInvoice],
  [false, false, false, true, true],
  "digital card: Contact Us and invoice only",
);
assert.equal(digital.timeline, undefined, "digital card: no delivery steps");
assert.equal(digital.footnote, undefined, "digital card: no return-by note");
assert.equal(digital.deliveryBy, undefined, "digital card: no delivery date");

// Once the card has been emailed the store reports DELIVERED with the email time (QA bugs 35, 36).
const emailed = mapCustomerOrderToProfileUi({
  ...order("sd-gift-card-digital", "Complete", "DELIVERED"),
  sunnyDelivery: { estimatedDeliveryAt: null, deliveredAt: "2026-10-03T19:20:05+05:30", returnableTill: null },
});
assert.equal(emailed.category, "delivered", "emailed digital card: Delivered tab");
assert.equal(emailed.statusLabel, "Delivered", "emailed digital card: Delivered badge, not Complete");
assert.ok(emailed.deliveryBy, "emailed digital card: delivery date shown");
assert.deepEqual(
  [emailed.showTrack, emailed.showCancel, emailed.showReturn, emailed.showContactUs, emailed.showDownloadInvoice],
  [false, false, false, true, true],
  "emailed digital card: Contact Us and invoice only",
);

const physical = mapCustomerOrderToProfileUi(order("sd-gift-card-physical", "processing"));
assert.equal(physical.items[0].subtitle, "Physical Card");
assert.equal(physical.showTrack, true, "physical card keeps Track");
assert.equal(physical.showCancel, true, "physical card keeps Cancel");
assert.ok(physical.timeline?.length, "physical card keeps the stepper");

// A cancelled digital card keeps the normal cancelled layout (refund steps, Contact Us), without a delivery date.
const cancelled = mapCustomerOrderToProfileUi(order("sd-gift-card-digital", "canceled", "CANCELLED"));
assert.equal(cancelled.category, "cancelled");
assert.equal(cancelled.showContactUs, true, "cancelled digital card: Contact Us");
assert.equal(cancelled.deliveryBy, undefined, "cancelled digital card: no delivery date");
const { isActiveDigitalGiftCardOrder, isDigitalGiftCardContactUsOnlyOrder } = await import(
  "../src/features/account/utils/orderDeliveryTimeline.utils.ts"
);
assert.equal(isActiveDigitalGiftCardOrder(cancelled), false, "views keep the refund stepper");
assert.equal(isDigitalGiftCardContactUsOnlyOrder(cancelled), false, "phone views keep Contact Us");
assert.equal(isActiveDigitalGiftCardOrder(digital), true);

const jewellery = mapCustomerOrderToProfileUi(order("SD-RING-001"));
assert.equal(jewellery.items[0].subtitle, undefined, "jewellery has no card label");
assert.equal(jewellery.showReturn, true);

console.log("gift card order display: 6/6 passed");

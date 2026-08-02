# My Orders — QA Test Guide

**Environment:** https://sunnydiamonds-web-dev.on-forge.com (frontend) ·
https://sunnydiamond-store-dev.on-forge.com (Magento backend)
**Test account:** `sunnydiamond.qa@yopmail.com` (password with the team lead)
**Verified against:** Magento `dev @ 166f58c`, frontend `Version-2.6-order-implementation @ 4abc92d`
**Guide produced from a full E2E run on 2 Aug 2026.** Orders 000000037–000000040
on dev are the artifacts of that run.

All screenshots are in `img/` and were captured live during the run.

---

## 0. Prerequisites

- Sign in with the QA account (Profile icon → email → password).
- COD is only offered for orders **up to ₹40,000** — use the *Tisha diamond
  finger ring* (₹31,055) or similar for COD test orders.
- A delivery address must exist in **My Addresses** before checkout
  (checkout links there if missing).
- If a shipment fails on the ops side with "Not all of your products are
  available", the SKU's source quantity is 0 — raise stock first
  (dev catalog imports carry qty 0 for some SKUs).

---

## 1. Place a test order (COD, with size + gifting)

| Step | Expect | Screenshot |
|---|---|---|
| Open a ring PDP | Size dropdown ("Ring Size Diamond") + "Mark this as a gift" checkbox | `img/03-pdp.png` |
| Pick a size, tick gift, ADD TO BAG | Added-to-bag dialog shows **Gift** tag + "Size: N" + metal | `img/04-pdp-size-gift.png`, `img/05-added-to-bag.png` |
| Cart → VIEW GIFTING OPTIONS → PERSONALISE GIFT | Panel with gift-note field + per-item include toggle + grouped/separate switch | `img/06-cart.png`, `img/07-gifting-panel.png` |
| Type a gift note → SAVE → CHECKOUT | Address prefilled from My Addresses | `img/08-checkout-address.png` |
| CONTINUE TO PAYMENT → select Cash On Delivery → PAY NOW | "Order Successfully Placed" with order number | `img/09-payment-cod.png`, `img/10-order-placed.png` |

Checks: size line persists through added-dialog → cart → checkout summary →
confirmation. Gift tag persists everywhere.

## 2. My Orders — list & tabs

Profile → MY ORDERS. Tabs: **In Progress / Delivered / Cancelled / Returned**.
Empty tab shows "No orders match this filter" (`img/02-orders-empty.png` for the
no-orders-at-all state).

A fresh COD order appears under **In Progress** with (`img/11-orders-list-inprogress.png`):
- Status badge (raw Magento status label, e.g. "Pending")
- **Delivery by / Estimated Delivery = placed date + 10 days** (backend-stamped;
  config `delivery/lead_time_days`)
- 5-step fulfillment stepper (In Production → Packaged → Shipped → Out for
  Delivery → Delivered)
- Real product photo
- CANCEL ORDER + TRACK buttons and the "cancelled before they are shipped" note

## 3. Track modal

TRACK on an in-progress order (`img/12-track-modal.png`): vertical stepper with a
**per-step description under the current step** and the **timestamp** of each
completed step — both come live from the backend (`sunny_tracking`).

## 4. Order detail

VIEW ORDER DETAILS (`img/13-order-detail.png`): Gift tag + Complementary Gift
Bag line, stepper, delivery address, collapsible price breakup, payment mode,
DOWNLOAD INVOICE (**disabled until an invoice exists** — correct for fresh
orders), CANCEL ORDER.

## 5. Cancel flow

From the card or the detail view:

1. CANCEL ORDER → confirm dialog (CONTACT SUPPORT | PROCEED TO CANCEL) — `img/14-cancel-confirm.png`
2. Reason list is **admin-configurable** (Stores → Config → Sales → Order
   Cancellation on the Magento side) — the four current reasons render as radios.
3. Selecting **Other** disables CONFIRM until a comment is typed, with helper
   text — `img/15-cancel-reason-other-validation.png`
4. Real reason + optional comment → CONFIRM — `img/16-cancel-reason-filled.png`
5. Success dialog "Order Cancellation" with refund note + order id — `img/18-cancel-success.png`
6. The order leaves In Progress instantly and appears under **Cancelled** —
   `img/17-cancelled-tab.png`. For an unpaid COD order the refund stepper is a
   single "Order Cancelled" step (no money to refund).

Server enforces: cancel blocked once shipped; double-cancel is treated as
success (idempotent). The reason and the customer's comment land on the order's
status history in Magento admin.

## 6. Delivered state (ops precondition)

Store team advances the order in Magento admin: invoice → status *Packaged* →
Ship → status *Out for Delivery* → status *Delivered* (order view → comment
with status). Each change stamps the customer-visible stepper.

Delivered card (`img/19-delivered-tab.png`):
- Badge **Delivered**, Delivery by = actual delivered date
- All 5 steps completed
- **DOWNLOAD INVOICE enabled**, TRACK, **RETURN ORDER**
- Note: **"Orders can be returned till <delivered + 15 days>"** (config
  `returns/window_days`)

## 7. Invoice download

DOWNLOAD INVOICE on an invoiced order downloads `invoice-<order>.pdf`.
Mechanics QA should know: the file is generated on demand, stored privately in
S3, and served via a 15-minute pre-signed URL. The CDN cannot serve invoices
(returns 403) — verified. Un-invoiced orders get a disabled button.

## 8. Return flow

Only on Delivered orders inside the return window:

1. RETURN ORDER → confirm dialog — `img/20-return-confirm.png`
2. Reason list (admin-configurable: Stores → Config → Sunny Diamonds → Order
   Flow → Returns): Damaged product / Wrong item received / Quality not as
   expected / Size issue / Other (comment required) — `img/21-return-reason.png`
3. CONFIRM RETURN → "Return Requested" success dialog — `img/22-return-success.png`
4. Order moves to **Returned** tab with badge **Return In Progress** and a
   4-step refund stepper: Return Initiated → Product Picked Up → Refund
   Initiated → Refunded Successfully — `img/23-returned-tab-inprogress.png`
5. One return per order; a second attempt is rejected server-side. Window
   expiry is enforced server-side too.

**Ops side:** Magento admin order view gains a *Return Request* panel with the
reason/comment and **Mark Picked Up** / **Reject Return** buttons. Creating the
credit memo (normal admin refund) automatically advances the stepper to
**Refund Initiated** — `img/24-return-refund-initiated-detail.png` shows the
customer view after pickup + credit memo, including the refund ETA (initiated +
7 days). "Refunded Successfully" is set automatically by the Razorpay
`refund.processed` webhook (online payments) or by a daily fallback job after
the configured window; rejecting a return puts the order back to Delivered.

---

## Known issues found in this run (dev, 2 Aug 2026)

| # | Severity | Issue |
|---|---|---|
| 1 | fixed during run | Cancel/return mutation returned 500 ("Internal server error") — stale in-memory order broke response serialization. Fixed in `166f58c` + regenerated interceptors. Retest passed. |
| 2 | high | **Payment Mode shows "Check / Money order"** for COD orders — checkout places COD using the `checkmo` method. Should use/label `cashondelivery`; also makes the refund note read "Original payment method" for COD returns. |
| 3 | medium | Order detail item card is missing the **"Size: N | Metal"** line (present in cart/checkout; RD mock expects it). |
| 4 | medium | **Gift note text is not shown** on the order detail (only "Complementary Gift Bag"); grouped/order-level gift message needs rendering. |
| 5 | low | Order-confirmation page says "delivered by 16 August" while backend/My Orders say 12 August — confirmation uses its own +14d copy instead of the backend date. |
| 6 | low | Unpaid-COD cancellations still show "Refund to Original payment method expected in 5-7 business days" (success dialog) and an "Estimated Delivery: 5-7 business days" caption on the cancelled card — should be suppressed when refund amount is 0. |
| 7 | low | Refund steppers reuse the caption "Estimated Delivery" for the refund window — wording. |
| 8 | low | PDP/catalog: size option label is "**Ring Size Diamond**" — should be "Ring Size". |
| 9 | low | Checkout heading typo "Payment **Mehtod**". |
| 10 | env | Several catalog SKUs have source qty 0 → admin shipment fails ("Not all of your products are available"). Dev data issue, not code. |

Not covered in this run: engraving (no engraving custom options configured on
catalog yet), Razorpay online-payment orders and their webhook-driven
"Refunded Successfully" transition (needs a sandbox card payment), guest
tracking page, partial shipments.

# DFE touchpoints — CMS position rules

**Audience:** Client Admin (Strapi), QA  
**Scope:** Jewellery PLP product grid promos (`Product Landing Page` → `listingCards`)  
**Page size:** 10 products per load-more request (desktop and mobile)

Positions apply **per 10-product segment** (each load-more batch), not across the entire scroll.

---

## Field reference

| Field | Viewport | Rule |
|-------|----------|------|
| `desktopPosition` | Width ≥ 768px | Integer **≥ 1** |
| `mobilePosition` | Width &lt; 768px | Integer **≥ 1** |
| `isActive` | Both | `false` → card hidden |
| `description`, `cta`, `image` | Both | Required for card to publish (mapper drops incomplete entries) |

| Grid rule | Detail |
|-----------|--------|
| Slot numbering | **1-based**, left-to-right, row by row (2 columns mobile, 3 columns desktop) |
| Slot content | One product **or** one promo per slot |
| Same slot, two cards | Only the **first** card wins for that viewport |
| Zero products | No promos (empty listing) |
| Repeat | Same CMS positions apply on **every** segment of up to 10 products |

---

## Step 1 — In-grid placement (eligible slots)

For promo at slot **P** in a segment with **N** products (N ≤ 10):

| Step | Calculation |
|------|-------------|
| Promos before P | Count of listing cards with position **&lt; P** (same viewport) |
| Products required before P | **(P − 1) − promos before P** |
| Show in-grid at P? | **Yes** if products required **≤ N**; **No** if **&gt; N** |

---

## Step 2 — End-of-segment fallback (current implementation)

| Rule | Detail |
|------|--------|
| When | After all products in the segment (and any in-grid promos) |
| What | Each CMS card **not yet placed** in that segment is appended **at the end** of the segment |
| Order | Ascending position (`desktopPosition` or `mobilePosition`) |
| Duplicates | Never append a card already placed in-grid in the same segment |

---

## One promo — in-grid eligibility (N = segment product count)

| Position P | Products required before P | N = 10 | N = 6 | N = 3 |
|------------|----------------------------|--------|-------|-------|
| 3 | 2 | In-grid | In-grid | In-grid |
| 4 | 3 | In-grid | In-grid | In-grid |
| 7 | 6 | In-grid | In-grid | End only* |
| 8 | 7 | In-grid | End only* | End only* |
| 10 | 9 | In-grid | End only* | End only* |

\*Not eligible in-grid → promo still appears **at end of segment** (Step 2).

---

## Two promos — in-grid eligibility (same viewport)

Positions **4** and **8**:

| Promo | P | Promos before P | Products required | N = 10 | N = 7 | N = 5 |
|-------|---|-----------------|-------------------|--------|-------|-------|
| A | 4 | 0 | 3 | In-grid | In-grid | In-grid |
| B | 8 | 1 | 6 | In-grid | In-grid | End only* |

Positions **7** and **14** (page size 10):

| Promo | P | Promos before P | Products required | N = 10 | In-grid @ N = 10 | End fallback @ N = 10 |
|-------|---|-----------------|-------------------|--------|------------------|-------------------------|
| A | 7 | 0 | 6 | 10 | Yes | No (already placed) |
| B | 14 | 1 | 12 | 10 | No | **Yes** (after segment products) |

---

## Short listings — combined behavior

| Products loaded | Promos @ 7 & 14 (example) | Expected |
|-----------------|---------------------------|----------|
| 3 (one segment) | Both ineligible in-grid | 3 products, then **both** promos at bottom |
| 13 (10 + 3) | Segment 1: full | In-grid @ 7 + promo @ 14 at **end** of first 10 |
| | Segment 2: 3 products | Promo @ 7 **at end** after 3 products (and @ 14 at end if not placed) |
| 20 (two full segments) | Each segment | Same pattern **repeated** per segment |

---

## Filters, sort, load more

| Scenario | Position behavior |
|----------|-------------------|
| Load more | New segment(s) of up to 10 products; rules repeat per segment |
| Filters / sort | Same CMS positions; segments rebuilt from current product list |
| Last partial segment | N = remaining product count; in-grid + end fallback use that N |
| Empty results | No promos |

---

## Admin checklist

| # | Action |
|---|--------|
| 1 | Edit **Product Landing Page** → **listingCards** |
| 2 | Set **desktopPosition** and **mobilePosition** (per segment, not global scroll index) |
| 3 | For two promos on every **full** page: choose positions that pass Step 1 for N = 10, or rely on Step 2 for high slots (e.g. 14) |
| 4 | Publish; allow ~60s cache revalidation before QA |

---

## QA quick validation

| # | Check | Pass |
|---|--------|------|
| 1 | ≥ 10 products, two promos (e.g. 7 & 14) | In-grid + end placement per segment; no blank grid cells |
| 2 | Load more (20+ products) | Pattern repeats each full 10-product block |
| 3 | ≤ 3 products | Products first, then all active promos at bottom |
| 4 | 13 products | Second segment: products then end promos |
| 5 | Filter to 0 | Empty state; no promos |
| 6 | Resize at 768px | Mobile vs desktop positions |

---

## Implementation reference

- Grid merge: `web/src/features/jewellery-product/utils/plpListingCards.ts`
- CMS types: `web/src/services/product-landing/product-landing-page.types.ts` (`listingCards`)
- Unit tests: `web/scripts/test-plp-listing-cards.mjs`

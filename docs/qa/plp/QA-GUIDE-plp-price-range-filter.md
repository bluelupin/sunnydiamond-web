# PLP — By Price Range Filter — QA Test Guide

**Where to test:** Jewellery listing pages — `/jewellery` or `/jewellery/<category>` (e.g. Rings)  
**What to test:** Filters panel → **By Price Range** (slider + **Min Amount** + **Max Amount**)  
**Login required:** No

---

## Before you start

1. Open a jewellery listing page with products loaded.
2. Tap/click **Filters** in the toolbar.
3. Confirm **By Price Range** is visible with a two-thumb slider and Min/Max fields.
4. Note the **maximum price** shown on the slider — it comes from the catalog and may differ per category (do not assume a fixed amount).

Test on **mobile** (filter drawer) and **desktop** (filter panel on the right).

---

## Test cases

### 1. Default state

| # | Steps | Expected result |
|---|---|---|
| 1.1 | Open Filters without changing anything | Slider, Min Amount, and Max Amount show default range |
| 1.2 | Close Filters without applying | Product list unchanged |
| 1.3 | Open Filters again → **Apply Filters** without changes | Apply button is disabled |

---

### 2. Slider

| # | Steps | Expected result |
|---|---|---|
| 2.1 | Drag the **left (min)** thumb to a higher price | Min Amount updates; slider track updates |
| 2.2 | Click **Apply Filters** | Product list refreshes; only products in range shown |
| 2.3 | Re-open Filters | Min thumb and Min Amount match applied value |
| 2.4 | Reset (see §7), drag **right (max)** thumb lower | Max Amount updates |
| 2.5 | Apply | Products above max price are excluded |

**Check:** Min thumb never moves past max thumb.

---

### 3. Min Amount (manual entry)

| # | Steps | Expected result |
|---|---|---|
| 3.1 | Type `100000` in Min Amount | Min slider moves to match |
| 3.2 | Apply | Products below ₹1,00,000 are excluded |
| 3.3 | Enter a **negative** value | Not accepted |
| 3.4 | Enter a value **higher than the catalog maximum** | Error shown; Apply disabled |

---

### 4. Max Amount (manual entry)

| # | Steps | Expected result |
|---|---|---|
| 4.1 | Type `300000` in Max Amount | Max slider moves to match |
| 4.2 | Apply | Products above ₹3,00,000 are excluded |
| 4.3 | Clear Max Amount (leave empty) and blur | Treated as no upper limit up to catalog max |
| 4.4 | Enter a value **higher than the catalog maximum** | Error: *Maximum amount cannot exceed ₹…* |
| 4.5 | Apply while error is visible | Filter not applied; list unchanged |

---

### 5. Invalid range (min greater than max)

| # | Steps | Expected result |
|---|---|---|
| 5.1 | Set Min Amount to `500000` | — |
| 5.2 | Set Max Amount to `200000` | Error: *Minimum amount cannot be greater than maximum amount.* |
| 5.3 | Click Apply | Filter not applied |
| 5.4 | Fix Max to `600000` | Error clears; Apply works |

---

### 6. Apply behaviour

| # | Steps | Expected result |
|---|---|---|
| 6.1 | Move slider or type in fields **without** clicking Apply | Product list does **not** change yet |
| 6.2 | Click **Apply Filters** | List refreshes with filtered products; drawer/panel closes |
| 6.3 | Re-open Filters | Selected range still shown |

---

### 7. Clear All

| # | Steps | Expected result |
|---|---|---|
| 7.1 | Apply a price filter | List is filtered |
| 7.2 | Open Filters → **Clear All** | Min/Max reset to defaults; **all** drawer filters cleared |
| 7.3 | Check product list | Full unfiltered list (for price) |

---

### 8. URL (share & refresh)

| # | Steps | Expected result |
|---|---|---|
| 8.1 | Apply min ₹1,00,000 and max ₹5,00,000 | URL includes `minPrice=100000` and `maxPrice=500000` |
| 8.2 | Refresh the page | Same price filter still applied |
| 8.3 | Open `/jewellery?minPrice=50000&maxPrice=200000` directly | Listing opens with that range |
| 8.4 | Clear All | `minPrice` and `maxPrice` removed from URL |

---

### 9. With other filters

| # | Steps | Expected result |
|---|---|---|
| 9.1 | Select a **Metal Type** (or category chip) **and** a price range → Apply | Both filters apply together |
| 9.2 | Change sort to **Price: Low to High** | Sort works on filtered products |
| 9.3 | Click **Load more** | More products still respect price filter |
| 9.4 | Switch category tab | Page works without errors; price section updates or hides as appropriate |

---

### 10. Responsive

| # | Steps | Expected result |
|---|---|---|
| 10.1 | Mobile width | Bottom drawer; Apply and Clear All always reachable |
| 10.2 | Desktop width | Right-side filter panel |
| 10.3 | Both | No horizontal scrolling; inputs and slider usable |

---

## Regression checks

After testing price filter, quickly confirm these still work:

- [ ] Product cards, images, and links open correctly
- [ ] Wishlist toggle on products
- [ ] Category tabs switch listings
- [ ] Sort dropdown works
- [ ] “No products” empty state when filter matches nothing
- [ ] No errors in browser console when opening/closing/applying filters

---

## 5-minute smoke test

1. `/jewellery` → Filters → move min thumb → **Apply** → product count drops.  
2. Set Max manually → **Apply** → URL shows `maxPrice`.  
3. Min &gt; Max → error shown, Apply blocked.  
4. **Clear All** → full list returns.  
5. Reload page with `?minPrice=100000` → filter still applied.

---

**Pass:** All cases above behave as expected on mobile and desktop.  
**Fail:** Log steps, expected vs actual, browser/device, and screenshot; note the category/page URL used.

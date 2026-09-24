# QA test plan — tracker rows 14–20 (+ related fixes)

Round 2 of the QA sheet, plus four long-standing problems found while fixing it.
Written 2026-08-27.

## Environment

| What | Where |
|---|---|
| Storefront | https://sunnydiamonds-web-dev.on-forge.com |
| Magento admin | https://sunnydiamond-store-dev.on-forge.com/admin |
| Test customer | `sunnydiamond.qa@yopmail.com` — mailbox at https://yopmail.com |
| Test emails | All transactional mail goes to the address on the order; use a yopmail address |

### Test products

| Category | Product | Used for |
|---|---|---|
| Ring (engravable) | `vanya-diamond-finger-ring` | Engraving, fonts, cart lines, ring size |
| Ring (engravable) | `anya-diamond-finger-ring` | Second engravable ring |
| Bangle | `elowyn-diamond-bangle` | Bangle size chart |
| Bracelet | `aarnaelle-diamond-bracelet` | Bracelet size chart |
| Necklace | `celestial-diamond-necklace` | Chain length |

Product URL: `https://sunnydiamonds-web-dev.on-forge.com/product/<name-above>`

### Before you start

Two deploys are separate from the Magento one:

- **Storefront (web)** — anything marked _needs web deploy_ only works once the dev
  site is running commit `4053c9f0` or later. Ask before testing those if unsure.
- **CMS (Strapi)** — the grouped headings in the bracelet chart (T16b, step 3) need
  the CMS deploy. The bracelet **sizes** themselves are already live; only the two
  section headings wait on it.

Everything on the Magento side (statuses, size options, engraving options) is live now.

---

## T14 — An order can be marked Delivered

**Was:** `Delivered` never appeared in the admin status dropdown, so no order could
be moved past processing.

1. Admin → **Sales → Orders**, open any order whose State is `Processing`
   (a COD order is the easy case — it stays there until invoiced).
2. Scroll to **Comments History** and open the **Status** dropdown.
3. **Expect:** `Delivered`, `Return In Progress` and `Returned` are all in the list.
4. Choose `Delivered`, tick **Notify Customer by Email**, click **Submit Comment**.
5. **Expect:** the order status becomes Delivered; the customer receives the
   delivered email; on the storefront the order's tracker shows the Delivered step.
6. Open that order on the storefront (**My Orders → the order**).
   **Expect:** no Cancel button — a delivered order cannot be cancelled.
7. Repeat step 4 with `Return In Progress`, then `Returned`. Both should be
   accepted and cancellation stays unavailable.

---

## T15 — OTP timer survives a wrong code

**Was:** entering a wrong OTP hid the countdown; it kept running invisibly and
looked like it restarted mid-count. Resending during the cooldown sent nothing.

1. Storefront → Sign in → enter `sunnydiamond.qa@yopmail.com` → **Continue**.
2. Note the countdown (e.g. `Resend code in 00:59`).
3. Enter a deliberately wrong 6-digit code and submit.
4. **Expect:** the error message appears **and** the countdown is still visible next
   to it, still counting down from where it was — not restarted, not hidden.
5. **Expect:** `RESEND CODE` is not offered while the countdown is running.
6. Wait for the countdown to reach zero.
   **Expect:** `RESEND CODE` appears.
7. Tap `RESEND CODE`. **Expect:** a new code arrives in yopmail **and** the
   countdown restarts from the full duration.
8. Enter the newest code. **Expect:** sign-in succeeds.

_Needs web deploy._

---

## T16 — Bangle sizes match the client sheet

**Was:** the chart listed 33 rows numbered 1–33; the real size designations were
hidden in the measurement column.

1. Open `elowyn-diamond-bangle`.
2. Open the size dropdown. **Expect:** 19 options, starting `1.8/16 (38.10 MM)` and
   ending `2.10/16 (66.675)`. No plain `1`, `2`, `3`… ordinals.
3. Tap **Find your size**. **Expect:** the drawer's columns are headed
   **Circumference (in mm)**, **Diameter (in mm)** and **Size** — not `unit`,
   `diameter`, `sizeLabel`.
4. **Expect:** 19 rows, `1.8/16` through `2.10/16`, each with its circumference and
   diameter. Nothing above `2.10/16`.

_Step 3 needs web deploy; steps 2 and 4 are live now._

---

## T16b — Bracelet chart is a bracelet chart

**Was:** the bracelet guide held a copy of the bangle chart.

1. Open `aarnaelle-diamond-bracelet`.
2. Open the size dropdown. **Expect:** 25 options — ten ranges (`32-42`, `35-45`,
   `36-46`, `39-49`, `40-50`, `42-52`, `45-55`, `47-57`, `48-58`, `50-60`) followed
   by fifteen lengths (`110 mm` … `200 mm` ). No `1.8/16`-style bangle sizes.
3. Tap **Find your size**. **Expect:** the same 25 values under two headings,
   **Oval** and **Tennis & Chain**. _(Needs the CMS deploy — until then they appear
   as one correctly ordered list with no headings, which is not a bug to raise.)_

---

## T17 — Necklaces offer a chain length

**Was:** necklaces had no size UI at all.

1. Open `celestial-diamond-necklace`.
2. **Expect:** a selector labelled **Chain Length** with `14"` through `30"`
   (12 values), and a **Find your size** link.
3. Open the drawer. **Expect:** title **Chain Length Guide**, one **Size** column
   only — no empty Circumference/Diameter columns, and no tall blank block above
   the table.

_Step 3's single-column layout needs web deploy._

---

## T18 — A brand-new account can reach Profile

**Was:** reported as newly registered users being unable to open Profile. Could not
be reproduced on the current build; the session handling behind it was hardened, so
please try hard to break it.

1. Use a **fresh** yopmail address (e.g. `sdqa-<yourname>-01@yopmail.com`).
2. Sign up through the storefront, complete OTP, fill the registration form.
3. **Expect:** you land signed in, and **Profile** opens with your details.
4. Reload the page. Navigate away to the home page and back to Profile.
   **Expect:** still signed in every time; never bounced to sign-in or home.
5. Close the tab, reopen the site. **Expect:** still signed in.
6. If you ever *are* bounced, note the exact time and tell us — the fix distinguishes
   a real "not authorized" answer from the server being briefly unreachable, and the
   timestamp lets us check the server log.

_Needs web deploy._

---

## T19 — Two engraved copies of one ring stay separate

**Was:** the second line failed with _"Could not add this item as a separate bag line
because the engraving field is full."_ and later engraving edits always overflowed.

1. Open `vanya-diamond-finger-ring`. Choose a size, add engraving text `ABC`,
   add to bag.
2. Return to the same product. Choose a size, engraving text `XYZ`, add to bag.
3. **Expect:** the bag shows **two separate lines**, one reading `ABC`, one `XYZ` —
   not one line with quantity 2, and no error message.
4. On one line tap **Modify** next to the engraving, type a full-length value
   (10 characters, e.g. `ABCDEFGHIJ`), save.
   **Expect:** it saves; no "engraving field is full" error.
5. Reload the bag. **Expect:** both lines and both engravings are unchanged.
6. **Note:** lines added to a bag *before* today may still misbehave — remove and
   re-add them. That is expected, not a new bug.

---

## T20 — Engraving font can be chosen and changed

**Was:** no product had fonts selected, so the font dropdown never appeared anywhere.

1. Open `vanya-diamond-finger-ring` and turn on engraving.
2. **Expect:** a font dropdown with 10 fonts (Algerian, Edwardian Script, Lucida
   Handwriting, Monotype Corsiva, Pinyon Script, …).
3. Pick a font other than the first, add to bag.
4. In the bag, tap **Modify** on that line.
   **Expect:** a **font selector** on the cart line, with the same 10 fonts, showing
   the font you picked.
5. Change the font and save. Reload the bag.
   **Expect:** the new font is still shown.
6. Edit only the engraving *text* (leave the font alone) and save.
   **Expect:** the font does not change.
7. **Note:** the preview renders in a system font — the ten client fonts are not
   installed on the site yet. Report the *name* being wrong, not the shape.

_Steps 4–6 need web deploy._

---

## T21 — The chosen size reaches the order (new)

The important one. Until now the size a customer picked was never sent to Magento —
it lived only in the browser, so orders reached the workshop with no size on them.

1. Add `vanya-diamond-finger-ring` to the bag with size **12** selected.
2. Complete checkout (COD is fine) and place the order.
3. **Expect — storefront:** My Orders → the order shows `Ring Size: 12`.
4. **Expect — email:** the order confirmation lists `Ring Size: 12` under the item.
5. **Expect — admin:** Sales → Orders → the order → the item row shows
   `Ring Size 12`.
6. **Expect — invoice:** invoice the order and open the PDF; the size is on the item.
7. Repeat with a bangle, a bracelet and a necklace.
   **Expect:** `Bangle Size`, `Bracelet Size` and `Chain Length` respectively, each
   carrying the value chosen on the product page.
8. **Expect:** nowhere in any of these does a line called **Cart Line Key** appear —
   it is internal and must never be shown to a customer or to admin.

---

## T22 — The bag behaves on a second device (new)

**Was:** the font list lived in browser storage, so a bag opened elsewhere lost it.

1. Sign in as the test customer on device/browser **A**, add an engraved ring with a
   chosen font, and keep it in the bag.
2. Sign in as the same customer on device/browser **B** (a different browser profile
   is enough — an incognito window shares nothing with the first).
3. Open the bag on **B**, tap **Modify** on the engraved line.
   **Expect:** the font selector is there with all 10 fonts and the saved font
   selected — not an empty or missing selector.
4. Change the font on **B** and save. Reload on **A**.
   **Expect:** **A** shows the new font.
5. On **B**, change the line quantity, then go to checkout and enter an address.
   Return to the bag.
   **Expect:** the font selector is still fully populated (it must not go blank after
   a quantity change or a checkout step).

_Needs web deploy._

---

## Regression sweep

Quick passes over things the changes sit next to:

| Check | Expect |
|---|---|
| Add a ring **without** engraving | No engraving text on the line; COD still offered at checkout |
| Add an engraved item | COD correctly restricted for engraved orders (unchanged rule) |
| Cancel a `processing`, un-delivered order from My Orders | Still works, refund still issued |
| Sign in with an existing account | Unchanged; OTP flow as before |
| Sign out and back in | Bag and wishlist behave as before |
| Product page for a category with no sizes (earrings, pendants, nose pins) | **No** size selector at all |
| Change quantity in the bag | Line keeps its engraving, font and size |

---

## T23 — Ring chart and ring dropdown agree

The chart used to list sizes 1–35 plus a stray `99` while the dropdown offered 2–30,
so customers saw sizes they could not buy. Corrected 27 Aug.

1. Open `vanya-diamond-finger-ring` and open the size dropdown.
   **Expect:** 29 options, `2` through `30`, no gaps.
2. Tap **Find your size**.
   **Expect:** 29 rows, `2` through `30` — every size in the chart is also in the
   dropdown and vice versa. No `1`, no `31`–`35`, no `99`.
3. **Expect:** size `30` is present in both, with circumference `70` and
   diameter `22.3`.

_Live now (chart data); the drawer's column headers need the web deploy._

**All four charts now match Magento one-for-one:** rings 29, bangles 19, bracelets
25, necklace 12. Bangle labels are the only cosmetic difference — the dropdown shows
`1.8/16 (38.10 MM)` where the chart shows `1.8/16` plus its measurement columns.
That is intended, not a defect.

---

## Known and not a bug (please don't raise these)

- **Font previews use a system typeface.** The ten client fonts are not installed on
  the site yet — only the font *names* are live.
- **Bag lines created before 27 Aug** may carry a broken engraving value. Remove and
  re-add them.
- **Bracelet chart headings** (`Oval` / `Tennis & Chain`) are pending the CMS deploy.
- The label above the ring size selector reads "Ring Size Diamond" — that is CMS
  content, being corrected separately.

## Reporting

Please note, for each failure: the product, the exact steps, whether you were signed
in, the browser/device, and the time (so we can match it to the server log).

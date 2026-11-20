# Sunny Diamonds BI tracking

## Status - 4 November 2026

| Area | Current status | Evidence / next check |
| --- | --- | --- |
| Website integration | Implemented in the staging branch | `fe3a241f` leaves GTM as the only provider loader. The website emits consent-gated data layer events. |
| Provider tags | Created in GTM, per project owner | GA4, Meta Pixel and Clarity tags were reported as created. Publication, consent triggers, ID mappings and live requests are not yet independently verified. |
| Consent audit | Implemented in web and CMS code | Browser sends `/api/consent` to the protected CMS record endpoint. An earlier staging POST returned `403 Invalid origin`; the staging-origin fix is present in the current branch. Confirm a fresh POST returns 200 and a CMS record appears. |
| Cross-browser GA4 identity | Implemented in code | A server-side HMAC of verified Magento customer ID is pushed as `user_id` only with Analytics consent. Confirm the secret is set and GTM maps `user_id` to GA4; test two browsers. |
| Consent settings access | Open design gap | Footer settings button was removed because it is not in approved Figma. No approved entry point exists for reopening preferences after dismissal. |
| Policy evidence | Open gap | `noticeVersion=2026-11-02` is hardcoded; the CMS Privacy Policy has no explicit version field linked to consent records. |
| Login audit behavior | Open design decision | The current login flow creates a separate customer-linked audit record. Reuse or update of the original choice record has not been implemented. |

Do not treat provider setup as verified until a consent POST succeeds, GTM Preview shows the expected tag firing, and Network shows the corresponding GA4, Meta and Clarity requests. No production activation or live provider verification is established by this document.

## Deployment

GTM is the only provider loader. The website puts provider IDs and events in `dataLayer`, then loads GTM after an audited cookie choice. It does not inject GA4, Meta Pixel, or Clarity scripts directly. Set these values on the Next.js deployment and rebuild:

| Variable | Value | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-ZTVG0Z45F8` | GA4 measurement |
| `NEXT_PUBLIC_META_PIXEL_ID` | `2429014724593167` | Meta Pixel |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `z7qlvvk1tv` | Clarity recordings |
| `NEXT_PUBLIC_GTM_ID` | `GTM-MT4B5QJZ` | Enables GTM-owned provider tags |
| `ANALYTICS_USER_ID_SECRET` | Private random value | Stable cross-browser GA4 user ID after verified login |

Keep `ANALYTICS_USER_ID_SECRET` server-only and unchanged across deployments. In GTM, use Data Layer Variables `ga4_measurement_id`, `meta_pixel_id`, `clarity_project_id`, and `user_id` for the provider tags. Apply Analytics consent to GA4 and Clarity and Marketing consent to Meta. Do not add All Pages triggers that bypass consent. `NEXT_PUBLIC_APP_ENV` does not gate tracking. Provider IDs are public browser identifiers, not secrets. The old `NEXT_PUBLIC_GA_MEASUREMENT_ID` is unused.

The Next.js server also needs `STRAPI_API_TOKEN` or `CMS_API_TOKEN` with permission for `POST /api/cookie-consents/record`. Deploy the Strapi route and content type before the website change. The CMS audit must return success before any optional provider loads.

## Behavior

- GTM loads only after confirmed Analytics or Marketing consent. A valid `NEXT_PUBLIC_GTM_ID` is required; without it, no optional provider loads.
- The website emits one explicit `page_view` per route transition, plus ecommerce and other data layer events. Configure the GA4 tag in GTM to use those events with automatic page views disabled. The server derives a pseudonymous GA4 User ID from the verified Magento customer ID. Guest, withdrawal, and logout clear it. An initial page view before the session check can be anonymous.
- Configure Meta Pixel in GTM to fire only with Marketing consent. Map website `page_view`, `view_item`, `search`, `add_to_wishlist`, `add_to_cart`, `begin_checkout`, and `purchase` to the corresponding Meta standard events. Do not enable advanced matching or send contact details.
- Configure Clarity in GTM to fire only with Analytics consent and `clarity_allowed=true` on the homepage, jewellery listing, or product detail routes. The website updates loaded Clarity with Consent V2 signals and pauses it on other routes. Mask sensitive fields in Clarity project settings. Confirm that account and checkout navigation produces no collection traffic.

The browser stores the current choice and a pending request ID. Each new accept, reject, or settings change is forwarded through `/api/consent` to the CMS audit. Failed audit requests keep optional providers off and retry while the page is open. The browser does not restore consent from CMS. A visible, approved entry point for reopening preferences after dismissal is still pending design approval.

## Verification

In a fresh browser, confirm no GTM, GA4, Meta, or Clarity requests before consent. Confirm `POST /api/consent` returns 200 and `gtm.js?id=GTM-MT4B5QJZ` loads. After accepting Analytics, use GTM Preview to confirm the GA4 and eligible Clarity tags fire; check for a GA4 `g/collect` request and Clarity traffic. After accepting Marketing, confirm the Meta tag fires and `facebook.com/tr?id=2429014724593167` appears. Reject and withdrawal must stop further optional event sends; withdrawal reloads the page to unload already loaded scripts. Verify the same pseudonymous GA4 User ID on subsequent hits from two browsers signed into the same account.

References: [Google tag setup](https://developers.google.com/tag-platform/gtagjs), [GA4 ecommerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce), [Microsoft Clarity Consent V2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

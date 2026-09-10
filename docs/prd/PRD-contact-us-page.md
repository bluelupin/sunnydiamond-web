# Contact Us Page — Product Requirements Document (PRD)

**Document type:** End-to-end PRD (CMS + Frontend)  
**Page route:** `/contact`  
**Last updated:** September 2026  
**Audience:** Product, CMS editors, Frontend developers, QA

---

## 1. Executive Summary

The **Contact Us** page lets customers reach Sunny Diamonds through phone, email, WhatsApp, and an enquiry form. All visible copy, contact options, form configuration, Visit Us block, and SEO are driven by **Strapi CMS** (`api/contact-page`). The Next.js frontend fetches CMS data server-side, normalizes it into a typed page model, and renders sections conditionally — **no hardcoded page content fallbacks**.

| Area | Source of truth |
|------|-----------------|
| Page layout & sections | Strapi `contact-page` single type |
| Form field labels & reason dropdown | Strapi `contact-page` → `formSection` + live `generic-forms` by `formTag` |
| Form submission | BFF `POST /api/generic-submissions/submit` → Strapi `api/generic-submissions/submit` |
| Visit Us block | Strapi `visitSection` (shared PDP Visit Us component) |

---

## 2. Goals

1. Provide clear, CMS-managed contact channels (Call Us, Email, WhatsApp, etc.).
2. Capture structured enquiries via a validated form tied to a CMS `formTag`.
3. Support logged-in users with profile prefill (name, email, phone).
4. Match brand UI patterns (tertiary CTAs, cart-style checkbox, toast feedback).
5. Behave correctly on desktop vs mobile for phone numbers (copy vs dial).
6. Remain resilient when CMS sections are inactive or missing (graceful omission, not broken layout).

### Non-goals

- In-page live chat widget (not part of this page).
- Order/support ticket management (handled elsewhere).
- Bespoke jewellery contact flow (`/bespoke` uses `contact-bespoke-page` — separate CMS type).

---

## 3. User Journeys

### 3.1 Guest — submit enquiry

1. User lands on `/contact`.
2. Reads intro text and contact option cards.
3. Fills enquiry form (name, phone, email, reason, message).
4. Accepts consent checkbox (if enabled in CMS).
5. Submits → success toast → form resets.

### 3.2 Logged-in customer — submit enquiry

1. Same as guest; name, email, and phone prefill from **My Profile** once (does not overwrite fields the user already typed).

### 3.3 Call Us — phone interaction

| Device | Action on phone number tap/click |
|--------|----------------------------------|
| **Desktop** (viewport ≥ 768px) | Copy number to clipboard + toast “Phone number copied” |
| **Mobile** (viewport < 768px) | Open native dialer via `tel:` link |

### 3.4 Email / WhatsApp

- **Email:** `mailto:` link (tertiary CTA).
- **WhatsApp:** External `wa.me` or full URL (opens in new tab when external).

### 3.5 Visit Us

- Optional bottom section; CTA may open Book a Visit flow or link to store locator (CMS-driven).

---

## 4. Page Architecture

### 4.1 Route & rendering

| Item | Detail |
|------|--------|
| **URL** | `/contact` |
| **App file** | `web/src/app/(site)/contact/page.tsx` |
| **Revalidate** | 300 seconds (ISR) |
| **Loading** | `Suspense` + `ContactPageSkeleton` |
| **Main view** | `ContactPage` (`web/src/features/contact/components/ContactPage.tsx`) |

### 4.2 Section order (top → bottom)

```
┌─────────────────────────────────────┐
│ 1. Hero (optional)                  │
├─────────────────────────────────────┤
│ 2. Intro + Contact info cards       │
│    (optional — either or both)      │
├─────────────────────────────────────┤
│ 3. Enquiry form (optional)          │
├─────────────────────────────────────┤
│ 4. Visit Us (optional)              │
└─────────────────────────────────────┘
```

### 4.3 Conditional visibility rules

| Section | Shown when |
|---------|------------|
| Hero | CMS hero mapped successfully (`title` required; image/video optional) |
| Intro + cards block | `introText` **or** at least one valid `contactOption` |
| Form | `formSection` active + `formTag`, title, submit label present |
| Visit Us | `visitSection` active + title + at least one image URL |
| Entire info subsection | Hidden if both intro and cards are empty |

**Important:** There are **no static fallbacks**. If CMS returns empty data for a section, that section is not rendered.

---

## 5. CMS (Strapi) — Content Model

### 5.1 API endpoint

```
GET {STRAPI_BASE}/api/contact-page?{populate query}
```

**Strapi content type:** `contact-page` (single type)  
**Frontend endpoint key:** `STRAPI_ENDPOINTS.contactPage` → `"api/contact-page"`

### 5.2 Populate requirements

`populate=*` alone returns **HTTP 400** on this type. The frontend uses explicit nested populate (see `contact-page.service.ts`):

- `heroSection` → image, bgImage, heroVideo (desktop/mobile media)
- `contactSection` → `contactOptions`
- `formSection` → `form` → `dynamicFields` → `dropdownOptions`
- `visitSection` → image, showrooms, cta
- `seo` → `ogImage`

### 5.3 Root fields

| CMS field | Type | Purpose |
|-----------|------|---------|
| `introText` | Text | Intro paragraph above contact cards (same copy mobile + desktop) |
| `heroSection` | Component | Hero banner |
| `contactSection` | Component | Contact option cards |
| `formSection` | Component | Enquiry form |
| `visitSection` | Component | Visit Us strip |
| `seo` | Component | Meta tags |
| `locale` | String | i18n (optional fetch param) |

### 5.4 Section visibility (`isActive` / `showField`)

Every major section and contact option respects:

```
visible = isActive ?? showField ?? true
```

If `isActive` is explicitly `false`, section is hidden. If `showField` is explicitly `false`, section is hidden. If both unset, defaults to **visible**.

---

## 6. CMS — Section Specifications

### 6.1 Hero (`heroSection`)

| Field | Required for display | Notes |
|-------|---------------------|-------|
| `title` | **Yes** | Rendered as `<h1>` over media |
| `isActive` / `showField` | — | Section gate |
| `image` or `bgImage` | No | Responsive desktop/mobile images |
| `heroVideo` | No | Optional background video (overrides/static with image per `HeroBackgroundMedia`) |

**Frontend output:** `NormalizedContactHero`  
**Component:** `ContactHeroSection`

---

### 6.2 Contact options (`contactSection`)

| Field | Purpose |
|-------|---------|
| `heading` | Optional section heading (not always displayed in current UI — cards use per-option titles) |
| `contactOptions[]` | Array of contact cards |

#### Each `contactOption`

| Field | Type | Purpose |
|-------|------|---------|
| `type` | `phone` \| `email` \| `link` | Drives link behavior |
| `heading` or `title` | String | **Required** — card title (e.g. “Call Us”) |
| `description` | Text | Optional body copy |
| `availability` | Text | Multi-line hours; parsed as `Label: Value` per line |
| `value` | String | Phone, email, URL, or WhatsApp number |
| `buttonLabel` | String | Link CTA text; generic values (`phone`, `whatsapp`) are ignored for display |
| `sortOrder` | Number | CMS ordering (frontend preserves CMS array order) |
| `isActive` / `showField` | Boolean | Per-card visibility |

#### Availability text format (CMS editor)

```
Monday - Friday: 10:00 AM - 7:00 PM
Saturday: 10:00 AM - 5:00 PM
```

Lines without `:` are shown as value-only rows.

#### Link resolution (mapper logic)

| Detected variant | `href` | Link label |
|------------------|--------|------------|
| `type: phone` or numeric value | `tel:{digits}` | `value` or `buttonLabel` |
| Email (`@` in value) | `mailto:{email}` | email display |
| WhatsApp (label/value contains whatsapp/wa.me) | `https://wa.me/{digits}` or full URL | `WHATSAPP` or custom label |
| HTTP(S) or path | As-is | Custom label |
| Invalid / empty actionable target | Card **omitted** | — |

**Phone fallback:** If a WhatsApp option lacks a dialable value, the mapper uses the first phone option’s value from the same section.

---

### 6.3 Form (`formSection`)

| Field | Required | Notes |
|-------|----------|-------|
| `heading` | One of heading / formName | Form section title |
| `successMessage` | No | Toast description on successful submit |
| `form.formTag` | **Yes** | Links to `generic-forms` collection |
| `form.submitButtonText` | **Yes** | Submit CTA label |
| `form.requiresConsent` | No | Default `true` if unset |
| `form.consentLabel` | No | Full consent sentence; frontend auto-links Terms & Privacy phrases |
| `form.dynamicFields[]` | No | Drives labels/placeholders/reason options |

#### Dynamic field matching (by label + fieldType)

| UI field | Match rule |
|----------|------------|
| Name | `fieldType: text` + label contains `name` or `full` |
| Phone | `fieldType: phone` |
| Email | `fieldType: email` |
| Reason | `fieldType: dropdown` + label contains `reason`, `purpose`, or `contact` |
| Message | `fieldType: textarea` or `text` + label contains `message`, `note`, or `describe` |

Required fields in CMS get `*` appended to label if missing.

#### Live form refresh

On mount, the client also calls:

```
GET api/generic-forms?filters[formTag][$eq]={formTag}&populate=...
```

This can refresh **submit button text** and **reason dropdown options** if the standalone generic form entry is updated without republishing the contact page.

---

### 6.4 Visit Us (`visitSection`)

| Field | Required | Notes |
|-------|----------|-------|
| `sectionTitle` | **Yes** | Section heading |
| `description` | No | Supporting copy |
| `image` or first active `showrooms[].image` | **Yes** (at least one URL) | Background/visual |
| `cta` | No | Label + URL |
| `formCta.modalTag` | No | Book a Visit modal tag |

**Frontend:** Reuses `ProductDetailVisitUsSection` (same as PDP).

---

### 6.5 SEO (`seo`)

| Field | Maps to |
|-------|---------|
| `metaTitle` | `<title>` |
| `metaDescription` | Meta description |
| `canonicalUrl` | Canonical path |
| `metaKeywords` | Keywords meta |
| `ogImage` | Open Graph image |

If SEO block missing or empty, page falls back to `siteConfig` brand defaults with canonical `/contact`.

---

## 7. Frontend — Data Layer

### 7.1 Service

**File:** `web/src/services/contact/contact-page.service.ts`

- `getContactPage()` — React `cache()` wrapped server fetch
- On error → returns `EMPTY_CONTACT_PAGE` (all sections null/empty)
- Optional `locale` query param

### 7.2 Mapper

**File:** `web/src/services/contact/contact-page.mapper.ts`

- `mapContactPage(raw)` → `NormalizedContactPage`
- Types: `web/src/services/contact/contact-page.types.ts`

### 7.3 Normalized page shape

```typescript
NormalizedContactPage {
  hero: NormalizedContactHero | null
  intro: { description, mobileDescription } | null
  infoCards: NormalizedContactInfoCard[]
  form: NormalizedContactForm | null
  visitUs: NormalizedVisitUsSection | null
  seo: NormalizedContactSeo | null
}
```

---

## 8. Frontend — UI Components

### 8.1 File map

| Component | File | Role |
|-----------|------|------|
| `ContactPage` | `ContactPage.tsx` | Orchestrates sections |
| `ContactHeroSection` | `ContactHeroSection.tsx` | Hero media + title |
| `ContactInfoSection` | `ContactInfoSection.tsx` | Intro + contact cards grid |
| `ContactPhoneLink` | `ContactPhoneLink.tsx` | Desktop copy / mobile `tel:` |
| `ContactFormSection` | `ContactFormSection.tsx` | Enquiry form |
| `ContactConsentLabel` | `ContactConsentLabel.tsx` | Parses consent text → policy links |
| `ContactPageSkeleton` | `skeletons/ContactPageSkeleton.tsx` | Loading placeholder |
| `ProductDetailVisitUsSection` | PDP feature | Visit Us block |

### 8.2 Contact info cards layout

- **Desktop:** 3-column grid, equal-height cards, gray background per card
- **Mobile:** Stacked cards with dividers, icon beside CTA link
- **CTA style:** `DetailTextLink` (tertiary underline animation)
- **Phone cards only:** `ContactPhoneLink` instead of plain link

### 8.3 Enquiry form layout

- Max width `1140px`; desktop form area has `gray200` padding wrapper
- Fields: Name → Phone + Email (2-col desktop) → Reason dropdown → Message textarea
- Phone: country code select (`+91` default) + national number input
- Submit: full-width mobile, auto-width desktop; disabled until valid + consent

### 8.4 Consent row

| Element | Implementation |
|---------|----------------|
| Checkbox | `GiftingPanelCheckbox` (same as Cart gift checkbox) |
| Label | CMS `consentLabel` via `ContactConsentLabel` |
| Auto-links | Regex detects “terms & conditions” and “privacy policy” → `DetailTextLink` |
| Terms URL | `/terms-and-conditions` |
| Privacy URL | `/policy-and-certifications?policy=privacy-policy` |

### 8.5 Phone link behavior (`ContactPhoneLink`)

| Breakpoint | Hook | Behavior |
|------------|------|----------|
| `< 768px` | `useIsMobile()` | `DetailTextLink` with `href={tel:...}` |
| `≥ 768px` | `useIsMobile()` | `onClick` → `navigator.clipboard.writeText(label)` + toast |

Clipboard copies CMS **display label** first; falls back to dialable digits from `tel:` href.

---

## 9. Form Validation & Submission

### 9.1 Validation hook

`useAppointmentFormValidation` with options:

- `noteRequired: true` (message required)
- `emailRequired: true`

Validated fields: name, phone (with country code rules), email, message.

Additional client rules:

| Rule | Error |
|------|-------|
| Reason required when CMS provides reason label or options | “Please select a reason” |
| Consent required when `requiresConsent` | “Please accept the terms to continue.” |
| Submit disabled until all pass | Button `disabled` |

Errors show on blur/touch or after submit attempt.

### 9.2 Submit payload

**Client → BFF:** `POST /api/generic-submissions/submit`

```json
{
  "formTag": "<from CMS>",
  "fullName": "Jane Doe",
  "phone": "+919876543210",
  "email": "jane@example.com",
  "reasonForContact": "Product enquiry",
  "message": "I have a question about...",
  "consentAccepted": true,
  "sourcePage": "/contact"
}
```

**BFF → Strapi:** Proxies same flat JSON to `api/generic-submissions/submit` (no `{ data: {} }` wrapper).

### 9.3 Success & error UX

| Outcome | UX |
|---------|-----|
| Success | Toast with `formSection.successMessage` (description only); form resets |
| Failure | Destructive toast: “Unable to send message” + error detail if available |

---

## 10. Authentication Integration

When `useAuth().status === "authenticated"`:

1. `useCustomerProfileContact` loads profile.
2. On first availability, prefills empty fields only:
   - Full name
   - Email
   - Phone (national part)
   - Country code
3. `hasAppliedProfilePrefill` prevents re-overwriting after user edits.
4. Form reset after submit clears prefill flag (logged-in user can get fresh prefill on next visit).

---

## 11. API & Network Diagram

```
Browser                    Next.js BFF                    Strapi CMS
   |                            |                              |
   |-- GET /contact (SSR) ------>|-- GET api/contact-page ----->|
   |                            |<-- JSON ----------------------|
   |<-- HTML -------------------|                              |
   |                            |                              |
   |-- GET generic-forms -------|------------------------------>|
   |   (client, by formTag)     |                              |
   |                            |                              |
   |-- POST /api/generic- ------>|-- POST generic-submissions -->|
   |   submissions/submit       |       /submit                |
```

---

## 12. Performance & Caching

| Mechanism | Value |
|-----------|-------|
| Page ISR `revalidate` | 300s |
| `getContactPage` | React `cache()` per request |
| Hero LCP preload | `preloadPlpHeroLcpImages` for hero URLs |
| Form fetch | `AbortController` on unmount / formTag change |

---

## 13. Accessibility

- Semantic headings: hero `h1`, form `h2`, card titles `h2`
- Form inputs: `aria-invalid`, `aria-describedby` linked to `FormFieldError`
- Checkbox: native input inside `GiftingPanelCheckbox` with `aria-label`
- Skeleton: `aria-busy="true"`, `aria-label="Loading contact page"`
- Phone country select: `aria-label="Country code"`

---

## 14. Error & Edge Cases

| Scenario | Expected behavior |
|----------|-------------------|
| CMS fetch fails entirely | Empty page sections; metadata uses site defaults |
| Hero missing title | No hero section |
| Contact option missing title | Card skipped |
| WhatsApp without valid number and no phone fallback | Card skipped |
| Form missing `formTag` / title / submit | No form section |
| `consentLabel` empty but `requiresConsent` true | Consent row hidden (checkbox not shown) — submit still requires consent internally |
| Generic form live fetch fails | Uses contact-page mapped reason options + labels |
| Clipboard denied (desktop phone) | Toast: “Unable to copy” |
| User resizes across 768px | Phone link switches copy ↔ dial on next render |

---

## 15. CMS Editor Checklist

Use this when configuring Contact Us in Strapi:

- [ ] Hero `title` set; section active
- [ ] Upload desktop + mobile hero images (or video)
- [ ] `introText` written (if intro desired)
- [ ] Each contact card: `heading`/`title`, `type`, `value`, active flag
- [ ] Phone `value` includes country code if needed (e.g. `+91 1800 123 4567`)
- [ ] Availability lines use `Label: Value` format
- [ ] Form `formTag` matches an entry in **Generic Forms**
- [ ] Generic form has dropdown options for “reason” field
- [ ] `submitButtonText` and `successMessage` set
- [ ] `consentLabel` includes phrases **Terms & Conditions** and **Privacy Policy** for auto-linking
- [ ] Visit Us: `sectionTitle` + image uploaded
- [ ] SEO meta title + description filled

---

## 16. QA Test Matrix

### 16.1 Page load

| # | Test | Expected |
|---|------|----------|
| 1 | Open `/contact` | Page loads; skeleton then content |
| 2 | Disable hero in CMS | No hero; other sections shift up |
| 3 | Disable all sections | Minimal/empty page without console errors |

### 16.2 Contact cards

| # | Test | Expected |
|---|------|----------|
| 4 | Call Us on desktop | Click copies number; toast shown; no dialer |
| 5 | Call Us on mobile | Tap opens phone dialer |
| 6 | Email card | Opens mail client (`mailto:`) |
| 7 | WhatsApp card | Opens WhatsApp URL |
| 8 | Resize 767 ↔ 768 | Phone behavior switches |

### 16.3 Form

| # | Test | Expected |
|---|------|----------|
| 9 | Submit empty | Inline validation errors |
| 10 | Submit without consent | Consent error |
| 11 | Valid submit | Success toast; form clears |
| 12 | Logged-in user | Name/email/phone prefilled |
| 13 | Edit prefilled field | Value not overwritten |
| 14 | Network failure on submit | Error toast |

### 16.4 Consent & policies

| # | Test | Expected |
|---|------|----------|
| 15 | Terms link in consent | Navigates to `/terms-and-conditions` |
| 16 | Privacy link | Navigates to policy hub with privacy policy |
| 17 | Checkbox visual | Matches Cart page checkbox |

### 16.5 SEO

| # | Test | Expected |
|---|------|----------|
| 18 | View page source / meta | CMS title, description, canonical |

---

## 17. Related Systems (Out of Scope but Linked)

| System | Relationship |
|--------|--------------|
| `generic-forms` | Form definition + reason options |
| `generic-submissions/submit` | Stores contact enquiries |
| `profile-page` / Magento customer | Profile prefill source |
| `policy-and-certifications` | Privacy policy destination |
| `contact-bespoke-page` | Separate bespoke contact flow |
| `support-page` | Help & FAQs (different page) |

---

## 18. Source Code Reference

```
web/src/app/(site)/contact/page.tsx          # Route, metadata, SSR fetch
web/src/services/contact/
  contact-page.service.ts                    # Strapi fetch + populate
  contact-page.mapper.ts                     # CMS → normalized model
  contact-page.types.ts                      # Strapi + normalized types
web/src/features/contact/components/
  ContactPage.tsx
  ContactHeroSection.tsx
  ContactInfoSection.tsx
  ContactPhoneLink.tsx
  ContactFormSection.tsx
  ContactConsentLabel.tsx
  skeletons/ContactPageSkeleton.tsx
web/src/services/forms/
  generic-form.service.ts                    # submitContactEnquiry, getGenericFormByTag
  generic-form.types.ts                      # ContactEnquiryPayload
web/src/app/api/generic-submissions/submit/route.ts  # BFF proxy
web/src/api/endpoints.ts                     # Strapi path constants
```

---

## 19. Glossary

| Term | Meaning |
|------|---------|
| **BFF** | Backend-for-frontend Next.js API route proxying to Strapi |
| **formTag** | Unique string linking UI form to CMS generic form + submission handler |
| **Tertiary CTA** | Text link with animated underline (`DetailTextLink`) |
| **Normalized model** | Frontend-friendly TypeScript shape after mapper |
| **ISR** | Incremental Static Regeneration (`revalidate: 300`) |

---

## 20. Revision History

| Date | Change |
|------|--------|
| Sep 2026 | Initial PRD — CMS-only content, phone copy/dial split, cart checkbox, consent policy links |

---

*This document reflects the implemented behavior in the Sunny Diamonds web codebase. For environment-specific CMS URLs and credentials, refer to deployment configuration — not included here.*

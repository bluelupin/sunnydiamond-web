# Careers API Requirements — Backend Team Handoff

This document describes the Strapi CMS schema, permissions, populate queries, and content requirements needed to power the Sunny Diamonds **Careers** frontend (`/careers`) with **no static fallbacks**.

Frontend integration lives in:

- `web/src/services/careers/careers.service.ts`
- `web/src/services/careers/careers.mapper.ts`
- `web/src/services/careers/careers.types.ts`
- `web/src/services/careers/career-submission.service.ts`

Base URL (dev): `https://sunnydiamonds-cms-dev.on-forge.com/api`

---

## 1. Endpoints overview

| Purpose | Method | Endpoint | Public permission |
|--------|--------|----------|-------------------|
| Landing page content | GET | `/career-landing-page` | `find` |
| Listing page content + filters | GET | `/career-listing-page` | `find` |
| Job openings collection | GET | `/career-openings` | `find` |
| Job application submit | POST | `/submissions-job-openings` | `create` |

All GET endpoints must have **published entries** and Public role permissions enabled.

---

## 2. Career Landing Page (`/career-landing-page`)

Single-type (or equivalent) containing all landing sections.

### 2.1 Recommended populate (matches live CMS field names)

```
populate=*
populate[heroSection][populate][backgroundImage][populate][desktopImage]=true
populate[heroSection][populate][backgroundImage][populate][mobileImage]=true
populate[moreThanSection][populate][featuredImage1][populate][desktopImage]=true
populate[moreThanSection][populate][featuredImage1][populate][mobileImage]=true
populate[moreThanSection][populate][featuredImage2][populate][desktopImage]=true
populate[moreThanSection][populate][featuredImage2][populate][mobileImage]=true
populate[discoverSection][populate][backgroundImage][populate][desktopImage]=true
populate[discoverSection][populate][backgroundImage][populate][mobileImage]=true
populate[discoverSection][populate][cta]=true
populate[investingSection][populate][InvestingFeatures][populate][featureImage][populate][desktopImage]=true
populate[investingSection][populate][InvestingFeatures][populate][featureImage][populate][mobileImage]=true
populate[openingsSection][populate][career_openings][populate][applyCta]=true
populate[FAQs][populate]=faqItems
populate[applicationFlowSection][populate]=formFields
populate[seo][populate][ogImage][populate][desktopImage]=true
populate[seo][populate][ogImage][populate][mobileImage]=true
```

> **Live CMS keys:** `heroSection`, `openingsSection` (`OpeningTitle`, `OpeningDescription`, `CtaLable`, `career_openings`), `moreThanSection` (`featuredTitle`, `featuredBody`, `featuredImage1/2`), `investingSection` (`InvestingTitle`, `InvestingFeatures[]` with `FeatureTitle`, `FeatureDescription`), `FAQs`, `discoverSection` (`cta.label`).

### 2.2 Section schema

#### `hero` (component)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Hero H1 |
| `ctaLabel` | string | Yes | e.g. "DISCOVER OPEN ROLES" |
| `backgroundImage` | responsive-image | Yes | `desktopImage`, `mobileImage`, `altText` |

#### `currentOpeningsSection` (component)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `sectionTitle` | string | Yes | Desktop title (optional if `mobileTitle` used everywhere) |
| `mobileTitle` | string | Yes | Shown as section heading on all breakpoints in current UI |
| `sectionDescription` | text | Yes | Subtitle under heading |
| `ctaLabel` | string | Yes | e.g. "VIEW ALL OPENINGS" |
| `relatedCareerOpenings` | relation → career-openings | Yes | **Curated** list (max 3 used). Must reference **published + active** jobs |

#### `moreThanWorkplaceSection` (component)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | text | Yes | Supports `\n` line breaks |
| `description` | text | Yes | Body copy |
| `quote` | string | No | Pull quote beside body |
| `leftImage` | responsive-image | Yes* | *Or provide `featuredImages[0]` |
| `rightImage` | responsive-image | Yes* | *Or provide `featuredImages[1]` |
| `featuredImages` | repeatable responsive-image | Alt | Fallback image source |

#### `investingInPeopleSection` (component)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `sectionTitle` | string | Yes | e.g. "Investing in You" |
| `sectionImage` | responsive-image | Yes | Shared right/bottom image |
| `features` | repeatable component | Yes (≥1) | Accordion items |
| `features[].label` | string | Yes | |
| `features[].description` | text | Yes | |
| `features[].icon` | media | No | Optional icon per feature |

#### `faqSection` (component)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `sectionHeading` | string | Yes | |
| `faqItems` | repeatable | Yes (≥1) | |
| `faqItems[].question` | string | Yes | |
| `faqItems[].answer` | text | Yes | |

#### `discoverSection` (component)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | |
| `ctaLabel` | string | Yes | |
| `backgroundImage` | responsive-image | Yes | |

#### `applicationFlowSection` (component) — **NEW (required for modals + form)**

All copy previously hardcoded in the frontend must live here.

| Field | Type | Required |
|-------|------|----------|
| `applyLabel` | string | Yes |
| `jobSummaryHeading` | string | Yes |
| `rolesHeading` | string | Yes |
| `qualificationsHeading` | string | Yes |
| `lookingForHeading` | string | Yes |
| `whyJoinHeading` | string | Yes |
| `shareLabel` | string | Yes |
| `viewJobLabel` | string | Yes |
| `applyModalTitle` | string | Yes |
| `autofillResumeLabel` | string | Yes |
| `applyManuallyLabel` | string | Yes |
| `applyLinkedInLabel` | string | Yes |
| `closeLabel` | string | Yes |
| `applicationFormTitle` | string | Yes |
| `resumeHeading` | string | Yes |
| `resumeHint` | string | Yes |
| `resumeUploadLabel` | string | Yes |
| `resumeRemoveLabel` | string | Yes |
| `uploadResumeModalTitle` | string | Yes |
| `uploadResumeModalDescription` | text | Yes |
| `onlyUploadLabel` | string | Yes |
| `confirmSubmissionTitle` | string | Yes |
| `confirmSubmissionDescription` | text | Yes |
| `goBackLabel` | string | Yes |
| `submitLabel` | string | Yes |
| `personalDetailsHeading` | string | Yes |
| `educationHeading` | string | Yes |
| `workExperienceHeading` | string | Yes |
| `skillsHeading` | string | Yes |
| `additionalInfoHeading` | string | Yes |
| `noRoleSelected` | string | Yes |
| `applicationSuccessTitle` | string | Yes |
| `applicationSuccessDescriptionLine1` | text | Yes |
| `applicationSuccessDescriptionLine2` | text | Yes |
| `appliedJobDetailsHeading` | string | Yes |
| `jobTitleLabel` | string | Yes |
| `jobIdLabel` | string | Yes |
| `goHomeLabel` | string | Yes |
| `genderOptions` | JSON array of strings | Yes |
| `workExperienceOptions` | JSON array of strings | Yes |
| `noticePeriodOptions` | JSON array of strings | Yes |
| `employeeRelationOptions` | JSON array of strings | Yes |
| `formFields` | component | Yes — see below |

**`formFields` component**

| Field | Required |
|-------|----------|
| `fullNameLabel`, `phoneLabel`, `emailLabel`, `dateOfBirthLabel`, `dateOfBirthPlaceholder`, `fieldPlaceholder`, `genderLabel`, `highestDegreeLabel`, `areaOfStudyLabel`, `yearOfCompletionLabel`, `relevantExperienceLabel`, `currentCompanyLabel`, `currentJobTitleLabel`, `currentCtcLabel`, `expectedCtcLabel`, `noticePeriodLabel`, `skillsSearchLabel`, `skillsSearchPlaceholder`, `skillsLabel`, `languagesLabel`, `companyRelationLabel`, `companyRelationYes`, `companyRelationNo`, `employeeNameLabel`, `employeeJobTitleLabel` | All Yes |

#### `seo` (component)

| Field | Type | Required |
|-------|------|----------|
| `metaTitle` | string | Yes |
| `metaDescription` | text | Yes |
| `canonicalUrl` | string | Yes (`/careers`) |
| `metaKeywords` | string | No |
| `ogImage` | media | No |

---

## 3. Career Listing Page (`/career-listing-page`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `hero` | component | No | Used on listings view; falls back to landing hero |
| `featuredTitle` | string | No | Optional secondary title |
| `title` | string | Yes | Main listings heading |
| `searchPlaceholder` | string | Yes | |
| `mobileSearchPlaceholder` | string | No | Falls back to `searchPlaceholder` |
| `filtersTitle` | string | Yes | Sidebar / drawer heading |
| `filterLocationLabel` | string | Yes | |
| `filterDepartmentLabel` | string | Yes | |
| `filterExperienceLabel` | string | Yes | |
| `filterSelectPlaceholder` | string | Yes | e.g. "Select" |
| `openFiltersLabel` | string | Yes | Mobile filter button aria-label |
| `closeFiltersLabel` | string | Yes | |
| `emptyResultsMessage` | string | Yes | Shown when search/filter returns 0 jobs |
| `locationFilters` | repeatable `{ label, value }` or string[] | Yes | **CMS-defined filter options** |
| `departmentFilters` | repeatable | Yes | |
| `experienceFilters` | repeatable | Yes | |
| `seo` | component | No | |

Filter values must **exactly match** the corresponding field values on job openings (`location`, `department`, `requiredExperience`).

---

## 4. Career Openings (`/career-openings`)

Collection type for individual jobs.

### 4.1 Query used by frontend

```
GET /career-openings?filters[isActive][$eq]=true&sort[0]=sortOrder:asc&sort[1]=publishedAt:desc&populate=...
```

### 4.2 Required fields (job omitted from UI if any missing)

| Field | Strapi key (preferred) | Type | Notes |
|-------|------------------------|------|-------|
| Job ID | `jobID` | string | Display chip, submission payload |
| Slug | `slug` | UID | Canonical job identifier |
| Title | `title` (or `jobTitle`) | string | |
| Location | `location` | string | Must match listing filter values |
| Department | `department` | string | Must match listing filter values |
| Experience | `experience` (or `requiredExperience`) | string | Must match listing filter values |
| Employment type | `employmentType` | enum/string | `Full Time`, `Full-time`, `Part-time`, or `Contract` |
| Summary | `summary` | text | Card + detail intro |
| Workplace | `workplaceType` | string | Optional — meta row hidden when absent |
| Posted date | `publishedAt` | datetime | Used for "Posted X days ago" |
| Sort order | `sortOrder` | integer | Listing order |
| Active flag | `isActive` | boolean | Inactive jobs excluded |
| Apply CTA | `applyCta.label` | string | CTA component — also accepts `applyCtaLabel` |

### 4.3 Job description — choose ONE approach

**Option A (recommended for current UI layout): structured components**

| Field | Type |
|-------|------|
| `jobSummary` | text |
| `rolesAndResponsibilities` | text |
| `qualifications` | repeatable `{ label, text }` |
| `whatWeAreLookingFor` | text |
| `whyJoinUs` | text |
| `responsibilities` | repeatable string | Optional list fallback |
| `requirements` | repeatable string | Optional list fallback |

**Option B: single rich text**

| Field | Type |
|-------|------|
| `jobDescription` | richtext | Rendered in Job Summary block |

If using Option B only, structured section blocks will not appear.

### 4.4 Optional fields

| Field | Notes |
|-------|-------|
| `isFeatured` | For future featured badges |
| `isNew` | For future "New" badges |
| `seo` | Per-job SEO if detail URLs added later |

### 4.5 Example filter by slug

```
GET /career-openings?filters[slug][$eq]=sales-executive&filters[isActive][$eq]=true&populate=*
```

---

## 5. Job Application Submission (`POST /submissions-job-openings`)

### 5.1 Permission

Public role → **create** on `submissions-job-openings`.

### 5.2 JSON payload

```json
{
  "data": {
    "jobID": "SD2847",
    "jobTitle": "Retail Sales Consultant",
    "location": "Kochi, Kerala",
    "department": "Retail",
    "experience": "2-4 yrs",
    "personalDetails": {
      "fullName": "Jane Doe",
      "phone": "+919876543210",
      "email": "jane@example.com",
      "dateOfBirth": "1995-01-15",
      "gender": "Female"
    },
    "educationDetails": {
      "highestDegree": "Bachelor's",
      "areaOfStudy": "Business",
      "yearOfCompletion": "2018"
    },
    "workExperience": {
      "relevantExperience": "2-4 years",
      "currentCompany": "Example Retail",
      "currentJobTitle": "Consultant",
      "currentCtc": "6 LPA",
      "expectedCtc": "8 LPA",
      "noticePeriod": "1 month"
    },
    "skillsAndLanguages": {
      "skills": ["Sales", "CRM"],
      "languages": ["English", "Malayalam"]
    },
    "addInfo": {
      "hasCompanyRelation": false,
      "employeeName": "",
      "employeeJobTitle": "",
      "applicationEntry": "manual"
    }
  }
}
```

### 5.3 Multipart payload (when resume attached)

Frontend sends:

- `data` — JSON string (same structure as above)
- `resume` — file (PDF, ZIP, JPEG, PNG; max 5 MB)

**Backend action required:** Accept multipart upload, store resume in media library, and link to submission record.

### 5.4 `applicationEntry` values

- `manual`
- `resume`
- `linkedin`

---

## 6. Localization

Support locale query param on all GET endpoints:

```
/api/career-landing-page?populate=*&locale=en
```

Ensure all translatable fields are enabled in Strapi i18n plugin.

---

## 7. Responsive image component (shared)

All image fields should use the same responsive-image component as other pages:

```json
{
  "altText": "Team at Sunny Diamonds",
  "desktopImage": { "url": "..." },
  "mobileImage": { "url": "..." }
}
```

Frontend resolves URLs via `NEXT_PUBLIC_STRAPI_URL`.

---

## 8. Current dev environment status (verified 2026-07-31)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/api/career-landing-page?populate=*` | **200 OK** | Published; sections use keys `heroSection`, `FAQs`, `moreThanSection`, `investingSection`, `discoverSection`, `openingsSection` |
| `/api/career-listing-page` | **404** | Not published yet — frontend derives filter options from job data |
| `/api/career-openings` | **200 OK** | 4 active jobs; uses `title`, `experience`, `employmentType`, `applyCta.label` |

**CMS gaps blocking full UI:**

- Responsive images have `desktopImage: null` / `mobileImage: null` — upload media files for hero, life, discover sections
- `applicationFlowSection` not present — job detail, apply form, and success screens stay hidden until added
- `career-listing-page` must be published for listings view labels/filters

Until media and missing sections are seeded, the Careers page renders **only sections with valid CMS data** (openings, FAQ, benefits accordion) — no static fallback copy.

---

## 9. Checklist for backend

- [ ] Upload responsive-image media (`desktopImage` + `mobileImage`) for hero, life, discover sections
- [ ] Create & publish `career-landing-page` with all sections including `applicationFlowSection`
- [ ] Create & publish `career-listing-page` with filter config + UI labels
- [ ] Create & publish `career-openings` entries with all required fields
- [ ] Link `career_openings` on landing page to active jobs
- [ ] Enable Public `find` on landing, listing, openings
- [ ] Enable Public `create` on `submissions-job-openings`
- [ ] Implement multipart resume upload on submission endpoint
- [ ] Add structured job detail fields OR single `jobDescription` richtext
- [ ] Add `workplaceType` and `publishedAt` to job openings
- [ ] Verify CORS allows browser POST from web app origin (or provide BFF proxy)
- [ ] Seed `locationFilters` / `departmentFilters` / `experienceFilters` matching job data

---

## 10. Contact

For frontend mapper field aliases or populate adjustments, coordinate with the web team using this document and `web/src/services/careers/careers.types.ts`.

"""Careers module test case data — imported by add_careers_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Strapi CMS reachable with published career-landing-page and career listings"
PRE_02 = "PRE-02: At least one active career opening with jobCode in CMS"
PRE_03 = "PRE-03: Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"
PRE_04 = "PRE-04: Logged-in and guest sessions for application form tests"

PRECONDITIONS_LIST = [
    ("PRE-01", "Strapi CMS reachable with published career landing + listings"),
    ("PRE-02", "At least one active career opening with jobCode"),
    ("PRE-03", "Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"),
    ("PRE-04", "Guest and logged-in sessions for application flows"),
]

TEST_DATA_NOTES = [
    "Routes: /careers, /careers/all-openings, /careers/{jobCode}, /careers/apply/{jobCode}",
    "CMS: career-landing-page, career-listing-page, career openings collection",
    "ISR revalidate: 300 seconds on careers pages",
    "In-page flow: landing → job detail → application → success (CareersJobsContext)",
]

KNOWN_GAPS: list[str] = [
    "Full application submission requires valid resume upload and backend acceptance — manual QA",
    "LinkedIn apply opens external window — not automatable in runner",
    "Careers header transparent mode on landing requires scroll interaction to verify",
]

ISSUES: list[tuple[str, ...]] = []

TEST_CASES = [
    ("CAREER-001", "A. Routes", "Careers landing", "Navigate to /careers", "CareersPage loads with CMS sections", "P0", "Functional", PRE_01, "Route: /careers", ""),
    ("CAREER-002", "A. Routes", "All openings page", "Navigate to /careers/all-openings", "CareersAllOpeningsPage with filters", "P0", "Functional", PRE_01, "Route: /careers/all-openings", ""),
    ("CAREER-003", "A. Routes", "Job detail slug", "Open /careers/{jobCode}", "CareersJobSlugPage with job metadata", "P0", "Functional", PRE_02, "Valid jobCode", ""),
    ("CAREER-004", "A. Routes", "Apply route", "Open /careers/apply/{jobCode}", "CareersApplyPage with application form", "P0", "Functional", PRE_02, "Valid jobCode", ""),
    ("CAREER-005", "A. Routes", "Sitemap entries", "Open /sitemap.xml", "/careers and /careers/all-openings listed", "P2", "SEO", PRE_01, "sitemap.ts", ""),
    ("CAREER-006", "A. Routes", "Loading skeleton", "Hard refresh /careers", "CareersPageSkeleton in Suspense", "P2", "UX", PRE_01, "—", ""),
    ("CAREER-007", "A. Routes", "ISR revalidate", "Inspect careers page.tsx", "revalidate = 300", "P2", "Architecture", PRE_01, "—", ""),
    ("CAREER-008", "B. SEO", "Landing metadata", "View /careers source", "resolveCareersSeoMetadata + constructMetadata", "P1", "SEO", PRE_01, "—", ""),
    ("CAREER-009", "B. SEO", "All openings metadata", "View /careers/all-openings source", "resolveCareersAllOpeningsSeoMetadata", "P1", "SEO", PRE_01, "—", ""),
    ("CAREER-010", "B. SEO", "Job slug metadata", "View job detail page", "Dynamic title includes job title", "P1", "SEO", PRE_02, "—", ""),
    ("CAREER-011", "B. SEO", "Metadata fallback", "CMS outage", "siteConfig fallback on generateMetadata catch", "P2", "Resilience", PRE_01, "—", ""),
    ("CAREER-012", "C. Landing", "Hero section", "Load /careers", "CareersHeroSection when landing.hero present", "P0", "CMS", PRE_01, "—", ""),
    ("CAREER-013", "C. Landing", "Openings section", "Scroll to openings", "CareersOpeningsSection with featured jobs", "P0", "CMS", PRE_02, "—", ""),
    ("CAREER-014", "C. Landing", "Life at section", "Scroll to life section", "CareersLifeSection CMS content", "P1", "CMS", PRE_01, "—", ""),
    ("CAREER-015", "C. Landing", "Benefits section", "Scroll to benefits", "CareersBenefitsSection feature cards", "P1", "CMS", PRE_01, "—", ""),
    ("CAREER-016", "C. Landing", "Bespoke inspirations", "Scroll to discover", "CareersBespokeInspirationsSection", "P2", "CMS", PRE_01, "—", ""),
    ("CAREER-017", "C. Landing", "FAQ section", "Scroll to FAQ", "CareersFaqSection accordion", "P1", "CMS", PRE_01, "—", ""),
    ("CAREER-018", "D. Job Listings", "All openings list", "Open /careers/all-openings", "CareersJobListingsSection renders openings", "P0", "Functional", PRE_02, "—", ""),
    ("CAREER-019", "D. Job Listings", "Search filter", "Type in search box", "Jobs filter by title/department", "P1", "Functional", PRE_02, "Manual", ""),
    ("CAREER-020", "D. Job Listings", "Department filter", "Select department filter", "List narrows to matching jobs", "P1", "Functional", PRE_02, "Manual", ""),
    ("CAREER-021", "D. Job Listings", "Mobile filter drawer", "Open filters on mobile", "CareersJobFiltersDrawer", "P1", "UI", PRE_03, "Manual", ""),
    ("CAREER-022", "D. Job Listings", "Empty state", "Filter with no matches", "CareersJobListingsEmptyState shown", "P2", "UX", PRE_02, "—", ""),
    ("CAREER-023", "D. Job Listings", "Job card CTA", "Click job card", "Navigates to job detail or opens in-page detail", "P0", "Navigation", PRE_02, "—", ""),
    ("CAREER-024", "E. Job Detail", "In-page detail flow", "Select job on landing", "CareersJobDetailSection via flowStep=detail", "P1", "Functional", PRE_02, "—", ""),
    ("CAREER-025", "E. Job Detail", "Apply options modal", "Click Apply on job", "CareersApplyOptionsModal (form vs LinkedIn)", "P1", "Functional", PRE_02, "—", ""),
    ("CAREER-026", "E. Job Detail", "Copy job ID", "Click job ID chip", "copyCareerJobId copies job code", "P2", "Functional", PRE_02, "—", ""),
    ("CAREER-027", "F. Application", "Application form", "Proceed to application step", "CareersApplicationFormSection with validation", "P0", "Functional", PRE_02, "—", ""),
    ("CAREER-028", "F. Application", "Resume upload", "Upload resume file", "CareersUploadResumeModal / file chip", "P0", "Functional", PRE_02, "Manual", ""),
    ("CAREER-029", "F. Application", "Education fields", "Fill education section", "Degree, area of study, year mapped to submission", "P1", "Functional", PRE_02, "—", ""),
    ("CAREER-030", "F. Application", "Submit confirmation", "Submit application", "CareersSubmitConfirmationModal before final submit", "P1", "UX", PRE_02, "—", ""),
    ("CAREER-031", "F. Application", "Success screen", "Successful submit", "CareersApplicationSuccessSection with job ID copy", "P0", "Functional", PRE_02, "Manual", ""),
    ("CAREER-032", "F. Application", "Submission mapper", "Inspect career-submission.mapper", "Maps form to Strapi submission payload", "P1", "Architecture", PRE_01, "—", ""),
    ("CAREER-033", "G. Context", "Jobs provider", "Inspect CareersPage", "CareersJobsProvider wraps flow", "P1", "Architecture", PRE_01, "—", ""),
    ("CAREER-034", "G. Context", "Flow steps", "Inspect CareersJobsContext", "flowStep: landing | detail | application | success", "P1", "Architecture", PRE_01, "—", ""),
    ("CAREER-035", "G. Context", "Header bridge", "On careers routes", "useCareersHeaderMode adjusts header styling", "P2", "UI", PRE_03, "Manual", ""),
    ("CAREER-036", "H. CMS Data", "Careers service", "Inspect careers.service.ts", "getCareersPageData fetches landing CMS", "P1", "Architecture", PRE_01, "—", ""),
    ("CAREER-037", "H. CMS Data", "Careers mapper", "Inspect careers.mapper.ts", "mapCareersPageData normalizes landing page", "P1", "Architecture", PRE_01, "—", ""),
    ("CAREER-038", "H. CMS Data", "Empty fallback", "CMS failure", "EMPTY_CAREERS_PAGE_DATA used", "P1", "Resilience", PRE_01, "—", ""),
    ("CAREER-039", "H. CMS Data", "Job opening mapper", "Inspect careers.service", "mapCareerOpening normalizes job entity", "P2", "Architecture", PRE_02, "—", ""),
    ("CAREER-040", "I. Navigation", "Header Careers link", "Click Careers in header", "Navigates to /careers", "P1", "Navigation", PRE_04, "—", ""),
    ("CAREER-041", "I. Navigation", "View all openings CTA", "Click view all on landing", "Navigates to /careers/all-openings", "P1", "Navigation", PRE_01, "—", ""),
    ("CAREER-042", "J. Responsive", "Mobile landing", "View /careers on mobile", "Sections stack; CTAs reachable", "P1", "UI", PRE_03, "Manual", ""),
    ("CAREER-043", "J. Responsive", "Desktop listings layout", "View all openings desktop", "Sidebar filters + job list layout", "P1", "UI", PRE_03, "Manual", ""),
]

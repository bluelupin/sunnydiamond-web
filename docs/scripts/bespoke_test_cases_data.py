"""Bespoke Jewellery page test case data — imported by add_bespoke_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Strapi CMS published contact-bespoke-page single type"
PRE_02 = "PRE-02: Strapi bespoke-submissions submit endpoint reachable"
PRE_03 = "PRE-03: Test viewports: Mobile (≤767px), Tablet (~768px), Desktop (≥1280px)"
PRE_04 = "PRE-04: Guest and logged-in Magento customer (info.archien@gmail.com)"
PRE_05 = "PRE-05: Featured story cards with documentId for save-inspiration tests"

PRECONDITIONS_LIST = [
    ("PRE-01", "Strapi CMS published contact-bespoke-page single type"),
    ("PRE-02", "Strapi bespoke-submissions submit endpoint reachable"),
    ("PRE-03", "Test viewports: Mobile, Tablet, Desktop"),
    ("PRE-04", "Guest and logged-in customer accounts"),
    ("PRE-05", "Featured stories with documentId in CMS"),
]

TEST_DATA_NOTES = [
    "Primary route: /bespoke-jewellery (ISR revalidate 300s)",
    "CMS: api/contact-bespoke-page (deep-populated controller); page content requires published CMS — empty state when fetch fails is CMS responsibility",
    "Share Vision form: POST api/bespoke-submissions/submit (JSON or multipart); API errors mapped via formatBespokeSubmissionError",
    "Save inspiration: POST /api/customer/saved-creations (auth required; CMS must publish documentId per featured card)",
    "Profile tab: /profile?section=bespoke",
    "Header nav label 'bespoke' resolves to /bespoke-jewellery",
]

KNOWN_GAPS = [
    "Get in Touch CTA uses CMS href only — does not open Share Vision panel",
]

# issue_id, jira, module, area, title, description, priority, status, test_ids, notes
ISSUES = [
    (
        "BESPOKE-ISSUE-004",
        "",
        "Bespoke",
        "UX",
        "Get in Touch CTA does not open Share Vision",
        "BespokeInterestedSection links to CMS ctaHref only; Share Vision form opens from story section CTA when customDesignForm is configured.",
        "P3",
        "Open",
        "BESPOKE-045",
        "By design unless product wants unified CTA",
    ),
]

# tc_id, area, scenario, steps, expected, priority, type, preconds, test_data, notes
TEST_CASES = [
    # A. Routes & Navigation
    ("BESPOKE-001", "A. Routes", "Bespoke page route", "Navigate to /bespoke-jewellery", "Page loads with 200; BespokePage rendered", "P0", "Functional", PRE_01, "Route: /bespoke-jewellery", ""),
    ("BESPOKE-002", "A. Routes", "Header nav link", "Click Bespoke in header", "Navigates to /bespoke-jewellery", "P0", "Navigation", PRE_04, "—", ""),
    ("BESPOKE-003", "A. Routes", "Sitemap entry", "Inspect sitemap.xml", "/bespoke-jewellery listed monthly priority 0.7", "P2", "SEO", PRE_01, "sitemap.ts", ""),
    ("BESPOKE-004", "A. Routes", "CMS failure empty page", "Simulate Strapi unreachable", "EMPTY_CONTACT_BESPOKE_PAGE; no sections (CMS must publish page — by design)", "P1", "CMS", PRE_01, "CMS down", "CMS responsibility"),
    ("BESPOKE-005", "A. Routes", "ISR revalidation", "Inspect page route", "revalidate = 300 on bespoke-jewellery page", "P2", "Architecture", PRE_01, "—", ""),
    ("BESPOKE-006", "A. Routes", "Transparent header overlay", "Load bespoke page", "isHeroOverlayRoute includes /bespoke-jewellery", "P1", "UI", PRE_03, "—", ""),
    ("BESPOKE-007", "A. Routes", "Homepage CTA link", "Homepage Bespoke For You CTA", "Links to /bespoke-jewellery", "P1", "Navigation", PRE_01, "CMS CTA", ""),
    ("BESPOKE-008", "A. Routes", "Profile empty CTA", "Profile bespoke tab empty state", "CTA href /bespoke-jewellery", "P2", "Navigation", PRE_04, "Logged in", ""),
    # B. SEO
    ("BESPOKE-009", "B. SEO", "Page title", "Inspect <title> on /bespoke-jewellery", "CMS SEO title or seoContent.bespoke fallback", "P1", "SEO", PRE_01, "—", ""),
    ("BESPOKE-010", "B. SEO", "Meta description", "Inspect meta description", "CMS or static fallback description", "P1", "SEO", PRE_01, "—", ""),
    ("BESPOKE-011", "B. SEO", "Canonical URL", "Inspect canonical link", "Defaults to /bespoke-jewellery", "P1", "SEO", PRE_01, "—", ""),
    ("BESPOKE-012", "B. SEO", "JSON-LD WebPage", "Inspect page source", "buildBespokeJsonLd WebPage schema present", "P2", "SEO", PRE_01, "—", ""),
    ("BESPOKE-013", "B. SEO", "Metadata fallback", "CMS SEO missing", "resolveBespokeSeoMetadata uses seoContent.bespoke", "P2", "SEO", PRE_01, "—", ""),
    # C. Hero
    ("BESPOKE-014", "C. Hero", "Hero section render", "CMS hero published", "BespokeHeroSection with title + background", "P0", "UI", PRE_01, "hero.showField true", ""),
    ("BESPOKE-015", "C. Hero", "Hero hidden when CMS off", "hero.showField false", "Hero section omitted", "P2", "CMS", PRE_01, "—", ""),
    ("BESPOKE-016", "C. Hero", "Responsive hero height", "View mobile vs desktop", "h-[240px] mobile; h-320 desktop", "P2", "Responsive", PRE_03, "—", ""),
    # D. Story Section
    ("BESPOKE-017", "D. Story", "Story section render", "CMS visionSection active cards", "BespokeStorySection with steps", "P0", "UI", PRE_01, "—", ""),
    ("BESPOKE-018", "D. Story", "Desktop horizontal scroll", "Scroll story on desktop", "useSince1997HorizontalScroll track animates", "P1", "UI", PRE_03, "Desktop", ""),
    ("BESPOKE-019", "D. Story", "Mobile vertical stack", "View story on mobile", "Steps stacked; no horizontal scroll animation", "P1", "Responsive", PRE_03, "Mobile", ""),
    ("BESPOKE-020", "D. Story", "Story video fallback", "Video fails to play", "Falls back to step image", "P2", "UI", PRE_01, "Video card", ""),
    ("BESPOKE-021", "D. Story", "Share Vision CTA visible", "story.ctaLabel + customDesignForm set", "DetailDarkButton opens panel", "P0", "Functional", PRE_01, "—", ""),
    ("BESPOKE-022", "D. Story", "CTA hidden without form", "story CTA but no customDesignForm", "Share Vision button not rendered", "P2", "CMS", PRE_01, "—", ""),
    # E. Share Vision Form
    ("BESPOKE-023", "E. Form", "Panel opens", "Click Share Vision CTA", "BespokeShareVisionPanel in ProductDetailSidePanelShell", "P0", "UI", PRE_01, "—", ""),
    ("BESPOKE-024", "E. Form", "Required fields", "Submit empty form", "Validation errors on name, phone, email, note", "P0", "Validation", PRE_02, "—", ""),
    ("BESPOKE-025", "E. Form", "Phone validation +91", "Enter invalid phone", "Phone validation per country code", "P1", "Validation", PRE_02, "+91 10 digits", ""),
    ("BESPOKE-026", "E. Form", "Email required", "Leave email empty", "Email required error shown", "P1", "Validation", PRE_02, "—", ""),
    ("BESPOKE-027", "E. Form", "Design vision required", "Leave note empty", "Note required error (noteRequired: true)", "P0", "Validation", PRE_02, "—", ""),
    ("BESPOKE-028", "E. Form", "Reference image preview", "Attach image", "Preview shown; can remove/replace", "P1", "UI", PRE_02, "image/*", ""),
    ("BESPOKE-029", "E. Form", "Image size limit", "Upload file > 5 MB", "Toast: Image must be 5 MB or smaller", "P1", "Validation", PRE_02, ">5MB file", ""),
    ("BESPOKE-030", "E. Form", "Submit JSON payload", "Submit without image", "POST JSON to bespoke-submissions/submit", "P0", "Integration", PRE_02, "Valid data", ""),
    ("BESPOKE-031", "E. Form", "Submit multipart", "Submit with reference image", "FormData with data + referenceImage", "P0", "Integration", PRE_02, "With image", ""),
    ("BESPOKE-032", "E. Form", "Success flow", "Valid submit", "CMS successToast; form resets; panel closes", "P0", "Functional", PRE_02, "—", ""),
    ("BESPOKE-033", "E. Form", "Submit failure message", "Simulate API failure", "formatBespokeSubmissionError shows API or fallback message in toast", "P1", "Resilience", PRE_02, "API error", ""),
    ("BESPOKE-034", "E. Form", "Field-level API errors", "API returns validation error for email/phone/etc.", "parseBespokeSubmissionFieldErrors maps to inline field errors", "P2", "Resilience", PRE_02, "Strapi badRequest", ""),
    ("BESPOKE-035", "E. Form", "Double submit guard", "Click submit twice quickly", "isSubmitting prevents duplicate POST", "P2", "UX", PRE_02, "—", ""),
    ("BESPOKE-036", "E. Form", "Panel close resets", "Close panel mid-form", "Fields cleared via resetForm", "P2", "UX", PRE_02, "—", ""),
    # F. Featured Stories
    ("BESPOKE-037", "F. Featured", "Carousel render", "CMS featured stories cards", "BespokeFeaturedStoriesSection carousel visible", "P0", "UI", PRE_01, "—", ""),
    ("BESPOKE-038", "F. Featured", "Desktop 3-up carousel", "View on desktop", "react-slick centerMode 3 slides", "P1", "Responsive", PRE_03, "Desktop", ""),
    ("BESPOKE-039", "F. Featured", "Mobile single slide", "View on mobile", "1 slide visible", "P1", "Responsive", PRE_03, "Mobile", ""),
    ("BESPOKE-040", "F. Featured", "Autoplay pause on hover", "Hover carousel", "Autoplay pauses on hover/focus", "P2", "UX", PRE_03, "Desktop", ""),
    ("BESPOKE-041", "F. Featured", "Open story modal", "Click primary CTA / active slide", "BespokeFeaturedStoryModal opens", "P0", "Functional", PRE_01, "—", ""),
    ("BESPOKE-042", "F. Featured", "Past creations modal", "Click secondary CTA", "BespokePastCreationsModal opens", "P1", "Functional", PRE_01, "pastCreations data", ""),
    ("BESPOKE-043", "F. Featured", "Browser back closes modal", "Open modal; press Back", "popstate closes modal", "P2", "UX", PRE_03, "—", ""),
    ("BESPOKE-044", "F. Featured", "Modal responsive shell", "Resize viewport", "Drawer mobile (≤767px); Sheet desktop", "P1", "Responsive", PRE_03, "—", ""),
    # G. Guarantees & Get in Touch
    ("BESPOKE-045", "G. Sections", "Get in Touch CTA", "Click interested section CTA", "Navigates to CMS ctaHref (not Share Vision panel)", "P2", "Functional", PRE_01, "—", "BESPOKE-ISSUE-004"),
    ("BESPOKE-046", "G. Sections", "Guarantees strip", "CMS service highlights", "BespokeGuaranteesSection with icons", "P1", "UI", PRE_01, "—", ""),
    ("BESPOKE-047", "G. Sections", "Guarantees responsive", "Mobile vs desktop", "Row desktop; stacked mobile", "P2", "Responsive", PRE_03, "—", ""),
    ("BESPOKE-048", "G. Sections", "Interested section heights", "View breakpoints", "h-[219px] mobile; md:h-[432px] desktop", "P2", "Responsive", PRE_03, "—", ""),
    # H. Save Inspiration
    ("BESPOKE-049", "H. Save", "Guest redirect login", "Save as inspiration as guest", "Redirect login with return /bespoke-jewellery", "P0", "Auth", PRE_04, "Guest", ""),
    ("BESPOKE-050", "H. Save", "Auth loading state", "Click save while auth loading", "Just a moment toast", "P2", "Auth", PRE_04, "—", ""),
    ("BESPOKE-051", "H. Save", "Save success toast", "Logged-in save new item", "Saved as inspiration toast; modal closes", "P0", "Functional", PRE_04, PRE_05, ""),
    ("BESPOKE-052", "H. Save", "Already saved", "Save duplicate creation", "Already saved toast", "P1", "Functional", PRE_04, PRE_05, ""),
    ("BESPOKE-053", "H. Save", "Missing documentId (CMS)", "Open modal for slide without documentId", "Inline message shown; save blocked until CMS publishes documentId (by design)", "P1", "CMS", PRE_01, "No documentId", "CMS responsibility"),
    ("BESPOKE-054", "H. Save", "Profile grid shows item", "After save visit profile bespoke", "Item in ProfileBespokeSection grid", "P0", "Integration", PRE_04, PRE_05, ""),
    # I. Profile Bespoke Tab
    ("BESPOKE-055", "I. Profile", "Profile bespoke route", "Open /profile?section=bespoke", "ProfileBespokeSection loads", "P0", "Functional", PRE_04, "Logged in", ""),
    ("BESPOKE-056", "I. Profile", "Empty state", "No saved creations", "ProfileEmptyState with link to bespoke page", "P1", "UI", PRE_04, "Empty list", ""),
    ("BESPOKE-057", "I. Profile", "Remove with undo", "Remove saved item", "Optimistic hide + undo toast", "P1", "Functional", PRE_04, PRE_05, ""),
    ("BESPOKE-058", "I. Profile", "Detail panel", "Click saved card", "ProfileBespokeDetailPanel Drawer/Sheet", "P1", "UI", PRE_04, PRE_05, ""),
    ("BESPOKE-059", "I. Profile", "Load error 401", "Session expired", "FormFieldError sign-in message", "P2", "Resilience", PRE_04, "Expired session", ""),
    ("BESPOKE-060", "I. Profile", "Pagination", ">20 saved items", "Pagination controls when totalPages > 1", "P2", "Functional", PRE_04, "20+ items", ""),
    # J. Architecture
    ("BESPOKE-061", "J. Architecture", "Server page fetch", "Inspect page.tsx", "getContactBespokePage on server", "P1", "Architecture", PRE_01, "—", ""),
    ("BESPOKE-062", "J. Architecture", "Cached CMS fetch", "Inspect service", "React cache() on getContactBespokePage", "P2", "Architecture", PRE_01, "—", ""),
    ("BESPOKE-063", "J. Architecture", "Section gating", "Inspect BespokePage", "Sections render only when CMS data present", "P1", "Architecture", PRE_01, "—", ""),
    ("BESPOKE-064", "J. Architecture", "Saved creations BFF", "Inspect API route", "/api/customer/saved-creations GET/POST", "P1", "Architecture", PRE_04, "—", ""),
    ("BESPOKE-065", "J. Architecture", "Shared form fields", "Inspect Share Vision panel", "ShareYourVisionFields + useAppointmentFormValidation", "P2", "Architecture", PRE_02, "—", ""),
    # K. Live smoke (HTTP)
    ("BESPOKE-066", "K. Live", "HTTP 200", "GET /bespoke-jewellery", "200 OK HTML response", "P0", "Smoke", PRE_01, "Dev server", ""),
    ("BESPOKE-067", "K. Live", "Page has content", "GET /bespoke-jewellery HTML", "Hero or story markup when CMS up", "P0", "Smoke", PRE_01, "CMS published", ""),
    ("BESPOKE-068", "K. Live", "Footer bespoke link", "Inspect footer", "Link to bespoke-jewellery path", "P2", "Navigation", PRE_01, "—", ""),
]

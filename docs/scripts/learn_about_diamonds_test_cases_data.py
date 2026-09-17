"""Learn About Diamonds test case data — imported by add_learn_about_diamonds_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Strapi CMS reachable with published learn-about-diamonds-page"
PRE_02 = "PRE-02: Four Cs section configured with carat/clarity/color/cut panels"
PRE_03 = "PRE-03: Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"
PRE_04 = "PRE-04: Browsers: Chrome, Safari, Firefox, Edge (latest)"

PRECONDITIONS_LIST = [
    ("PRE-01", "Strapi CMS reachable with published learn-about-diamonds-page"),
    ("PRE-02", "Four Cs panels configured in CMS"),
    ("PRE-03", "Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"),
    ("PRE-04", "Browsers: Chrome, Safari, Firefox, Edge (latest)"),
]

TEST_DATA_NOTES = [
    "Primary route: /learn-about-diamonds (/education redirects here)",
    "CMS endpoint: api/learn-about-diamonds-page",
    "ISR revalidate: 300 seconds",
    "Sections: hero, fourCsIntro, fourCs, certificate, learnMore, discover CTA, FAQ",
]

KNOWN_GAPS: list[str] = [
    "Four Cs slider interactions and anatomy scroll-sync require manual/browser testing",
    "Discover journey panel content depends on CMS steps configuration",
]

ISSUES: list[tuple[str, ...]] = []

TEST_CASES = [
    ("LAD-001", "A. Page Load", "Open page", "Navigate to /learn-about-diamonds", "Page loads; skeleton then content; no console errors", "P0", "Functional", PRE_01, "Route: /learn-about-diamonds", ""),
    ("LAD-002", "A. Page Load", "Legacy redirect", "Open /education", "Redirects to /learn-about-diamonds", "P1", "Navigation", PRE_01, "/education", ""),
    ("LAD-003", "A. Page Load", "Loading skeleton", "Hard refresh on slow network", "EducationPageSkeleton in Suspense fallback", "P2", "UX", PRE_01, "loading via Suspense", ""),
    ("LAD-004", "A. Page Load", "ISR revalidate", "Inspect page.tsx", "revalidate = 300", "P2", "Architecture", PRE_01, "—", ""),
    ("LAD-005", "A. Page Load", "CMS empty fallback", "Simulate CMS failure", "EMPTY_LEARN_ABOUT_DIAMONDS_PAGE; page does not crash", "P1", "Resilience", PRE_01, "—", ""),
    ("LAD-006", "B. SEO", "generateMetadata", "Inspect page source", "CMS SEO title/description via resolveEducationSeoMetadata", "P0", "SEO", PRE_01, "Route: /learn-about-diamonds", ""),
    ("LAD-007", "B. SEO", "Canonical link", "View page source", "Canonical points to /learn-about-diamonds", "P1", "SEO", PRE_01, "—", ""),
    ("LAD-008", "B. SEO", "JSON-LD", "View page source", "buildEducationJsonLd structured data present", "P2", "SEO", PRE_01, "—", ""),
    ("LAD-009", "B. SEO", "Metadata fallback", "CMS outage", "siteConfig fallback title/description", "P2", "Resilience", PRE_01, "—", ""),
    ("LAD-010", "C. Hero", "Hero section", "Load page with CMS hero", "EducationHeroSection renders CMS title/media", "P0", "CMS", PRE_01, "—", ""),
    ("LAD-011", "C. Hero", "Hero hidden when null", "CMS hero missing", "Hero section omitted", "P1", "CMS", PRE_01, "—", ""),
    ("LAD-012", "C. Hero", "Hero load animation", "Scroll page", "useEducationHeroLoadAnimation applied", "P2", "UI", PRE_03, "—", ""),
    ("LAD-013", "D. Four Cs Intro", "Intro section", "Scroll to Four Cs intro", "EducationFourCsIntroSection with pillars/tags", "P1", "CMS", PRE_02, "—", ""),
    ("LAD-014", "D. Four Cs Intro", "Intro hidden when null", "CMS fourCsIntro missing", "Section omitted", "P2", "CMS", PRE_01, "—", ""),
    ("LAD-015", "E. Four Cs Panels", "Panels section wired", "Inspect EducationPage", "EducationFourCsPanelsSection", "P0", "Functional", PRE_02, "—", ""),
    ("LAD-016", "E. Four Cs Panels", "Carat slider", "Interact with Carat panel", "Carat visual updates with slider", "P1", "Functional", PRE_02, "Manual", ""),
    ("LAD-017", "E. Four Cs Panels", "Clarity slider", "Interact with Clarity panel", "Clarity grade stops update visual", "P1", "Functional", PRE_02, "Manual", ""),
    ("LAD-018", "E. Four Cs Panels", "Color/Cut panels", "Switch tabs/panels", "Color and Cut panels render CMS content", "P1", "CMS", PRE_02, "—", ""),
    ("LAD-019", "E. Four Cs Panels", "Panel texture assets", "Inspect static assets", "educationPageImages.panelTexture configured", "P3", "UI", PRE_01, "—", ""),
    ("LAD-020", "F. Certificate", "Certified section", "Scroll to certificate", "EducationCertifiedSection with lab logos", "P1", "CMS", PRE_01, "—", ""),
    ("LAD-021", "F. Certificate", "Section hidden when null", "CMS certificate missing", "Section omitted", "P2", "CMS", PRE_01, "—", ""),
    ("LAD-022", "G. Learn More", "Anatomy section", "Scroll to learn more", "EducationLearnMoreSection with anatomy panels", "P1", "CMS", PRE_01, "—", ""),
    ("LAD-023", "G. Learn More", "Scroll sync hook", "Scroll anatomy section", "useLearnAnatomySectionSync highlights active panel", "P2", "Functional", PRE_03, "Manual", ""),
    ("LAD-024", "H. Discover CTA", "Discover banner", "Scroll to discover section", "EducationDiscoverSection CTA banner", "P1", "CMS", PRE_01, "—", ""),
    ("LAD-025", "H. Discover CTA", "Journey panel", "Click discover CTA", "EducationDiscoverJourneyPanel opens with CMS steps", "P1", "Functional", PRE_01, "Manual", ""),
    ("LAD-026", "I. FAQ", "FAQ section", "Scroll to FAQ", "EducationFaqSection accordion from CMS faqItems", "P1", "CMS", PRE_01, "—", ""),
    ("LAD-027", "I. FAQ", "FAQ hidden when null", "CMS faq missing", "Section omitted", "P2", "CMS", PRE_01, "—", ""),
    ("LAD-028", "J. CMS Data", "Page service", "Inspect service", "getLearnAboutDiamondsPage fetches STRAPI_ENDPOINTS.learnAboutDiamondsPage", "P1", "Architecture", PRE_01, "—", ""),
    ("LAD-029", "J. CMS Data", "Page mapper", "Inspect mapper", "mapLearnAboutDiamondsPage normalizes CMS entity", "P1", "Architecture", PRE_01, "—", ""),
    ("LAD-030", "J. CMS Data", "Deep populate query", "Inspect service", "LEARN_ABOUT_DIAMONDS_POPULATE_QUERY for nested media", "P2", "Architecture", PRE_01, "—", ""),
    ("LAD-031", "K. Navigation", "Header link", "Click Learn About Diamonds in nav", "Routes to /learn-about-diamonds", "P1", "Navigation", PRE_04, "—", ""),
    ("LAD-032", "K. Navigation", "Footer link", "Click footer education link", "Routes to /learn-about-diamonds", "P2", "Navigation", PRE_04, "—", ""),
    ("LAD-033", "L. Responsive", "Mobile layout", "View on ≤390px", "Four Cs panels usable; no horizontal scroll", "P1", "UI", PRE_03, "Manual", ""),
    ("LAD-034", "L. Responsive", "Desktop layout", "View on ≥1280px", "Sections match design spacing and typography", "P1", "UI", PRE_03, "Manual", ""),
]

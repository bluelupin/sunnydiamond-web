"""Homepage test case data — imported by add_homepage_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Strapi CMS reachable with published homepage shell, editorial, and shopping blocks"
PRE_02 = "PRE-02: Homepage hero media (desktop/mobile image or video) configured in CMS"
PRE_03 = "PRE-03: Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"
PRE_04 = "PRE-04: Browsers: Chrome, Safari, Firefox, Edge (latest)"
PRE_05 = "PRE-05: Magento catalog reachable for featured products / collection sections"

PRECONDITIONS_LIST = [
    ("PRE-01", "Strapi CMS reachable with published homepage shell, editorial, and shopping blocks"),
    ("PRE-02", "Homepage hero media configured in CMS"),
    ("PRE-03", "Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"),
    ("PRE-04", "Browsers: Chrome, Safari, Firefox, Edge (latest)"),
    ("PRE-05", "Magento catalog reachable for featured products sections"),
]

TEST_DATA_NOTES = [
    "Primary route: / (app/(site)/(home)/page.tsx)",
    "CMS: api/homepage/shell, api/homepage/editorial-blocks, api/homepage/shopping-blocks",
    "ISR revalidate: 300 seconds on homepage segment",
    "Above-fold: hero + crafting rarity resolved server-side; below-fold lazy-loaded client sections",
    "Section nav IDs: hero, crafting-rarity, flawless, alankara, categories, diamond-awaits, valentine, promise, bespoke-for-you, diamonds-for-everyone, craftsmanship, showrooms",
]

KNOWN_GAPS: list[str] = [
    "Below-fold section content requires scroll + hydration — not fully verifiable via initial HTML fetch",
    "Section nav scroll-spy and footer hide behavior require manual/browser testing",
    "Hero video autoplay and reduced-motion behavior require device testing",
]

ISSUES: list[tuple[str, ...]] = []

# id, area, scenario, steps, expected, priority, type, preconds, test_data, notes
TEST_CASES = [
    # A. Page Load & Route
    ("HOME-001", "A. Page Load", "Homepage route loads", "Navigate to /", "Page returns 200; HomePageView renders", "P0", "Functional", PRE_01, "Route: /", ""),
    ("HOME-002", "A. Page Load", "Route loading skeleton", "Hard refresh / during navigation", "HomePageRouteSkeleton shown in loading.tsx", "P2", "UX", PRE_01, "loading.tsx", ""),
    ("HOME-003", "A. Page Load", "ISR revalidate config", "Inspect page.tsx export", "revalidate = 300", "P2", "Architecture", PRE_01, "page.tsx", ""),
    ("HOME-004", "A. Page Load", "CMS provider wraps page", "Inspect page component tree", "HomepageCmsProvider seeds shell/editorial/shopping", "P1", "Architecture", PRE_01, "—", ""),
    ("HOME-005", "A. Page Load", "Prefetch homepage bundle", "Inspect page.tsx data fetch", "prefetchHomepageBundle() on server", "P1", "Performance", PRE_01, "—", ""),
    ("HOME-006", "A. Page Load", "Hero LCP preload", "Inspect page.tsx", "preloadHeroLcpImages(hero) called", "P1", "Performance", PRE_02, "—", ""),
    ("HOME-007", "A. Page Load", "Feature error boundaries", "Inspect HomePage.tsx", "SectionNav wrapped in FeatureErrorBoundary", "P2", "Resilience", PRE_01, "—", ""),
    ("HOME-008", "A. Page Load", "Homepage performance reporter", "Inspect HomePage.tsx", "HomepagePerformanceReporter mounted", "P3", "Performance", PRE_01, "—", ""),
    # B. SEO & Metadata
    ("HOME-009", "B. SEO", "generateMetadata wired", "Inspect (home)/page.tsx", "generateMetadata exports CMS + fallback SEO", "P0", "SEO", PRE_01, "Route: /", ""),
    ("HOME-010", "B. SEO", "Canonical link", "View page source on /", "link rel=canonical present", "P0", "SEO", PRE_01, "Route: /", ""),
    ("HOME-011", "B. SEO", "Meta title", "View page source", "title reflects CMS SEO or Sunny Diamonds fallback", "P0", "SEO", PRE_01, "Route: /", ""),
    ("HOME-012", "B. SEO", "JSON-LD WebSite", "View page source", "WebSite + Organization JSON-LD scripts", "P1", "SEO", PRE_01, "Route: /", ""),
    ("HOME-013", "B. SEO", "CMS SEO resolver", "Inspect homepageSeo.ts", "resolveHomepageSeoMetadata uses homepage then global defaultSeo", "P1", "SEO", PRE_01, "homepageSeo.ts", ""),
    ("HOME-014", "B. SEO", "Metadata fallback on CMS error", "Simulate CMS failure in generateMetadata", "Fallback title/description from siteConfig", "P2", "Resilience", PRE_01, "—", ""),
    ("HOME-015", "B. SEO", "Share/OG image resolution", "Inspect homepageSeo.ts", "shareImage/ogImage resolved via resolveCmsMediaUrl", "P2", "SEO", PRE_01, "—", ""),
    # C. Hero Section
    ("HOME-016", "C. Hero", "Hero section wired", "Inspect HomePage.tsx", "HeroSection with id=hero", "P0", "Functional", PRE_02, "—", ""),
    ("HOME-017", "C. Hero", "Hero null guard", "CMS hero inactive/missing", "HeroSection returns null; page still loads", "P1", "CMS", PRE_02, "—", ""),
    ("HOME-018", "C. Hero", "Hero background media", "Inspect HeroSection", "HeroBackgroundMedia for desktop/mobile/video", "P1", "UI", PRE_02, "—", ""),
    ("HOME-019", "C. Hero", "Hero overlay + CTA", "Inspect HeroSection", "HeroSectionOverlay + primary CTA Link", "P1", "UI", PRE_02, "—", ""),
    ("HOME-020", "C. Hero", "Hero trust badges", "Scroll hero on desktop", "HomepageTrustBadgeSection renders when CMS badges exist", "P2", "CMS", PRE_02, "—", ""),
    ("HOME-021", "C. Hero", "Hero full viewport height", "Inspect HeroSection classes", "h-[100dvh] max-h-[100dvh] layout", "P2", "UI", PRE_03, "Mobile + desktop", ""),
    ("HOME-022", "C. Hero", "Hero eyebrow + h1", "Load homepage with CMS hero", "Eyebrow text and h1 from resolved hero content", "P1", "Content", PRE_02, "—", ""),
    # D. Crafting Rarity
    ("HOME-023", "D. Crafting Rarity", "Section wired", "Inspect HomePage.tsx", "CraftingRaritySection id=crafting-rarity", "P0", "Functional", PRE_01, "—", ""),
    ("HOME-024", "D. Crafting Rarity", "Category grid", "Inspect CraftingRaritySection", "CraftingRarityCategoryGrid for nav categories", "P1", "UI", PRE_01, "—", ""),
    ("HOME-025", "D. Crafting Rarity", "Copy block + secondary CTA", "Inspect CraftingRaritySection", "CraftingRarityCopyBlock with secondary CTA link", "P1", "UI", PRE_01, "—", ""),
    ("HOME-026", "D. Crafting Rarity", "Section active guard", "CMS section inactive", "isSectionActive hides section content", "P2", "CMS", PRE_01, "—", ""),
    ("HOME-027", "D. Crafting Rarity", "Responsive hero image", "Inspect CraftingRaritySection", "ResponsiveImage for editorial imagery", "P2", "UI", PRE_03, "—", ""),
    # E. Section Navigation
    ("HOME-028", "E. Section Nav", "Section nav wired", "Inspect HomePage.tsx", "SectionNav dynamically imported", "P1", "UI", PRE_01, "—", ""),
    ("HOME-029", "E. Section Nav", "Scroll spy", "Inspect SectionNav.tsx", "useScrollSpy with sectionIds from useHomeSidebarNavigation", "P1", "Functional", PRE_03, "Desktop", ""),
    ("HOME-030", "E. Section Nav", "Click scrolls to section", "Click nav item", "scrollToHomeSection + saveHomeActiveSection", "P1", "Functional", PRE_03, "Desktop", ""),
    ("HOME-031", "E. Section Nav", "Hide at footer", "Scroll to footer", "Nav hidden when footer intersecting", "P2", "UI", PRE_03, "Desktop", ""),
    ("HOME-032", "E. Section Nav", "Progress indicator", "Scroll through sections", "SectionNavProgressIndicator reflects active section", "P2", "UI", PRE_03, "Desktop", ""),
    ("HOME-033", "E. Section Nav", "Empty nav guard", "No CMS nav sections", "SectionNav returns null", "P3", "Edge Case", PRE_01, "—", ""),
    # F. Below-fold Sections
    ("HOME-034", "F. Below Fold", "Diamond sourcing section", "Scroll to flawless", "DiamondSourcingSection id=flawless lazy-loaded", "P1", "CMS", PRE_01, "—", ""),
    ("HOME-035", "F. Below Fold", "Featured collection (Alankara)", "Scroll to alankara", "FeaturedCollectionSection renders collection CMS block", "P1", "CMS", PRE_05, "—", ""),
    ("HOME-036", "F. Below Fold", "Occasions teaser", "Scroll to categories", "OccasionsTeaserSection with category tiles", "P1", "CMS", PRE_01, "—", ""),
    ("HOME-037", "F. Below Fold", "Featured products carousel", "Scroll to diamond-awaits", "FeaturedProductsSection + carousel from Magento", "P0", "Integration", PRE_05, "—", ""),
    ("HOME-038", "F. Below Fold", "Gifting banner (Valentine)", "Scroll to valentine", "ForYourValentineSection from shopping blocks", "P1", "CMS", PRE_01, "—", ""),
    ("HOME-039", "F. Below Fold", "Sunny Promise", "Scroll to promise", "SunnyPromiseSection trust/promise CMS content", "P2", "CMS", PRE_01, "—", ""),
    ("HOME-040", "F. Below Fold", "Bespoke for you", "Scroll to bespoke-for-you", "BespokeForYouSection cards + CTA", "P1", "CMS", PRE_01, "—", ""),
    ("HOME-041", "F. Below Fold", "Diamonds for Everyone", "Scroll to diamonds-for-everyone", "DiamondsForEveryoneSection promo block", "P1", "CMS", PRE_01, "—", ""),
    ("HOME-042", "F. Below Fold", "Craftsmanship process", "Scroll to craftsmanship", "CraftsmanshipProcess steps from editorial CMS", "P2", "CMS", PRE_01, "—", ""),
    ("HOME-043", "F. Below Fold", "Showrooms section", "Scroll to showrooms", "ShowroomsSection store locator teaser", "P1", "CMS", PRE_01, "—", ""),
    ("HOME-044", "F. Below Fold", "Lazy import retry", "Inspect HomeBelowFoldSections", "lazyImportWithRetry for each below-fold section", "P2", "Architecture", PRE_01, "—", ""),
    ("HOME-045", "F. Below Fold", "Section fallbacks", "Slow network scroll", "SectionFallback pulse placeholders while loading", "P2", "UX", PRE_03, "—", ""),
    # G. CMS & Data Layer
    ("HOME-046", "G. CMS Data", "Shell service", "Inspect homepageShell.service.ts", "Fetches api/homepage/shell", "P1", "Architecture", PRE_01, "—", ""),
    ("HOME-047", "G. CMS Data", "Editorial blocks service", "Inspect homepageEditorialBlocks.service.ts", "Fetches api/homepage/editorial-blocks", "P1", "Architecture", PRE_01, "—", ""),
    ("HOME-048", "G. CMS Data", "Shopping blocks service", "Inspect homepageShoppingBlocks.service.ts", "Fetches api/homepage/shopping-blocks", "P1", "Architecture", PRE_01, "—", ""),
    ("HOME-049", "G. CMS Data", "Homepage mapper", "Inspect homepage.mapper.ts", "Normalizes Strapi homepage payloads", "P2", "Architecture", PRE_01, "—", ""),
    ("HOME-050", "G. CMS Data", "CMS cache seeding", "Inspect HomepageCmsProvider", "seedHomepageCmsCache on first render", "P2", "Architecture", PRE_01, "—", ""),
    ("HOME-051", "G. CMS Data", "Partial CMS failure tolerance", "Inspect prefetchHomepageCms", "Promise.allSettled — page loads if one block fails", "P1", "Resilience", PRE_01, "—", ""),
    ("HOME-052", "G. CMS Data", "Query keys", "Inspect hooks/homepage/queryKeys.ts", "Stable keys for shell/editorial/shopping", "P3", "Architecture", PRE_01, "—", ""),
    # H. Performance & Cross-entry
    ("HOME-053", "H. Performance", "Below-fold prefetch", "Inspect prefetchHomepageBelowFold", "Alankara/occasions prefetched server-side when possible", "P2", "Performance", PRE_05, "—", ""),
    ("HOME-054", "H. Performance", "Lazy animated sections", "Inspect HomeBelowFoldSections", "LazyAnimatedSection defers below-fold paint", "P2", "Performance", PRE_01, "—", ""),
    ("HOME-055", "H. Cross-entry", "Header navigation", "Use main header on /", "Jewellery, Gifting, Bespoke links work from homepage", "P0", "Navigation", PRE_04, "—", ""),
    ("HOME-056", "H. Cross-entry", "Hero CTA navigation", "Click hero primary CTA", "Navigates to CMS-configured destination", "P1", "Navigation", PRE_02, "—", ""),
    ("HOME-057", "H. Cross-entry", "Category grid links", "Click crafting rarity category", "Navigates to jewellery category route", "P1", "Navigation", PRE_05, "—", ""),
    ("HOME-058", "H. Cross-entry", "Gifting CTA to PLP", "Click gifting banner CTA", "Navigates to /jewellery with filter params", "P1", "Navigation", PRE_01, "See GIFT-230", ""),
    # I. Responsive (manual)
    ("HOME-059", "I. Responsive", "Mobile hero layout", "View / on mobile ≤390px", "Hero text readable; CTA reachable; no horizontal scroll", "P0", "UI", PRE_03, "Mobile", "Manual"),
    ("HOME-060", "I. Responsive", "Tablet section spacing", "View / on ~768px", "Sections stack correctly; images not cropped incorrectly", "P1", "UI", PRE_03, "Tablet", "Manual"),
    ("HOME-061", "I. Responsive", "Desktop section nav", "View / on ≥1280px", "Section nav visible; scroll-spy highlights active section", "P1", "UI", PRE_03, "Desktop", "Manual"),
    ("HOME-062", "I. Responsive", "iOS Safari date/overlay", "Open panels from homepage CTAs", "No z-index or scroll lock conflicts with header", "P2", "UI", PRE_04, "iOS Safari", "Manual"),
]

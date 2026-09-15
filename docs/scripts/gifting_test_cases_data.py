"""Gifting module test case data — imported by add_gifting_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Strapi CMS reachable with published gifting-page single type"
PRE_02 = "PRE-02: Magento API reachable (products, nav, facets, cart, gift card SKUs)"
PRE_03 = "PRE-03: Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"
PRE_04 = "PRE-04: Browsers: Chrome, Safari, Firefox, Edge (latest)"
PRE_05 = "PRE-05: Guest and logged-in Magento customer accounts available"
PRE_06 = "PRE-06: GIFT_CARD_PHYSICAL_SKU and GIFT_CARD_DIGITAL_SKU configured in env"
PRE_07 = "PRE-07: Razorpay payment configured for online gift card checkout"

PRECONDITIONS_LIST = [
    ("PRE-01", "Strapi CMS reachable with published gifting-page single type"),
    ("PRE-02", "Magento API reachable (products, nav, facets, cart, gift card SKUs)"),
    ("PRE-03", "Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"),
    ("PRE-04", "Browsers: Chrome, Safari, Firefox, Edge (latest)"),
    ("PRE-05", "Guest and logged-in Magento customer accounts available"),
    ("PRE-06", "GIFT_CARD_PHYSICAL_SKU and GIFT_CARD_DIGITAL_SKU configured in env"),
    ("PRE-07", "Razorpay payment configured for online gift card checkout"),
]

TEST_DATA_NOTES = [
    "Routes: /gifting (landing), /gift-card (auto-opens gift card panel)",
    "Gift finder submits to /jewellery or /jewellery/{category} with occasion/minPrice/maxPrice query params",
    "Gift card flow persists in sessionStorage key sunny:gift-card-flow",
    "Occasion cards on /gifting always show CTA label 'Explore' (not CMS label)",
    "Cart gifting panel: intro nudge shown only for authenticated users on first checkout attempt",
    "Gift notes are entered in cart gifting panel but not displayed on cart line items in UI",
]

KNOWN_GAPS = [
    "Gift note not displayed on cart line items (only in gifting panel)",
    "Gift note may not appear on My Orders order detail if backend metadata missing",
    "No dedicated gifting PRD in docs/prd/",
    "No automated unit/integration tests for gifting module",
]

# id, area, scenario, steps, expected, priority, type, preconds, test_data, notes
TEST_CASES = [
    # A. Page load & routing
    ("GIFT-001", "A. Page Load", "Open gifting landing page", "Navigate to /gifting", "Page loads with skeleton then CMS content; title includes Sunny Diamonds branding", "P0", "Functional", PRE_01, "Route: /gifting", ""),
    ("GIFT-002", "A. Page Load", "ISR revalidation", "Inspect page.tsx revalidate export", "revalidate = 300 (5 min ISR)", "P2", "Technical", "—", "—", ""),
    ("GIFT-003", "A. Page Load", "Sitemap inclusion", "Open /sitemap.xml", "/gifting URL listed (priority 0.8, weekly)", "P2", "SEO", "—", "—", ""),
    ("GIFT-004", "A. Page Load", "Gift card route not in sitemap", "Search sitemap for /gift-card", "/gift-card not listed in sitemap", "P2", "SEO", "—", "—", ""),
    ("GIFT-005", "A. Page Load", "Header nav link", "Click 'Gifting' in main header", "Navigates to /gifting; header uses transparent/overlay treatment", "P0", "Navigation", PRE_01, "—", ""),
    ("GIFT-006", "A. Page Load", "Footer link", "Click Gifting link in footer if present", "Routes to /gifting", "P1", "Navigation", PRE_01, "—", ""),
    ("GIFT-007", "A. Page Load", "Loading skeleton", "Hard refresh /gifting on slow network", "Route loading skeleton (min-h 40vh gray placeholder) shown before content", "P2", "UX", PRE_01, "—", ""),
    ("GIFT-008", "A. Page Load", "Suspense fallback", "Observe initial render", "EMPTY_GIFTING_PAGE fallback used while Strapi loads; no crash", "P2", "UX", PRE_01, "—", ""),
    ("GIFT-009", "A. Page Load", "CMS fetch failure", "Simulate Strapi outage for gifting-page", "Page renders without sections; no unhandled error; metadata uses fallbacks", "P1", "Resilience", PRE_01, "CMS down", ""),
    ("GIFT-010", "A. Page Load", "All sections disabled in CMS", "Set showField=false on all gifting-page sections", "Minimal page without console errors; only sections with valid CMS data render", "P1", "CMS", PRE_01, "All sections inactive", ""),
    ("GIFT-011", "A. Page Load", "SEO metadata from CMS", "View page source / devtools", "meta title, description, canonical from CMS SEO block when configured", "P1", "SEO", PRE_01, "—", ""),
    ("GIFT-012", "A. Page Load", "SEO fallback on CMS failure", "Load page when CMS SEO missing", "Site default title/description used", "P2", "SEO", PRE_01, "—", ""),
    ("GIFT-013", "A. Page Load", "Browser back/forward", "Navigate away from /gifting and return", "Page restores correctly without broken state", "P2", "Navigation", PRE_01, "—", ""),
    ("GIFT-014", "A. Page Load", "Direct anchor navigation", "Open /gifting#occasion-led-gifts", "Page scrolls to occasion section", "P2", "Navigation", PRE_01, "—", ""),
    ("GIFT-015", "A. Page Load", "No horizontal scroll", "Test 320px–1920px widths on /gifting", "No unintended horizontal scrollbar", "P1", "UI", PRE_03, "—", ""),

    # B. Hero section
    ("GIFT-020", "B. Hero", "Hero renders from CMS", "Open /gifting with hero active", "Hero h1 title visible; responsive background image (desktop/mobile)", "P0", "CMS", PRE_01, "—", ""),
    ("GIFT-021", "B. Hero", "Hero hidden when inactive", "Set hero showField=false in CMS", "Hero section omitted", "P1", "CMS", PRE_01, "Hero inactive", ""),
    ("GIFT-022", "B. Hero", "Hero hidden without title", "Remove hero title in CMS", "Hero section not rendered", "P2", "CMS", PRE_01, "—", ""),
    ("GIFT-023", "B. Hero", "Hero responsive height", "Compare mobile vs desktop", "240px mobile / 320px desktop height per Figma spec", "P2", "UI", PRE_03, "Mobile + Desktop", ""),
    ("GIFT-024", "B. Hero", "Hero desktop image", "Desktop viewport", "CMS desktop background image shown", "P1", "CMS", PRE_03, "Desktop", ""),
    ("GIFT-025", "B. Hero", "Hero mobile image", "Mobile viewport", "CMS mobile background image shown", "P1", "CMS", PRE_03, "Mobile", ""),
    ("GIFT-026", "B. Hero", "Hero accessibility", "Inspect hero region", "aria-labelledby='gifting-hero-title' on hero section", "P2", "Accessibility", PRE_01, "—", ""),
    ("GIFT-027", "B. Hero", "Hero overlay header", "Load page at top", "Header transparent with white nav text over hero", "P1", "UI", PRE_01, "—", ""),

    # C. Intro (Gifting With Love)
    ("GIFT-030", "C. Intro", "Intro section renders", "Scroll to intro below hero", "CMS title and description displayed", "P1", "CMS", PRE_01, "—", ""),
    ("GIFT-031", "C. Intro", "Intro hidden when inactive", "Set intro showField=false", "Section omitted", "P1", "CMS", PRE_01, "Intro inactive", ""),
    ("GIFT-032", "C. Intro", "Intro background image", "Configure optional background in CMS", "Background image renders when provided", "P2", "CMS", PRE_01, "—", ""),
    ("GIFT-033", "C. Intro", "Intro scroll reveal", "Scroll into intro section", "Reveal animation on heading/image/description", "P2", "UI", PRE_01, "—", ""),
    ("GIFT-034", "C. Intro", "Intro multiline title", "CMS title with line breaks", "Title supports whitespace-pre-line rendering", "P2", "CMS", PRE_01, "—", ""),

    # D. Occasion cards
    ("GIFT-040", "D. Occasions", "Occasion section renders", "Scroll to #occasion-led-gifts", "Section title and occasion cards visible", "P0", "Functional", PRE_01, "—", ""),
    ("GIFT-041", "D. Occasions", "Occasion section hidden", "Disable occasion section in CMS", "Section omitted", "P1", "CMS", PRE_01, "Occasions inactive", ""),
    ("GIFT-042", "D. Occasions", "Card CTA label on gifting", "Inspect occasion card CTA on /gifting", "CTA text is always 'Explore' (not CMS label)", "P1", "UI", PRE_01, "—", ""),
    ("GIFT-043", "D. Occasions", "Card click navigation (filterSlug)", "Click card with filterSlug configured", "Navigates to /jewellery?occasion={slug}", "P0", "Navigation", PRE_02, "Card with filterSlug", ""),
    ("GIFT-044", "D. Occasions", "Card click navigation (CTA URL)", "Click card without filterSlug but with CMS CTA URL", "Navigates to CMS CTA URL", "P1", "Navigation", PRE_01, "Card with CTA URL only", ""),
    ("GIFT-045", "D. Occasions", "Card without image omitted", "Configure card without image in CMS", "Card not rendered", "P2", "CMS", PRE_01, "—", ""),
    ("GIFT-046", "D. Occasions", "Card without href omitted", "Configure card without valid link", "Card not rendered", "P2", "CMS", PRE_01, "—", ""),
    ("GIFT-047", "D. Occasions", "Mobile carousel scroll", "Swipe occasion cards on mobile/tablet", "Horizontal snap scroll works smoothly", "P1", "Responsive", PRE_03, "Mobile/Tablet", ""),
    ("GIFT-048", "D. Occasions", "Desktop grid layout", "View at xl breakpoint", "4-column grid layout", "P1", "Responsive", PRE_03, "Desktop xl", ""),
    ("GIFT-049", "D. Occasions", "Keyboard navigation", "Focus carousel; press Arrow Left/Right", "Carousel scrolls with keyboard", "P2", "Accessibility", PRE_01, "—", ""),
    ("GIFT-050", "D. Occasions", "Desktop hover CTA", "Hover occasion card on desktop", "CTA reveal/hover animation plays", "P2", "UI", PRE_03, "Desktop", ""),

    # E. Trending products
    ("GIFT-051", "E. Products", "Product section renders", "Scroll to #gifting-products", "Section title, description, product carousel visible", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-052", "E. Products", "Loading skeleton", "Load page; observe product section during fetch", "FeaturedCarouselSkeleton shown while Magento loads", "P1", "UX", PRE_02, "—", ""),
    ("GIFT-053", "E. Products", "Empty products hidden", "Simulate Magento returning no trending products", "Entire product section hidden (not empty state message)", "P1", "Resilience", PRE_02, "Empty Magento response", ""),
    ("GIFT-054", "E. Products", "Product card CTA", "Inspect product card button", "CTA label is 'VIEW PRODUCT'", "P1", "UI", PRE_02, "—", ""),
    ("GIFT-055", "E. Products", "Product card navigation", "Click a product card", "Navigates to product PDP", "P0", "Navigation", PRE_02, "—", ""),
    ("GIFT-056", "E. Products", "Product carousel scroll", "Scroll/swipe product carousel", "Carousel navigation works on mobile and desktop", "P1", "UI", PRE_03, "—", ""),
    ("GIFT-057", "E. Products", "Section hidden without CMS title", "Remove perfectGift title in CMS", "Section not rendered even if products exist", "P2", "CMS", PRE_01, "—", ""),

    # F. Gift finder
    ("GIFT-060", "F. Gift Finder", "Gift finder section renders", "Scroll to #discover-ideal-gift", "Three dropdowns and submit button visible", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-061", "F. Gift Finder", "Category dropdown populated", "Open 'I am looking for' dropdown", "Magento jewellery nav categories listed", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-062", "F. Gift Finder", "Price dropdown populated", "Open 'Within' dropdown", "Magento price buckets OR static fallback bands shown", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-063", "F. Gift Finder", "Occasion dropdown populated", "Open 'By Occasion' dropdown", "Magento occasion facets listed", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-064", "F. Gift Finder", "Static price fallback", "Disable Magento price buckets", "Static bands: Under ₹25k, ₹25k–50k, ₹50k–1L, Above ₹1L", "P1", "Resilience", PRE_02, "Magento buckets empty", ""),
    ("GIFT-065", "F. Gift Finder", "Submit disabled with no selection", "Load form; do not select any field", "Submit button disabled", "P0", "Validation", PRE_02, "—", ""),
    ("GIFT-066", "F. Gift Finder", "Submit enabled with category only", "Select category only; click submit", "Navigates to /jewellery/{category}", "P0", "Functional", PRE_02, "Category: Rings", ""),
    ("GIFT-067", "F. Gift Finder", "Submit enabled with price only", "Select price range only; submit", "Navigates to /jewellery?minPrice=&maxPrice=", "P0", "Functional", PRE_02, "Price: ₹25k–50k", ""),
    ("GIFT-068", "F. Gift Finder", "Submit enabled with occasion only", "Select occasion only; submit", "Navigates to /jewellery?occasion={slug}", "P0", "Functional", PRE_02, "Occasion: Wedding", ""),
    ("GIFT-069", "F. Gift Finder", "Submit with all filters", "Select category + price + occasion; submit", "Navigates to /jewellery/{category}?occasion=&minPrice=&maxPrice=", "P0", "Functional", PRE_02, "All three selected", ""),
    ("GIFT-070", "F. Gift Finder", "Gift finder image desktop", "Desktop viewport", "CMS gift finder side image visible", "P1", "UI", PRE_03, "Desktop", ""),
    ("GIFT-071", "F. Gift Finder", "Gift finder image hidden mobile", "Mobile viewport", "Side image hidden (md:block hidden)", "P1", "Responsive", PRE_03, "Mobile", ""),
    ("GIFT-072", "F. Gift Finder", "Suspense fallback", "Observe form before Magento options load", "Form renders with static price ranges as fallback", "P2", "UX", PRE_02, "—", ""),
    ("GIFT-073", "F. Gift Finder", "PLP noindex with filters", "Submit gift finder; inspect PLP meta", "Filtered jewellery PLP uses noIndex when query params present", "P2", "SEO", PRE_02, "—", ""),

    # G. Gift card promo section
    ("GIFT-080", "G. Gift Card Promo", "Gift card section renders", "Scroll to #gift-card", "Title, description, background, cutout image, CTA visible", "P0", "CMS", PRE_01, "—", ""),
    ("GIFT-081", "G. Gift Card Promo", "Section hidden when inactive", "Disable giftCard section in CMS", "Section omitted", "P1", "CMS", PRE_01, "Gift card section inactive", ""),
    ("GIFT-082", "G. Gift Card Promo", "CTA opens gift card panel", "Click gift card CTA button", "Gift card side panel/drawer opens", "P0", "Functional", PRE_01, "—", ""),
    ("GIFT-083", "G. Gift Card Promo", "CTA layout mobile", "Mobile viewport", "CTA appears below cutout image", "P1", "Responsive", PRE_03, "Mobile", ""),
    ("GIFT-084", "G. Gift Card Promo", "CTA layout desktop", "Desktop viewport", "CTA inline in text column", "P1", "Responsive", PRE_03, "Desktop", ""),

    # H. Finishing touch & trust badges
    ("GIFT-090", "H. Finishing Touch", "Promise section renders", "Scroll to #the-finishing-touch", "Title and service cards visible", "P1", "CMS", PRE_01, "—", ""),
    ("GIFT-091", "H. Finishing Touch", "Mobile carousel", "Swipe finishing touch cards on mobile", "Horizontal snap scroll works", "P2", "Responsive", PRE_03, "Mobile", ""),
    ("GIFT-092", "H. Finishing Touch", "Desktop grid", "Desktop viewport", "3-column grid layout", "P2", "Responsive", PRE_03, "Desktop", ""),
    ("GIFT-093", "H. Finishing Touch", "Description desktop only", "Compare mobile vs desktop", "Section description hidden on mobile (hidden md:block)", "P2", "UI", PRE_03, "—", ""),
    ("GIFT-094", "H. Trust Badges", "Guarantees section renders", "Scroll to trust badges", "CMS trust badges displayed via GuaranteesBar", "P1", "CMS", PRE_01, "—", ""),
    ("GIFT-095", "H. Trust Badges", "Empty badges hidden", "Remove all trust badges in CMS", "Guarantees section not rendered", "P2", "CMS", PRE_01, "—", ""),

    # I. Gift card route & launcher
    ("GIFT-100", "I. Gift Card Route", "Open /gift-card", "Navigate to /gift-card", "Full gifting page loads; gift card panel auto-opens", "P0", "Functional", PRE_01, "Route: /gift-card", ""),
    ("GIFT-101", "I. Gift Card Route", "Auto-scroll to gift card section", "Land on /gift-card", "Page scrolls to #gift-card anchor", "P1", "UX", PRE_01, "—", ""),
    ("GIFT-102", "I. Gift Card Route", "Close panel redirect", "On /gift-card, close gift card panel", "Redirects to /gifting#gift-card", "P0", "Navigation", PRE_01, "—", ""),
    ("GIFT-103", "I. Gift Card Route", "Homepage gift card CTA", "Click secondary gift card CTA on homepage gifting banner", "Gift card panel opens (no full navigation)", "P1", "Navigation", PRE_01, "Homepage ForYourValentineSection", ""),
    ("GIFT-104", "I. Gift Card Route", "CMS CTA matching /gift-card", "Click CMS CTA with URL /gift-card or #gift-card", "Gift card panel opens instead of navigation", "P2", "Navigation", PRE_01, "—", ""),

    # J. Gift card flow — configure step
    ("GIFT-110", "J. GC Configure", "Panel shell desktop", "Open gift card panel on desktop (>1023px)", "Right-side sheet panel opens", "P0", "UI", PRE_03, "Desktop", ""),
    ("GIFT-111", "J. GC Configure", "Panel shell mobile", "Open gift card panel on mobile (≤1023px)", "Bottom drawer at 90vh height", "P0", "UI", PRE_03, "Mobile", ""),
    ("GIFT-112", "J. GC Configure", "Panel overlay", "Open panel; inspect backdrop", "rgba(30,30,30,0.75) overlay with blur", "P2", "UI", PRE_01, "—", ""),
    ("GIFT-113", "J. GC Configure", "Default card type", "Open configure step", "Physical card type selected by default", "P1", "Functional", PRE_01, "—", ""),
    ("GIFT-114", "J. GC Configure", "Toggle digital card", "Switch to Digital card type", "Digital selected; address step skipped later", "P0", "Functional", PRE_01, "—", ""),
    ("GIFT-115", "J. GC Configure", "Amount slider range", "Move amount slider", "Range ₹1,000–₹50,000; step ₹500; default ₹5,000", "P0", "Functional", PRE_01, "—", ""),
    ("GIFT-116", "J. GC Configure", "Amount presets", "Click preset buttons", "₹1,000 / ₹5,000 / ₹10,000 presets update amount", "P1", "Functional", PRE_01, "—", ""),
    ("GIFT-117", "J. GC Configure", "Manual amount input", "Type amount below 1000 or above 50000", "Value clamped to ₹1,000–₹50,000 range", "P1", "Validation", PRE_01, "Amount: 500, 60000", ""),
    ("GIFT-118", "J. GC Configure", "Occasion required", "Leave occasion empty; click ADD DETAILS", "Button disabled until occasion selected", "P0", "Validation", PRE_02, "—", ""),
    ("GIFT-119", "J. GC Configure", "Occasion from Magento", "Open occasion dropdown", "Options from Magento sd_occasions attribute", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-120", "J. GC Configure", "Occasion fallback", "Simulate Magento occasions API failure", "Static fallback: Wedding/Anniversary/Birthday/Festive", "P1", "Resilience", PRE_02, "Magento down", ""),
    ("GIFT-121", "J. GC Configure", "Optional message", "Enter gift message in textarea", "Message accepted; optional field", "P2", "Functional", PRE_01, "—", ""),
    ("GIFT-122", "J. GC Configure", "Guest auth gate", "As guest, complete configure; click ADD DETAILS", "Login modal opens with returnUrl; resumes to Details after auth", "P0", "Auth", PRE_05, "Guest user", ""),
    ("GIFT-123", "J. GC Configure", "Authenticated proceed", "As logged-in user, click ADD DETAILS", "Advances to Details step", "P0", "Functional", PRE_05, "Logged-in user", ""),
    ("GIFT-124", "J. GC Configure", "Flow state persistence", "Fill configure step; refresh browser", "sessionStorage sunny:gift-card-flow restores state", "P1", "UX", PRE_01, "—", ""),

    # K. Gift card flow — details step
    ("GIFT-130", "K. GC Details", "Sender fields render", "Advance to Details step", "Sender name, phone (+91), email fields visible", "P0", "Functional", PRE_05, "—", ""),
    ("GIFT-131", "K. GC Details", "Profile prefill logged-in", "Open Details as logged-in user", "Sender name/phone/email prefilled from customer profile once", "P1", "Functional", PRE_05, "Logged-in user", ""),
    ("GIFT-132", "K. GC Details", "Sender name required", "Clear sender name; attempt continue", "Validation error; cannot proceed", "P0", "Validation", PRE_05, "—", ""),
    ("GIFT-133", "K. GC Details", "Sender phone required", "Enter <10 digit phone", "Validation error for phone", "P0", "Validation", PRE_05, "Phone: 12345", ""),
    ("GIFT-134", "K. GC Details", "Sender phone digits only", "Type letters in phone field", "Only digits accepted", "P1", "Validation", PRE_05, "—", ""),
    ("GIFT-135", "K. GC Details", "Sender email optional", "Leave email empty with valid name/phone", "Can proceed (email not required)", "P1", "Validation", PRE_05, "—", ""),
    ("GIFT-136", "K. GC Details", "Same as sender default", "Check receiver section", "'Same as Sender' toggle ON by default", "P1", "Functional", PRE_05, "—", ""),
    ("GIFT-137", "K. GC Details", "Receiver fields when toggled off", "Turn off Same as Sender", "Receiver name and phone fields appear and are required", "P0", "Functional", PRE_05, "—", ""),
    ("GIFT-138", "K. GC Details", "Physical CTA label", "Physical card selected", "Button shows 'ADD ADDRESS'", "P1", "UI", PRE_05, "Physical card", ""),
    ("GIFT-139", "K. GC Details", "Digital CTA label", "Digital card selected", "Button shows 'PAY NOW'", "P0", "Functional", PRE_05, "Digital card", ""),

    # L. Gift card flow — address step (physical)
    ("GIFT-140", "L. GC Address", "Address step shown physical only", "Physical card: proceed from Details", "Address step displayed", "P0", "Functional", PRE_05, "Physical card", ""),
    ("GIFT-141", "L. GC Address", "Address line 1 required", "Leave address line 1 empty", "Validation error; PAY NOW disabled", "P0", "Validation", PRE_05, "—", ""),
    ("GIFT-142", "L. GC Address", "Address line 1 min length", "Enter <5 char address", "Validation error", "P1", "Validation", PRE_05, "Addr: 'abc'", ""),
    ("GIFT-143", "L. GC Address", "Address line 1 max length", "Enter 121+ characters", "Capped at 120 chars or validation error", "P2", "Validation", PRE_05, "—", ""),
    ("GIFT-144", "L. GC Address", "Pincode format", "Enter invalid pincode (5 digits, starts with 0)", "Error: 'Invalid Pincode'", "P0", "Validation", PRE_05, "Pincode: 012345, 12345", ""),
    ("GIFT-145", "L. GC Address", "Pincode valid", "Enter 6-digit pincode not starting with 0", "Accepted", "P0", "Validation", PRE_05, "Pincode: 560001", ""),
    ("GIFT-146", "L. GC Address", "City validation", "Enter city <2 chars or with numbers", "Validation error", "P1", "Validation", PRE_05, "City: 'A', 'City1'", ""),
    ("GIFT-147", "L. GC Address", "State dropdown", "Open state dropdown", "Indian states list (INDIAN_STATES) shown", "P0", "Functional", PRE_05, "—", ""),
    ("GIFT-148", "L. GC Address", "Use current location", "Click use current location", "Geolocation autofill; shows 'DETECTING LOCATION...' while loading", "P1", "Functional", PRE_05, "—", ""),
    ("GIFT-149", "L. GC Address", "Geolocation denied", "Deny location permission", "Graceful fallback; manual entry still works", "P2", "Edge Case", PRE_05, "—", ""),
    ("GIFT-150", "L. GC Address", "Estimated delivery date", "View address step footer", "Estimated delivery date displayed", "P2", "UI", PRE_05, "—", ""),
    ("GIFT-151", "L. GC Address", "PAY NOW disabled until valid", "Partially fill address", "PAY NOW disabled until all required fields valid", "P0", "Validation", PRE_05, "—", ""),

    # M. Gift card payment & success
    ("GIFT-160", "M. GC Payment", "Place order API call", "Complete flow; click PAY NOW", "POST /api/gift-card/place-order with correct payload", "P0", "Integration", PRE_06 + PRE_07, "—", ""),
    ("GIFT-161", "M. GC Payment", "Razorpay modal opens", "Physical/digital PAY NOW with online payment", "Razorpay checkout modal opens", "P0", "Integration", PRE_07, "—", ""),
    ("GIFT-162", "M. GC Payment", "Payment success", "Complete Razorpay payment", "Success step shown with order confirmation", "P0", "Integration", PRE_07, "—", ""),
    ("GIFT-163", "M. GC Payment", "Payment failure toast", "Fail/cancel Razorpay payment", "Toast: 'Payment failed. Please try again or use another payment method.'", "P0", "Error Handling", PRE_07, "—", ""),
    ("GIFT-164", "M. GC Payment", "Missing SKU config", "Unset GIFT_CARD_*_SKU env vars", "502 with message about gift card checkout not configured", "P1", "Resilience", PRE_06, "SKUs missing", ""),
    ("GIFT-165", "M. GC Payment", "API validation amount", "POST with amount ≤ 0", "400 'Gift card amount is required'", "P1", "API", PRE_06, "amount: 0", ""),
    ("GIFT-166", "M. GC Payment", "API validation sender", "POST without sender name/phone", "400 validation error", "P1", "API", PRE_06, "—", ""),
    ("GIFT-167", "M. GC Payment", "API validation receiver", "POST with sameAsSender=false but missing receiver", "400 validation error", "P1", "API", PRE_06, "—", ""),
    ("GIFT-168", "M. GC Payment", "API validation physical address", "POST physical card without full address", "400 validation error", "P1", "API", PRE_06, "Physical, no address", ""),
    ("GIFT-169", "M. GC Success", "Physical success message", "Complete physical gift card order", "Message mentions physical delivery with estimated date", "P0", "Functional", PRE_07, "Physical card", ""),
    ("GIFT-170", "M. GC Success", "Digital success message", "Complete digital gift card order", "Message mentions digital card sent to recipient", "P0", "Functional", PRE_07, "Digital card", ""),
    ("GIFT-171", "M. GC Success", "Track order CTA", "Click TRACK ORDER on success", "Navigates to /order-tracking?order={orderNumber}", "P0", "Navigation", PRE_07, "—", ""),
    ("GIFT-172", "M. GC Success", "Go back to shopping CTA", "Click GO BACK TO SHOPPING", "Navigates to /jewellery", "P1", "Navigation", PRE_07, "—", ""),
    ("GIFT-173", "M. GC Success", "Close panel resets flow", "Close panel after success", "Flow state cleared; panel closes", "P1", "UX", PRE_07, "—", ""),

    # N. PDP gift marking
    ("GIFT-180", "N. PDP Gift", "Mark as gift checkbox", "Open any jewellery PDP", "'Mark this as a gift' checkbox visible with helper copy", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-181", "N. PDP Gift", "Add to bag with gift flag", "Check 'Mark as a gift'; add to bag", "Item added with isGift=true; Gift badge in bag drawer", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-182", "N. PDP Gift", "Add without gift flag", "Leave unchecked; add to bag", "Item added without gift badge", "P1", "Functional", PRE_02, "—", ""),
    ("GIFT-183", "N. PDP Gift", "Edit mode pre-check", "Edit cart line that was marked gift", "Checkbox pre-checked based on isGift/gifting metadata", "P1", "Functional", PRE_02, "Gift line in cart", ""),

    # O. Cart gifting panel
    ("GIFT-190", "O. Cart Gifting", "Gift badge on cart item", "Add gifted item to cart; open cart", "Gift badge visible top-left on cart line", "P0", "UI", PRE_02, "—", ""),
    ("GIFT-191", "O. Cart Gifting", "Mark as gift toggle in cart", "Toggle gift checkbox on cart line", "Gift state updates; toggling ON clears hasExploredGiftingOptions", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-192", "O. Cart Gifting", "View gifting options CTA desktop", "Desktop cart sidebar", "'View Gifting Options' button visible", "P0", "Functional", PRE_02, "Desktop", ""),
    ("GIFT-193", "O. Cart Gifting", "Gifting options CTA mobile", "Mobile cart sticky footer", "'Gifting Options' button visible", "P0", "Functional", PRE_02, "Mobile", ""),
    ("GIFT-194", "O. Cart Gifting", "Open personalise panel", "Click View Gifting Options", "Gifting panel opens on personalise step", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-195", "O. Cart Gifting", "Panel desktop layout", "Open panel on desktop", "Right sheet panel", "P1", "UI", PRE_03, "Desktop", ""),
    ("GIFT-196", "O. Cart Gifting", "Panel mobile layout", "Open panel on mobile", "Bottom drawer 90vh", "P1", "UI", PRE_03, "Mobile", ""),
    ("GIFT-197", "O. Cart Gifting", "Bag hero image", "View personalise step", "Static /images/cart/gifting-bag-hero.png shown", "P2", "UI", PRE_02, "—", ""),
    ("GIFT-198", "O. Cart Gifting", "Add gift note single mode", "Click + to add gift note (single bag)", "Note field activates with placeholder 'Add Gift Note'", "P0", "Functional", PRE_02, "—", ""),
    ("GIFT-199", "O. Cart Gifting", "Item selection checkboxes", "Select/deselect cart items for gifting", "Checkboxes toggle which items included in gift bag", "P0", "Functional", PRE_02, "Multi-item cart", ""),
    ("GIFT-200", "O. Cart Gifting", "Separate gifts toggle", "Enable 'Separate gifts' switch", "Per-item note fields shown; copy updates to separate bags message", "P0", "Functional", PRE_02, "Multi-item cart", ""),
    ("GIFT-201", "O. Cart Gifting", "Save gifting selection", "Configure notes; click Save", "Gifting applied to Magento cart; panel closes; navigates to /cart", "P0", "Integration", PRE_02, "—", ""),
    ("GIFT-202", "O. Cart Gifting", "Gift note not on cart line", "Save gift note; view cart line items", "Note NOT displayed on cart line (known gap — only in panel)", "P2", "Known Gap", PRE_02, "—", "Gift note not shown on cart UI"),
    ("GIFT-203", "O. Cart Gifting", "CTAs disabled during checkout nav", "Click checkout; observe cart during navigation", "Gifting CTAs disabled while isNavigatingToCheckout", "P2", "UX", PRE_02, "—", ""),

    # P. Checkout gifting integration
    ("GIFT-210", "P. Checkout", "Guest skips gifting intro", "As guest, click Checkout from cart", "Guest checkout modal opens; no gifting intro nudge", "P0", "Functional", PRE_05, "Guest user", ""),
    ("GIFT-211", "P. Checkout", "Auth intro nudge first checkout", "As logged-in user, first checkout click", "Gifting intro dialog/drawer shown before checkout", "P0", "Functional", PRE_05, "Logged-in, not explored", ""),
    ("GIFT-212", "P. Checkout", "Intro personalise CTA", "On intro nudge, click Personalise Gift", "Opens personalise step of gifting panel", "P0", "Functional", PRE_05, "—", ""),
    ("GIFT-213", "P. Checkout", "Intro skip to checkout", "On intro nudge, click Continue to Checkout", "Skips gifting; navigates to /checkout", "P0", "Functional", PRE_05, "—", ""),
    ("GIFT-214", "P. Checkout", "No intro after explored", "Complete gifting flow once; checkout again", "Direct navigation to /checkout (no intro nudge)", "P0", "Functional", PRE_05, "hasExploredGiftingOptions=true", ""),
    ("GIFT-215", "P. Checkout", "Intro desktop dialog", "Auth intro on desktop", "Centered dialog 560px width", "P1", "UI", PRE_03, "Desktop", ""),
    ("GIFT-216", "P. Checkout", "Intro mobile drawer", "Auth intro on mobile", "Bottom drawer 90vh", "P1", "UI", PRE_03, "Mobile", ""),
    ("GIFT-217", "P. Checkout", "Gift badge in order summary", "Checkout with gifted items", "Gift badge shown on gifted items in CheckoutOrderSummaryBody", "P1", "UI", PRE_02, "Gifted cart items", ""),
    ("GIFT-218", "P. Checkout", "No gift note in checkout summary", "Checkout with gift note saved", "Gift note not displayed in checkout summary (badge only)", "P2", "Known Gap", PRE_02, "—", ""),

    # Q. Post-order gifting
    ("GIFT-220", "Q. Post-Order", "Gift bag on order detail", "Place order with gifting; open My Orders detail", "'Complementary Gift Bag' shown on gifted item", "P0", "Functional", PRE_05, "Order with gifting", ""),
    ("GIFT-221", "Q. Post-Order", "Gift note on order detail", "Order with gift note placed", "Gift note displayed on order detail item card", "P1", "Functional", PRE_05, "Order with gift note", "May fail if backend metadata missing"),
    ("GIFT-222", "Q. Post-Order", "Order without gifting", "Order placed without gift marking", "No gift bag badge on order detail", "P1", "Functional", PRE_05, "Non-gift order", ""),

    # R. Cross-entry & homepage
    ("GIFT-230", "R. Cross-Entry", "Homepage gifting banner", "View homepage gifting section", "ForYourValentineSection renders from CMS shopping blocks", "P1", "CMS", PRE_01, "Homepage", ""),
    ("GIFT-231", "R. Cross-Entry", "Homepage primary CTA", "Click primary CTA on gifting banner", "Navigates to CMS-configured jewellery PLP URL", "P1", "Navigation", PRE_01, "—", ""),
    ("GIFT-232", "R. Cross-Entry", "Homepage gift card CTA", "Click gift card secondary CTA", "Gift card panel opens", "P1", "Navigation", PRE_01, "—", ""),

    # S. Error, edge & resilience
    ("GIFT-240", "S. Resilience", "Magento trending products down", "Simulate Magento outage for products", "Product section hidden; rest of page loads", "P1", "Resilience", PRE_02, "Magento down", ""),
    ("GIFT-241", "S. Resilience", "Magento gift finder options down", "Simulate Magento nav/facets failure", "Gift finder shows static price fallback; form still usable", "P1", "Resilience", PRE_02, "Magento down", ""),
    ("GIFT-242", "S. Resilience", "Cart gifting Magento sync fail", "Simulate Magento cart sync failure on save", "Local gifting state kept; checkout re-syncs", "P2", "Resilience", PRE_02, "—", ""),
    ("GIFT-243", "S. Resilience", "Empty cart gifting", "Open gifting options on empty cart", "Standard empty bag state; no gifting panel", "P2", "Edge Case", PRE_02, "Empty cart", ""),
    ("GIFT-244", "S. Resilience", "Gift card panel close mid-flow", "Close panel on Details step", "Flow resets; sessionStorage cleared or stale on reopen", "P1", "UX", PRE_01, "—", ""),
    ("GIFT-245", "S. Accessibility", "Gift card form labels", "Tab through gift card form fields", "All inputs have associated labels; focus visible", "P1", "Accessibility", PRE_01, "—", ""),
    ("GIFT-246", "S. Accessibility", "Gifting panel focus trap", "Open gifting panel; tab through", "Focus trapped in panel; Escape closes panel", "P1", "Accessibility", PRE_01, "—", ""),
    ("GIFT-247", "S. Accessibility", "Occasion carousel aria", "Inspect occasion carousel", "Scrollable region has appropriate aria attributes", "P2", "Accessibility", PRE_01, "—", ""),
]

ISSUES = [
    (
        "GIFT-ISSUE-001",
        "",
        "Gifting",
        "O. Cart Gifting",
        "Gift note not shown on cart line items",
        "Gift notes entered in gifting panel are not displayed on cart line items — only badge shown.",
        "P2",
        "Open",
        "GIFT-202",
        "Known gap",
    ),
    (
        "GIFT-ISSUE-002",
        "",
        "Gifting",
        "Q. Post-Order",
        "Gift note missing on order detail",
        "Gift note may not appear on My Orders order detail if backend order metadata is missing.",
        "P1",
        "Open",
        "GIFT-221",
        "See docs/qa/my-orders/QA-GUIDE",
    ),
    (
        "GIFT-ISSUE-003",
        "",
        "Gifting",
        "P. Checkout",
        "Gift note not in checkout summary",
        "Checkout order summary shows gift badge but not the gift note text.",
        "P2",
        "Open",
        "GIFT-218",
        "",
    ),
    (
        "GIFT-ISSUE-004",
        "",
        "Gifting",
        "A. Page Load",
        "No gifting PRD",
        "No dedicated PRD document in docs/prd/ for gifting page requirements.",
        "P3",
        "Open",
        "—",
        "",
    ),
    (
        "GIFT-ISSUE-005",
        "",
        "Gifting",
        "A. Page Load",
        "No automated tests",
        "No unit or integration tests found for gifting module (*.test.ts / *.spec.ts).",
        "P2",
        "Open",
        "—",
        "",
    ),
]

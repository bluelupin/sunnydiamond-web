"""Wishlist module test case data — imported by add_wishlist_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Magento GraphQL wishlist + product catalog APIs reachable"
PRE_02 = "PRE-02: Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"
PRE_03 = "PRE-03: Guest session and logged-in customer (e.g. info.archien@gmail.com)"
PRE_04 = "PRE-04: Published products with valid SKU and PDP urlKey"
PRE_05 = "PRE-05: Products with configurable options (ring size, metal color) for add-to-bag panel"

PRECONDITIONS_LIST = [
    ("PRE-01", "Magento GraphQL wishlist + product catalog APIs reachable"),
    ("PRE-02", "Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"),
    ("PRE-03", "Guest session and logged-in customer account available"),
    ("PRE-04", "Published products with valid SKU and PDP urlKey"),
    ("PRE-05", "Products with ring size / metal options for add-to-bag panel"),
]

TEST_DATA_NOTES = [
    "Primary route: /wishlist (client-rendered; SKUs from WishlistContext)",
    "Guest persistence: localStorage sunny-wishlist (JSON array of SKUs)",
    "Logged-in persistence: Magento customer wishlist via BFF /api/customer/wishlist",
    "Login merge: postLoginSync.syncWishlistAfterLogin() pushes guest SKUs then clears storage",
    "Profile mirror: /profile?section=wishlist uses ProfileWishlistSection",
    "Pagination: WISHLIST_VISIBLE_CAP = 6; load more adds 6 per click",
]

KNOWN_GAPS: list[str] = [
    "Header wishlist icon has no item-count badge (cart has badge)",
    "Wishlist page accessible to guests but shows login banner; profile wishlist requires auth",
]

# issue_id, jira, module, area, title, description, priority, status, test_ids, notes
ISSUES: list[tuple[str, ...]] = [
    (
        "WISH-ISSUE-001",
        "",
        "Wishlist",
        "Header",
        "No wishlist count badge in header",
        "Cart bag icon shows totalItems badge; wishlist nav link is icon-only with no count.",
        "P3",
        "Open",
        "WISH-004",
        "Enhancement — not blocking core flows",
    ),
]

# tc_id, area, scenario, steps, expected, priority, type, preconds, test_data, notes
TEST_CASES = [
    # A. Routes & Page Load
    ("WISH-001", "A. Routes", "Wishlist page route", "Navigate to /wishlist", "WishlistPage renders with heading Your Wishlist", "P0", "Functional", PRE_02, "Route: /wishlist", ""),
    ("WISH-002", "A. Routes", "Wishlist metadata noindex", "Inspect /wishlist meta robots", "noIndex: true in page metadata", "P2", "SEO", PRE_02, "Route: /wishlist", ""),
    ("WISH-003", "A. Routes", "Wishlist canonical", "Inspect canonical link on /wishlist", "canonicalPath /wishlist", "P2", "SEO", PRE_02, "Route: /wishlist", ""),
    ("WISH-004", "A. Routes", "Header wishlist link", "Click wishlist icon in header", "Navigates to /wishlist", "P0", "Navigation", PRE_02, "—", "See WISH-ISSUE-001"),
    ("WISH-005", "A. Routes", "WishlistProvider global", "Inspect AppProvider", "WishlistProvider wraps app for global wishlist state", "P0", "Architecture", PRE_02, "—", ""),
    ("WISH-006", "A. Routes", "Solid header treatment", "Visit /wishlist", "Page uses solid header (not hero overlay)", "P2", "UI", PRE_02, "—", ""),
    ("WISH-007", "A. Routes", "Profile wishlist section", "Navigate to /profile?section=wishlist (logged in)", "ProfileWishlistSection renders saved items", "P0", "Functional", PRE_03, "Logged in", ""),
    ("WISH-008", "A. Routes", "Moved toast VIEW link", "Add item to wishlist from PDP", "Toast VIEW links to /profile?section=wishlist", "P1", "Navigation", PRE_03, "Any product", ""),
    # B. Empty State
    ("WISH-009", "B. Empty State", "Empty wishlist message", "Open /wishlist with no saved SKUs", "Your wishlist is empty heading shown", "P0", "UI", PRE_03, "Clear wishlist", ""),
    ("WISH-010", "B. Empty State", "Empty wishlist CTA", "Click Explore Jewellery on empty state", "Navigates to /jewellery", "P0", "Navigation", PRE_03, "Empty wishlist", ""),
    ("WISH-011", "B. Empty State", "Empty wishlist copy", "Read empty state description", "Save pieces you love copy displayed", "P2", "UI", PRE_03, "Empty wishlist", ""),
    ("WISH-012", "B. Empty State", "Profile empty state", "Open profile wishlist with no items", "ProfileWishlistEmptyState shown", "P1", "UI", PRE_03, "Logged in, empty", ""),
    # C. Guest Wishlist
    ("WISH-013", "C. Guest", "Guest add from PDP", "As guest, toggle wishlist on PDP", "SKU added locally; moved toast shown", "P0", "Functional", PRE_03, PRE_04, ""),
    ("WISH-014", "C. Guest", "Guest localStorage key", "Add item as guest; inspect localStorage", "sunny-wishlist JSON array contains SKU", "P0", "Data", PRE_03, PRE_04, ""),
    ("WISH-015", "C. Guest", "Guest remove from wishlist page", "Remove item on /wishlist as guest", "SKU removed; undo toast shown", "P0", "Functional", PRE_03, PRE_04, ""),
    ("WISH-016", "C. Guest", "Guest undo remove", "Remove item → click UNDO on toast", "SKU restored to wishlist", "P1", "Functional", PRE_03, PRE_04, ""),
    ("WISH-017", "C. Guest", "Guest login banner", "Visit /wishlist as guest", "Login banner shown above title", "P1", "UI", PRE_03, "Guest", ""),
    ("WISH-018", "C. Guest", "Guest wishlist survives refresh", "Add item; reload /wishlist", "Same SKUs after refresh from localStorage", "P0", "Functional", PRE_03, PRE_04, ""),
    # D. Logged-in Wishlist
    ("WISH-019", "D. Logged-in", "Fetch customer wishlist on auth", "Login with existing Magento wishlist", "WishlistContext loads SKUs from BFF GET", "P0", "Integration", PRE_01, PRE_03, ""),
    ("WISH-020", "D. Logged-in", "Add SKU via BFF", "Add item while authenticated", "POST /api/customer/wishlist with sku body", "P0", "API", PRE_01, PRE_04, ""),
    ("WISH-021", "D. Logged-in", "Remove SKU via BFF", "Remove item while authenticated", "DELETE /api/customer/wishlist with sku body", "P0", "API", PRE_01, PRE_04, ""),
    ("WISH-022", "D. Logged-in", "Optimistic UI update", "Toggle wishlist on PDP (logged in)", "UI updates immediately; rolls back on API failure", "P1", "UX", PRE_03, PRE_04, ""),
    ("WISH-023", "D. Logged-in", "Inflight guard", "Rapid double-toggle same SKU", "Second request blocked while inflight", "P2", "Edge case", PRE_03, PRE_04, ""),
    ("WISH-024", "D. Logged-in", "Unauthenticated mutation opens login", "Toggle wishlist when status unknown/unauth", "Login modal opens with returnUrl", "P1", "Auth", PRE_03, "—", ""),
    # E. Toasts
    ("WISH-025", "E. Toasts", "Moved to wishlist toast", "Add item to wishlist", "Item moved to Wishlist message; 4s duration", "P0", "UI", PRE_03, PRE_04, ""),
    ("WISH-026", "E. Toasts", "Removed toast with undo", "Remove item from wishlist", "Item removed from wishlist + UNDO action; 8s duration", "P0", "UI", PRE_03, PRE_04, ""),
    ("WISH-027", "E. Toasts", "Dismiss moved toast on remove", "Add then remove quickly", "Moved toast dismissed when remove toast shows", "P2", "UX", PRE_03, PRE_04, ""),
    ("WISH-028", "E. Toasts", "Suppress removed toast option", "Add to bag from wishlist page", "Removed toast suppressed (showRemovedToast: false)", "P1", "Functional", PRE_03, PRE_04, ""),
    # F. Wishlist Page UI
    ("WISH-029", "F. Page UI", "Product count label", "Wishlist with N items", "N Products label under title", "P1", "UI", PRE_03, "2+ items", ""),
    ("WISH-030", "F. Page UI", "Grid view default", "Load wishlist with items (desktop)", "WishlistGrid shown by default", "P0", "UI", PRE_02, PRE_04, ""),
    ("WISH-031", "F. Page UI", "List view toggle mobile", "Switch to list view on mobile", "WishlistList renders; grid hidden on mobile", "P1", "Responsive", PRE_02, PRE_04, ""),
    ("WISH-032", "F. Page UI", "View toggle a11y", "Inspect grid/list toggle", "aria-label Grid view / List view on buttons", "P2", "A11y", PRE_02, "—", ""),
    ("WISH-033", "F. Page UI", "Loading skeleton", "Load wishlist with SKUs while products fetch", "WishlistPageGridSkeleton with aria-busy", "P1", "UI", PRE_03, PRE_04, ""),
    ("WISH-034", "F. Page UI", "Load more pagination", "Wishlist with >6 items", "JewelleryLoadMoreSection loads 6 more per click", "P1", "Functional", PRE_03, "7+ SKUs", "WISHLIST_VISIBLE_CAP = 6"),
    ("WISH-035", "F. Page UI", "Product card image/link", "Click wishlist card image or title", "Navigates to PDP via getWishlistProductHref", "P0", "Navigation", PRE_04, "—", ""),
    ("WISH-036", "F. Page UI", "Remove button on card", "Click REMOVE on wishlist item", "Item removed from wishlist", "P0", "Functional", PRE_03, PRE_04, ""),
    # G. Add to Bag Panel
    ("WISH-037", "G. Add to Bag", "Open add to bag panel", "Click ADD TO BAG on wishlist item", "WishlistAddToBagPanel opens with product detail prefetch", "P0", "Functional", PRE_05, "Ring product", ""),
    ("WISH-038", "G. Add to Bag", "Ring size validation", "Submit without ring size on ring product", "Inline ring size error shown", "P1", "Validation", PRE_05, "Ring product", ""),
    ("WISH-039", "G. Add to Bag", "Metal color selection", "Change metal swatch in panel", "Selected variant updates price/options", "P1", "Functional", PRE_05, "Multi-metal product", ""),
    ("WISH-040", "G. Add to Bag", "Add to bag success", "Complete add to bag from panel", "Cart drawer opens; item removed from wishlist silently", "P0", "Integration", PRE_03, PRE_05, ""),
    ("WISH-041", "G. Add to Bag", "Panel close", "Open panel → close without adding", "Panel closes; item remains on wishlist", "P1", "Functional", PRE_04, "—", ""),
    ("WISH-042", "G. Add to Bag", "View product link in panel", "Click view product in panel", "Opens PDP for urlKey", "P2", "Navigation", PRE_04, "—", ""),
    # H. Profile Section
    ("WISH-043", "H. Profile", "Profile grid/list parity", "Toggle views in profile wishlist", "Same grid/list behavior as /wishlist page", "P1", "UI", PRE_03, PRE_04, ""),
    ("WISH-044", "H. Profile", "Profile add to bag", "Add to bag from profile wishlist", "Same panel + bag drawer flow as /wishlist", "P1", "Functional", PRE_03, PRE_05, ""),
    ("WISH-045", "H. Profile", "Profile load error", "Simulate product fetch failure", "Unable to load wishlist products message", "P1", "Resilience", PRE_01, "API failure", ""),
    ("WISH-046", "H. Profile", "Profile listing skeleton", "Loading profile wishlist", "ProfileWishlistListingSkeleton shown", "P2", "UI", PRE_03, PRE_04, ""),
    # I. BFF / API
    ("WISH-047", "I. API", "GET wishlist unauthorized", "Call GET /api/customer/wishlist without session", "401 Unauthorized", "P0", "API", PRE_02, "No cookie", ""),
    ("WISH-048", "I. API", "POST missing SKU", "POST /api/customer/wishlist with empty body", "400 SKU is required", "P1", "API", PRE_03, "Logged in", ""),
    ("WISH-049", "I. API", "Sync route", "POST /api/customer/wishlist/sync with skus array", "Guest SKUs merged into Magento wishlist", "P0", "API", PRE_01, PRE_03, ""),
    ("WISH-050", "I. API", "Magento wishlist mapper", "Inspect customer-wishlist.mapper", "Normalizes SKUs and maps wishlistId/items", "P2", "Data", PRE_01, "—", ""),
    ("WISH-051", "I. API", "Product hydration by SKU", "Load wishlist page with saved SKUs", "useMagentoWishlistProducts fetches catalog by SKU", "P0", "Integration", PRE_01, PRE_04, ""),
    ("WISH-052", "I. API", "Removal-only optimization", "Remove one item from multi-item wishlist", "Hook avoids full refetch on removal-only change", "P2", "Performance", PRE_03, "2+ items", ""),
    # J. Post-login Sync
    ("WISH-053", "J. Sync", "Guest wishlist merge on login", "Guest wishlist → login", "syncCustomerWishlist merges SKUs; localStorage cleared", "P0", "Integration", PRE_03, "Guest then login", ""),
    ("WISH-054", "J. Sync", "Empty guest wishlist on login", "Login with no local wishlist", "No sync call needed; Magento wishlist loads", "P1", "Integration", PRE_03, "—", ""),
    ("WISH-055", "J. Sync", "Post-login sync resilience", "Login when wishlist sync fails", "Login still succeeds; wishlistPushed false in result", "P2", "Resilience", PRE_01, "API failure", ""),
    # K. PDP / PLP Integration
    ("WISH-056", "K. Integration", "PDP wishlist toggle", "Toggle heart on jewellery PDP", "isWishlisted state updates; icon filled when saved", "P0", "Functional", PRE_04, "Jewellery PDP", ""),
    ("WISH-057", "K. Integration", "PLP wishlist on card", "Toggle wishlist on PLP product card", "Optimistic wishlist state on card", "P1", "Functional", PRE_04, "PLP", ""),
    ("WISH-058", "K. Integration", "Wishlist uses product SKU", "Compare PDP toggle id vs stored SKU", "Wishlist stores Magento SKU not urlKey", "P1", "Data", PRE_04, "—", ""),
    # L. Cart Integration
    ("WISH-059", "L. Cart", "Move to wishlist from cart", "Click Move to wishlist on cart line", "Line removed from cart; SKU added to wishlist", "P0", "Functional", PRE_03, PRE_04, "See CART-027"),
    ("WISH-060", "L. Cart", "Cart uses addToWishlist", "Inspect CartItem", "addToWishlist called with product.id (SKU)", "P1", "Integration", PRE_03, "—", ""),
    # M. Error Handling
    ("WISH-061", "M. Errors", "Wishlist page load error", "Simulate Magento product fetch failure", "Unable to load wishlist products alert shown", "P0", "Resilience", PRE_01, "API down", ""),
    ("WISH-062", "M. Errors", "Authenticated add failure rollback", "Fail POST wishlist while adding", "Optimistic state rolled back; moved toast dismissed", "P1", "Resilience", PRE_01, "API failure", ""),
    ("WISH-063", "M. Errors", "Authenticated remove failure rollback", "Fail DELETE wishlist while removing", "Optimistic state rolled back; removed toast dismissed", "P1", "Resilience", PRE_01, "API failure", ""),
    # N. Responsive
    ("WISH-064", "N. Responsive", "Mobile safe area padding", "View /wishlist on mobile", "Bottom padding accounts for safe-area-inset-bottom", "P2", "Responsive", PRE_02, "Mobile", ""),
    ("WISH-065", "N. Responsive", "Add to bag panel mobile height", "Open panel on mobile", "Panel uses calc(100dvh - 3rem) height", "P2", "Responsive", PRE_02, "Mobile", ""),
    # O. Known gaps
    ("WISH-066", "O. Gaps", "Header wishlist badge", "Compare header bag vs wishlist icons", "Wishlist has no count badge (known gap)", "P3", "Gap", PRE_02, "—", "WISH-ISSUE-001"),
]

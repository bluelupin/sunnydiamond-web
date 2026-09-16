"""Cart / Shopping Bag test case data — imported by add_cart_test_cases.py."""

from __future__ import annotations

PRE_01 = "PRE-01: Magento GraphQL cart API reachable (guest + customer cart)"
PRE_02 = "PRE-02: Strapi product-display page published (cart benefits strip)"
PRE_03 = "PRE-03: Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"
PRE_04 = "PRE-04: Logged-in customer account (e.g. info.archien@gmail.com) and guest session"
PRE_05 = "PRE-05: Published products with SKU, options (ring size, metal, engraving), and gift wrap"

PRECONDITIONS_LIST = [
    ("PRE-01", "Magento GraphQL cart API reachable (guest + customer cart)"),
    ("PRE-02", "Strapi product-display page published (cart benefits strip)"),
    ("PRE-03", "Test viewports: Mobile (≤390px), Tablet (~768px), Desktop (≥1280px)"),
    ("PRE-04", "Logged-in customer account and guest session available"),
    ("PRE-05", "Published products with SKU, metal/ring size, engraving, gift wrap"),
]

TEST_DATA_NOTES = [
    "Primary route: /cart (client-rendered; Magento quote via GraphQL proxy)",
    "Persistence: localStorage sunny-guest-cart-id + sunny-cart-line-meta-v1",
    "Login merge: postLoginSync.mergeGuestCart() on auth",
    "Gifting tests overlap GIFT-190–203 in gifting_test_cases_data.py",
    "Cart totals sourced from Magento mapMagentoCartTotals(); shipping estimated via Kochi postcode",
    "Bank offers in Offers & Deals are payment-preference only — applied at gateway, not in cart totals",
]

KNOWN_GAPS: list[str] = []

# issue_id, jira, module, area, title, description, priority, status, test_ids, notes
ISSUES: list[tuple[str, ...]] = []

# tc_id, area, scenario, steps, expected, priority, type, preconds, test_data, notes
TEST_CASES = [
    # A. Routes & Page Load
    ("CART-001", "A. Routes", "Cart page route", "Navigate to /cart", "CartPage renders; CMS benefits strip loaded", "P0", "Functional", PRE_02, "Route: /cart", ""),
    ("CART-002", "A. Routes", "Cart metadata noindex", "Inspect /cart meta robots", "noIndex: true in generateMetadata", "P2", "SEO", PRE_02, "Route: /cart", ""),
    ("CART-003", "A. Routes", "Cart canonical", "Inspect canonical link on /cart", "canonicalPath /cart", "P2", "SEO", PRE_02, "Route: /cart", ""),
    ("CART-004", "A. Routes", "Header bag link", "Click bag icon in header", "Navigates to /cart; badge shows totalItems", "P0", "Navigation", PRE_04, "Any items in bag", ""),
    ("CART-005", "A. Routes", "Hydration skeleton", "Load /cart with items", "CartPageSkeleton shown while isHydrating", "P1", "UI", PRE_01, "Logged-in cart", ""),
    ("CART-006", "A. Routes", "Post-hydration refresh", "Load /cart after hydration", "refreshCart() called once isHydrating false", "P1", "Integration", PRE_01, "—", ""),
    # B. Empty State
    ("CART-007", "B. Empty State", "Empty bag message", "Open /cart with no items", "'Your bag is empty' heading shown", "P0", "UI", PRE_04, "Clear cart", ""),
    ("CART-008", "B. Empty State", "Empty bag CTA", "Click Shop Now on empty cart", "Navigates to /jewellery", "P0", "Navigation", PRE_04, "Empty cart", ""),
    ("CART-009", "B. Empty State", "Empty bag copy", "Read empty state description", "Discovery copy displayed", "P2", "UI", PRE_04, "Empty cart", ""),
    # C. Add to Bag & Drawer
    ("CART-010", "C. Add to Bag", "PDP add to bag", "PDP → Add to Bag", "Item added; bag drawer opens", "P0", "Functional", PRE_05, "Any ring", ""),
    ("CART-011", "C. Add to Bag", "Drawer success message", "Add item", "'Item added to your bag successfully!' in drawer", "P0", "UI", PRE_05, "—", ""),
    ("CART-012", "C. Add to Bag", "Drawer product preview", "Add item", "Added product image, name, price in drawer", "P0", "UI", PRE_05, "—", ""),
    ("CART-013", "C. Add to Bag", "View Shopping Bag CTA", "Click View Shopping Bag in drawer", "Navigates to /cart", "P0", "Navigation", PRE_05, "—", ""),
    ("CART-014", "C. Add to Bag", "Continue Shopping", "Click Continue Shopping in drawer", "Drawer closes; stays on current page", "P1", "Functional", PRE_05, "—", ""),
    ("CART-015", "C. Add to Bag", "Drawer remove item", "Remove item from drawer", "Line removed; totals update", "P1", "Functional", PRE_05, "—", ""),
    ("CART-016", "C. Add to Bag", "More items note", "Add 2+ items; open drawer", "CartMoreItemsNote shows +N more items", "P2", "UI", PRE_05, "2+ items", ""),
    ("CART-017", "C. Add to Bag", "Update bag from PDP", "Edit options on PDP for cart line", "Drawer shows 'Product updated successfully'", "P1", "Functional", PRE_05, "Item in cart", ""),
    ("CART-018", "C. Add to Bag", "Add failure toast", "Simulate add-to-bag API failure", "Error toast via formatAddToBagErrorMessage", "P1", "Resilience", PRE_01, "API failure", ""),
    # D. Line Items
    ("CART-019", "D. Line Items", "Product image", "View cart line", "Product thumbnail renders", "P0", "UI", PRE_05, "—", ""),
    ("CART-020", "D. Line Items", "Product name link", "Click product name", "Opens PDP (/product/{urlKey})", "P0", "Navigation", PRE_05, "—", ""),
    ("CART-021", "D. Line Items", "Line meta row", "View ring line", "Metal, size, etc. in CartMetaRow", "P0", "UI", PRE_05, "Ring w/ options", ""),
    ("CART-022", "D. Line Items", "Same product separate lines", "Add identical product twice from PDP", "Two distinct cart line items; no quantity merge", "P0", "Functional", PRE_05, "Same SKU", "By design — lineInstance per add"),
    ("CART-023", "D. Line Items", "No quantity controls", "View cart line items", "No qty stepper; each line is one entry (by design)", "P1", "UI", PRE_05, "—", "By design — no update quantity on platform"),
    ("CART-024", "D. Line Items", "Remove line", "Click remove/delete on line", "Item removed; toast optional", "P0", "Functional", PRE_05, "—", ""),
    ("CART-025", "D. Line Items", "Empty cart via line removal", "Remove each line one by one", "Cart shows empty state after last line removed; no bulk clear-all (by design)", "P2", "Functional", PRE_05, "Multi-item", ""),
    ("CART-026", "D. Line Items", "Edit link", "Click Edit on line", "Opens PDP edit URL with options", "P1", "Navigation", PRE_05, "—", ""),
    ("CART-027", "D. Line Items", "Move to wishlist", "Click Move to wishlist", "Item wishlisted; removed from cart", "P1", "Functional", PRE_04, "Logged in", ""),
    ("CART-028", "D. Line Items", "Buy now", "Click Buy Now on line", "Other lines removed; one item remains", "P2", "Functional", PRE_05, "Multi-item", ""),
    # E. Engraving & Options
    ("CART-029", "E. Options", "Engraving panel", "Open engraving on engravable line", "MetalEngravingPanel opens", "P0", "Functional", PRE_05, "Engravable ring", ""),
    ("CART-030", "E. Options", "Save engraving", "Enter text + font; save", "Engraving synced to Magento; meta updated", "P0", "Integration", PRE_05, "Engravable ring", ""),
    ("CART-031", "E. Options", "Invalid engraving charset", "Enter disallowed characters", "ENGRAVING_CHARSET_MESSAGE error", "P1", "Validation", PRE_05, "—", ""),
    ("CART-032", "E. Options", "Duplicate SKU lines", "Add same SKU with different engraving", "Separate lines via lineInstance key", "P1", "Functional", PRE_05, "Engravable ring", ""),
    ("CART-033", "E. Options", "Mark as gift checkbox", "Toggle gift on cart line", "Gift badge appears; gifting state updates", "P0", "Functional", PRE_05, "—", ""),
    ("CART-034", "E. Options", "Gift toggle clears explored", "Toggle gift ON", "hasExploredGiftingOptions cleared", "P2", "Functional", PRE_04, "Logged in", ""),
    # F. Gifting Panel
    ("CART-035", "F. Gifting", "View gifting options desktop", "Desktop cart sidebar", "View Gifting Options CTA visible", "P0", "UI", PRE_03, "Desktop", "See GIFT-192"),
    ("CART-036", "F. Gifting", "Gifting options mobile footer", "Mobile cart sticky footer", "Gifting Options button visible", "P0", "UI", PRE_03, "Mobile", "See GIFT-193"),
    ("CART-037", "F. Gifting", "Gifting intro on checkout", "Logged-in first checkout click", "Gifting intro panel before /checkout", "P1", "Functional", PRE_04, "Logged in", ""),
    ("CART-038", "F. Gifting", "Guest skips gifting intro", "Guest checkout click", "GuestCheckoutModal; no gifting intro", "P1", "Functional", PRE_04, "Guest", ""),
    ("CART-039", "F. Gifting", "Save gifting selection", "Configure notes; Save", "Magento setCartGiftOptions; panel closes", "P0", "Integration", PRE_05, "—", "See GIFT-201"),
    ("CART-040", "F. Gifting", "Separate wrap mode", "Enable separate gifts", "Per-item notes in panel", "P1", "Functional", PRE_05, "2+ gift items", ""),
    # G. Pricing & Totals
    ("CART-041", "G. Pricing", "Subtotal from Magento", "View price sidebar", "Subtotal matches Magento cart.prices", "P0", "Data", PRE_01, "—", ""),
    ("CART-042", "G. Pricing", "Tax row", "View price breakdown", "Tax line shown", "P0", "Data", PRE_01, "—", ""),
    ("CART-043", "G. Pricing", "Shipping estimate", "Cart without shipping method", "Estimated shipping via Kochi postcode", "P1", "Data", PRE_01, "—", ""),
    ("CART-044", "G. Pricing", "Grand total", "View total", "Matches Magento grand_total", "P0", "Data", PRE_01, "—", ""),
    ("CART-045", "G. Pricing", "Line display price", "Compare line total vs qty×unit", "getCartLineDisplayTotal consistent", "P1", "Data", PRE_05, "—", ""),
    ("CART-046", "G. Pricing", "Mobile sticky total", "View mobile footer", "Total + checkout CTA visible", "P0", "UI", PRE_03, "Mobile", ""),
    ("CART-047", "G. Pricing", "Price breakup toggle mobile", "Expand price breakup on mobile", "Subtotal/tax/shipping rows shown", "P1", "UI", PRE_03, "Mobile", ""),
    # H. Offers & Gift Cards
    ("CART-048", "H. Offers", "Apply bank offer", "Select bank offer in Offers section", "Offer ID stored; cart total unchanged (by design — payment gateway)", "P2", "Functional", PRE_04, "—", "By design"),
    ("CART-049", "H. Offers", "Remove bank offer", "Deselect applied bank offer", "Offer selection cleared; total unchanged", "P2", "Functional", PRE_04, "—", "By design"),
    ("CART-050", "H. Offers", "Apply gift card code", "Enter gift card in offers UI", "Local gift card discount applied to display total", "P2", "Functional", PRE_04, "Mock code", ""),
    ("CART-051", "H. Offers", "Magento offer discount", "Cart with Magento promo", "offerDiscount reflected in breakdown", "P1", "Data", PRE_01, "Promo cart", ""),
    # I. Checkout Handoff
    ("CART-052", "I. Checkout", "Proceed to checkout logged in", "Click checkout (authenticated)", "Navigates to /checkout", "P0", "Navigation", PRE_04, "Logged in", ""),
    ("CART-053", "I. Checkout", "Guest checkout modal", "Click checkout as guest", "GuestCheckoutModal opens", "P0", "Functional", PRE_04, "Guest", ""),
    ("CART-054", "I. Checkout", "Continue as guest", "Guest modal → Continue as Guest", "Navigates to /checkout", "P0", "Navigation", PRE_04, "Guest", ""),
    ("CART-055", "I. Checkout", "Login from guest modal", "Guest modal → I Already Have an Account", "Login modal with returnUrl /checkout", "P1", "Functional", PRE_04, "Guest", ""),
    ("CART-056", "I. Checkout", "Checkout nav lock", "Click checkout; observe cart", "pointer-events-none while isNavigatingToCheckout", "P2", "UX", PRE_04, "—", ""),
    ("CART-057", "I. Checkout", "Checkout disabled empty cart", "Attempt checkout with empty bag", "Checkout not available / empty state", "P1", "Edge case", PRE_04, "Empty cart", ""),
    # J. Gift Notes Display
    ("CART-058", "J. Gift Notes", "Single-wrap note in panel", "Save single gift note; open gifting panel", "Note visible in gifting right panel only (not on cart lines)", "P1", "UI", PRE_05, "Single wrap", "By design — see GIFT-202"),
    ("CART-059", "J. Gift Notes", "Separate-wrap notes in panel", "Separate gifts + notes; open gifting panel", "Per-item notes in gifting panel only (not on cart lines)", "P1", "UI", PRE_05, "Separate wrap", "By design"),
    ("CART-060", "J. Gift Notes", "Gift badge on line", "Gifted item in cart", "CartGiftBadge visible", "P0", "UI", PRE_05, "—", "See GIFT-190"),
    # K. Persistence & Auth
    ("CART-061", "K. Persistence", "Guest cart ID storage", "Add item as guest; inspect localStorage", "sunny-guest-cart-id set", "P0", "Data", PRE_04, "Guest", ""),
    ("CART-062", "K. Persistence", "Line metadata storage", "Add item with options", "sunny-cart-line-meta-v1 has line meta", "P0", "Data", PRE_05, "—", ""),
    ("CART-063", "K. Persistence", "Cart survives refresh", "Add item; reload /cart", "Same items after refresh", "P0", "Functional", PRE_04, "—", ""),
    ("CART-064", "K. Persistence", "Login merge guest cart", "Guest cart → login", "mergeGuestCart merges lines into customer cart", "P0", "Integration", PRE_04, "Guest then login", ""),
    ("CART-065", "K. Persistence", "Customer cart on init", "Login with existing customer cart", "fetchCustomerCart loads items", "P0", "Integration", PRE_04, "Logged in", ""),
    ("CART-066", "K. Persistence", "Legacy cart migration", "Browser with sunny-cart-v2 data", "migrateLegacyLinesToGuestCart on init", "P2", "Migration", PRE_04, "Legacy storage", ""),
    # L. Error Handling
    ("CART-067", "L. Errors", "Add without SKU", "Add product missing SKU", "Error: Cannot add product without SKU", "P1", "Validation", PRE_05, "Invalid product", ""),
    ("CART-068", "L. Errors", "Cart refresh failure", "Simulate Magento cart fetch failure on /cart", "CartRefreshErrorState with Try Again retry", "P0", "Resilience", PRE_01, "API down", ""),
    ("CART-069", "L. Errors", "Stale cart after refresh fail", "Refresh fails with items in cart", "Banner error shown; stale lines remain visible", "P1", "Resilience", PRE_01, "—", ""),
    ("CART-070", "L. Errors", "Engraving save failure", "Fail engraving sync", "Error surfaced to user", "P2", "Resilience", PRE_05, "—", ""),
    # M. Responsive
    ("CART-071", "M. Responsive", "Desktop two-column layout", "View /cart desktop", "Items left; price sidebar sticky right", "P0", "UI", PRE_03, "Desktop", ""),
    ("CART-072", "M. Responsive", "Mobile sticky footer", "View /cart mobile", "Checkout footer fixed at bottom", "P0", "UI", PRE_03, "Mobile", ""),
    ("CART-073", "M. Responsive", "Bag drawer mobile", "Add item on mobile", "Bottom drawer 85vh", "P1", "UI", PRE_03, "Mobile", ""),
    ("CART-074", "M. Responsive", "Bag drawer desktop", "Add item on desktop", "Right sheet 472px", "P1", "UI", PRE_03, "Desktop", ""),
    # N. Architecture
    ("CART-075", "N. Architecture", "CartProvider mounted", "Inspect AppProvider", "CartProvider + CartUIProvider in tree", "P1", "Architecture", PRE_02, "—", ""),
    ("CART-076", "N. Architecture", "Global bag drawer", "Add from any page", "CartBagDrawer mounted in AppProvider", "P1", "Architecture", PRE_05, "—", ""),
    ("CART-077", "N. Architecture", "GraphQL proxy no-store", "Cart mutation via /api/magento/graphql", "Cart ops use cache: no-store", "P2", "Architecture", PRE_01, "—", ""),
    ("CART-078", "N. Architecture", "Optimistic bag drawer snapshot", "Add to bag from PDP", "Drawer opens instantly with optimistic snapshot; reconciles after API", "P2", "Architecture", PRE_05, "—", ""),
    # O. Logged-in session (Tushar)
    ("CART-079", "O. Logged-in", "Authenticated cart page", "Login as customer; open /cart", "Customer cart loads; no guest modal", "P0", "Functional", PRE_04, "info.archien@gmail.com", ""),
    ("CART-080", "O. Logged-in", "Checkout without guest modal", "Logged-in checkout click", "Direct /checkout; no GuestCheckoutModal", "P0", "Functional", PRE_04, "Logged in", ""),
    ("CART-081", "O. Logged-in", "Wishlist move preserves session", "Move cart line to wishlist", "Wishlist updated for logged-in user", "P1", "Functional", PRE_04, "Logged in", ""),
    ("CART-082", "O. Logged-in", "Gifting intro once", "First checkout triggers intro", "Second checkout skips intro after explored", "P2", "Functional", PRE_04, "Logged in", ""),
]

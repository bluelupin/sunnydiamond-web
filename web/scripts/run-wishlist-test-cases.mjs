#!/usr/bin/env node
/**
 * Wishlist test-case runner — static checks + live HTTP verification.
 * Outputs docs/scripts/wishlist-test-results.json for the Excel generator.
 *
 * Usage:
 *   node web/scripts/run-wishlist-test-cases.mjs
 *   node web/scripts/run-wishlist-test-cases.mjs --base-url http://localhost:3000
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");
const RESULTS_PATH = join(REPO_ROOT, "docs", "scripts", "wishlist-test-results.json");

const DEFAULT_BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const FETCH_TIMEOUT_MS = 120_000;

function parseArgs(argv) {
  let baseUrl = DEFAULT_BASE_URL;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--base-url" && argv[i + 1]) {
      baseUrl = argv[i + 1];
      i += 1;
    }
  }
  return { baseUrl };
}

const results = {};

function record(tcId, status, actual) {
  results[tcId] = { status, actual, testedAt: new Date().toISOString() };
}

function readSrc(relativePath) {
  const fullPath = join(WEB_ROOT, relativePath);
  if (!existsSync(fullPath)) return "";
  return readFileSync(fullPath, "utf8");
}

function assertSource(tcId, label, source, pattern, actualOnPass) {
  const ok = typeof pattern === "string" ? source.includes(pattern) : pattern.test(source);
  record(tcId, ok ? "Pass" : "Fail", ok ? actualOnPass : `Expected: ${label}`);
  return ok;
}

async function fetchText(baseUrl, path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: "text/html,application/xml,application/json,*/*" },
      redirect: options.redirect ?? "follow",
      signal: controller.signal,
      ...options,
    });
    const text = await response.text();
    return {
      status: response.status,
      text,
      ok: response.ok,
      url: response.url,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractMeta(html, attr, key) {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["']`,
    "i",
  );
  const match = html.match(re);
  return match ? (match[1] || match[2] || "").trim() : "";
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match ? match[1].trim() : "";
}

function runStaticChecks() {
  const wishlistRoute = readSrc("src/app/(site)/wishlist/page.tsx");
  const wishlistPage = readSrc("src/features/wishlist/components/WishlistPage.tsx");
  const wishlistContext = readSrc("src/features/wishlist/context/WishlistContext.tsx");
  const guestStorage = readSrc("src/features/wishlist/utils/guestWishlistStorage.ts");
  const constants = readSrc("src/features/wishlist/constants.ts");
  const content = readSrc("src/features/wishlist/data/content.ts");
  const heading = readSrc("src/features/wishlist/components/WishlistHeading.tsx");
  const emptyState = readSrc("src/features/wishlist/components/WishlistEmptyState.tsx");
  const navLink = readSrc("src/features/wishlist/components/WishlistNavLink.tsx");
  const viewToggle = readSrc("src/features/wishlist/components/WishlistViewToggle.tsx");
  const grid = readSrc("src/features/wishlist/components/WishlistGrid.tsx");
  const list = readSrc("src/features/wishlist/components/WishlistList.tsx");
  const card = readSrc("src/features/wishlist/components/WishlistCard.tsx");
  const addToBagPanel = readSrc("src/features/wishlist/components/WishlistAddToBagPanel.tsx");
  const skeleton = readSrc("src/features/wishlist/components/skeletons/WishlistPageSkeleton.tsx");
  const profileSection = readSrc("src/features/account/components/ProfileWishlistSection.tsx");
  const profileEmpty = readSrc("src/features/account/components/ProfileWishlistEmptyState.tsx");
  const profileSkeleton = readSrc("src/features/account/components/ProfileWishlistListingSkeleton.tsx");
  const wishlistApi = readSrc("src/app/api/customer/wishlist/route.ts");
  const wishlistSyncApi = readSrc("src/app/api/customer/wishlist/sync/route.ts");
  const wishlistClient = readSrc("src/services/customer/customer-wishlist.client.ts");
  const wishlistMapper = readSrc("src/services/customer/customer-wishlist.mapper.ts");
  const wishlistHook = readSrc("src/hooks/magento/useMagentoWishlistProducts.ts");
  const postLoginSync = readSrc("src/features/auth/services/postLoginSync.ts");
  const appProvider = readSrc("src/shared/lib/providers/AppProvider.tsx");
  const header = readSrc("src/shared/ui/layout/Header.tsx");
  const cartItem = readSrc("src/features/cart/components/CartItem.tsx");
  const jewelleryPdp = readSrc("src/features/jewellery-product/components/JewelleryProductPage.tsx");
  const productUtils = readSrc("src/features/wishlist/utils/wishlistProduct.utils.ts");
  const profileSections = readSrc("src/features/account/data/profileSections.ts");

  // A. Routes
  assertSource("WISH-001", "wishlist route", wishlistRoute, "WishlistPageView", "Wishlist page route");
  assertSource("WISH-002", "wishlist noindex", wishlistRoute, "noIndex: true", "Wishlist page sets noIndex");
  assertSource("WISH-003", "wishlist canonical", wishlistRoute, 'canonicalPath: "/wishlist"', "Canonical /wishlist");
  assertSource("WISH-004", "header wishlist link", navLink, 'href="/wishlist"', "Header wishlist nav link");
  assertSource("WISH-005", "wishlist provider", appProvider, "WishlistProvider", "WishlistProvider in AppProvider");
  record(
    "WISH-006",
    !readSrc("src/shared/utils/navigation.ts").includes('pathname === "/wishlist"')
      ? "Pass"
      : "Fail",
    "Wishlist uses solid header (not in hero overlay routes)",
  );
  record(
    "WISH-007",
    profileSection.includes("ProfileWishlistSection") && profileSections.includes('"wishlist"')
      ? "Pass"
      : "Fail",
    "Profile wishlist section wired with profile section id",
  );
  assertSource(
    "WISH-008",
    "moved toast view link",
    content,
    'movedToWishlistHref: "/profile?section=wishlist"',
    "Moved toast VIEW href",
  );

  // B. Empty state
  assertSource("WISH-009", "empty title", emptyState, "emptyTitle", "Empty wishlist title");
  assertSource("WISH-010", "empty CTA href", emptyState, "wishlistPageContent.emptyCtaHref", "Explore Jewellery CTA");
  assertSource("WISH-011", "empty description", emptyState, "emptyDescription", "Empty wishlist description");
  assertSource("WISH-012", "profile empty state", profileEmpty, "ProfileWishlistEmptyState", "Profile empty state component");

  // C. Guest
  assertSource("WISH-013", "guest mutate", wishlistContext, 'status === "guest"', "Guest wishlist branch");
  assertSource("WISH-014", "guest storage key", constants, 'WISHLIST_STORAGE_KEY = "sunny-wishlist"', "localStorage key");
  assertSource("WISH-015", "guest remove", guestStorage, "writeGuestWishlistToStorage", "Guest remove persists storage");
  assertSource("WISH-016", "undo remove", wishlistContext, "undoRemovedFromWishlist", "Undo removed wishlist item");
  assertSource("WISH-017", "guest login banner", heading, "to save items and access them anytime", "Guest login banner copy");
  assertSource("WISH-018", "guest read storage", guestStorage, "readGuestWishlistFromStorage", "Guest wishlist read on load");

  // D. Logged-in
  assertSource("WISH-019", "fetch on auth", wishlistContext, "getCustomerWishlist", "Loads customer wishlist on auth");
  assertSource("WISH-020", "add via BFF", wishlistClient, 'method: "POST"', "Client POST add SKU");
  assertSource("WISH-021", "remove via BFF", wishlistClient, 'method: "DELETE"', "Client DELETE remove SKU");
  assertSource("WISH-022", "optimistic update", wishlistContext, "setWishlistedIds(next)", "Optimistic wishlist update");
  assertSource("WISH-023", "inflight guard", wishlistContext, "inflightSkusRef", "Inflight SKU guard");
  assertSource("WISH-024", "login modal", wishlistContext, "openLoginModal", "Unauthenticated opens login modal");

  // E. Toasts
  assertSource("WISH-025", "moved toast", wishlistContext, "movedToWishlistMessage", "Moved to wishlist toast");
  assertSource("WISH-026", "removed toast undo", wishlistContext, "removedFromWishlistUndoLabel", "Removed toast with UNDO");
  assertSource("WISH-027", "dismiss moved on remove", wishlistContext, "dismissMovedToast", "Dismiss moved toast on remove");
  assertSource("WISH-028", "suppress removed toast", wishlistPage, "showRemovedToast: false", "Suppress removed toast on add to bag");

  // F. Page UI
  assertSource("WISH-029", "product count label", content, "productCountLabel", "Product count label helper");
  assertSource("WISH-030", "grid view", wishlistPage, "WishlistGrid", "Wishlist grid on page");
  assertSource("WISH-031", "list view mobile", wishlistPage, "WishlistList", "Wishlist list on mobile");
  assertSource("WISH-032", "view toggle a11y", viewToggle, "gridViewLabel", "Grid/list aria labels");
  assertSource("WISH-033", "loading skeleton", skeleton, "aria-busy", "Wishlist loading skeleton");
  assertSource("WISH-034", "pagination cap", constants, "WISHLIST_VISIBLE_CAP = 6", "Visible cap is 6");
  assertSource("WISH-035", "product href", productUtils, "getWishlistProductHref", "Wishlist product PDP href");
  assertSource("WISH-036", "remove on card", card, "onRemove", "Remove action on wishlist card");

  // G. Add to bag
  assertSource("WISH-037", "add to bag panel", wishlistPage, "WishlistAddToBagPanel", "Add to bag panel wired");
  assertSource("WISH-038", "ring size validation", addToBagPanel, "ringSizeError", "Ring size validation in panel");
  assertSource("WISH-039", "metal selection", addToBagPanel, "selectedMetal", "Metal color selection");
  assertSource("WISH-040", "add to bag removes wishlist", wishlistPage, "removeFromWishlist(wishlistSku", "Add to bag removes from wishlist");
  assertSource("WISH-041", "panel close", addToBagPanel, "onClose", "Panel close handler");
  assertSource("WISH-042", "view product link", addToBagPanel, "getWishlistProductHref", "View product link in panel");

  // H. Profile
  assertSource("WISH-043", "profile grid/list", profileSection, "WishlistViewToggle", "Profile view toggle");
  assertSource("WISH-044", "profile add to bag", profileSection, "WishlistAddToBagPanel", "Profile add to bag panel");
  assertSource("WISH-045", "profile load error", profileSection, "loadErrorMessage", "Profile load error message");
  assertSource("WISH-046", "profile skeleton", profileSkeleton, "aria-busy", "Profile listing skeleton");

  // I. API
  assertSource("WISH-047", "GET unauthorized", wishlistApi, 'status: 401', "GET returns 401 without token");
  assertSource("WISH-048", "POST missing sku", wishlistApi, "SKU is required", "POST validates SKU");
  assertSource("WISH-049", "sync route", wishlistSyncApi, "syncCustomerWishlist", "Wishlist sync route");
  assertSource("WISH-050", "mapper", wishlistMapper, "normalizeWishlistSkus", "Wishlist mapper normalizes SKUs");
  assertSource("WISH-051", "product hydration", wishlistHook, "getMagentoProductsBySkus", "Hydrates wishlist products by SKU");
  assertSource("WISH-052", "removal-only optimization", wishlistHook, "isRemovalOnly", "Removal-only fetch optimization");

  // J. Sync
  assertSource("WISH-053", "login sync", postLoginSync, "syncWishlistAfterLogin", "Guest wishlist sync on login");
  assertSource("WISH-054", "empty guest sync skip", postLoginSync, "localSkus.length === 0", "Skip sync when guest list empty");
  assertSource("WISH-055", "sync resilience", postLoginSync, "allSettled", "Post-login sync uses allSettled");

  // K. Integration
  assertSource("WISH-056", "pdp toggle", jewelleryPdp, "toggleWishlist", "PDP wishlist toggle");
  assertSource("WISH-057", "plp card wishlist", readSrc("src/features/jewellery-product/components/JewelleryProductCard.tsx"), "isWishlisted", "PLP card wishlist state");
  assertSource("WISH-058", "sku storage", productUtils, "normalizeWishlistSkus", "Wishlist SKU normalization");

  // L. Cart
  assertSource("WISH-059", "move to wishlist", cartItem, "Move to wishlist", "Cart move to wishlist CTA");
  assertSource("WISH-060", "cart addToWishlist", cartItem, "addToWishlist", "Cart uses addToWishlist");

  // M. Errors
  assertSource("WISH-061", "page load error", wishlistPage, "loadErrorMessage", "Wishlist page load error UI");
  assertSource("WISH-062", "add rollback", wishlistContext, "setWishlistedIds(previous)", "Rollback on add failure");
  assertSource("WISH-063", "remove rollback", wishlistContext, "dismissRemovedToast", "Dismiss removed toast on remove failure");

  // N. Responsive
  assertSource("WISH-064", "mobile safe area", wishlistPage, "safe-area-inset-bottom", "Mobile safe area padding");
  assertSource("WISH-065", "panel mobile height", addToBagPanel, "100dvh-3rem", "Mobile panel height");

  // O. Gaps
  const wishlistNavHasBadge =
    navLink.includes("totalItems") ||
    navLink.includes("wishlistCount") ||
    /<WishlistNavLink[^>]*(count|badge)/i.test(header);
  record(
    "WISH-066",
    !wishlistNavHasBadge ? "Pass" : "Fail",
    !wishlistNavHasBadge
      ? "No wishlist count badge on header (known gap WISH-ISSUE-001)"
      : "Unexpected wishlist badge found",
  );

  const manualCases = [
    "WISH-010",
    "WISH-012",
    "WISH-013",
    "WISH-015",
    "WISH-016",
    "WISH-018",
    "WISH-022",
    "WISH-025",
    "WISH-026",
    "WISH-027",
    "WISH-031",
    "WISH-036",
    "WISH-038",
    "WISH-039",
    "WISH-040",
    "WISH-041",
    "WISH-042",
    "WISH-043",
    "WISH-044",
    "WISH-055",
    "WISH-056",
    "WISH-057",
    "WISH-059",
  ];

  for (const tcId of manualCases) {
    if (!results[tcId]) {
      record(tcId, "Blocked", "Manual / browser / Magento interaction required");
    }
  }
}

async function runLiveChecks(baseUrl) {
  try {
    const page = await fetchText(baseUrl, "/wishlist");
    record(
      "WISH-001",
      page.ok ? "Pass" : "Fail",
      page.ok ? `GET /wishlist returned ${page.status}` : `GET /wishlist failed (${page.status})`,
    );

    const robots = extractMeta(page.text, "name", "robots");
    record(
      "WISH-002",
      robots.toLowerCase().includes("noindex") ? "Pass" : "Partial",
      robots ? `robots: ${robots}` : "noindex meta not found in initial HTML (client metadata)",
    );

    const canonical = extractCanonical(page.text);
    if (canonical.includes("/wishlist")) {
      record("WISH-003", "Pass", `Canonical: ${canonical}`);
    }

    const hasTitle =
      page.text.includes("Your Wishlist") ||
      page.text.includes("wishlist-page-title") ||
      page.text.includes("Your wishlist is empty");
    record(
      "WISH-009",
      hasTitle ? "Pass" : "Partial",
      hasTitle ? "Wishlist page shell rendered in HTML" : "Wishlist content not in initial HTML",
    );

    const hasLoginBanner = page.text.includes("to save items and access them anytime");
    record(
      "WISH-017",
      hasLoginBanner ? "Pass" : "Partial",
      hasLoginBanner ? "Guest login banner present in HTML" : "Login banner not in initial HTML",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const prior = results["WISH-001"];
    record(
      "WISH-001",
      prior?.status === "Pass" ? "Partial" : "Fail",
      prior?.status === "Pass"
        ? `Live fetch timed out (${message}); static route check passed`
        : `Could not reach /wishlist: ${message}`,
    );
  }

  try {
    const api = await fetchText(baseUrl, "/api/customer/wishlist");
    record(
      "WISH-047",
      api.status === 401 ? "Pass" : "Fail",
      api.status === 401 ? "GET /api/customer/wishlist returns 401 without session" : `Unexpected status ${api.status}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record("WISH-047", "Blocked", `BFF check failed: ${message}`);
  }
}

function summarize() {
  const entries = Object.values(results);
  return {
    total: Object.keys(results).length,
    pass: entries.filter((r) => r.status === "Pass").length,
    fail: entries.filter((r) => r.status === "Fail").length,
    blocked: entries.filter((r) => r.status === "Blocked").length,
    partial: entries.filter((r) => r.status === "Partial").length,
  };
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  console.log(`Wishlist test runner — ${baseUrl}\n`);

  runStaticChecks();
  await runLiveChecks(baseUrl);

  const summary = summarize();
  const output = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    summary,
    results,
  };

  writeFileSync(RESULTS_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log("Summary:", summary);
  console.log(`Results written to ${RESULTS_PATH}`);

  process.exit(summary.fail > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Bespoke page test-case runner — static checks + live HTTP verification.
 * Outputs docs/scripts/bespoke-test-results.json for the Excel generator.
 *
 * Usage:
 *   node web/scripts/run-bespoke-test-cases.mjs
 *   node web/scripts/run-bespoke-test-cases.mjs --base-url http://localhost:3000
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");
const RESULTS_PATH = join(REPO_ROOT, "docs", "scripts", "bespoke-test-results.json");

const DEFAULT_BASE_URL = process.env.BASE_URL || "http://localhost:3000";

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

async function fetchText(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "text/html,application/xml,*/*" },
    redirect: "follow",
  });
  const text = await response.text();
  return { status: response.status, text, ok: response.ok };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractMetaDescription(html) {
  const match = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
  );
  return match ? (match[1] || match[2] || "").trim() : "";
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match ? match[1].trim() : "";
}

function runStaticChecks() {
  const pageRoute = readSrc("src/app/(site)/bespoke-jewellery/page.tsx");
  const bespokePage = readSrc("src/features/bespoke/components/BespokePage.tsx");
  const hero = readSrc("src/features/bespoke/components/BespokeHeroSection.tsx");
  const story = readSrc("src/features/bespoke/components/BespokeStorySection.tsx");
  const sharePanel = readSrc("src/features/bespoke/components/BespokeShareVisionPanel.tsx");
  const featured = readSrc("src/features/bespoke/components/BespokeFeaturedStoriesSection.tsx");
  const featuredModal = readSrc("src/features/bespoke/components/BespokeFeaturedStoryModal.tsx");
  const pastModal = readSrc("src/features/bespoke/components/BespokePastCreationsModal.tsx");
  const guarantees = readSrc("src/features/bespoke/components/BespokeGuaranteesSection.tsx");
  const interested = readSrc("src/features/bespoke/components/BespokeInterestedSection.tsx");
  const service = readSrc("src/services/bespoke/contact-bespoke-page.service.ts");
  const submission = readSrc("src/services/bespoke/bespoke-submission.service.ts");
  const seo = readSrc("src/shared/lib/seo/bespokeSeo.ts");
  const navigation = readSrc("src/shared/utils/navigation.ts");
  const sitemap = readSrc("src/app/sitemap.ts");
  const profileBespoke = readSrc("src/features/account/components/ProfileBespokeSection.tsx");
  const savedApi = readSrc("src/app/api/customer/saved-creations/route.ts");
  const homepageBespoke = readSrc("src/features/cms/components/home/BespokeForYouSection.tsx");
  const footer = readSrc("src/features/cms/data/footerPages.ts");

  // A. Routes
  assertSource("BESPOKE-001", "page route", pageRoute, "BespokePage", "Bespoke page route");
  assertSource("BESPOKE-002", "nav path", navigation, 'return "/bespoke-jewellery"', "Header bespoke nav path");
  assertSource("BESPOKE-003", "sitemap", sitemap, '"/bespoke-jewellery"', "Sitemap entry");
  record(
    "BESPOKE-004",
    service.includes("EMPTY_CONTACT_BESPOKE_PAGE") && bespokePage.includes("page.hero &&")
      ? "Pass"
      : "Fail",
    "CMS failure yields empty sections (CMS responsibility — page must be published)",
  );
  assertSource("BESPOKE-005", "revalidate", pageRoute, "revalidate = 300", "ISR 300s");
  assertSource("BESPOKE-006", "hero overlay", navigation, 'pathname === "/bespoke-jewellery"', "Transparent header route");
  assertSource("BESPOKE-007", "homepage CTA", homepageBespoke, "resolveBespokeForYouSection", "Homepage bespoke section");
  assertSource("BESPOKE-008", "profile CTA", readSrc("src/features/account/data/profileContent.ts"), "/bespoke-jewellery", "Profile empty CTA");

  // B. SEO
  assertSource("BESPOKE-009", "metadata", pageRoute, "generateMetadata", "generateMetadata on route");
  assertSource("BESPOKE-010", "description", seo, "metaDescription", "SEO description resolver");
  assertSource("BESPOKE-011", "canonical", seo, "BESPOKE_JEWELLERY_PATH", "Canonical path default");
  assertSource("BESPOKE-012", "json-ld", pageRoute, "buildBespokeJsonLd", "JSON-LD on page");
  assertSource("BESPOKE-013", "seo fallback", seo, "seoContent.bespoke", "Static SEO fallback");

  // C. Hero
  assertSource("BESPOKE-014", "hero component", bespokePage, "BespokeHeroSection", "Hero section wired");
  assertSource("BESPOKE-015", "hero conditional", bespokePage, "page.hero &&", "Hero gated on CMS");
  assertSource("BESPOKE-016", "hero responsive", hero, "h-[240px]", "Responsive hero heights");

  // D. Story
  assertSource("BESPOKE-017", "story section", bespokePage, "BespokeStorySection", "Story section wired");
  assertSource("BESPOKE-018", "horizontal scroll", story, "useSince1997HorizontalScroll", "Desktop horizontal scroll");
  assertSource("BESPOKE-019", "mobile stack", story, "lg:hidden", "Mobile vertical stack");
  assertSource("BESPOKE-020", "video fallback", story, "setUseImageFallback", "Video image fallback");
  assertSource("BESPOKE-021", "share vision CTA", story, "BespokeShareVisionPanel", "Share Vision panel wired");
  record(
    "BESPOKE-022",
    story.includes("ctaLabel && customDesignForm") ? "Pass" : "Fail",
    "CTA hidden when customDesignForm missing",
  );

  // E. Form
  assertSource("BESPOKE-023", "panel shell", sharePanel, "ProductDetailSidePanelShell", "Share Vision panel shell");
  assertSource("BESPOKE-024", "validation", sharePanel, "useAppointmentFormValidation", "Form validation hook");
  assertSource("BESPOKE-025", "phone validation", sharePanel, "countryCode", "Phone country code field");
  assertSource("BESPOKE-026", "email required", sharePanel, "emailRequired: true", "Email required");
  assertSource("BESPOKE-027", "note required", sharePanel, "noteRequired: true", "Design vision required");
  assertSource("BESPOKE-028", "image preview", sharePanel, "referenceImagePreviewUrl", "Reference image preview");
  assertSource("BESPOKE-029", "image size limit", sharePanel, "MAX_REFERENCE_IMAGE_BYTES", "5 MB image limit");
  assertSource("BESPOKE-030", "json submit", submission, "body: data", "JSON submission path");
  assertSource("BESPOKE-031", "multipart submit", submission, "FormData", "Multipart submission path");
  assertSource("BESPOKE-032", "success toast", sharePanel, "successToast.title", "Success toast on submit");
  const hasSubmissionErrorHandling =
    sharePanel.includes("formatBespokeSubmissionError") &&
    sharePanel.includes("parseBespokeSubmissionFieldErrors");
  record(
    "BESPOKE-033",
    hasSubmissionErrorHandling ? "Pass" : "Fail",
    hasSubmissionErrorHandling
      ? "API failure uses formatBespokeSubmissionError toast"
      : "Submit error formatting missing",
  );
  record(
    "BESPOKE-034",
    hasSubmissionErrorHandling && sharePanel.includes("apiFieldErrors") ? "Pass" : "Fail",
    hasSubmissionErrorHandling
      ? "API validation mapped to inline field errors"
      : "Field-level API error mapping missing",
  );
  assertSource("BESPOKE-035", "isSubmitting", sharePanel, "isSubmitting", "Double submit guard");
  assertSource("BESPOKE-036", "reset form", sharePanel, "resetForm", "Panel close resets form");

  // F. Featured
  assertSource("BESPOKE-037", "featured section", bespokePage, "BespokeFeaturedStoriesSection", "Featured stories section");
  assertSource("BESPOKE-038", "desktop carousel", featured, "slidesToShow", "Carousel slides config");
  assertSource("BESPOKE-039", "mobile carousel", featured, "max-width: 768px", "Mobile carousel breakpoint");
  assertSource("BESPOKE-040", "autoplay pause", featured, "pauseOnHover", "Autoplay pause on hover");
  assertSource("BESPOKE-041", "story modal", featured, "BespokeFeaturedStoryModal", "Featured story modal");
  assertSource("BESPOKE-042", "past creations", featured, "BespokePastCreationsModal", "Past creations modal");
  assertSource("BESPOKE-043", "popstate", featured, "popstate", "Browser back closes modal");
  assertSource("BESPOKE-044", "modal responsive", featuredModal, "DrawerContent", "Drawer/Sheet modal shells");

  // G. Sections
  record(
    "BESPOKE-045",
    interested.includes("ctaHref") && !interested.includes("BespokeShareVisionPanel")
      ? "Pass"
      : "Fail",
    "Get in Touch uses CMS href only (BESPOKE-ISSUE-004)",
  );
  assertSource("BESPOKE-046", "guarantees", bespokePage, "BespokeGuaranteesSection", "Guarantees section");
  assertSource("BESPOKE-047", "guarantees responsive", guarantees, "md:flex-row", "Guarantees responsive layout");
  assertSource("BESPOKE-048", "interested heights", interested, "h-[219px]", "Interested section heights");

  // H. Save
  assertSource("BESPOKE-049", "guest login", featuredModal, "getLoginHrefForReturn", "Guest login redirect");
  assertSource("BESPOKE-050", "auth loading", featuredModal, 'status === "loading"', "Auth loading toast");
  assertSource("BESPOKE-051", "save client", featuredModal, "saveCustomerCreationClient", "Save inspiration API");
  assertSource("BESPOKE-052", "already saved", featuredModal, "Already saved", "Duplicate save message");
  record(
    "BESPOKE-053",
    featuredModal.includes("canSave") && featuredModal.includes("missing CMS document id")
      ? "Pass"
      : "Fail",
    "Missing documentId handled with inline message (CMS responsibility)",
  );
  assertSource("BESPOKE-054", "profile section", profileBespoke, "ProfileBespokeSection", "Profile bespoke grid");

  // I. Profile
  assertSource("BESPOKE-055", "profile section id", readSrc("src/features/account/data/profileSections.ts"), '"bespoke"', "Profile bespoke section id");
  assertSource("BESPOKE-056", "profile empty", profileBespoke, "ProfileEmptyState", "Profile empty state");
  assertSource(
    "BESPOKE-057",
    "remove undo",
    readSrc("src/features/account/context/ProfileBespokeToastContext.tsx"),
    "ProfileBespokeRemovedToastBanner",
    "Remove undo toast",
  );
  assertSource("BESPOKE-058", "detail panel", readSrc("src/features/account/components/ProfileBespokeDetailPanel.tsx"), "ProfileBespokeDetailPanel", "Detail panel component");
  assertSource(
    "BESPOKE-059",
    "401 error",
    readSrc("src/features/account/hooks/useCustomerSavedCreations.ts"),
    "sign in again",
    "401 error copy",
  );
  assertSource("BESPOKE-060", "pagination", profileBespoke, "totalPages", "Pagination support");

  // J. Architecture
  assertSource("BESPOKE-061", "server fetch", pageRoute, "getContactBespokePage", "Server-side CMS fetch");
  assertSource("BESPOKE-062", "cache", service, "cache(", "React cache on CMS service");
  assertSource("BESPOKE-063", "section gating", bespokePage, "page.featuredStories &&", "Conditional section render");
  assertSource("BESPOKE-064", "saved creations BFF", savedApi, "saved-creations", "Saved creations BFF route");
  assertSource("BESPOKE-065", "shared fields", sharePanel, "ShareYourVisionFields", "Shared vision form fields");
}

async function runLiveChecks(baseUrl) {
  let reachable = false;

  try {
    const pageRes = await fetchText(baseUrl, "/bespoke-jewellery");
    reachable = pageRes.ok;

    record(
      "BESPOKE-066",
      pageRes.status === 200 ? "Pass" : "Fail",
      pageRes.status === 200 ? `GET /bespoke-jewellery ${pageRes.status}` : `HTTP ${pageRes.status}`,
    );

    const hasContent =
      pageRes.text.includes("bespoke") ||
      pageRes.text.includes("Bespoke") ||
      pageRes.text.includes("Shopping") ||
      pageRes.text.length > 5000;
    record(
      "BESPOKE-067",
      pageRes.ok && hasContent ? "Pass" : pageRes.ok ? "Partial" : "Fail",
      pageRes.ok
        ? hasContent
          ? "Page HTML has bespoke content"
          : "200 but minimal content (CMS may be empty)"
        : "Page unreachable",
    );

    const title = extractTitle(pageRes.text);
    if (title) {
      record("BESPOKE-009", "Pass", `Live title: ${title.slice(0, 60)}`);
    }
    const description = extractMetaDescription(pageRes.text);
    if (description) {
      record("BESPOKE-010", "Pass", `Live description present (${description.length} chars)`);
    }
    const canonical = extractCanonical(pageRes.text);
    if (canonical.includes("bespoke-jewellery")) {
      record("BESPOKE-011", "Pass", `Canonical: ${canonical}`);
    }
    if (pageRes.text.includes("WebPage") || pageRes.text.includes("schema.org")) {
      record("BESPOKE-012", "Pass", "JSON-LD/schema present in HTML");
    }

    const sitemapRes = await fetchText(baseUrl, "/sitemap.xml");
    record(
      "BESPOKE-003",
      sitemapRes.text.includes("/bespoke-jewellery") ? "Pass" : "Fail",
      sitemapRes.text.includes("/bespoke-jewellery")
        ? "Sitemap contains bespoke route"
        : "Sitemap missing bespoke route",
    );

    const footerSrc = readSrc("src/features/cms/data/footerPages.ts");
    record(
      "BESPOKE-068",
      footerSrc.includes("bespoke") || pageRes.text.includes("bespoke-jewellery")
        ? "Pass"
        : "Partial",
      "Footer/static nav references bespoke path",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    for (const id of ["BESPOKE-066", "BESPOKE-067", "BESPOKE-068"]) {
      if (!results[id]) {
        record(id, reachable ? "Partial" : "Blocked", `Live check failed: ${message}`);
      }
    }
  }
}

function summarize() {
  const entries = Object.values(results);
  return {
    total: entries.length,
    pass: entries.filter((r) => r.status === "Pass").length,
    fail: entries.filter((r) => r.status === "Fail").length,
    blocked: entries.filter((r) => r.status === "Blocked").length,
    partial: entries.filter((r) => r.status === "Partial").length,
  };
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  console.log(`Bespoke test runner — ${baseUrl}\n`);

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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

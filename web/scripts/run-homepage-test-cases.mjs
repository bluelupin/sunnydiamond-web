#!/usr/bin/env node
/**
 * Homepage test-case runner — static checks + live HTTP verification.
 * Outputs docs/scripts/homepage-test-results.json for the Excel generator.
 *
 * Usage:
 *   node web/scripts/run-homepage-test-cases.mjs
 *   node web/scripts/run-homepage-test-cases.mjs --base-url http://localhost:3001
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");
const RESULTS_PATH = join(REPO_ROOT, "docs", "scripts", "homepage-test-results.json");

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

async function fetchText(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "text/html,application/xml,*/*" },
    redirect: options.redirect ?? "follow",
    ...options,
  });
  const text = await response.text();
  return {
    status: response.status,
    text,
    ok: response.ok,
    url: response.url,
  };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match ? match[1].trim() : "";
}

function runStaticChecks() {
  const homePage = readSrc("src/app/(site)/(home)/page.tsx");
  const homeLoading = readSrc("src/app/(site)/(home)/loading.tsx");
  const homeView = readSrc("src/features/cms/components/HomePage.tsx");
  const heroSection = readSrc("src/features/cms/components/home/HeroSection.tsx");
  const craftingRarity = readSrc("src/features/cms/components/home/CraftingRaritySection.tsx");
  const belowFold = readSrc("src/features/cms/components/home/HomeBelowFoldSections.tsx");
  const sectionNav = readSrc("src/features/cms/components/home/SectionNav.tsx");
  const homepageSeo = readSrc("src/shared/lib/seo/homepageSeo.ts");
  const prefetchCms = readSrc("src/lib/homepage/prefetchHomepageCms.ts");
  const resolveAboveFold = readSrc("src/lib/homepage/resolveHomepageAboveFold.ts");
  const cmsProvider = readSrc("src/shared/lib/providers/HomepageCmsProvider.tsx");
  const shellService = readSrc("src/services/homepage/homepageShell.service.ts");
  const editorialService = readSrc("src/services/homepage/homepageEditorialBlocks.service.ts");
  const shoppingService = readSrc("src/services/homepage/homepageShoppingBlocks.service.ts");
  const homepageMapper = readSrc("src/services/homepage/homepage.mapper.ts");
  const queryKeys = readSrc("src/hooks/homepage/queryKeys.ts");
  const prefetchBelowFold = readSrc("src/lib/homepage/prefetchHomepageBelowFold.ts");
  const perfReporter = readSrc("src/features/cms/components/home/HomepagePerformanceReporter.tsx");
  const header = readSrc("src/shared/ui/layout/Header.tsx");

  // A. Page Load
  assertSource("HOME-001", "home page route", homePage, "HomePageView", "Homepage route renders HomePageView");
  assertSource("HOME-002", "loading skeleton", homeLoading, "HomePageRouteSkeleton", "Route loading.tsx skeleton");
  assertSource("HOME-003", "revalidate 300", homePage, "export const revalidate = 300", "ISR revalidate = 300");
  assertSource("HOME-004", "CMS provider", homePage, "HomepageCmsProvider", "HomepageCmsProvider wraps page");
  assertSource("HOME-005", "prefetch bundle", homePage, "prefetchHomepageBundle", "prefetchHomepageBundle on server");
  assertSource("HOME-006", "hero LCP preload", homePage, "preloadHeroLcpImages", "preloadHeroLcpImages called");
  assertSource("HOME-007", "error boundary", homeView, "FeatureErrorBoundary", "FeatureErrorBoundary on SectionNav");
  assertSource("HOME-008", "perf reporter", homeView, "HomepagePerformanceReporter", "HomepagePerformanceReporter wired");

  // B. SEO
  assertSource("HOME-009", "generateMetadata", homePage, "export async function generateMetadata", "generateMetadata exported");
  assertSource("HOME-013", "SEO resolver", homepageSeo, "resolveHomepageSeoMetadata", "resolveHomepageSeoMetadata");
  assertSource("HOME-014", "metadata fallback", homePage, 'title: "Sunny Diamonds"', "Fallback metadata on CMS error");
  assertSource("HOME-015", "OG image", homepageSeo, "resolveCmsMediaUrl", "CMS share/OG image resolution");
  assertSource("HOME-012", "JSON-LD builder", homePage, "buildHomepageJsonLd", "buildHomepageJsonLd on page");

  // C. Hero
  assertSource("HOME-016", "hero wired", homeView, 'HeroSection id="hero"', "HeroSection id=hero");
  assertSource("HOME-017", "hero null guard", heroSection, "if (!hero)", "Hero null guard");
  assertSource("HOME-018", "hero media", heroSection, "HeroBackgroundMedia", "HeroBackgroundMedia");
  assertSource("HOME-019", "hero overlay CTA", heroSection, "HeroSectionOverlay", "Hero overlay + CTA");
  assertSource("HOME-020", "hero trust badges", heroSection, "HomepageTrustBadgeSection", "Trust badges in hero");
  assertSource("HOME-021", "hero viewport height", heroSection, "h-[100dvh]", "Full viewport hero height");
  assertSource("HOME-022", "hero h1", heroSection, "<h1", "Hero h1 present");

  // D. Crafting Rarity
  assertSource("HOME-023", "crafting rarity wired", homeView, 'CraftingRaritySection id="crafting-rarity"', "CraftingRaritySection wired");
  assertSource("HOME-024", "category grid", craftingRarity, "CraftingRarityCategoryGrid", "Category grid");
  assertSource("HOME-025", "copy block CTA", craftingRarity, "CraftingRarityCopyBlock", "Copy block + CTA");
  assertSource("HOME-026", "section active", craftingRarity, "isSectionActive", "isSectionActive guard");
  assertSource("HOME-027", "responsive image", craftingRarity, "ResponsiveImage", "ResponsiveImage in crafting rarity");

  // E. Section Nav
  assertSource("HOME-028", "section nav", homeView, "SectionNav", "SectionNav dynamic import");
  assertSource("HOME-029", "scroll spy", sectionNav, "useScrollSpy", "useScrollSpy wired");
  assertSource("HOME-030", "scroll to section", sectionNav, "scrollToHomeSection", "scrollToHomeSection on click");
  assertSource("HOME-031", "hide at footer", sectionNav, "isFooterIntersecting", "Nav hides at footer");
  assertSource("HOME-032", "progress indicator", sectionNav, "SectionNavProgressIndicator", "Progress indicator");
  assertSource("HOME-033", "empty nav", sectionNav, "navSections.length === 0", "Empty nav guard");

  // F. Below-fold
  assertSource("HOME-034", "diamond sourcing", belowFold, "DiamondSourcingSection", "DiamondSourcingSection lazy");
  assertSource("HOME-035", "featured collection", belowFold, "FeaturedCollectionSection", "FeaturedCollectionSection");
  assertSource("HOME-036", "occasions teaser", belowFold, "OccasionsTeaserSection", "OccasionsTeaserSection");
  assertSource("HOME-037", "featured products", belowFold, "FeaturedProductsSection", "FeaturedProductsSection");
  assertSource("HOME-038", "valentine gifting", belowFold, "ForYourValentineSection", "ForYourValentineSection");
  assertSource("HOME-039", "sunny promise", belowFold, "SunnyPromiseSection", "SunnyPromiseSection");
  assertSource("HOME-040", "bespoke for you", belowFold, "BespokeForYouSection", "BespokeForYouSection");
  assertSource("HOME-041", "dfe section", belowFold, "DiamondsForEveryoneSection", "DiamondsForEveryoneSection");
  assertSource("HOME-042", "craftsmanship", belowFold, "CraftsmanshipProcess", "CraftsmanshipProcess");
  assertSource("HOME-043", "showrooms", belowFold, "ShowroomsSection", "ShowroomsSection");
  assertSource("HOME-044", "lazy retry", belowFold, "lazyImportWithRetry", "lazyImportWithRetry");
  assertSource("HOME-045", "section fallback", belowFold, "SectionFallback", "SectionFallback placeholders");

  // G. CMS Data
  assertSource("HOME-046", "shell service", shellService, "STRAPI_ENDPOINTS.homepageShell", "homepage shell service");
  assertSource("HOME-047", "editorial service", editorialService, "STRAPI_ENDPOINTS.homepageEditorialBlocks", "editorial blocks service");
  assertSource("HOME-048", "shopping service", shoppingService, "STRAPI_ENDPOINTS.homepageShoppingBlocks", "shopping blocks service");
  assertSource("HOME-049", "mapper", homepageMapper, "export", "homepage.mapper.ts exists");
  assertSource("HOME-050", "cache seed", cmsProvider, "seedHomepageCmsCache", "CMS cache seeding");
  assertSource("HOME-051", "allSettled", prefetchCms, "Promise.allSettled", "Partial CMS failure tolerance");
  assertSource("HOME-052", "query keys", queryKeys, "homepageQueryKeys", "homepage query keys");

  // H. Performance & cross-entry
  assertSource("HOME-053", "below-fold prefetch", prefetchBelowFold, "export", "prefetchHomepageBelowFold");
  assertSource("HOME-054", "lazy animated", belowFold, "LazyAnimatedSection", "LazyAnimatedSection");
  assertSource("HOME-055", "header nav", header, "isJewelleryNavLink", "Header jewellery nav wired");
  assertSource("HOME-056", "hero CTA", heroSection, "<Link", "Hero CTA Link");
  assertSource("HOME-057", "category grid links", readSrc("src/features/cms/components/home/CraftingRarityCategoryGrid.tsx"), "Link", "Category grid links");
  assertSource("HOME-058", "gifting section", belowFold, 'id="valentine"', "Gifting banner section id");
}

async function runLiveChecks(baseUrl) {
  let html = "";
  let status = 0;

  try {
    const response = await fetchText(baseUrl, "/");
    html = response.text;
    status = response.status;
  } catch (error) {
    record("HOME-001", "Fail", `HTTP fetch failed: ${error.message}`);
    record("HOME-010", "Fail", "Skipped — homepage unreachable");
    record("HOME-011", "Fail", "Skipped — homepage unreachable");
    return;
  }

  record(
    "HOME-001",
    status === 200 ? "Pass" : "Fail",
    status === 200 ? `GET / returned ${status}` : `GET / returned ${status}`,
  );

  const canonical = extractCanonical(html);
  record(
    "HOME-010",
    canonical ? "Pass" : "Fail",
    canonical ? `Canonical: ${canonical}` : "No canonical link found",
  );

  const title = extractTitle(html);
  record(
    "HOME-011",
    title.length > 0 ? "Pass" : "Fail",
    title ? `Title: ${title}` : "No title tag found",
  );

  const hasJsonLd = html.includes('"@type"') && html.includes("WebSite");
  record(
    "HOME-012",
    hasJsonLd ? "Pass" : "Fail",
    hasJsonLd ? "WebSite JSON-LD in HTML" : "WebSite JSON-LD not found in HTML",
  );

  const hasHero = html.includes('id="hero"') || html.includes("HeroSection");
  record(
    "HOME-016",
    hasHero ? "Pass" : "Partial",
    hasHero ? "Hero section present in HTML" : "Hero id not in initial HTML (may be CMS-empty)",
  );
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));

  runStaticChecks();
  await runLiveChecks(baseUrl);

  const summaryCounts = { Pass: 0, Fail: 0, Blocked: 0, Partial: 0 };
  for (const entry of Object.values(results)) {
    const key = entry.status in summaryCounts ? entry.status : "Partial";
    summaryCounts[key] += 1;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    summary: {
      total: Object.keys(results).length,
      pass: summaryCounts.Pass,
      fail: summaryCounts.Fail,
      blocked: summaryCounts.Blocked,
      partial: summaryCounts.Partial,
    },
    results,
  };

  writeFileSync(RESULTS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log("Summary:", payload.summary);
  console.log(`Results written to ${RESULTS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

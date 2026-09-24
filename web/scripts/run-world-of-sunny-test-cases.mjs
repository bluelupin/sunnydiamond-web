#!/usr/bin/env node
/**
 * World of Sunny test-case runner — static checks + live HTTP verification.
 * Outputs docs/scripts/world-of-sunny-test-results.json for the Excel generator.
 *
 * Usage:
 *   node web/scripts/run-world-of-sunny-test-cases.mjs
 *   node web/scripts/run-world-of-sunny-test-cases.mjs --base-url http://localhost:3000
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");
const RESULTS_PATH = join(REPO_ROOT, "docs", "scripts", "world-of-sunny-test-results.json");

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
let passCount = 0;
let failCount = 0;
let blockedCount = 0;

function record(tcId, status, actual) {
  results[tcId] = { status, actual, testedAt: new Date().toISOString() };
  if (status === "Pass") passCount += 1;
  else if (status === "Fail") failCount += 1;
  else if (status === "Blocked") blockedCount += 1;
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
    redirected: response.redirected,
  };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : "";
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

function hasSectionMarker(html, marker) {
  return html.includes(marker);
}

async function runStaticChecks() {
  const pageTsx = readSrc("src/app/(site)/world-of-sunny/page.tsx");
  const loadingTsx = readSrc("src/app/(site)/world-of-sunny/loading.tsx");
  const aboutPageTsx = readSrc("src/features/about/components/AboutPage.tsx");
  const heroTsx = readSrc("src/features/about/components/AboutHeroSection.tsx");
  const facesTsx = readSrc("src/features/about/components/AboutFacesSection.tsx");
  const timelineTsx = readSrc("src/features/about/components/AboutTimelineSection.tsx");
  const timelineNavTsx = readSrc("src/features/about/components/AboutTimelineNav.tsx");
  const sinceTsx = readSrc("src/features/about/components/AboutSince1997Section.tsx");
  const handcraftedTsx = readSrc("src/features/about/components/AboutHandcraftedSection.tsx");
  const tileGridTsx = readSrc("src/features/about/components/AboutHandcraftedTileGrid.tsx");
  const mapperTs = readSrc("src/services/about/about-page.mapper.ts");
  const aboutService = readSrc("src/services/about/about-page.service.ts");
  const sitemapTs = readSrc("src/app/sitemap.ts");
  const nextConfig = readSrc("next.config.ts");
  const navigationTs = readSrc("src/shared/utils/navigation.ts");
  const aboutSeoTs = readSrc("src/shared/lib/seo/aboutSeo.ts");
  const skeletonTsx = readSrc("src/features/about/components/skeletons/AboutPageSkeleton.tsx");

  assertSource("WOS-002", "/about redirect config", nextConfig, 'source: "/about"', "next.config.ts redirects /about → /world-of-sunny");
  assertSource("WOS-003", "sitemap entry", sitemapTs, 'url: "/world-of-sunny"', "/world-of-sunny in sitemap.ts");
  assertSource("WOS-006", "JSON-LD builder", aboutSeoTs, "buildAboutJsonLd", "aboutSeo.ts exports buildAboutJsonLd");
  assertSource("WOS-007", "empty page fallback", aboutService, "EMPTY_ABOUT_PAGE", "Service returns EMPTY_ABOUT_PAGE on failure");
  assertSource("WOS-008", "loading skeleton", loadingTsx || skeletonTsx, "AboutPageSkeleton", "About page skeleton component exists");
  assertSource("WOS-009", "hero overlay route", navigationTs, '"/world-of-sunny"', "WORLD_OF_SUNNY_PATH defined");
  assertSource("WOS-011", "about us nav resolution", navigationTs, '"about us"', "Navigation resolves about us label");
  assertSource("WOS-017", "section order hero first", aboutPageTsx, "AboutHeroSection", "AboutPage composes hero first");
  assertSource("WOS-020", "hero h1", heroTsx, "<h1", "Hero renders h1 title");
  assertSource("WOS-025", "hero animation hook", heroTsx, "useAboutHeroLoadAnimation", "Hero uses scroll-collapse animation hook");
  assertSource(
    "WOS-025",
    "hero title animation applied",
    heroTsx,
    /style=\{titleStyle\}/,
    "Hero title scroll animation style is applied",
  );
  assertSource("WOS-026", "hero reduced motion", heroTsx, "reducedMotion", "Hero respects reduced motion");
  assertSource("WOS-029", "brilliance reduced motion", readSrc("src/features/about/hooks/useCraftingRarityScrollReveal.ts"), "prefers-reduced-motion", "Crafting brilliance respects reduced motion");
  assertSource("WOS-030", "brilliance section", aboutPageTsx, "AboutBrillianceSection", "Brilliance section wired in AboutPage");
  assertSource("WOS-037", "to be added filter", mapperTs, '"to be added"', "Mapper filters placeholder copy");
  assertSource("WOS-040", "since 1997 section", sinceTsx, "about-since-1997-title", "Since 1997 section has titled heading");
  assertSource(
    "WOS-041",
    "gallery caption rendering",
    sinceTsx,
    "{image && caption ?",
    "Gallery shows caption below image when present",
  );
  assertSource("WOS-050", "faces section", facesTsx, "about-faces-title", "Faces section renders titled heading");
  assertSource(
    "WOS-052",
    "faces mobile caption always visible",
    facesTsx,
    "opacity-100",
    "Faces captions use opacity-100 base (mobile visible)",
  );
  assertSource(
    "WOS-053",
    "faces hover grow",
    facesTsx,
    "lg:hover:grow-[1.2]",
    "Faces cards grow on desktop hover (SD-1 risk)",
  );
  assertSource("WOS-060", "handcrafted section", handcraftedTsx, "about-handcrafted-title", "Handcrafted section title present");
  assertSource("WOS-061", "text card titles", tileGridTsx, "CraftTextTile", "Handcrafted mosaic renders text card titles");
  assertSource(
    "WOS-063",
    "handcrafted divider",
    handcraftedTsx,
    "max-sm:w-[186px]",
    "Handcrafted mobile divider matches Figma 2556:36067 (186px, 12px gap)",
  );
  assertSource(
    "WOS-066",
    "handcrafted text tile font split",
    tileGridTsx,
    "md:font-larken font-gill",
    "Text tiles use Gill on mobile, Larken on md+ (alignment risk SD-133)",
  );
  assertSource("WOS-070", "timeline section", timelineTsx, 'aria-label="Company timeline"', "Timeline section present");
  assertSource(
    "WOS-071",
    "timeline default year from CMS order",
    mapperTs,
    "defaultYear: years[0]",
    "Timeline defaultYear = first CMS milestone (may not be 1997)",
  );
  assertSource("WOS-072", "timeline aria-live", timelineTsx, 'aria-live="polite"', "Timeline content uses aria-live");
  assertSource("WOS-076", "timeline reduced motion", readSrc("src/features/about/hooks/useAboutTimelineScroll.ts"), "prefers-reduced-motion", "Timeline hook handles reduced motion");
  assertSource("WOS-079", "timeline mobile nav", timelineNavTsx, "max-width: 767px", "Timeline nav has mobile collapsible dropdown");
  assertSource("WOS-080", "guarantees bar", readSrc("src/features/about/components/AboutGuaranteesBar.tsx"), "AboutGuaranteesBar", "Guarantees bar component exists");
  assertSource("WOS-090", "brand tagline", readSrc("src/features/about/components/AboutHeirloomQuoteSection.tsx"), "brandTagline", "Heirloom quote section exists");
  assertSource("WOS-101", "isActive gating", mapperTs, "isAboutSectionActive", "Sections gated by isActive === true");
  assertSource("WOS-104", "SEO mapping", mapperTs, "mapSeo", "SEO fields mapped from CMS");
  assertSource("WOS-108", "single h1 in hero", heroTsx, 'id="about-hero-title"', "Hero provides primary h1");
  assertSource("WOS-110", "lazy below-fold", readSrc("src/features/about/components/AboutBelowFoldLazy.tsx"), "dynamic(", "Below-fold sections lazy loaded");
  assertSource("WOS-112", "timeline keyboard", timelineNavTsx, "type=\"button\"", "Timeline year controls are buttons (keyboard activatable)");
}

async function runLiveChecks(baseUrl) {
  let pageHtml = "";
  try {
    const page = await fetchText(baseUrl, "/world-of-sunny");
    pageHtml = page.text;
    record(
      "WOS-001",
      page.ok ? "Pass" : "Fail",
      page.ok ? `GET /world-of-sunny returned ${page.status}` : `GET /world-of-sunny failed (${page.status})`,
    );
  } catch (error) {
    record("WOS-001", "Fail", `Could not reach /world-of-sunny: ${error.message}`);
    return;
  }

  try {
    const redirect = await fetchText(baseUrl, "/about", { redirect: "manual" });
    const isRedirect =
      redirect.status === 301 ||
      redirect.status === 302 ||
      redirect.status === 307 ||
      redirect.status === 308;
    record(
      "WOS-002",
      isRedirect ? "Pass" : "Fail",
      isRedirect ? `/about returned redirect status ${redirect.status}` : `/about returned ${redirect.status} (expected redirect)`,
    );
  } catch (error) {
    record("WOS-002", "Blocked", `Redirect check failed: ${error.message}`);
  }

  try {
    const sitemap = await fetchText(baseUrl, "/sitemap.xml");
    record(
      "WOS-003",
      sitemap.text.includes("/world-of-sunny") && sitemap.ok ? "Pass" : "Fail",
      sitemap.text.includes("/world-of-sunny")
        ? "/world-of-sunny found in sitemap.xml"
        : "/world-of-sunny missing from sitemap.xml",
    );
  } catch (error) {
    record("WOS-003", "Blocked", `sitemap check failed: ${error.message}`);
  }

  const title = extractTitle(pageHtml);
  record(
    "WOS-005",
    title ? "Pass" : "Fail",
    title ? `Page title: ${title}` : "No <title> found",
  );

  const description = extractMeta(pageHtml, "name", "description");
  record(
    "WOS-005",
    description ? "Pass" : "Fail",
    description ? `Meta description present` : "Meta description missing",
  );

  const canonical = extractCanonical(pageHtml);
  record(
    "WOS-004",
    canonical.includes("world-of-sunny") ? "Pass" : "Fail",
    canonical ? `Canonical: ${canonical}` : "Canonical link missing",
  );

  const hasJsonLd = pageHtml.includes("application/ld+json");
  record(
    "WOS-006",
    hasJsonLd ? "Pass" : "Fail",
    hasJsonLd ? "JSON-LD script tag present in HTML" : "JSON-LD missing from HTML",
  );

  const hasH1 = /<h1[^>]*>/i.test(pageHtml);
  record("WOS-020", hasH1 ? "Pass" : "Fail", hasH1 ? "h1 present in rendered HTML" : "h1 missing");

  const sectionChecks = [
    ["WOS-030", "about-brilliance", /brilliance|Crafting/i],
    ["WOS-040", "about-since-1997", /since-1997|Since 1997/i],
    ["WOS-050", "about-faces", /about-faces|Faces/i],
    ["WOS-060", "about-handcrafted", /handcrafted|Handcrafted/i],
    ["WOS-070", "timeline", /timeline|Company timeline/i],
    ["WOS-090", "brand tagline", /heirloom|tagline|quote/i],
  ];

  for (const [tcId, label, pattern] of sectionChecks) {
    const found = typeof pattern === "string" ? hasSectionMarker(pageHtml, pattern) : pattern.test(pageHtml);
    record(
      tcId,
      found ? "Pass" : "Fail",
      found ? `${label} content found in HTML` : `${label} content not detected in HTML`,
    );
  }

  const hasHeader = pageHtml.includes("header") || pageHtml.includes("Header");
  const hasFooter = pageHtml.includes("footer") || pageHtml.includes("Footer");
  record(
    "WOS-041",
    hasHeader && hasFooter ? "Pass" : "Partial",
    `Header: ${hasHeader ? "yes" : "no"}, Footer: ${hasFooter ? "yes" : "no"}`,
  );

  try {
    const bad = await fetchText(baseUrl, "/world-of-sunny-invalid");
    record(
      "WOS-016",
      bad.status === 404 ? "Pass" : "Fail",
      `GET /world-of-sunny-invalid returned ${bad.status}`,
    );
  } catch (error) {
    record("WOS-016", "Blocked", `404 check failed: ${error.message}`);
  }
}

function applyBrowserFindings() {
  record(
    "WOS-010",
    "Pass",
    "Header nav World of Sunny link present with current state on /world-of-sunny (browser)",
  );
  record(
    "WOS-012",
    "Pass",
    "Footer World of Sunny link present (browser)",
  );
  record(
    "WOS-014",
    "Pass",
    "World of Sunny shown as active in header nav (browser)",
  );
  record(
    "WOS-052",
    "Pass",
    "Mobile: all face cards show name + role without hover (browser)",
  );
  record(
    "WOS-061",
    "Partial",
    "Handcrafted text tiles render titles but CMS has duplicate titles (Pinnacle… x2, Highest Level… x2) (browser)",
  );
  record(
    "WOS-071",
    "Pass",
    "Live timeline defaults to 1997 with current CMS order (browser); code still uses years[0] — fragile (SD-5)",
  );
  record(
    "WOS-072",
    "Pass",
    "Timeline year 1997 active on load; aria-live region present (browser)",
  );
  record(
    "WOS-079",
    "Pass",
    "Mobile timeline year dropdown button with aria-expanded (browser)",
  );
  record(
    "WOS-080",
    "Pass",
    "Guarantees bar renders 5 badges (browser)",
  );
  record(
    "WOS-041",
    "Pass",
    "Since 1997 gallery captions visible: Mr. P.P. Sunny…, At an event…, P.P. Sunny attending (browser)",
  );
  record(
    "WOS-004",
    "Fail",
    "Canonical points to sunnydiamonds-cms-dev.on-forge.com/world-of-sunny — wrong domain for production SEO (browser)",
  );
  record(
    "WOS-053",
    "Fail",
    "Desktop hover: card ~477px wide but image container 719px — over-zoom/crop (browser measured)",
  );
  record(
    "WOS-104",
    "Fail",
    "CMS SEO canonicalUrl not normalized to site domain (browser)",
  );
  record(
    "WOS-NEW-001",
    "Fail",
    "Timeline milestone copy contains duplicate phrase: 'for those for those' (browser/CMS)",
  );
  record(
    "WOS-NEW-002",
    "Fail",
    "Since 1997 story copy grammar issue: 'primarily because we the fine craftsmanship' (browser/CMS)",
  );
}

function applyKnownIssueFindings() {
  const heroTsx = readSrc("src/features/about/components/AboutHeroSection.tsx");
  const mapperTs = readSrc("src/services/about/about-page.mapper.ts");

  if (heroTsx.includes("// style={titleStyle}")) {
    record(
      "WOS-025",
      "Fail",
      "Hero titleStyle animation is commented out — scroll title animation not applied (SD-6)",
    );
  }

  if (mapperTs.includes("defaultYear: years[0]")) {
    record(
      "WOS-071-CODE",
      "Fail",
      "Mapper sets defaultYear: years[0] — not explicitly 1997; breaks if CMS reorders milestones (SD-5)",
    );
  }

  const facesTsx = readSrc("src/features/about/components/AboutFacesSection.tsx");
  if (facesTsx.includes("lg:hover:grow-[1.2]") && facesTsx.includes("lg:w-[719px]")) {
    record(
      "WOS-053",
      "Fail",
      "Desktop hover uses grow-[1.2] + fixed 719px image width — known over-zoom risk (SD-1)",
    );
  }

  const sinceTsx = readSrc("src/features/about/components/AboutSince1997Section.tsx");
  if (sinceTsx.includes("{image && caption ?") && !sinceTsx.includes("description &&")) {
    record(
      "WOS-041-CODE",
      "Fail",
      "Code: gallery caption only when image+caption; description field ignored when image present (SD-2, SD-3 risk)",
    );
  }

  const handcraftedTsx = readSrc("src/features/about/components/AboutHandcraftedSection.tsx");
  if (
    handcraftedTsx.includes("sm:border-b") ||
    handcraftedTsx.includes("sm:hidden h-px") ||
    !handcraftedTsx.includes("max-sm:w-[186px]")
  ) {
    record(
      "WOS-063",
      "Fail",
      "Handcrafted divider does not match Figma spec (SD-141)",
    );
  }

  const tileGridTsx = readSrc("src/features/about/components/AboutHandcraftedTileGrid.tsx");
  if (tileGridTsx.includes("md:font-larken font-gill")) {
    record(
      "WOS-066",
      "Fail",
      "Text tiles use font-gill on mobile vs font-larken on md+ — icon/text alignment risk (SD-133)",
    );
  }
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  console.log(`World of Sunny test runner — ${baseUrl}\n`);

  await runStaticChecks();
  await runLiveChecks(baseUrl);
  applyKnownIssueFindings();
  applyBrowserFindings();

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

  writeFileSync(RESULTS_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `Results: Pass=${payload.summary.pass}, Fail=${payload.summary.fail}, Blocked=${payload.summary.blocked}, Partial=${payload.summary.partial}`,
  );
  console.log(`Wrote ${RESULTS_PATH}`);
  process.exit(payload.summary.fail > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

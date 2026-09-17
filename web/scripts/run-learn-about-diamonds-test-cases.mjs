#!/usr/bin/env node
/**
 * Learn About Diamonds test-case runner — static checks + live HTTP verification.
 * Outputs docs/scripts/learn-about-diamonds-test-results.json
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");
const RESULTS_PATH = join(REPO_ROOT, "docs", "scripts", "learn-about-diamonds-test-results.json");
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
}

const FETCH_TIMEOUT_MS = 30_000;

async function fetchText(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "text/html,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  return { status: response.status, text: await response.text(), ok: response.ok };
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match ? match[1].trim() : "";
}

function runStaticChecks() {
  const page = readSrc("src/app/(site)/learn-about-diamonds/page.tsx");
  const educationRedirect = readSrc("src/app/(site)/education/page.tsx");
  const educationPage = readSrc("src/features/education/components/EducationPage.tsx");
  const hero = readSrc("src/features/education/components/EducationHeroSection.tsx");
  const fourCsIntro = readSrc("src/features/education/components/EducationFourCsIntroSection.tsx");
  const fourCsPanels = readSrc("src/features/education/components/EducationFourCsPanelsSection.tsx");
  const certified = readSrc("src/features/education/components/EducationCertifiedSection.tsx");
  const learnMore = readSrc("src/features/education/components/EducationLearnMoreSection.tsx");
  const discover = readSrc("src/features/education/components/EducationDiscoverSection.tsx");
  const faq = readSrc("src/features/education/components/EducationFaqSection.tsx");
  const skeleton = readSrc("src/features/education/components/skeletons/EducationPageSkeleton.tsx");
  const service = readSrc("src/services/education/learn-about-diamonds-page.service.ts");
  const mapper = readSrc("src/services/education/learn-about-diamonds-page.mapper.ts");
  const seo = readSrc("src/shared/lib/seo/educationSeo.ts");
  const content = readSrc("src/features/education/data/content.ts");
  const heroAnim = readSrc("src/features/education/hooks/useEducationHeroLoadAnimation.ts");
  const anatomySync = readSrc("src/features/education/hooks/useLearnAnatomySectionSync.ts");
  const journeyPanel = readSrc("src/features/education/components/EducationDiscoverJourneyPanel.tsx");
  const nextConfig = readSrc("next.config.ts");
  const navigation = readSrc("src/shared/utils/navigation.ts");

  assertSource("LAD-001", "page route", page, "EducationPage", "Learn about diamonds page route");
  assertSource("LAD-002", "education redirect", nextConfig, 'source: "/education"', "/education redirect in next.config");
  assertSource("LAD-003", "skeleton", page, "EducationPageSkeleton", "Suspense skeleton");
  assertSource("LAD-004", "revalidate", page, "export const revalidate = 300", "ISR revalidate 300");
  assertSource("LAD-005", "empty fallback", page, "EMPTY_LEARN_ABOUT_DIAMONDS_PAGE", "CMS empty fallback");
  assertSource("LAD-006", "generateMetadata", page, "generateMetadata", "generateMetadata wired");
  assertSource("LAD-008", "JSON-LD", page, "buildEducationJsonLd", "JSON-LD builder");
  assertSource("LAD-009", "metadata fallback", page, "siteConfig.brand.name", "Metadata fallback");
  assertSource("LAD-010", "hero section", educationPage, "EducationHeroSection", "Hero section wired");
  assertSource("LAD-011", "hero null guard", educationPage, "{hero ? <EducationHeroSection", "Hero null guard");
  assertSource("LAD-012", "hero animation", hero, "useEducationHeroLoadAnimation", "Hero load animation hook");
  assertSource("LAD-013", "four cs intro", educationPage, "EducationFourCsIntroSection", "Four Cs intro");
  assertSource("LAD-014", "intro null guard", educationPage, "{fourCsIntro ? <EducationFourCsIntroSection", "Intro null guard");
  assertSource("LAD-015", "four cs panels", educationPage, "EducationFourCsPanelsSection", "Four Cs panels");
  assertSource("LAD-019", "panel texture", content, "panelTexture", "Panel texture asset");
  assertSource("LAD-020", "certificate", educationPage, "EducationCertifiedSection", "Certificate section");
  assertSource("LAD-021", "certificate null", educationPage, "{certificate ? <EducationCertifiedSection", "Certificate null guard");
  assertSource("LAD-022", "learn more", educationPage, "EducationLearnMoreSection", "Learn more section");
  assertSource("LAD-023", "anatomy sync", learnMore, "useLearnAnatomySectionSync", "Anatomy scroll sync");
  assertSource("LAD-024", "discover banner", educationPage, "EducationDiscoverSection", "Discover CTA section");
  assertSource("LAD-025", "journey panel", journeyPanel, "EducationDiscoverJourneyPanel", "Discover journey panel");
  assertSource("LAD-026", "faq section", educationPage, "EducationFaqSection", "FAQ section");
  assertSource("LAD-027", "faq null", educationPage, "{faq ? <EducationFaqSection", "FAQ null guard");
  assertSource("LAD-028", "page service", service, "STRAPI_ENDPOINTS.learnAboutDiamondsPage", "CMS page service");
  assertSource("LAD-029", "mapper", mapper, "mapLearnAboutDiamondsPage", "Page mapper");
  assertSource("LAD-030", "populate query", service, "LEARN_ABOUT_DIAMONDS_POPULATE_QUERY", "Deep populate query");
  assertSource("LAD-031", "nav route", navigation, "learnAboutDiamondsRoute", "Nav uses learnAboutDiamondsRoute");
  assertSource("LAD-007", "seo resolver", seo, "resolveEducationSeoMetadata", "SEO metadata resolver");
}

async function runLiveChecks(baseUrl) {
  try {
    const redirect = await fetch(`${baseUrl}/education`, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const redirectOk = redirect.status === 301 || redirect.status === 302 || redirect.status === 307 || redirect.status === 308;
    record("LAD-002", redirectOk ? "Pass" : "Fail", redirectOk ? `GET /education → ${redirect.status}` : `Unexpected /education status ${redirect.status}`);

    const page = await fetchText(baseUrl, "/learn-about-diamonds");
    record("LAD-001", page.status === 200 ? "Pass" : "Fail", `GET /learn-about-diamonds → ${page.status}`);

    const canonical = extractCanonical(page.text);
    record("LAD-007", canonical.includes("learn-about-diamonds") ? "Pass" : "Fail", canonical ? `Canonical: ${canonical}` : "No canonical");

    const hasJsonLd = page.text.includes('"@type"');
    record("LAD-008", hasJsonLd ? "Pass" : "Fail", hasJsonLd ? "JSON-LD in HTML" : "No JSON-LD in HTML");
  } catch (error) {
    record("LAD-001", "Fail", `HTTP error: ${error.message}`);
  }
}

async function main() {
  const { baseUrl } = parseArgs(process.argv.slice(2));
  runStaticChecks();
  await runLiveChecks(baseUrl);

  const summary = { Pass: 0, Fail: 0, Partial: 0, Blocked: 0 };
  for (const entry of Object.values(results)) {
    summary[entry.status in summary ? entry.status : "Partial"] += 1;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    summary: { total: Object.keys(results).length, pass: summary.Pass, fail: summary.Fail, partial: summary.Partial, blocked: summary.Blocked },
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

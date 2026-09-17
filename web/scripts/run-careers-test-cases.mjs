#!/usr/bin/env node
/**
 * Careers test-case runner — static checks + live HTTP verification.
 * Outputs docs/scripts/careers-test-results.json
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");
const RESULTS_PATH = join(REPO_ROOT, "docs", "scripts", "careers-test-results.json");
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

async function fetchText(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: "text/html,*/*" },
    redirect: "follow",
  });
  return { status: response.status, text: await response.text(), ok: response.ok };
}

function runStaticChecks() {
  const landingPage = readSrc("src/app/(site)/careers/page.tsx");
  const allOpeningsPage = readSrc("src/app/(site)/careers/all-openings/page.tsx");
  const jobSlugPage = readSrc("src/app/(site)/careers/[jobId]/page.tsx");
  const applyPage = readSrc("src/app/(site)/careers/apply/[jobId]/page.tsx");
  const careersPage = readSrc("src/features/careers/components/CareersPage.tsx");
  const allOpenings = readSrc("src/features/careers/components/CareersAllOpeningsPage.tsx");
  const skeleton = readSrc("src/features/careers/components/skeletons/CareersPageSkeleton.tsx");
  const hero = readSrc("src/features/careers/components/CareersHeroSection.tsx");
  const openings = readSrc("src/features/careers/components/CareersOpeningsSection.tsx");
  const life = readSrc("src/features/careers/components/CareersLifeSection.tsx");
  const benefits = readSrc("src/features/careers/components/CareersBenefitsSection.tsx");
  const bespoke = readSrc("src/features/careers/components/CareersBespokeInspirationsSection.tsx");
  const faq = readSrc("src/features/careers/components/CareersFaqSection.tsx");
  const listings = readSrc("src/features/careers/components/CareersJobListingsSection.tsx");
  const filtersDrawer = readSrc("src/features/careers/components/shared/CareersJobFiltersDrawer.tsx");
  const emptyListings = readSrc("src/features/careers/components/shared/CareersJobListingsEmptyState.tsx");
  const jobDetail = readSrc("src/features/careers/components/CareersJobDetailSection.tsx");
  const applyModal = readSrc("src/features/careers/components/shared/CareersApplyOptionsModal.tsx");
  const copyJobId = readSrc("src/features/careers/utils/copyCareerJobId.ts");
  const appForm = readSrc("src/features/careers/components/shared/CareersApplicationForm.tsx");
  const uploadModal = readSrc("src/features/careers/components/shared/CareersUploadResumeModal.tsx");
  const confirmModal = readSrc("src/features/careers/components/shared/CareersSubmitConfirmationModal.tsx");
  const success = readSrc("src/features/careers/components/CareersApplicationSuccessSection.tsx");
  const submissionMapper = readSrc("src/services/careers/career-submission.mapper.ts");
  const jobsContext = readSrc("src/features/careers/context/CareersJobsContext.tsx");
  const headerBridge = readSrc("src/features/careers/context/careersHeaderBridge.ts");
  const service = readSrc("src/services/careers/careers.service.ts");
  const mapper = readSrc("src/services/careers/careers.mapper.ts");
  const careersSeo = readSrc("src/shared/lib/seo/careersSeo.ts");
  const routes = readSrc("src/features/careers/constants/careersRoutes.ts");
  const sitemap = readSrc("src/app/sitemap.ts");
  const header = readSrc("src/shared/ui/layout/Header.tsx");

  assertSource("CAREER-001", "landing route", landingPage, "CareersPage", "Careers landing route");
  assertSource("CAREER-002", "all openings route", allOpeningsPage, "CareersAllOpeningsPage", "All openings route");
  assertSource("CAREER-003", "job slug route", jobSlugPage, "CareersJobSlugPage", "Job slug route");
  assertSource("CAREER-004", "apply route", applyPage, "CareersApplyPage", "Apply route");
  assertSource("CAREER-005", "sitemap", sitemap, 'url: "/careers"', "Careers in sitemap");
  assertSource("CAREER-006", "skeleton", landingPage, "CareersPageSkeleton", "Loading skeleton");
  assertSource("CAREER-007", "revalidate", landingPage, "export const revalidate = 300", "ISR revalidate");
  assertSource("CAREER-008", "landing seo", landingPage, "resolveCareersSeoMetadata", "Landing SEO");
  assertSource("CAREER-009", "listings seo", allOpeningsPage, "resolveCareersAllOpeningsSeoMetadata", "All openings SEO");
  assertSource("CAREER-010", "job seo", jobSlugPage, "generateMetadata", "Job slug metadata");
  assertSource("CAREER-011", "seo fallback", landingPage, "siteConfig.brand.name", "SEO fallback");
  assertSource("CAREER-012", "hero", careersPage, "CareersHeroSection", "Hero section");
  assertSource("CAREER-013", "openings section", careersPage, "CareersOpeningsSection", "Openings section");
  assertSource("CAREER-014", "life section", careersPage, "CareersLifeSection", "Life section");
  assertSource("CAREER-015", "benefits", careersPage, "CareersBenefitsSection", "Benefits section");
  assertSource("CAREER-016", "bespoke", careersPage, "CareersBespokeInspirationsSection", "Bespoke inspirations");
  assertSource("CAREER-017", "faq", careersPage, "CareersFaqSection", "FAQ section");
  assertSource("CAREER-018", "listings section", allOpenings, "CareersJobListingsSection", "Job listings section");
  assertSource("CAREER-021", "filter drawer", filtersDrawer, "CareersJobFiltersDrawer", "Mobile filter drawer");
  assertSource("CAREER-022", "empty listings", emptyListings, "CareersJobListingsEmptyState", "Empty listings state");
  assertSource("CAREER-023", "job card", readSrc("src/features/careers/components/shared/CareersJobCard.tsx"), "CareersJobCard", "Job card component");
  assertSource("CAREER-024", "job detail", careersPage, "CareersJobDetailSection", "In-page job detail");
  assertSource("CAREER-025", "apply modal", applyModal, "CareersApplyOptionsModal", "Apply options modal");
  assertSource("CAREER-026", "copy job id", copyJobId, "copyCareerJobId", "Copy job ID util");
  assertSource("CAREER-027", "application form", appForm, "CareersApplicationForm", "Application form");
  assertSource("CAREER-028", "resume upload", uploadModal, "CareersUploadResumeModal", "Resume upload modal");
  assertSource("CAREER-029", "education fields", submissionMapper, "educationDetails", "Education submission mapping");
  assertSource("CAREER-030", "submit confirm", confirmModal, "CareersSubmitConfirmationModal", "Submit confirmation modal");
  assertSource("CAREER-031", "success section", success, "CareersApplicationSuccessSection", "Success section");
  assertSource("CAREER-032", "submission mapper", submissionMapper, "mapCareerJobSubmissionToStrapi", "Submission mapper");
  assertSource("CAREER-033", "jobs provider", careersPage, "CareersJobsProvider", "Jobs provider");
  assertSource("CAREER-034", "flow steps", jobsContext, 'flowStep', "Flow step state");
  assertSource("CAREER-035", "header bridge", headerBridge, "useCareersHeaderMode", "Careers header mode");
  assertSource("CAREER-036", "careers service", service, "getCareersPageData", "Careers CMS service");
  assertSource("CAREER-037", "careers mapper", mapper, "mapCareersPageData", "Careers mapper");
  assertSource("CAREER-038", "empty fallback", landingPage, "EMPTY_CAREERS_PAGE_DATA", "Empty CMS fallback");
  assertSource("CAREER-039", "opening mapper", service, "mapCareerOpening", "Job opening mapper");
  assertSource("CAREER-040", "header link", header, "CAREERS_ROUTE", "Header careers route");
  assertSource("CAREER-041", "all openings route const", routes, "CAREERS_ALL_OPENINGS_ROUTE", "All openings route constant");
}

async function runLiveChecks(baseUrl) {
  try {
    const landing = await fetchText(baseUrl, "/careers");
    record("CAREER-001", landing.status === 200 ? "Pass" : "Fail", `GET /careers → ${landing.status}`);

    const allOpenings = await fetchText(baseUrl, "/careers/all-openings");
    record("CAREER-002", allOpenings.status === 200 ? "Pass" : "Fail", `GET /careers/all-openings → ${allOpenings.status}`);

    const hasSitemapCareers = (await fetchText(baseUrl, "/sitemap.xml")).text.includes("/careers");
    record("CAREER-005", hasSitemapCareers ? "Pass" : "Fail", hasSitemapCareers ? "Sitemap lists /careers" : "Sitemap missing careers");
  } catch (error) {
    record("CAREER-001", "Fail", `HTTP error: ${error.message}`);
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

/**
 * Self-check: schema.org markup builders (SEO-1, SEO-2, 28 Oct).
 * Run: npm run test:structured-data
 */
import assert from "node:assert/strict";
import { register } from "node:module";

// Lets Node load the app's own TS modules: "@/..." → src/..., extensionless → .ts / .tsx,
// and image imports become a stub (Next.js normally handles them).
const aliasHooks = `
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
const SRC = ${JSON.stringify(new URL("../src/", import.meta.url).href)};
const isFile = (url) => { try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; } };
export async function resolve(specifier, context, next) {
  const aliased = specifier.startsWith("@/");
  if (!aliased && !specifier.startsWith(".")) return next(specifier, context);
  const base = aliased ? new URL(specifier.slice(2), SRC).href : new URL(specifier, context.parentURL).href;
  for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
    if (isFile(base + suffix)) return next(base + suffix, context);
  }
  return next(specifier, context);
}
export async function load(url, context, next) {
  if (/\\.(png|jpe?g|svg|webp)$/.test(url)) {
    return { format: "module", shortCircuit: true, source: 'export default { src: "/fallback.png" };' };
  }
  return next(url, context);
}`;
register(`data:text/javascript,${encodeURIComponent(aliasHooks)}`);

const { buildProductJsonLd } = await import("../src/shared/lib/seo/schema/product.ts");
const { buildJobPostingJsonLd } = await import("../src/shared/lib/seo/schema/jobPosting.ts");

const product = {
  sku: "SD-R-001",
  urlKey: "solitaire-ring",
  name: "Solitaire Ring",
  description: "A ring.",
  image: "https://cdn.example/a.jpg",
  price: 85000,
  inStock: true,
  rating: 0,
  reviews: 0,
};

// Return policy, free shipping and condition on every offer.
const full = buildProductJsonLd({
  ...product,
  images: ["https://cdn.example/a.jpg", { src: "https://cdn.example/b.jpg" }, "https://cdn.example/a.jpg"],
  material: "18K Rose Gold",
});
assert.equal(full.offers.hasMerchantReturnPolicy.merchantReturnDays, 15);
assert.equal(full.offers.hasMerchantReturnPolicy.applicableCountry, "IN");
assert.equal(full.offers.shippingDetails.shippingRate.value, 0);
assert.equal(full.offers.shippingDetails.shippingRate.currency, "INR");
assert.equal(full.offers.shippingDetails.shippingDestination.addressCountry, "IN");
assert.equal(full.offers.itemCondition, "https://schema.org/NewCondition");
// Every gallery image, duplicates dropped.
assert.deepEqual(full.image, ["https://cdn.example/a.jpg", "https://cdn.example/b.jpg"]);
assert.equal(full.material, "18K Rose Gold");
// No reviews: no rating block.
assert.equal("aggregateRating" in full, false);

// No gallery, no metal: main image only, no material.
const bare = buildProductJsonLd(product);
assert.deepEqual(bare.image, ["https://cdn.example/a.jpg"]);
assert.equal("material" in bare, false);

// No photos in Magento: the bundled placeholder is never published as the image.
const placeholder = { src: "/_next/static/media/fallBackImage.abc123.png", height: 10, width: 10 };
assert.equal("image" in buildProductJsonLd({ ...product, image: placeholder, images: [placeholder] }), false);
assert.deepEqual(
  buildProductJsonLd({ ...product, images: [placeholder, "https://cdn.example/c.jpg"] }).image,
  ["https://cdn.example/c.jpg"],
);

const job = {
  id: "1",
  slug: "store-manager-kochi",
  jobCode: "SD-SM-01",
  title: "Store Manager",
  department: "Retail",
  location: "Kochi, Kerala",
  type: "Full-time",
  postedAt: "2026-10-20",
  summary: "Run the Kochi store.",
  descriptionHtml: "<p>Run the Kochi store.</p>",
  isActive: true,
};

const posting = buildJobPostingJsonLd(job);
assert.equal(posting["@type"], "JobPosting");
assert.equal(posting.description, "<p>Run the Kochi store.</p>");
assert.equal(posting.datePosted, "2026-10-20");
assert.equal(posting.jobLocation.address.addressLocality, "Kochi, Kerala");
assert.equal(posting.jobLocation.address.addressCountry, "IN");
assert.equal(posting.identifier.value, "SD-SM-01");
assert.match(posting.hiringOrganization.logo, /\/apple-touch-icon\.png$/);

assert.equal(buildJobPostingJsonLd({ ...job, type: "Part-time" }).employmentType, "PART_TIME");
assert.equal(buildJobPostingJsonLd({ ...job, type: "Contract" }).employmentType, "CONTRACTOR");
assert.equal(posting.employmentType, "FULL_TIME");
// Unknown type: field left out rather than guessed.
assert.equal("employmentType" in buildJobPostingJsonLd({ ...job, type: "Internship" }), false);
// No sections and no legacy HTML: the summary is the description.
assert.equal(buildJobPostingJsonLd({ ...job, descriptionHtml: "" }).description, "Run the Kochi store.");
// Current CMS openings: sections in page order, with their headings.
assert.equal(
  buildJobPostingJsonLd({
    ...job,
    jobSummaryTitle: "Job Summary",
    jobSummary: "<p>Lead the team.</p>",
    rolesTitle: "Roles",
    rolesAndResponsibilities: "<ul><li>Sales</li></ul>",
    skills: "  ",
    qualifications: [{ label: "Education", text: "<p>Any degree</p>" }],
  }).description,
  "<h3>Job Summary</h3><p>Lead the team.</p><h3>Roles</h3><ul><li>Sales</li></ul><h3>Education</h3><p>Any degree</p>",
);

console.log("structured data: all checks passed");

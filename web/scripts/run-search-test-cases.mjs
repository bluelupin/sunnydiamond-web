/**
 * Predictive search checks (CR-C7 PS-12) against a deployed site and its Magento store.
 * Read-only: dropdown lookups go through /api/search/quick, which marks them as suggest-mode,
 * so the run adds nothing to Magento's popular-search log. The results page is fetched as
 * HTML only (its listing loads in the browser), so it records nothing either.
 * Run: npm run test:search
 *      npm run test:search -- --site http://localhost:3000 --graphql https://sunnydiamond-store-dev.on-forge.com/graphql
 */
import assert from "node:assert/strict";

const arg = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index > 0 ? process.argv[index + 1] : fallback;
};
const SITE = arg("--site", "https://sunnydiamonds-web-dev.on-forge.com").replace(/\/$/, "");
const GRAPHQL = arg("--graphql", "https://sunnydiamond-store-dev.on-forge.com/graphql");

async function quick(query) {
  const response = await fetch(`${SITE}/api/search/quick${query === undefined ? "" : `?q=${encodeURIComponent(query)}`}`);
  return { status: response.status, body: await response.json() };
}

async function gql(query, variables = {}) {
  const response = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Store: "default", "X-Sunny-Search-Mode": "suggest" },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

const labels = (links) => links.map((link) => link.label);

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`ok  ${name}`);
}

// Seed queries: what the shopper types → what must appear. Built from the dev catalogue
// (100 pieces; the Thali category has no pieces, so "thaali" is checked by category only).
const SEEDS = [
  { q: "earrings", products: /earring/i, category: "Earrings" },
  { q: "earings", products: /earring/i, category: "Earrings" },
  { q: "bangles", products: /bangle/i, category: "Bangles" },
  { q: "nosepin", products: /nosepin/i, category: "Nose Pins" },
  { q: "neckllace", products: /necklace/i, category: "Necklaces" },
  { q: "pendent", products: /pendant/i, category: "Pendants" },
  { q: "dimond", products: /diamond/i },
  { q: "thaali", category: "Thali", detail: "in Pendants" },
  { q: "4cs", article: "The 4Cs of diamonds" },
  { q: "emi", service: "EMI and Diamonds for Everyone" },
];

for (const seed of SEEDS) {
  await check(`"${seed.q}" returns the right groups`, async () => {
    const { status, body } = await quick(seed.q);
    assert.equal(status, 200);
    assert.equal(body.query, seed.q);
    if (seed.products) {
      assert.ok(body.products.length > 0 && body.products.length <= 6, `${seed.q}: ${body.products.length} pieces`);
      assert.match(body.products[0].name, seed.products);
      for (const product of body.products) {
        assert.match(product.href, /^\/product\/[\w-]+$/);
        assert.ok(product.price > 0, `${product.name} has no price`);
      }
    }
    if (seed.category) {
      const category = body.categories.find((link) => link.label === seed.category);
      assert.ok(category, `${seed.q}: categories were ${JSON.stringify(labels(body.categories))}`);
      assert.match(category.href, /^\/[\w-]+$/);
      if (seed.detail) assert.equal(category.detail, seed.detail);
    }
    if (seed.article) assert.ok(labels(body.articles).includes(seed.article), JSON.stringify(labels(body.articles)));
    if (seed.service) assert.ok(labels(body.services).includes(seed.service), JSON.stringify(labels(body.services)));
  });
}

await check('"emi" does not match blog posts inside words ("Premium")', async () => {
  const { body } = await quick("emi");
  for (const article of body.articles) assert.match(article.label, /(^|[^\p{L}\p{N}])emi/iu);
});

await check("empty search lists the four curated popular searches first", async () => {
  const { status, body } = await quick();
  assert.equal(status, 200);
  assert.deepEqual(labels(body.popular).slice(0, 4), ["Solitaire rings", "Bridal necklace", "Gifts under ₹50,000", "Auriga"]);
});

await check("a word with no match returns no groups", async () => {
  const { body } = await quick("xyzzy");
  assert.deepEqual([body.products, body.categories, body.articles, body.services].map((group) => group.length), [0, 0, 0, 0]);
});

await check("one character is refused", async () => {
  assert.equal((await quick("r")).status, 400);
});

await check("a 150-character query is cut to 100 and control characters are dropped", async () => {
  const { status, body } = await quick(`ring\u0000\u0007${"s".repeat(150)}`);
  assert.equal(status, 200);
  assert.equal(body.query.length, 100);
  assert.doesNotMatch(body.query, /\p{C}/u);
});

await check("Magento category search expands synonyms and needs 3 characters", async () => {
  const CATEGORIES = "query ($q: String!) { sunnySearchCategories(query: $q) { name parent_name } }";
  const thaali = await gql(CATEGORIES, { q: "thaali" });
  assert.ok(thaali.data.sunnySearchCategories.some((row) => row.name === "Thali" && row.parent_name === "Pendants"));
  const short = await gql(CATEGORIES, { q: "ri" });
  assert.deepEqual(short.data.sunnySearchCategories, []);
});

await check("Magento popular searches are terms of 3+ characters", async () => {
  const result = await gql("{ sunnyPopularSearches(limit: 20) }");
  const terms = result.data.sunnyPopularSearches;
  assert.ok(Array.isArray(terms) && terms.length <= 20);
  for (const term of terms) assert.ok(term.length >= 3, `"${term}" is too short`);
});

await check("results page renders with its title (and the no-results message when nothing matches)", async () => {
  const rings = await fetch(`${SITE}/search?q=rings`);
  assert.equal(rings.status, 200);
  const html = await rings.text();
  assert.match(html, /Results for [^<]{0,12}rings/);
  assert.match(html, /noindex/);
  const none = await (await fetch(`${SITE}/search?q=xyzzy`)).text();
  assert.match(none, /find a match for/);
});

await check("/search without a query and the old /coming-soon both go to the jewellery listing", async () => {
  // The site layout streams a loading screen, so Next often redirects inside a 200 page
  // (<meta id="__next-page-redirect">) instead of with a 3xx; browsers follow either.
  for (const route of ["/search", "/coming-soon"]) {
    const response = await fetch(`${SITE}${route}`, { redirect: "manual" });
    const target =
      response.status >= 300 && response.status < 400
        ? response.headers.get("location")
        : (await response.text()).match(/__next-page-redirect"[^>]*url=([^"]+)"/)?.[1];
    assert.match(target ?? "", /\/jewellery$/, `${route}: ${response.status}`);
  }
});

console.log(`\n${passed} search checks passed against ${SITE} and ${GRAPHQL}`);

import assert from "node:assert/strict";
import { buildEducationJourneyHref } from "../src/features/education/utils/educationJourneyRoutes.ts";

const globalFacets = { minPrice: 10_000, maxPrice: 500_000 };
const scopedFacets = { minPrice: 50_000, maxPrice: 200_000 };

const href = buildEducationJourneyHref({
  categoryUrlKey: "rings",
  minPrice: 50_000,
  maxPrice: 200_000,
  diamondShapeLabel: "Round",
  listingFacets: scopedFacets,
  priceUrlFacets: globalFacets,
});

assert.match(href, /minPrice=50000/, "includes min price when scoped facets match selection");
assert.match(href, /maxPrice=200000/, "includes max price when scoped facets match selection");
assert.match(href, /diamondShape=/, "includes diamond shape");

const hrefAboveScopedMax = buildEducationJourneyHref({
  categoryUrlKey: "rings",
  minPrice: 80_000,
  maxPrice: 350_000,
  diamondShapeLabel: "Round",
  listingFacets: { minPrice: 50_000, maxPrice: 300_000 },
  priceUrlFacets: globalFacets,
});

assert.match(
  hrefAboveScopedMax,
  /maxPrice=350000/,
  "preserves user max above category-scoped facet ceiling",
);
assert.match(hrefAboveScopedMax, /minPrice=80000/, "preserves user min");

const defaultRangeHref = buildEducationJourneyHref({
  categoryUrlKey: null,
  minPrice: globalFacets.minPrice,
  maxPrice: globalFacets.maxPrice,
  diamondShapeLabel: "Round",
  listingFacets: globalFacets,
  priceUrlFacets: globalFacets,
});

assert.doesNotMatch(defaultRangeHref, /minPrice=/, "omits min when range is full catalog default");
assert.doesNotMatch(defaultRangeHref, /maxPrice=/, "omits max when range is full catalog default");

console.log("test-education-journey-href.mjs: ok");

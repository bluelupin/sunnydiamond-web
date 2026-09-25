/**
 * Self-check for the Diamonds for Everyone simulator config resolver.
 * Run: npm run test:dfe-config
 */
import assert from "node:assert/strict";
import {
  clampDfeMonthlyAmount,
  computeDfeInvestmentSummary,
  resolveDfeInvestmentConfig,
} from "../src/features/diamonds-for-everyone/utils/investmentConfig.ts";

const defaults = {
  minMonthly: 1000,
  maxMonthly: 50000,
  step: 500,
  defaultMonthly: 5000,
  monthsPaid: 11,
  totalMonths: 12,
};

// Nothing from the CMS: built-in values.
assert.deepEqual(resolveDfeInvestmentConfig(null, defaults), defaults);
assert.deepEqual(resolveDfeInvestmentConfig({}, defaults), defaults);

// Valid CMS values win.
assert.deepEqual(
  resolveDfeInvestmentConfig(
    { minMonthly: 2000, maxMonthly: 100000, step: 1000, defaultMonthly: 10000, monthsPaid: 10, totalMonths: 12 },
    defaults,
  ),
  { minMonthly: 2000, maxMonthly: 100000, step: 1000, defaultMonthly: 10000, monthsPaid: 10, totalMonths: 12 },
);

// Bad single values fall back one by one.
const badFields = resolveDfeInvestmentConfig({ step: 0, defaultMonthly: -5, monthsPaid: 10.5 }, defaults);
assert.equal(badFields.step, 500);
assert.equal(badFields.defaultMonthly, 5000);
assert.equal(badFields.monthsPaid, 11);

// Contradictory pairs fall back as pairs.
const minAboveMax = resolveDfeInvestmentConfig({ minMonthly: 60000 }, defaults);
assert.equal(minAboveMax.minMonthly, 1000);
assert.equal(minAboveMax.maxMonthly, 50000);
const paidAll = resolveDfeInvestmentConfig({ monthsPaid: 12, totalMonths: 12 }, defaults);
assert.equal(paidAll.monthsPaid, 11);
assert.equal(paidAll.totalMonths, 12);

// Default amount is pulled into the configured range.
assert.equal(resolveDfeInvestmentConfig({ maxMonthly: 3000 }, defaults).defaultMonthly, 3000);

// Typo guard: more bonus months than paid months falls back as a pair.
const typo = resolveDfeInvestmentConfig({ monthsPaid: 1, totalMonths: 12 }, defaults);
assert.equal(typo.monthsPaid, 11);
assert.equal(typo.totalMonths, 12);
assert.equal(resolveDfeInvestmentConfig({ monthsPaid: 6, totalMonths: 12 }, defaults).monthsPaid, 6);

// Ceilings match the Strapi field limits.
assert.equal(resolveDfeInvestmentConfig({ totalMonths: 1200 }, defaults).totalMonths, 12);
assert.equal(resolveDfeInvestmentConfig({ maxMonthly: 2_000_000 }, defaults).maxMonthly, 50000);

// Step must land on the maximum; otherwise the default step, else 1.
assert.equal(resolveDfeInvestmentConfig({ step: 800 }, defaults).step, 500);
assert.equal(resolveDfeInvestmentConfig({ step: 60000 }, defaults).step, 500);
assert.equal(resolveDfeInvestmentConfig({ minMonthly: 1000, maxMonthly: 1300 }, defaults).step, 1);

// Starting amount snaps onto the slider grid.
assert.equal(resolveDfeInvestmentConfig({ defaultMonthly: 5200 }, defaults).defaultMonthly, 5000);
assert.equal(resolveDfeInvestmentConfig({ defaultMonthly: 5300 }, defaults).defaultMonthly, 5500);

// Summary: one month free by default, two when only ten are paid.
assert.deepEqual(computeDfeInvestmentSummary(5000, defaults), {
  contribution: 55000,
  bonus: 5000,
  totalValue: 60000,
});
assert.deepEqual(computeDfeInvestmentSummary(5000, { monthsPaid: 10, totalMonths: 12 }), {
  contribution: 50000,
  bonus: 10000,
  totalValue: 60000,
});

// Amounts are whole rupees inside the range.
assert.equal(clampDfeMonthlyAmount(1234.56, defaults), 1235);
assert.equal(clampDfeMonthlyAmount(-10, defaults), 1000);

console.log("dfe-investment-config: all checks passed");

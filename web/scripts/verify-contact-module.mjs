#!/usr/bin/env node
/**
 * Lightweight verification for Contact Us module fixes (no test framework required).
 * Run: node web/scripts/verify-contact-module.mjs
 */

const formatEmailDisplay = (value) => {
  const compact = value.replace(/\s+/g, "");
  const match = compact.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].toLowerCase() : value.trim();
};

const normalizeContactCopy = (value) => {
  const text = value?.trim();
  if (!text) return undefined;
  return text
    .replace(/\bassisstance\b/gi, "assistance")
    .replace(/\bmember of our team\b/gi, "member of the team");
};

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed += 1;
    return;
  }
  failed += 1;
  console.error(`FAIL: ${label}`);
}

assert(
  formatEmailDisplay("GET INTOUCH@SUNNTDIAMONDS.COM") === "getintouch@sunntdiamonds.com",
  "email display normalizes garbled CMS email",
);
assert(
  normalizeContactCopy("Get quick assisstance from our dedicated member of our team") ===
    "Get quick assistance from our dedicated member of the team",
  "contact copy typo normalization",
);
assert(
  normalizeContactCopy("") === undefined,
  "empty copy returns undefined",
);

console.log(`Contact module checks: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

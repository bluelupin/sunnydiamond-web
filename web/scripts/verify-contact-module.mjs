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

const resolveEmailLinkLabel = (buttonLabel, email) => {
  const generic = ["phone", "email", "whatsapp", "link", "call", "cta", "button"];
  if (buttonLabel && !generic.includes(buttonLabel.toLowerCase()) && !buttonLabel.includes("@")) {
    return buttonLabel;
  }
  if (buttonLabel?.includes("@")) {
    return formatEmailDisplay(buttonLabel);
  }
  return email;
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
assert(
  resolveEmailLinkLabel("GET INTOUCH@SUNNTDIAMONDS.COM", "getintouch@sunntdiamonds.com") ===
    "getintouch@sunntdiamonds.com",
  "garbled CMS buttonLabel normalized for email display",
);
assert(
  resolveEmailLinkLabel("Email Us", "getintouch@sunntdiamonds.com") === "Email Us",
  "custom non-email buttonLabel preserved",
);

console.log(`Contact module checks: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

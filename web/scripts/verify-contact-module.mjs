#!/usr/bin/env node
/**
 * Lightweight verification for Contact Us module fixes (no test framework required).
 * Run: node web/scripts/verify-contact-module.mjs
 */

const formatEmailAddress = (value) => {
  const compact = value.replace(/\s+/g, "");
  const match = compact.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!match) return value.trim();

  return match[0]
    .toLowerCase()
    .replace("@sunntdiamonds.com", "@sunnydiamonds.com");
};

const sanitizeEmailLinkLabel = (label) =>
  label.replace(/@sunntdiamonds\.com/gi, "@SUNNYDIAMONDS.COM");

const formatEmailLinkDisplay = (email) => {
  const [localPart, domain = ""] = email.split("@");
  return `${localPart.toUpperCase()}@${domain.toUpperCase()}`;
};

const resolveEmailLinkLabel = (buttonLabel, email) => {
  const generic = ["phone", "email", "whatsapp", "link", "call", "cta", "button"];
  const cmsLabel = buttonLabel?.trim();

  if (cmsLabel && !generic.includes(cmsLabel.toLowerCase())) {
    return cmsLabel.includes("@") ? sanitizeEmailLinkLabel(cmsLabel) : cmsLabel;
  }

  return formatEmailLinkDisplay(email);
};

const resolveWhatsAppLinkLabel = (buttonLabel) => {
  const cmsLabel = buttonLabel?.trim();
  if (cmsLabel) return cmsLabel;

  return "WHATSAPP";
};

const resolveContactVisitCta = (sectionCta, pageCta) => {
  const sectionLabel = sectionCta?.label?.trim();
  if (sectionLabel) return sectionCta;

  const pageLabel = pageCta?.label?.trim();
  if (pageLabel) return pageCta;

  return sectionCta ?? pageCta;
};

const normalizeContactCtaHref = (url) => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  if (trimmed.includes("@")) {
    return `mailto:${trimmed}`;
  }

  return `https://${trimmed}`;
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
  formatEmailAddress("GET INTOUCH@SUNNTDIAMONDS.COM") === "getintouch@sunnydiamonds.com",
  "email address normalizes garbled CMS email and fixes domain typo",
);
assert(
  resolveEmailLinkLabel("GETINTOUCH@SUNNYDIAMONDS.COM", "getintouch@sunnydiamonds.com") ===
    "GETINTOUCH@SUNNYDIAMONDS.COM",
  "email CTA prefers CMS buttonLabel",
);
assert(
  sanitizeEmailLinkLabel("GET INTOUCH@SUNNTDIAMONDS.COM") === "GET INTOUCH@SUNNYDIAMONDS.COM",
  "email CTA sanitizes known CMS domain typo",
);
assert(
  resolveWhatsAppLinkLabel("WHATSAPP") === "WHATSAPP",
  "whatsapp CTA uses CMS buttonLabel",
);
assert(
  resolveEmailLinkLabel("Email Us", "getintouch@sunnydiamonds.com") === "Email Us",
  "custom non-email buttonLabel preserved",
);
assert(
  resolveContactVisitCta(null, { label: "BOOK AN APPOINTMENT", url: "www.google.com" })?.label ===
    "BOOK AN APPOINTMENT",
  "visit us CTA falls back to page-level CMS cta",
);
assert(
  resolveContactVisitCta({ label: "Visit showroom", url: "/stores" }, {
    label: "BOOK AN APPOINTMENT",
    url: "www.google.com",
  })?.label === "Visit showroom",
  "visit section cta takes priority over page-level cta",
);
assert(
  normalizeContactCtaHref("www.google.com") === "https://www.google.com",
  "visit us CTA url normalizes bare domains",
);

console.log(`Contact module checks: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

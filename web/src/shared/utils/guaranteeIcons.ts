/** Figma UI-Production node 3541:249345 — Internally Flawless Diamond guarantee icon */
export const GUARANTEE_INTERNALLY_FLAWLESS_DIAMOND_ICON =
  "/icons/guarantee-internally-flawless-diamond.svg";

/** Figma UI-Production node 3541:249349 — Brand Assured Quality guarantee icon */
export const GUARANTEE_BRAND_ASSURED_QUALITY_ICON =
  "/icons/guarantee-brand-assured-quality.svg";

/** Figma UI-Production node 3541:249353 — Certifications of Diamond guarantee icon */
export const GUARANTEE_DIAMOND_CERTIFICATION_ICON =
  "/icons/guarantee-diamond-certification.svg";

export function resolveGuaranteeIconSrc(iconSrc: string, label: string): string {
  if (
    /flawless_diamond/i.test(iconSrc) ||
    /internally\s+flawless/i.test(label)
  ) {
    return GUARANTEE_INTERNALLY_FLAWLESS_DIAMOND_ICON;
  }

  if (
    /brand_quality/i.test(iconSrc) ||
    /brand\s+assured/i.test(label)
  ) {
    return GUARANTEE_BRAND_ASSURED_QUALITY_ICON;
  }

  if (
    /certification|certificate/i.test(iconSrc) ||
    /certification/i.test(label)
  ) {
    return GUARANTEE_DIAMOND_CERTIFICATION_ICON;
  }

  return iconSrc;
}

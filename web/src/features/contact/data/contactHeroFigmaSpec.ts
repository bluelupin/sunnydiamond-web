/** Figma UI-Production node 1480:178046 — Contact Us desktop */
export const contactHeroFigmaSpec = {
  heightPx: { mobile: 240, desktop: 320 },
  overlayOpacity: 0.4,
  title: {
    desktopFontSizePx: 48,
    lineHeight: 1.1,
    /** Title top offset from hero top (1440 desktop frame) */
    desktopTopPx: 203,
  },
  navigation: {
    heightPx: 104,
    paddingXPx: 40,
    paddingYPx: 24,
    logoNavGapPx: 40,
    iconGapPx: 24,
  },
  layout: {
    /** Horizontal inset on 1440 desktop frame (node 4285:92690) */
    contentPaddingXPx: 120,
    /** Usable content width: 1440 − (120 × 2) */
    contentMaxWidthPx: 1200,
    sectionGapPx: 104,
    contentPaddingTopPx: 64,
    contentPaddingBottomPx: 104,
  },
  visitUs: {
    heightPx: 387,
    overlayOpacity: 0.3,
    titleFontSizePx: 48,
    descriptionFontSizePx: 20,
    contentBottomPx: 40,
    contentMaxWidthPx: 1360,
    textBlockGapPx: 16,
    sectionGapPx: 32,
    ctaFontSizePx: 14,
    ctaUnderlinePaddingBottomPx: 4,
  },
  form: {
    titleFontSizePx: 32,
    fieldStackGapPx: 24,
    titleToFieldsGapPx: 32,
    submitWidthPx: 308,
    submitHeightPx: 56,
    submitColor: "#4D4D4D",
    consentFontSizePx: 16,
    consentColor: "#4D4D4D",
    checkboxSizePx: 24,
  },
  cards: {
    /** Gap between cards (node 4285:103120) */
    gapPx: 12,
    paddingPx: 24,
    /** All contact cards share fixed height (nodes 4285:103087–4285:103108) */
    compactHeightPx: 189,
    hoursRowGapPx: 12,
    ctaFontSizePx: 14,
    ctaUnderlinePaddingBottomPx: 4,
  },
} as const;

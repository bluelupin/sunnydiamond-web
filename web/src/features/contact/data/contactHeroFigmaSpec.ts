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
    /** Email / Personal Concierge fixed height (nodes 4285:103100, 4285:103108) */
    compactHeightPx: 189,
    hoursRowGapPx: 12,
    ctaFontSizePx: 14,
    ctaUnderlinePaddingBottomPx: 4,
  },
} as const;

/** Shared Tailwind classes for Contact page content shell (L-01, L-02, L-05). */
export const contactPageLayoutClasses = {
  shell: "w-full px-4 md:px-[120px] md:pb-104",
  inner: "mx-auto flex w-full max-w-[1200px] flex-col gap-16 md:gap-104",
  afterHero: "pt-16",
} as const;

/** Shared Tailwind classes for Contact info cards (C-02, C-03, C-07–C-09). */
/** Shared Tailwind classes for Contact Visit Us section (V-01–V-07). */
export const contactVisitUsLayoutClasses = {
  section: "relative h-[320px] w-full overflow-hidden md:h-[387px]",
  overlay: "pointer-events-none absolute inset-0 bg-black/30",
  contentShell:
    "absolute inset-x-0 bottom-10 z-10 flex justify-center px-4 md:px-10",
  contentInner: "flex w-full max-w-[1360px] flex-col items-center gap-8",
  textBlock: "flex flex-col items-center gap-4 text-center text-white",
  title: "font-larken text-[48px] font-light leading-110 text-white",
  description: "max-w-[606px] font-gill text-xl font-light leading-110 text-white",
  cta:
    "inline-flex w-fit border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white",
} as const;

/** Shared Tailwind classes for Contact enquiry form (F-02, F-03, F-04, F-14, F-16, F-18, F-19). */
export const contactFormLayoutClasses = {
  shell: "flex w-full flex-col items-center gap-8",
  title: "w-full text-center font-larken text-2xl font-light leading-110 text-darkblack md:text-32",
  form: "flex w-full flex-col gap-6",
  consentRow: "flex items-center gap-2",
  consentText: "min-w-0 flex-1 font-gill text-base font-light leading-110 text-neutral500",
  consentLink: "font-gill text-base font-normal leading-110 text-neutral500",
  submit:
    "mx-auto inline-flex h-14 w-full items-center justify-center bg-neutral500 px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[308px]",
} as const;

export const contactCardLayoutClasses = {
  grid: "grid w-full grid-cols-1 gap-4 bg-gray300 px-4 py-2 md:grid-cols-3 md:items-stretch md:gap-3 md:bg-transparent md:px-0 md:py-0",
  card: "flex h-full flex-col items-center self-stretch bg-gray300 p-4 md:gap-6 md:p-6",
  cardCompact: "md:h-[189px] md:justify-between",
  hoursRow: "flex flex-wrap items-center justify-center gap-3",
  hoursLabel: "font-gill font-light",
  hoursValue: "font-gill font-normal",
  cta:
    "inline-flex w-fit max-w-full break-all border-b border-darkblack pb-1 font-gill text-sm font-normal leading-110 text-darkblack",
} as const;

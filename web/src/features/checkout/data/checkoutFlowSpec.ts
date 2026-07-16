/** Figma Checkout — desktop 2083:10395+, mobile 2083:6365, sticky 2083:7181, order summary popup 2083:6968 */
export const checkoutFlowSpec = {
  page: {
    paddingXMobile: 20,
    titleFontSizeMobile: 32,
    titleMarginBottomMobile: 24,
    sectionGapMobile: 24,
  },
  mobile: {
    stickyFooterGradientHeight: 71,
    offersBarPaddingX: 16,
    offersBarPaddingY: 12,
    orderSummaryPaddingX: 16,
    orderSummaryPaddingY: 24,
    orderSummaryGap: 16,
    stickyFooterCollapsedClearance: 220,
    stickyFooterOffersExpandedClearance: 264,
    orderSummaryDrawerMaxHeight: "90vh",
    orderSummaryLinkSize: 14,
    stickyTotalFontSize: 20,
    stickyFooterZIndex: 40,
  },
  colors: {
    pageBackground: "#F4F3EE",
    offersBarBackground: "#F4F3EE",
    cardBackground: "#FFFFFF",
    divider: "#CCCCCC",
  },
} as const;

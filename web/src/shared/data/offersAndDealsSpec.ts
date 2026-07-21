/** Figma 2083:7653 — Offers and Deals expanded content */
export type OffersAndDealsVariant =
  | "sticky-gray200"
  | "sticky-gray300"
  | "panel-gray300";

export const offersAndDealsSpec = {
  /** EL-6de064d0 collapsed bar */
  toggle: {
    paddingStickyX: 16,
    paddingStickyY: 12,
    paddingPanel: 16,
    labelFontSize: 16,
    labelFontWeight: 400,
    labelColor: "#0A0A0A",
    iconSize: 24,
    backgroundCart: "#FBFAF6",
    backgroundCheckout: "#F4F3EE",
    backgroundPanel: "#F4F3EE",
  },
  expanded: {
    paddingX: 16,
    paddingBottom: 16,
    sectionGap: 16,
    fieldGap: 8,
    inputHeight: 56,
    inputPadding: 12,
    inputBackground: "#F2F2F2",
    labelFontSize: 16,
    labelFontWeight: 400,
    labelColor: "#0A0A0A",
    placeholderColor: "#999999",
    applyFontSize: 14,
    applyFontWeight: 400,
    offerCardGap: 12,
    offerCardIconSize: 24,
    offerCardTextGap: 4,
    offerCardPadding: 12,
    offerTitleFontSize: 16,
    offerDescriptionFontSize: 14,
    offerDescriptionColor: "#4D4D4D",
    messageFontSize: 14,
    messageFontWeight: 300,
    messageLineHeight: 110,
    messageColor: "#4D4D4D",
    messageAlign: "center" as const,
    backgroundCart: "#FBFAF6",
    backgroundCheckout: "#F4F3EE",
    errorColor: "#F91616",
    successColor: "#47CB6C",
  },
} as const;

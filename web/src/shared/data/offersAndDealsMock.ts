export type MockOfferIconVariant = "bank" | "coupon";

export type MockOffer = {
  id: string;
  code: string;
  title: string;
  headline: string;
  description: string;
  discountLabel: string;
  categoryLabel: string;
  iconVariant: MockOfferIconVariant;
  /** UI preview — replace with API-calculated discount later. */
  discountPercent?: number;
  discountFixed?: number;
};

export type MockGiftCard = {
  code: string;
  balance: number;
};

/** Mock offers — replace with API later */
export const mockAvailableOffers: MockOffer[] = [
  {
    id: "offer-kotak-bank",
    code: "KOTAK12",
    title: "Kotak Bank Solitaire Credit Cards",
    headline: "Upto 12% off Kotak Bank Solitaire Credit Cards",
    description: "Valid on select Kotak Bank Solitaire credit card payments.",
    discountLabel: "12% off",
    categoryLabel: "Bank Offer",
    iconVariant: "bank",
    discountPercent: 12,
  },
  {
    id: "offer-sunny10",
    code: "SUNNY10",
    title: "10% off diamond jewellery",
    headline: "10% off diamond jewellery",
    description: "Valid on orders above ₹50,000. Excludes bespoke pieces.",
    discountLabel: "10% off",
    categoryLabel: "Bank Offer",
    iconVariant: "coupon",
    discountPercent: 10,
  },
  {
    id: "offer-welcome500",
    code: "WELCOME500",
    title: "Welcome offer",
    headline: "₹500 off your first Sunny Diamonds purchase online",
    description: "₹500 off your first Sunny Diamonds purchase online.",
    discountLabel: "₹500 off",
    categoryLabel: "Bank Offer",
    iconVariant: "coupon",
    discountFixed: 500,
  },
  {
    id: "offer-festive15",
    code: "FESTIVE15",
    title: "Festive season special",
    headline: "15% off select rings and earrings until 31 Dec",
    description: "15% off select rings and earrings until 31 Dec.",
    discountLabel: "15% off",
    categoryLabel: "Bank Offer",
    iconVariant: "coupon",
    discountPercent: 15,
  },
];

export const mockGiftCards: MockGiftCard[] = [
  { code: "SUNNYGC1000", balance: 1000 },
  { code: "GIFT500", balance: 500 },
];

export const findMockOfferByCode = (code: string) =>
  mockAvailableOffers.find((offer) => offer.code.toLowerCase() === code.trim().toLowerCase());

export const findMockOfferById = (id: string) =>
  mockAvailableOffers.find((offer) => offer.id === id);

/** UI-only preview discount until Magento coupon API is wired. */
export const getMockOfferDiscountAmount = (offer: MockOffer, subtotal: number) => {
  if (subtotal <= 0) {
    return 0;
  }

  if (offer.discountFixed != null) {
    return Math.min(offer.discountFixed, subtotal);
  }

  if (offer.discountPercent != null) {
    return Math.round((subtotal * offer.discountPercent) / 100);
  }

  return 0;
};

export const findMockGiftCardByCode = (code: string) =>
  mockGiftCards.find((card) => card.code.toLowerCase() === code.trim().toLowerCase());

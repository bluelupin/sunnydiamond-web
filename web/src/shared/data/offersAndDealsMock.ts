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
  },
];

export const mockGiftCards: MockGiftCard[] = [
  { code: "SUNNYGC1000", balance: 1000 },
  { code: "GIFT500", balance: 500 },
];

export const findMockOfferByCode = (code: string) =>
  mockAvailableOffers.find((offer) => offer.code.toLowerCase() === code.trim().toLowerCase());

export const findMockGiftCardByCode = (code: string) =>
  mockGiftCards.find((card) => card.code.toLowerCase() === code.trim().toLowerCase());

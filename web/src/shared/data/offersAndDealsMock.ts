export type MockOffer = {
  id: string;
  code: string;
  title: string;
  description: string;
  discountLabel: string;
};

export type MockGiftCard = {
  code: string;
  balance: number;
};

/** Mock offers — replace with API later */
export const mockAvailableOffers: MockOffer[] = [
  {
    id: "offer-sunny10",
    code: "SUNNY10",
    title: "10% off diamond jewellery",
    description: "Valid on orders above ₹50,000. Excludes bespoke pieces.",
    discountLabel: "10% off",
  },
  {
    id: "offer-welcome500",
    code: "WELCOME500",
    title: "Welcome offer",
    description: "₹500 off your first Sunny Diamonds purchase online.",
    discountLabel: "₹500 off",
  },
  {
    id: "offer-festive15",
    code: "FESTIVE15",
    title: "Festive season special",
    description: "15% off select rings and earrings until 31 Dec.",
    discountLabel: "15% off",
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

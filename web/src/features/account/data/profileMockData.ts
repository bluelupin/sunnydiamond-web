import type { ProfileBespokeItemUi } from "../types/profileUi.types";

/** Dev-only preview data — not used in ProfileBespokeSection (always shows API results). */
export const PROFILE_PREVIEW_MOCK_WHEN_EMPTY = false;

const PLACEHOLDER_RING_IMAGE = "/images/jewellery/plp/product-ring-transparent.png";
const PLACEHOLDER_NECKLACE_IMAGE = "/images/jewellery/plp/product-necklace-transparent.png";

export const MOCK_PROFILE_BESPOKE: ProfileBespokeItemUi[] = [
  {
    id: "mock-bespoke-1",
    creationDocumentId: "mock-creation-1",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    images: [PLACEHOLDER_NECKLACE_IMAGE, PLACEHOLDER_RING_IMAGE],
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
  {
    id: "mock-bespoke-2",
    creationDocumentId: "mock-creation-2",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    images: [PLACEHOLDER_NECKLACE_IMAGE, PLACEHOLDER_RING_IMAGE],
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
  {
    id: "mock-bespoke-3",
    creationDocumentId: "mock-creation-3",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    images: [PLACEHOLDER_NECKLACE_IMAGE],
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
  {
    id: "mock-bespoke-4",
    creationDocumentId: "mock-creation-4",
    title: "Alankara Diamond Necklace",
    imageSrc: PLACEHOLDER_NECKLACE_IMAGE,
    images: [PLACEHOLDER_NECKLACE_IMAGE],
    size: "14",
    metal: "White Gold",
    price: "₹ 9,880",
    viewHref: "/bespoke-jewellery",
  },
];

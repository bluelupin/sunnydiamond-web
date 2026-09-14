import type {
  GiftCardDeliveryAddress,
  GiftCardFlowStep,
  GiftCardPartyDetails,
  GiftCardType,
} from "../context/GiftCardFlowContext";

const STORAGE_KEY = "sunny:gift-card-flow";

export type PersistedGiftCardFlowState = {
  step: GiftCardFlowStep;
  cardType: GiftCardType;
  amount: number;
  occasion: string;
  message: string;
  sender: GiftCardPartyDetails;
  receiverSameAsSender: boolean;
  receiver: GiftCardPartyDetails;
  deliveryAddress: GiftCardDeliveryAddress;
  pendingAuthAfterConfigure: boolean;
};

export function readGiftCardFlowStorage(): PersistedGiftCardFlowState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedGiftCardFlowState;
  } catch {
    return null;
  }
}

export function writeGiftCardFlowStorage(state: PersistedGiftCardFlowState): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function clearGiftCardFlowStorage(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

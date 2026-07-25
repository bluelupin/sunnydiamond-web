import type { CartLineItem } from "@/features/cart/types/cart.types";
import type { CheckoutFormData } from "../types/checkout.types";

const STORAGE_KEY = "sunny-checkout-pending-payment";

export type PendingCheckoutPayment = {
  orderNumber: string;
  contact: string;
  totalPrice: number;
  placedItems: CartLineItem[];
  guestOtp: string | null;
  form: CheckoutFormData;
  isAuthenticated: boolean;
};

export function savePendingCheckoutPayment(data: PendingCheckoutPayment): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function readPendingCheckoutPayment(): PendingCheckoutPayment | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingCheckoutPayment;
  } catch {
    return null;
  }
}

export function clearPendingCheckoutPayment(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}

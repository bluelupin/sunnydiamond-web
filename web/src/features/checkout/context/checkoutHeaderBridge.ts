import { useLayoutEffect, useState } from "react";
import { isCheckoutRoute } from "@/shared/utils/navigation";

let checkoutSuccessHeaderActive = false;
const listeners = new Set<() => void>();

export function setCheckoutSuccessHeaderActive(active: boolean) {
  if (checkoutSuccessHeaderActive === active) {
    return;
  }

  checkoutSuccessHeaderActive = active;
  listeners.forEach((listener) => listener());
}

export function resetCheckoutSuccessHeaderActive() {
  setCheckoutSuccessHeaderActive(false);
}

function getCheckoutSuccessHeaderActive() {
  return checkoutSuccessHeaderActive;
}

function subscribeCheckoutSuccessHeaderActive(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Header sits outside CheckoutPage; sync mobile success header surface on /checkout. */
export function useCheckoutSuccessHeaderActive(pathname: string): boolean {
  const [, setRevision] = useState(0);
  const onCheckoutRoute = isCheckoutRoute(pathname);

  useLayoutEffect(() => {
    if (!onCheckoutRoute) {
      return;
    }

    return subscribeCheckoutSuccessHeaderActive(() => setRevision((value) => value + 1));
  }, [onCheckoutRoute]);

  return onCheckoutRoute && getCheckoutSuccessHeaderActive();
}

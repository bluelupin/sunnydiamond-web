export const CHECKOUT_SUCCESS_PATH_PREFIX = "/checkout/success";

export function buildCheckoutSuccessPath(orderNumber: string): string {
  const normalized = orderNumber.trim();
  if (!normalized) {
    return "/checkout";
  }

  return `${CHECKOUT_SUCCESS_PATH_PREFIX}/${encodeURIComponent(normalized)}`;
}

export function parseCheckoutSuccessOrderNumber(pathname: string): string | null {
  const prefix = `${CHECKOUT_SUCCESS_PATH_PREFIX}/`;
  if (!pathname.startsWith(prefix)) {
    return null;
  }

  const rawSegment = pathname.slice(prefix.length).split("/")[0]?.trim();
  if (!rawSegment) {
    return null;
  }

  try {
    return decodeURIComponent(rawSegment).trim() || null;
  } catch {
    return rawSegment;
  }
}

/** Keep the placed order id in the URL without a full navigation. */
export function replaceCheckoutSuccessUrl(orderNumber: string) {
  if (typeof window === "undefined") {
    return;
  }

  const nextPath = buildCheckoutSuccessPath(orderNumber);
  if (window.location.pathname === nextPath) {
    return;
  }

  window.history.replaceState(window.history.state, "", nextPath);
}

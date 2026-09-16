import { cartRefreshErrorContent } from "../data/cartErrorContent";

/** User-facing message when Magento cart fetch/refresh fails. */
export function formatCartRefreshError(): string {
  return cartRefreshErrorContent.description;
}

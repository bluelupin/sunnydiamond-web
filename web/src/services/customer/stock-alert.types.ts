/** Discriminated result the notify-me UI switches on; the client never throws. */
export type StockAlertSubscribeResult =
  /** Alert stored (or was already stored — the shopper sees the same success). */
  | { status: "subscribed" }
  /** No customer session, or the token expired — caller sends the shopper to sign in. */
  | { status: "unauthorized" }
  /** Feature flagged off or Magento schema not deployed — caller hides the action. */
  | { status: "unavailable" }
  | { status: "error"; message: string };

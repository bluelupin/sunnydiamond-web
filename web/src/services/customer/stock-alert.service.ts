import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { SUNNY_SUBSCRIBE_STOCK_ALERT_MUTATION } from "./customer.gql";

type SunnySubscribeStockAlertResponse = {
  sunnySubscribeStockAlert?: {
    success?: boolean | null;
    message?: string | null;
  } | null;
};

export type StockAlertOutcome =
  | { kind: "subscribed"; alreadySubscribed: boolean }
  | { kind: "unauthorized" }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

/** Raw Magento messages are not shopper-facing — always fall back to this copy. */
const FRIENDLY_FAILURE_MESSAGE = "We couldn't set up this alert. Please try again.";

/** Magento's unknown-field error when SunnyDiamonds_TransactionalEmail is not deployed. */
const UNKNOWN_FIELD_PATTERN = /Cannot query field "sunnySubscribeStockAlert"/i;

function mapStockAlertError(error: unknown): StockAlertOutcome {
  if (!(error instanceof MagentoGraphqlError)) {
    return { kind: "error", message: FRIENDLY_FAILURE_MESSAGE };
  }

  const category = error.errors[0]?.extensions?.category ?? "";

  // Expired or revoked customer token — the shopper has to sign in again.
  // Two shapes on Magento 2.4.9: a resolver-level GraphQlAuthorizationException
  // arrives as an HTTP-200 error entry (graphql-authorization), but an
  // invalid/expired Bearer token is rejected before query execution with
  // HTTP 401 (graphql-authentication) — and graphqlClient discards non-OK
  // bodies, so that common case is only visible in the thrown message's
  // status suffix (same fallback api/auth/me uses).
  if (
    category === "graphql-authorization" ||
    category === "graphql-authentication" ||
    /\(401\)$/.test(error.message)
  ) {
    return { kind: "unauthorized" };
  }

  // Schema not deployed yet, or the backend's back_in_stock flag is off. Only
  // these two mean "this store cannot take stock alerts", so the UI hides the
  // action. GraphQlInputException (graphql-input) also carries retryable
  // failures, so the category alone must NOT map here — that would
  // permanently hide the CTA over a transient save error.
  if (
    UNKNOWN_FIELD_PATTERN.test(error.message) ||
    (category === "graphql-input" && /not available/i.test(error.message))
  ) {
    return { kind: "unavailable" };
  }

  // The item restocked between page load and click (the backend refuses to
  // record an alert it would never send). Good news, not a failure — tell the
  // shopper to refresh rather than hiding the button or apologising.
  if (error.message.includes("PRODUCT_IN_STOCK")) {
    return {
      kind: "error",
      message: "Good news — this item is just back in stock. Refresh the page to add it to your bag.",
    };
  }

  // Everything else (e.g. a transient save failure) stays a retryable error.
  return { kind: "error", message: FRIENDLY_FAILURE_MESSAGE };
}

export async function subscribeCustomerToStockAlert(
  authToken: string,
  sku: string,
): Promise<StockAlertOutcome> {
  let data: SunnySubscribeStockAlertResponse;

  try {
    data = await magentoGraphqlFetch<SunnySubscribeStockAlertResponse>({
      query: SUNNY_SUBSCRIBE_STOCK_ALERT_MUTATION,
      variables: { sku },
      authToken,
      cache: "no-store",
    });
  } catch (error) {
    return mapStockAlertError(error);
  }

  const payload = data.sunnySubscribeStockAlert;
  if (!payload?.success) {
    return { kind: "error", message: FRIENDLY_FAILURE_MESSAGE };
  }

  return {
    kind: "subscribed",
    alreadySubscribed: payload.message?.trim().toUpperCase() === "ALREADY_SUBSCRIBED",
  };
}

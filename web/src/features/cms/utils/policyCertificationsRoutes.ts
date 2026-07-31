import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";

export const POLICY_QUERY_PARAM = "policy";

/**
 * Legacy footer / redirect slugs → current CMS policy slugs.
 * Keeps existing footer URLs working without changing UI.
 */
export const POLICY_ID_ALIASES: Record<string, string> = {
  "shipping-delivery": "shipping-and-delivery",
  "cash-on-delivery-policy": "cash-on-delivery",
};

/** Maps legacy legal footer paths to policy hub sidebar ids. */
export const LEGAL_FOOTER_PATH_TO_POLICY_ID: Record<string, string> = {
  "/returns-and-cancellations": "15-day-return-policy",
  "/exchange-and-resizing": "exchange-and-resizing",
  "/shipping-delivery": "shipping-and-delivery",
  "/cash-on-delivery-policy": "cash-on-delivery",
  "/privacy-policy": "privacy-policy",
  "/terms-and-conditions": "terms-and-conditions",
};

export function buildPolicyCertificationsHref(policyId: string): string {
  const resolved = resolvePolicyIdFromParam(policyId) ?? policyId;
  return `${POLICY_AND_CERTIFICATIONS_PATH}?${POLICY_QUERY_PARAM}=${encodeURIComponent(resolved)}`;
}

export function resolvePolicyIdFromParam(param: string | null | undefined): string | undefined {
  const normalized = param?.trim();
  if (!normalized) {
    return undefined;
  }

  return POLICY_ID_ALIASES[normalized] ?? normalized;
}

export function resolvePolicyIdFromFooterPath(path: string): string | undefined {
  const normalized = path.replace(/\/$/, "") || "/";
  const policyId = LEGAL_FOOTER_PATH_TO_POLICY_ID[normalized];
  if (!policyId) {
    return undefined;
  }

  return policyId;
}

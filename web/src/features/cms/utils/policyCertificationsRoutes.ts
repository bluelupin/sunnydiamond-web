import { POLICY_AND_CERTIFICATIONS_PATH } from "@/shared/utils/navigation";
import { getPolicyById } from "@/features/cms/data/policyCertificationsContent";

export const POLICY_QUERY_PARAM = "policy";

/** Maps legacy legal footer paths to policy hub sidebar ids. */
export const LEGAL_FOOTER_PATH_TO_POLICY_ID: Record<string, string> = {
  "/returns-and-cancellations": "15-day-return-policy",
  "/exchange-and-resizing": "exchange-and-resizing",
  "/shipping-delivery": "shipping-delivery",
  "/cash-on-delivery-policy": "cash-on-delivery-policy",
  "/privacy-policy": "privacy-policy",
  "/terms-and-conditions": "terms-and-conditions",
};

export function buildPolicyCertificationsHref(policyId: string): string {
  return `${POLICY_AND_CERTIFICATIONS_PATH}?${POLICY_QUERY_PARAM}=${encodeURIComponent(policyId)}`;
}

export function resolvePolicyIdFromParam(param: string | null | undefined): string | undefined {
  const normalized = param?.trim();
  if (!normalized) {
    return undefined;
  }

  return getPolicyById(normalized) ? normalized : undefined;
}

export function resolvePolicyIdFromFooterPath(path: string): string | undefined {
  const normalized = path.replace(/\/$/, "") || "/";
  const policyId = LEGAL_FOOTER_PATH_TO_POLICY_ID[normalized];
  if (!policyId) {
    return undefined;
  }

  return getPolicyById(policyId) ? policyId : undefined;
}

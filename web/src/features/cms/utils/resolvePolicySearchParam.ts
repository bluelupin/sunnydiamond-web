import {
  POLICY_QUERY_PARAM,
  resolvePolicyIdFromParam,
} from "@/features/cms/utils/policyCertificationsRoutes";

/** Reads `?policy=` from App Router searchParams (server-safe). */
export function resolvePolicyIdFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): string | undefined {
  const raw = searchParams[POLICY_QUERY_PARAM];
  if (typeof raw === "string") {
    return resolvePolicyIdFromParam(raw);
  }
  if (Array.isArray(raw) && raw[0]) {
    return resolvePolicyIdFromParam(raw[0]);
  }
  return undefined;
}

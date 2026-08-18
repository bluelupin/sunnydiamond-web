import { cache } from "react";
import { apiFetch, ApiError } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import {
  EMPTY_POLICY_CERTIFICATIONS_PAGE,
  mapPolicyCertificationsPage,
} from "./policy-certifications-page.mapper";
import type {
  NormalizedPolicyCertificationsPage,
  StrapiLegalPage,
  StrapiPolicyCertificationsPage,
} from "./policy-certifications-page.types";

const POLICY_LANDING_QUERY = "populate=*&locale=en";
const LEGAL_PAGES_QUERY = "populate=*&pagination[pageSize]=100";

/** Strapi answers these when a collection is absent, unpublished, or not public. */
function isMissingContent(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 403 || error.status === 404 || error.status === 400)
  );
}

async function softFetch<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T | null> {
  try {
    return await apiFetch<T>(endpoint, { signal });
  } catch (error) {
    if (isMissingContent(error)) {
      return null;
    }
    console.warn(`[policy] Failed to fetch ${endpoint}`, error);
    return null;
  }
}

async function fetchLegalPages(signal?: AbortSignal): Promise<StrapiLegalPage[]> {
  try {
    const data = await apiFetch<StrapiLegalPage[]>(
      `${STRAPI_ENDPOINTS.legalPages}?${LEGAL_PAGES_QUERY}`,
      { signal },
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Same rule as softFetch: Strapi answers 404 for a collection that was never
    // modelled, which is a content gap rather than a failure worth a line per
    // render. Strapi has no legal-page type today, so warning here wrote
    // thousands of identical lines and buried every real error in the log.
    if (isMissingContent(error)) return [];
    console.warn("[policy] Failed to fetch legal pages", error);
    return [];
  }
}

export const getPolicyCertificationsPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedPolicyCertificationsPage> => {
    const [landing, legalPages] = await Promise.all([
      softFetch<StrapiPolicyCertificationsPage>(
        `${STRAPI_ENDPOINTS.policyCertificationsPage}?${POLICY_LANDING_QUERY}`,
        signal,
      ),
      fetchLegalPages(signal),
    ]);

    return mapPolicyCertificationsPage({
      landing,
      legalPages,
    });
  },
);

export async function getLegalPageBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<StrapiLegalPage | null> {
  try {
    const data = await apiFetch<StrapiLegalPage[]>(
      `${STRAPI_ENDPOINTS.legalPages}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { signal },
    );
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0] ?? null;
  } catch (error) {
    console.warn(`[policy] Failed to fetch legal page slug=${slug}`, error);
    return null;
  }
}

export { EMPTY_POLICY_CERTIFICATIONS_PAGE };
export type { NormalizedPolicyCertificationsPage } from "./policy-certifications-page.types";

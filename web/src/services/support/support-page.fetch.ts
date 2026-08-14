import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapSupportPage } from "./support-page.mapper";
import {
  EMPTY_SUPPORT_PAGE,
  type NormalizedSupportPage,
  type StrapiSupportPage,
} from "./support-page.types";

/** Deep populate so contact options, FAQ items, and SEO media resolve. */
const SUPPORT_PAGE_POPULATE = "populate=*";

/** Client-safe Strapi fetch — same payload as `/faqs`. */
export async function fetchSupportPage(options?: {
  locale?: string;
  signal?: AbortSignal;
}): Promise<NormalizedSupportPage> {
  try {
    const params = new URLSearchParams(SUPPORT_PAGE_POPULATE);
    const locale = options?.locale?.trim();
    if (locale) {
      params.set("locale", locale);
    }

    const raw = await apiFetch<StrapiSupportPage>(
      `${STRAPI_ENDPOINTS.supportPage}?${params.toString()}`,
      { signal: options?.signal },
    );

    return mapSupportPage(raw);
  } catch {
    return EMPTY_SUPPORT_PAGE;
  }
}

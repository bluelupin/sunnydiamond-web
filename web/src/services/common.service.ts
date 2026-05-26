import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/api/queryBuilder";

const defaultPopulate = { populate: "*" };

export type GlobalSettingsResponse = unknown;
export type NavigationResponse = unknown;
export type FooterResponse = unknown;

export async function getGlobalSettings(): Promise<GlobalSettingsResponse> {
  const query = buildQueryString(defaultPopulate);
  return apiFetch<GlobalSettingsResponse>(`${STRAPI_ENDPOINTS.global}?${query}`);
}

export async function getNavigationContent(): Promise<NavigationResponse> {
  const query = buildQueryString(defaultPopulate);
  return apiFetch<NavigationResponse>(`${STRAPI_ENDPOINTS.navigation}?${query}`);
}

export async function getFooterContent(): Promise<FooterResponse> {
  const query = buildQueryString(defaultPopulate);
  return apiFetch<FooterResponse>(`${STRAPI_ENDPOINTS.footer}?${query}`);
}

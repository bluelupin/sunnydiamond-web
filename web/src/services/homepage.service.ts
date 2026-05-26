import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/api/queryBuilder";

const defaultPopulate = { populate: "*" };

export type HomepageResponse = Record<string, any>;

export async function getHomepageContent(): Promise<HomepageResponse> {
  return apiFetch<HomepageResponse>(STRAPI_ENDPOINTS.homepage, {
    params: defaultPopulate,
  });
}

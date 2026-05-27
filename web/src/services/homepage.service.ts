import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/api/queryBuilder";
import type { HomepageResponse } from "@/types/homepage";

export type { HomepageResponse, DiamondSourcingSectionData } from "@/types/homepage";

const defaultPopulate = { populate: "*" };

export async function getHomepageContent(): Promise<HomepageResponse> {
  return apiFetch<HomepageResponse>(STRAPI_ENDPOINTS.homepage, {
    params: defaultPopulate,
  });
}

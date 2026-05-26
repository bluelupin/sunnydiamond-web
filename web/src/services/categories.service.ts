import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/api/queryBuilder";

const defaultPopulate = { populate: "*" };

export type CategoryListResponse = unknown;
export type CategoryDetailResponse = unknown;

export async function getCategoryList(): Promise<CategoryListResponse> {
  const query = buildQueryString(defaultPopulate);
  return apiFetch<CategoryListResponse>(`${STRAPI_ENDPOINTS.categories}?${query}`);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDetailResponse> {
  const query = buildQueryString({
    ...defaultPopulate,
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });

  return apiFetch<CategoryDetailResponse>(`${STRAPI_ENDPOINTS.categories}?${query}`);
}

export async function getProductsByCategorySlug(slug: string): Promise<CategoryDetailResponse> {
  const query = buildQueryString({
    ...defaultPopulate,
    filters: {
      category: {
        slug: {
          $eq: slug,
        },
      },
    },
  });

  return apiFetch<CategoryDetailResponse>(`${STRAPI_ENDPOINTS.products}?${query}`);
}

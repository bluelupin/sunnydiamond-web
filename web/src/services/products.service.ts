import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/api/queryBuilder";

const defaultPopulate = { populate: "*" };

export type ProductListResponse = unknown;
export type ProductDetailResponse = unknown;

export async function getProductList(params?: Record<string, unknown>): Promise<ProductListResponse> {
  const query = buildQueryString({ ...defaultPopulate, ...params });
  return apiFetch<ProductListResponse>(`${STRAPI_ENDPOINTS.products}?${query}`);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailResponse> {
  const query = buildQueryString({
    ...defaultPopulate,
    filters: {
      slug: {
        $eq: slug,
      },
    },
  });

  return apiFetch<ProductDetailResponse>(`${STRAPI_ENDPOINTS.products}?${query}`);
}

export async function getProductById(id: string | number): Promise<ProductDetailResponse> {
  const query = buildQueryString(defaultPopulate);
  return apiFetch<ProductDetailResponse>(`${STRAPI_ENDPOINTS.productById(id)}?${query}`);
}

export async function getFeaturedProducts(): Promise<ProductListResponse> {
  const query = buildQueryString({
    ...defaultPopulate,
    filters: {
      featured: {
        $eq: true,
      },
    },
  });

  return apiFetch<ProductListResponse>(`${STRAPI_ENDPOINTS.products}?${query}`);
}

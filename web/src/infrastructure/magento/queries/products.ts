import { magentoFetch } from "../client";
import type { ProductsQueryResponse, ProductDetailQueryResponse } from "../types";

// GraphQL fragment to keep product queries DRY
export const PRODUCT_INTERFACE_FRAGMENT = `
  fragment ProductFields on ProductInterface {
    uid
    id
    sku
    name
    description {
      html
    }
    short_description {
      html
    }
    image {
      url
      label
    }
    media_gallery {
      url
      label
    }
    price_range {
      minimum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
      }
    }
    stock_status
    categories {
      uid
      name
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  query GetProducts($search: String, $filter: ProductAttributeFilterInput, $pageSize: Int, $currentPage: Int) {
    products(search: $search, filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
      total_count
      items {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_INTERFACE_FRAGMENT}
`;

export const GET_PRODUCT_DETAIL_QUERY = `
  query GetProductDetail($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_INTERFACE_FRAGMENT}
`;

export async function fetchProducts(variables: {
  search?: string;
  filter?: Record<string, unknown>;
  pageSize?: number;
  currentPage?: number;
}) {
  return magentoFetch<ProductsQueryResponse>({
    query: GET_PRODUCTS_QUERY,
    variables,
  });
}

export async function fetchProductDetail(sku: string) {
  return magentoFetch<ProductDetailQueryResponse>({
    query: GET_PRODUCT_DETAIL_QUERY,
    variables: { sku },
  });
}

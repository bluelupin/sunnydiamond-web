import { MAGENTO_PLP_PRODUCT_FIELDS } from "./plpProductFields.fragment";

const MAGENTO_PRODUCT_AGGREGATIONS_FIELDS = `
  aggregations {
    attribute_code
    label
    count
    options {
      label
      value
      count
    }
  }
` as const;

/** Product page data only — no aggregations (facets use a separate query). */
export const MAGENTO_JEWELLERY_PRODUCTS_QUERY = `
  query JewelleryProducts(
    $search: String!
    $filter: ProductAttributeFilterInput
    $pageSize: Int!
    $currentPage: Int!
    $sort: ProductAttributeSortInput
  ) {
    products(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
      items {
        ${MAGENTO_PLP_PRODUCT_FIELDS}
      }
    }
  }
` as const;

/** Filter facet options scoped to the active PLP category tab. */
export const MAGENTO_JEWELLERY_PRODUCT_FACETS_QUERY = `
  query JewelleryProductFacets(
    $search: String!
    $filter: ProductAttributeFilterInput
    $sort: ProductAttributeSortInput
  ) {
    products(
      search: $search
      filter: $filter
      pageSize: 1
      currentPage: 1
      sort: $sort
    ) {
      ${MAGENTO_PRODUCT_AGGREGATIONS_FIELDS}
    }
  }
` as const;

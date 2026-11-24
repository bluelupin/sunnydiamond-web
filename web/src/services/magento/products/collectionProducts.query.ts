import { MAGENTO_PLP_PRODUCT_FIELDS } from "./plpProductFields.fragment";

export const MAGENTO_COLLECTION_PRODUCTS_FILTER_QUERY = `
  query MagentoCollectionProductsFilter(
    $filter: ProductAttributeFilterInput!
    $pageSize: Int!
  ) {
    products(filter: $filter, pageSize: $pageSize) {
      items {
        ${MAGENTO_PLP_PRODUCT_FIELDS}
      }
    }
  }
` as const;

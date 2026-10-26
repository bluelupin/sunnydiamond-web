import { MAGENTO_PLP_PRODUCT_FIELDS } from "./plpProductFields.fragment";

/** Wishlist cards use the same configurable-variant price and image as PLP cards. */
export const MAGENTO_PRODUCTS_BY_SKUS_QUERY = `
  query MagentoProductsBySkus($filter: ProductAttributeFilterInput!, $pageSize: Int!) {
    products(filter: $filter, pageSize: $pageSize) {
      items {
        ${MAGENTO_PLP_PRODUCT_FIELDS}
        uid
        small_image { url }
        thumbnail { url }
      }
    }
  }
` as const;

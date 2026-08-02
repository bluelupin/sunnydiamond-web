import { MAGENTO_MORE_FOR_YOU_PRODUCT_FIELDS } from "./moreForYouProductFields.fragment";

export const MAGENTO_MORE_FOR_YOU_CATEGORY_FALLBACK_QUERY = `
  query MoreForYouCategoryFallback($categoryId: String!, $pageSize: Int!) {
    products(
      filter: { category_id: { eq: $categoryId } }
      pageSize: $pageSize
      sort: { position: ASC }
    ) {
      items {
        ${MAGENTO_MORE_FOR_YOU_PRODUCT_FIELDS}
      }
    }
  }
` as const;

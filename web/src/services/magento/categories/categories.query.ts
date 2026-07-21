/** Level-2 jewellery categories for header mega menu (children of root). */
export const MAGENTO_JEWELLERY_NAV_CATEGORIES_QUERY = `
  query JewelleryNavCategories {
    categoryList {
      id
      uid
      name
      url_path
      url_key
      level
      product_count
      image
      children {
        id
        uid
        name
        url_path
        url_key
        level
        product_count
        image
      }
    }
  }
` as const;

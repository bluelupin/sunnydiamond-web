export const CRAFTING_RARITY_CATEGORY_PRODUCTS_QUERY = `
  query CraftingRarityCategoryProducts(
    $ringsFilter: ProductAttributeFilterInput!
    $earringsFilter: ProductAttributeFilterInput!
    $braceletsFilter: ProductAttributeFilterInput!
    $necklaceFilter: ProductAttributeFilterInput!
  ) {
    rings: products(
      search: ""
      filter: $ringsFilter
      pageSize: 12
      currentPage: 1
      sort: { position: ASC }
    ) {
      items {
        sku
        image {
          url
        }
        media_gallery {
          url
          position
          disabled
        }
      }
    }
    earrings: products(
      search: ""
      filter: $earringsFilter
      pageSize: 12
      currentPage: 1
      sort: { position: ASC }
    ) {
      items {
        sku
        image {
          url
        }
        media_gallery {
          url
          position
          disabled
        }
      }
    }
    bracelets: products(
      search: ""
      filter: $braceletsFilter
      pageSize: 12
      currentPage: 1
      sort: { position: ASC }
    ) {
      items {
        sku
        image {
          url
        }
        media_gallery {
          url
          position
          disabled
        }
      }
    }
    necklace: products(
      search: ""
      filter: $necklaceFilter
      pageSize: 12
      currentPage: 1
      sort: { position: ASC }
    ) {
      items {
        sku
        image {
          url
        }
        media_gallery {
          url
          position
          disabled
        }
      }
    }
  }
` as const;

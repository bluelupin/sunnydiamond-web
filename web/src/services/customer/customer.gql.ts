export const MAGENTO_GENERATE_CUSTOMER_TOKEN_MUTATION = `
  mutation MagentoGenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
` as const;

export const MAGENTO_CREATE_CUSTOMER_MUTATION = `
  mutation MagentoCreateCustomer($input: CustomerCreateInput!) {
    createCustomerV2(input: $input) {
      customer {
        email
      }
    }
  }
` as const;

export const MAGENTO_REVOKE_CUSTOMER_TOKEN_MUTATION = `
  mutation MagentoRevokeCustomerToken {
    revokeCustomerToken {
      result
    }
  }
` as const;

export const MAGENTO_CUSTOMER_ME_QUERY = `
  query MagentoCustomerMe {
    customer {
      firstname
      lastname
      email
    }
  }
` as const;

export const MAGENTO_CUSTOMER_CART_QUERY = `
  query MagentoCustomerCart {
    customerCart {
      id
    }
  }
` as const;

export const MAGENTO_MERGE_CARTS_MUTATION = `
  mutation MagentoMergeCarts($sourceCartId: String!, $destinationCartId: String!) {
    mergeCarts(source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
      id
    }
  }
` as const;

export const MAGENTO_CUSTOMER_WISHLIST_IDS_QUERY = `
  query MagentoCustomerWishlistIds {
    customer {
      wishlists {
        id
      }
    }
  }
` as const;

export const MAGENTO_ADD_PRODUCTS_TO_WISHLIST_MUTATION = `
  mutation MagentoAddProductsToWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemInput!]!) {
    addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
      wishlist {
        id
        items_count
      }
      user_errors {
        code
        message
      }
    }
  }
` as const;

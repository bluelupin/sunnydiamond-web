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
        id
        email
        firstname
        lastname
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

export const MAGENTO_CUSTOMER_ORDERS_QUERY = `
  query MagentoCustomerOrders($pageSize: Int!, $currentPage: Int!) {
    customer {
      orders(pageSize: $pageSize, currentPage: $currentPage) {
        total_count
        page_info {
          current_page
          page_size
          total_pages
        }
        items {
          id
          number
          order_date
          status
          items {
            product_name
            quantity_ordered
            product_url_key
            product_sku
          }
          total {
            grand_total {
              value
              currency
            }
          }
        }
      }
    }
  }
` as const;

export const MAGENTO_CUSTOMER_ADDRESSES_QUERY = `
  query MagentoCustomerAddresses {
    customer {
      addresses {
        uid
        firstname
        lastname
        street
        city
        region {
          region
          region_code
          region_id
        }
        postcode
        country_code
        telephone
        default_shipping
        default_billing
      }
    }
  }
` as const;

const CUSTOMER_ADDRESS_FIELDS = `
  uid
  firstname
  lastname
  street
  city
  region {
    region
    region_code
    region_id
  }
  postcode
  country_code
  telephone
  default_shipping
  default_billing
`;

export const MAGENTO_CREATE_CUSTOMER_ADDRESS_MUTATION = `
  mutation MagentoCreateCustomerAddress($input: CustomerAddressInput!) {
    createCustomerAddress(input: $input) {
      ${CUSTOMER_ADDRESS_FIELDS}
    }
  }
` as const;

export const MAGENTO_UPDATE_CUSTOMER_ADDRESS_MUTATION = `
  mutation MagentoUpdateCustomerAddressV2($uid: ID!, $input: CustomerAddressInput!) {
    updateCustomerAddressV2(uid: $uid, input: $input) {
      ${CUSTOMER_ADDRESS_FIELDS}
    }
  }
` as const;

export const MAGENTO_DELETE_CUSTOMER_ADDRESS_MUTATION = `
  mutation MagentoDeleteCustomerAddressV2($uid: ID!) {
    deleteCustomerAddressV2(uid: $uid)
  }
` as const;

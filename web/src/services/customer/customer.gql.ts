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
      id
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

export const MAGENTO_CUSTOMER_WISHLIST_QUERY = `
  query MagentoCustomerWishlist($pageSize: Int!, $currentPage: Int!) {
    customer {
      wishlists {
        id
        items_count
        items_v2(pageSize: $pageSize, currentPage: $currentPage) {
          items {
            id
            product {
              sku
            }
          }
          page_info {
            current_page
            total_pages
          }
        }
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

export const MAGENTO_REMOVE_PRODUCTS_FROM_WISHLIST_MUTATION = `
  mutation MagentoRemoveProductsFromWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
    removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsIds) {
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

/**
 * The `sunny_*` order fields only exist once SunnyDiamonds_OrderFlow is deployed, and
 * GraphQL hard-fails on unknown fields — so the fragments below collapse to empty
 * strings until `MAGENTO_ORDER_FLOW_FIELDS=true`. The flag is intentionally not
 * `NEXT_PUBLIC_`: every document that interpolates these fragments is executed
 * server-side only (customer order services called from `/api` route handlers).
 */
const ORDER_FLOW_FIELDS_ENABLED = process.env.MAGENTO_ORDER_FLOW_FIELDS === "true";

const SUNNY_REFUND_STATUS_FIELDS = `
  type
  steps {
    code
    label
    state
    timestamp
  }
  refund_amount {
    value
    currency
  }
  refund_mode
  estimated_completion_date
  estimated_window_label
`;

const SUNNY_ORDER_STATUS_FIELDS = ORDER_FLOW_FIELDS_ENABLED
  ? `
  sunny_status
  sunny_actions {
    can_track
    can_cancel
    can_return
    can_download_invoice
    can_contact_support
  }
  sunny_delivery {
    estimated_delivery_at
    delivered_at
    returnable_till
  }
  sunny_refund {
    ${SUNNY_REFUND_STATUS_FIELDS}
  }
  gift_mode
`
  : "";

const SUNNY_ORDER_TRACKING_FIELDS = ORDER_FLOW_FIELDS_ENABLED
  ? `
  sunny_tracking {
    current_step
    steps {
      code
      label
      state
      timestamp
      description
    }
  }
`
  : "";

const SUNNY_ORDER_ITEM_FIELDS = ORDER_FLOW_FIELDS_ENABLED
  ? `
  is_gift
  sunny_tag
  gift_message {
    message
  }
  product {
    thumbnail {
      url
    }
  }
`
  : "";

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
          comments {
            message
          }
          items {
            product_name
            quantity_ordered
            product_url_key
            product_sku
            selected_options {
              label
              value
            }
            entered_options {
              label
              value
            }
            ${SUNNY_ORDER_ITEM_FIELDS}
          }
          total {
            grand_total {
              value
              currency
            }
          }
          ${SUNNY_ORDER_STATUS_FIELDS}
          ${SUNNY_ORDER_TRACKING_FIELDS}
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

const ORDER_DETAIL_FIELDS = `
  id
  number
  order_date
  status
  carrier
  shipping_method
  comments {
    message
    timestamp
  }
  items {
    product_name
    quantity_ordered
    product_url_key
    product_sku
    product_sale_price {
      value
      currency
    }
    selected_options {
      label
      value
    }
    entered_options {
      label
      value
    }
    ${SUNNY_ORDER_ITEM_FIELDS}
  }
  total {
    grand_total {
      value
      currency
    }
    subtotal_incl_tax {
      value
      currency
    }
    total_tax {
      value
      currency
    }
    total_shipping {
      value
      currency
    }
    discounts {
      label
      amount {
        value
        currency
      }
    }
  }
  payment_methods {
    name
    type
    additional_data {
      name
      value
    }
  }
  shipping_address {
    firstname
    lastname
    street
    city
    region
    postcode
    telephone
  }
  billing_address {
    firstname
    lastname
    street
    city
    region
    postcode
    telephone
  }
  shipments {
    number
    tracking {
      title
      number
      carrier
    }
  }
  ${SUNNY_ORDER_STATUS_FIELDS}
  ${SUNNY_ORDER_TRACKING_FIELDS}
`;

export const MAGENTO_CUSTOMER_ORDER_BY_NUMBER_QUERY = `
  query MagentoCustomerOrderByNumber($filter: CustomerOrdersFilterInput!) {
    customer {
      orders(filter: $filter, pageSize: 1, currentPage: 1) {
        items {
          ${ORDER_DETAIL_FIELDS}
        }
      }
    }
  }
` as const;

export const MAGENTO_GUEST_ORDER_QUERY = `
  query MagentoGuestOrder($input: GuestOrderInformationInput!) {
    guestOrder(input: $input) {
      ${ORDER_DETAIL_FIELDS}
    }
  }
` as const;

/**
 * Order-flow mutations and the invoice query are never gated: they are only ever sent
 * when the customer triggers the feature, which cannot happen before the module ships.
 */
export const SUNNY_CANCEL_ORDER_MUTATION = `
  mutation SunnyCancelOrder($input: SunnyCancelOrderInput!) {
    sunnyCancelOrder(input: $input) {
      order {
        ${ORDER_DETAIL_FIELDS}
      }
      refund {
        ${SUNNY_REFUND_STATUS_FIELDS}
      }
    }
  }
` as const;

export const SUNNY_REQUEST_RETURN_MUTATION = `
  mutation SunnyRequestOrderReturn($input: SunnyRequestReturnInput!) {
    requestSunnyOrderReturn(input: $input) {
      order {
        ${ORDER_DETAIL_FIELDS}
      }
      return_details {
        state
        reason
        comment
        requested_at
      }
      refund {
        ${SUNNY_REFUND_STATUS_FIELDS}
      }
    }
  }
` as const;

export const SUNNY_ORDER_REASONS_QUERY = `
  query SunnyOrderReasons {
    sunnyOrderCancellationReasons {
      code
      label
      requires_comment
    }
    sunnyOrderReturnReasons {
      code
      label
      requires_comment
    }
  }
` as const;

export const SUNNY_INVOICE_PDF_QUERY = `
  query SunnyInvoicePdf($orderUid: ID!) {
    sunnyInvoicePdf(order_uid: $orderUid) {
      url
      expires_at
    }
  }
` as const;

export const SUNNY_DELETE_CUSTOMER_MUTATION = `
  mutation SunnyDeleteCustomer($input: SunnyDeleteCustomerInput) {
    sunnyDeleteCustomer(input: $input) {
      success
    }
  }
` as const;

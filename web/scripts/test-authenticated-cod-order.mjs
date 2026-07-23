#!/usr/bin/env node

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL ||
  "https://sunnydiamond-store-dev.on-forge.com/graphql";

const STORE = process.env.NEXT_PUBLIC_MAGENTO_STORE_CODE || "default";

const EMAIL = process.argv[2] || process.env.TEST_CUSTOMER_EMAIL;
const PASSWORD = process.argv[3] || process.env.TEST_CUSTOMER_PASSWORD;
const RING_SIZE = process.env.TEST_RING_SIZE || "12";
const ENGRAVING = process.env.TEST_ENGRAVING || "Forever";
const ENGRAVING_FONT = process.env.TEST_ENGRAVING_FONT || "Script";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http://localhost")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "http://localhost:3000";

if (!EMAIL || !PASSWORD) {
  console.error("Usage: node scripts/test-authenticated-cod-order.mjs <email> <password>");
  process.exit(1);
}

async function gql(query, variables = {}, token = null) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Store: STORE,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(json)}`);
  }

  if (json.errors?.length) {
    const message = json.errors.map((error) => error.message).join("; ");
    throw new Error(message);
  }

  return json.data;
}

function log(step, payload) {
  console.log(`\n=== ${step} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

async function main() {
  const tokenData = await gql(
    `
      mutation Login($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
          token
        }
      }
    `,
    { email: EMAIL, password: PASSWORD },
  );

  const token = tokenData.generateCustomerToken?.token;
  if (!token) {
    throw new Error("Login failed — no customer token returned");
  }

  log("1. Login", { email: EMAIL, tokenReceived: Boolean(token) });

  const me = await gql(
    `
      query CustomerMe {
        customer {
          firstname
          lastname
          email
          addresses {
            uid
            firstname
            lastname
            default_shipping
            city
            postcode
          }
        }
      }
    `,
    {},
    token,
  );

  const customer = me.customer;
  if (!customer?.email) {
    throw new Error("Authenticated customer profile not found");
  }

  log("2. Customer profile", {
    name: [customer.firstname, customer.lastname].filter(Boolean).join(" "),
    email: customer.email,
    addressCount: customer.addresses?.length ?? 0,
  });

  const cartData = await gql(
    `
      query CustomerCart {
        customerCart {
          id
          total_quantity
        }
      }
    `,
    {},
    token,
  );

  const cartId = cartData.customerCart?.id;
  if (!cartId) {
    throw new Error("No customer cart returned");
  }

  log("3. Customer cart", { cartId, totalQuantity: cartData.customerCart?.total_quantity ?? 0 });

  const products = await gql(
    `
      query Products {
        products(search: "", pageSize: 20) {
          items {
            sku
            name
            stock_status
          }
        }
      }
    `,
    {},
    token,
  );

  const sku =
    products.products?.items?.find((item) => item?.sku && item.stock_status === "IN_STOCK")?.sku ||
    products.products?.items?.[0]?.sku;

  if (!sku) {
    throw new Error("No in-stock product found");
  }

  const added = await gql(
    `
      mutation AddToCart($cartId: String!, $sku: String!) {
        addSimpleProductsToCart(
          input: {
            cart_id: $cartId
            cart_items: [{ data: { quantity: 1, sku: $sku } }]
          }
        ) {
          cart {
            total_quantity
            prices {
              grand_total {
                value
                currency
              }
            }
          }
        }
      }
    `,
    { cartId, sku },
    token,
  );

  log("4. Add to cart", { sku, cart: added.addSimpleProductsToCart?.cart });

  const cartItemsData = await gql(
    `
      query CartItems($cartId: String!) {
        cart(cart_id: $cartId) {
          itemsV2 {
            items {
              uid
              quantity
              product {
                sku
                name
              }
            }
          }
        }
      }
    `,
    { cartId },
    token,
  );

  const cartItem = cartItemsData.cart?.itemsV2?.items?.find((item) => item?.product?.sku === sku);
  const cartItemUid = cartItem?.uid;
  const productName = cartItem?.product?.name ?? sku;

  log("4b. Cart line", { cartItemUid, productName, ringSize: RING_SIZE, engraving: ENGRAVING });

  const productOptionsData = await gql(
    `
      query ProductOptions($sku: String!) {
        products(filter: { sku: { eq: $sku } }) {
          items {
            sku
            ... on CustomizableProductInterface {
              options {
                title
                uid
                __typename
                ... on CustomizableFieldOption {
                  title
                  uid
                }
                ... on CustomizableDropDownOption {
                  title
                  uid
                  value {
                    title
                    uid
                  }
                }
                ... on CustomizableRadioOption {
                  title
                  uid
                  value {
                    title
                    uid
                  }
                }
              }
            }
          }
        }
      }
    `,
    { sku },
    token,
  );

  const magentoOptions = productOptionsData.products?.items?.[0]?.options ?? [];
  const customizablePayload = [];

  for (const option of magentoOptions) {
    const title = option.title?.toLowerCase() ?? "";
    if (title.includes("engrav") && option.__typename === "CustomizableFieldOption" && option.uid) {
      customizablePayload.push({ uid: option.uid, value_string: ENGRAVING });
      continue;
    }

    const values = option.value ?? [];
    if (title.includes("font")) {
      const match = values.find((entry) => entry.title?.toLowerCase().includes(ENGRAVING_FONT.toLowerCase()));
      if (match?.uid && option.uid) {
        customizablePayload.push({ uid: option.uid, value_string: match.title });
      }
      continue;
    }

    if (title.includes("size")) {
      const match = values.find((entry) => entry.title === RING_SIZE);
      if (match?.uid && option.uid) {
        customizablePayload.push({ uid: option.uid, value_string: match.title });
      }
    }
  }

  if (cartItemUid && customizablePayload.length > 0) {
    await gql(
      `
        mutation SyncCartOptions($cartId: String!, $cartItems: [CartItemUpdateInput!]!) {
          updateCartItems(input: { cart_id: $cartId, cart_items: $cartItems }) {
            cart {
              id
            }
          }
        }
      `,
      {
        cartId,
        cartItems: [
          {
            cart_item_uid: cartItemUid,
            quantity: 1,
            customizable_options: customizablePayload,
          },
        ],
      },
      token,
    );

    log("4c. Synced Magento customizable options", customizablePayload);
  } else {
    log("4c. Magento customizable options", {
      synced: false,
      reason: magentoOptions.length === 0 ? "product_has_no_magento_options" : "missing_option_uids",
      note: "Ring size/engraving will be attached as order comment after placement",
    });
  }

  const defaultAddress =
    customer.addresses?.find((address) => address.default_shipping) || customer.addresses?.[0];

  let shipping;

  if (defaultAddress?.uid) {
    shipping = await gql(
      `
        mutation SetSavedShipping($cartId: String!, $uid: ID!) {
          setShippingAddressesOnCart(
            input: {
              cart_id: $cartId
              shipping_addresses: [{ customer_address_uid: $uid }]
            }
          ) {
            cart {
              shipping_addresses {
                available_shipping_methods {
                  carrier_code
                  method_code
                  method_title
                  amount {
                    value
                  }
                }
              }
            }
          }
        }
      `,
      { cartId, uid: defaultAddress.uid },
      token,
    );

    log("5. Shipping address (saved)", { uid: defaultAddress.uid, city: defaultAddress.city });
  } else {
    shipping = await gql(
      `
        mutation SetManualShipping($cartId: String!) {
          setShippingAddressesOnCart(
            input: {
              cart_id: $cartId
              shipping_addresses: [
                {
                  address: {
                    firstname: "Archie"
                    lastname: "Test"
                    street: ["12 MG Road"]
                    city: "Kochi"
                    postcode: "682001"
                    country_code: "IN"
                    region_id: 586
                    telephone: "9876543210"
                  }
                }
              ]
            }
          ) {
            cart {
              shipping_addresses {
                available_shipping_methods {
                  carrier_code
                  method_code
                  method_title
                  amount {
                    value
                  }
                }
              }
            }
          }
        }
      `,
      { cartId },
      token,
    );

    log("5. Shipping address (manual)", { city: "Kochi" });
  }

  const shippingMethods =
    shipping.setShippingAddressesOnCart?.cart?.shipping_addresses?.[0]
      ?.available_shipping_methods ?? [];

  await gql(
    `
      mutation SetBilling($cartId: String!) {
        setBillingAddressOnCart(
          input: { cart_id: $cartId, billing_address: { same_as_shipping: true } }
        ) {
          cart {
            id
          }
        }
      }
    `,
    { cartId },
    token,
  );

  const firstShipping = shippingMethods[0];
  if (!firstShipping?.carrier_code || !firstShipping?.method_code) {
    throw new Error("No shipping methods available");
  }

  const shippingSet = await gql(
    `
      mutation SetShippingMethod($cartId: String!, $carrier: String!, $method: String!) {
        setShippingMethodsOnCart(
          input: {
            cart_id: $cartId
            shipping_methods: [{ carrier_code: $carrier, method_code: $method }]
          }
        ) {
          cart {
            prices {
              grand_total {
                value
                currency
              }
            }
          }
        }
      }
    `,
    {
      cartId,
      carrier: firstShipping.carrier_code,
      method: firstShipping.method_code,
    },
    token,
  );

  log("6. Shipping method", {
    method: firstShipping.method_title,
    grandTotal: shippingSet.setShippingMethodsOnCart?.cart?.prices?.grand_total,
  });

  const cartBeforePayment = await gql(
    `
      query CartPayments($cartId: String!) {
        cart(cart_id: $cartId) {
          available_payment_methods {
            code
            title
          }
        }
      }
    `,
    { cartId },
    token,
  );

  const paymentMethods = cartBeforePayment.cart?.available_payment_methods ?? [];
  const codPreferences = ["cashondelivery", "cod", "checkmo", "free"];
  const availableCodes = new Set(paymentMethods.map((method) => method.code));
  const paymentCode =
    codPreferences.find((code) => availableCodes.has(code)) || paymentMethods[0]?.code;

  if (!paymentCode) {
    throw new Error("No payment method available");
  }

  await gql(
    `
      mutation SetPayment($cartId: String!, $code: String!) {
        setPaymentMethodOnCart(
          input: { cart_id: $cartId, payment_method: { code: $code } }
        ) {
          cart {
            selected_payment_method {
              code
            }
            prices {
              grand_total {
                value
                currency
              }
            }
          }
        }
      }
    `,
    { cartId, code: paymentCode },
    token,
  );

  log("7. Payment method", { paymentCode });

  const placed = await gql(
    `
      mutation PlaceOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) {
          orderV2 {
            id
            number
            status
          }
          errors {
            message
            code
          }
        }
      }
    `,
    { cartId },
    token,
  );

  const order = placed.placeOrder?.orderV2;
  const placeErrors = placed.placeOrder?.errors ?? [];

  if (placeErrors.length > 0) {
    throw new Error(placeErrors.map((error) => error.message).join("; "));
  }

  if (!order?.number) {
    throw new Error("placeOrder succeeded but no order number returned");
  }

  log("8. Order placed", {
    orderNumber: order.number,
    orderId: order.id,
    status: order.status,
    paymentCode,
    sku,
    ringSize: RING_SIZE,
    engraving: ENGRAVING,
  });

  const lineMetadataItem = {
    id: cartItemUid ?? sku,
    quantity: 1,
    product: {
      id: sku,
      name: productName,
      price: added.addSimpleProductsToCart?.cart?.prices?.grand_total?.value ?? 0,
      image: "",
      href: `/product/${sku}`,
    },
    options: {
      ringSize: RING_SIZE,
      engraving: ENGRAVING,
      engravingFont: ENGRAVING_FONT,
    },
  };

  try {
    const metadataResponse = await fetch(`${SITE_URL}/api/magento/orders/line-metadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: order.number,
        items: [lineMetadataItem],
      }),
    });

    const metadataJson = await metadataResponse.json();
    log("8b. Line metadata", {
      status: metadataResponse.status,
      ...metadataJson,
    });
  } catch (metadataError) {
    log("8b. Line metadata", {
      attached: false,
      reason: metadataError instanceof Error ? metadataError.message : "request_failed",
    });
  }

  const orders = await gql(
    `
      query CustomerOrders {
        customer {
          orders(pageSize: 5, currentPage: 1, sort: { sort_direction: DESC, sort_field: CREATED_AT }) {
            items {
              number
              status
              order_date
            }
          }
        }
      }
    `,
    {},
    token,
  );

  const recentOrders = orders.customer?.orders?.items ?? [];
  const found = recentOrders.some((entry) => entry.number === order.number);

  log("9. Profile orders check", {
    foundInCustomerOrders: found,
    recentOrderNumbers: recentOrders.map((entry) => entry.number),
  });

  if (!found) {
    throw new Error(`Order #${order.number} was placed but not found in customer.orders`);
  }

  console.log("\n✅ Authenticated COD checkout completed successfully");
  console.log(`Order #${order.number} is linked to ${EMAIL}`);
  console.log(`Ring size: ${RING_SIZE}, Engraving: ${ENGRAVING} (${ENGRAVING_FONT})`);
  console.log("View in storefront: /profile?section=orders");
  console.log(`Order detail: /profile/orders/${encodeURIComponent(order.number)}`);
  console.log(`Track: /order-tracking?order=${encodeURIComponent(order.number)}`);
}

main().catch((error) => {
  console.error("\n❌ Authenticated checkout test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

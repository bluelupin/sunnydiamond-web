#!/usr/bin/env node

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL ||
  "https://sunnydiamond-store-dev.on-forge.com/graphql";

async function gql(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Store: process.env.NEXT_PUBLIC_MAGENTO_STORE_CODE || "default",
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

const steps = [];

function log(step, payload) {
  steps.push({ step, ...payload });
  console.log(`\n=== ${step} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

async function main() {
  const products = await gql(`
    query TestGuestCheckoutProducts {
      products(search: "", pageSize: 20) {
        items {
          sku
          name
          stock_status
        }
      }
    }
  `);

  const sku =
    products.products?.items?.find((item) => item?.sku && item.stock_status === "IN_STOCK")
      ?.sku || products.products?.items?.[0]?.sku;

  if (!sku) {
    throw new Error("No product SKU found for checkout test");
  }

  log("1. Product", { sku });

  const created = await gql(`
    mutation TestCreateGuestCart {
      createGuestCart {
        cart {
          id
        }
      }
    }
  `);

  const cartId = created.createGuestCart?.cart?.id;
  if (!cartId) {
    throw new Error("Failed to create guest cart");
  }

  log("2. Guest cart", { cartId });

  const added = await gql(
    `
      mutation TestAddToCart($cartId: String!, $sku: String!) {
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
  );

  log("3. Add to cart", added.addSimpleProductsToCart?.cart);

  await gql(
    `
      mutation TestSetGuestEmail($cartId: String!, $email: String!) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email }) {
          cart {
            id
            email
          }
        }
      }
    `,
    { cartId, email: "guest.cod.test@sunnydiamond.com" },
  );

  log("4. Guest email", { email: "guest.cod.test@sunnydiamond.com" });

  const shipping = await gql(
    `
      mutation TestSetShippingAddress($cartId: String!) {
        setShippingAddressesOnCart(
          input: {
            cart_id: $cartId
            shipping_addresses: [
              {
                address: {
                  firstname: "Test"
                  lastname: "Guest"
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
  );

  const shippingMethods =
    shipping.setShippingAddressesOnCart?.cart?.shipping_addresses?.[0]
      ?.available_shipping_methods ?? [];

  log("5. Shipping address", { shippingMethods });

  const billing = await gql(
    `
      mutation TestSetBillingAddress($cartId: String!) {
        setBillingAddressOnCart(
          input: {
            cart_id: $cartId
            billing_address: { same_as_shipping: true }
          }
        ) {
          cart {
            id
          }
        }
      }
    `,
    { cartId },
  );

  log("6. Billing address", billing.setBillingAddressOnCart);

  const firstShipping = shippingMethods[0];
  if (!firstShipping?.carrier_code || !firstShipping?.method_code) {
    throw new Error("No shipping methods available after setting address");
  }

  const shippingSet = await gql(
    `
      mutation TestSetShippingMethod($cartId: String!, $carrier: String!, $method: String!) {
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
  );

  log("7. Shipping method", shippingSet.setShippingMethodsOnCart?.cart?.prices);

  const cartBeforePayment = await gql(
    `
      query TestCartPaymentMethods($cartId: String!) {
        cart(cart_id: $cartId) {
          available_payment_methods {
            code
            title
          }
          prices {
            grand_total {
              value
              currency
            }
          }
        }
      }
    `,
    { cartId },
  );

  const paymentMethods = cartBeforePayment.cart?.available_payment_methods ?? [];
  log("8. Payment methods", paymentMethods);

  const codPreferences = ["cashondelivery", "cod", "checkmo", "free"];
  const availableCodes = new Set(paymentMethods.map((method) => method.code));
  const paymentCode =
    codPreferences.find((code) => availableCodes.has(code)) ||
    paymentMethods[0]?.code;

  if (!paymentCode) {
    throw new Error("No payment method available on cart");
  }

  const paymentSet = await gql(
    `
      mutation TestSetPaymentMethod($cartId: String!, $code: String!) {
        setPaymentMethodOnCart(
          input: { cart_id: $cartId, payment_method: { code: $code } }
        ) {
          cart {
            selected_payment_method {
              code
              title
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
  );

  log("9. Payment method", {
    paymentCode,
    selected: paymentSet.setPaymentMethodOnCart?.cart?.selected_payment_method,
    grandTotal: paymentSet.setPaymentMethodOnCart?.cart?.prices?.grand_total,
  });

  const placed = await gql(
    `
      mutation TestPlaceOrder($cartId: String!) {
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
  );

  const order = placed.placeOrder?.orderV2;
  const placeErrors = placed.placeOrder?.errors ?? [];

  if (placeErrors.length > 0) {
    throw new Error(
      `placeOrder failed: ${placeErrors.map((error) => error.message).join("; ")}`,
    );
  }

  if (!order?.number) {
    throw new Error("placeOrder succeeded but no order number was returned");
  }

  log("10. Order placed", {
    orderNumber: order.number,
    orderId: order.id,
    status: order.status,
    paymentCode,
    cartId,
    sku,
    grandTotal: paymentSet.setPaymentMethodOnCart?.cart?.prices?.grand_total,
  });

  console.log("\n✅ Guest COD checkout test completed successfully");
  console.log(`Order #${order.number} should now be visible in Magento Admin → Sales → Orders`);
}

main().catch((error) => {
  console.error("\n❌ Guest COD checkout test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

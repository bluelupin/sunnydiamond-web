/**
 * Gift card checks against a Magento store (CR-C5 GC-0, GC-1, GC-3). Places no order:
 * the only placeOrder call is one the store must refuse.
 * Run: npm run test:gift-card
 *      npm run test:gift-card -- --graphql https://sunnydiamond-store-dev.on-forge.com/graphql
 */
import assert from "node:assert/strict";

const flag = process.argv.indexOf("--graphql");
const GRAPHQL =
  flag > 0 ? process.argv[flag + 1] : "https://sunnydiamond-store-dev.on-forge.com/graphql";

async function gql(query, variables = {}) {
  const response = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Store: "default" },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

const newCart = async () => (await gql("mutation { createEmptyCart }")).data.createEmptyCart;

const ADD = `mutation ($i: SunnyAddGiftCardToCartInput!) {
  sunnyAddGiftCardToCart(input: $i) { cart { prices { grand_total { value } } } }
}`;

const CART = `query ($c: String!) {
  cart(cart_id: $c) {
    items {
      product { sku }
      prices { row_total { value } }
      ... on SimpleCartItem { customizable_options { customizable_option_uid label values { value } } }
      ... on VirtualCartItem { customizable_options { customizable_option_uid label values { value } } }
    }
  }
}`;

const tomorrow = new Date(Date.now() + 36 * 3600 * 1000).toISOString().slice(0, 10);
const digital = (cartId, overrides = {}) => ({
  i: {
    cart_id: cartId,
    type: "DIGITAL",
    amount: 7250,
    sender_name: "QA Sender",
    sender_phone: "+91 9744355555",
    recipient_name: "QA Recipient",
    recipient_email: "sdqa-giftcard@yopmail.com",
    recipient_phone: "+91 9876543210",
    occasion: "birthday",
    delivery_date: tomorrow,
    message: "Happy birthday!\nFrom QA",
    ...overrides,
  },
});
const refusal = async (overrides) => {
  const result = await gql(ADD, digital(await newCart(), overrides));
  return result.errors?.[0]?.message ?? "NOT REFUSED";
};

let passed = 0;
async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`ok  ${name}`);
}

const address = {
  firstname: "QA",
  lastname: "Test",
  street: ["1 Test Road"],
  city: "Kochi",
  region_id: 580,
  postcode: "682035",
  country_code: "IN",
  telephone: "9876543210",
};

await check("a custom amount is the price, and stays the price on a fresh read", async () => {
  const cartId = await newCart();
  const added = await gql(ADD, digital(cartId));
  assert.equal(added.errors, undefined, added.errors?.[0]?.message);
  assert.equal(added.data.sunnyAddGiftCardToCart.cart.prices.grand_total.value, 7250);

  const item = (await gql(CART, { c: cartId })).data.cart.items[0];
  assert.equal(item.product.sku, "sd-gift-card-digital");
  assert.equal(item.prices.row_total.value, 7250);
  const options = Object.fromEntries(item.customizable_options.map((o) => [o.label, o.values[0].value]));
  assert.equal(options["Recipient Email"], "sdqa-giftcard@yopmail.com");
  assert.equal(options["Delivery Date"], tomorrow);
  assert.equal(options["Gift Message"], "Happy birthday!\nFrom QA");

  const again = await gql(ADD, digital(cartId));
  assert.match(again.errors?.[0]?.message ?? "", /on its own/);
});

await check("amounts outside ₹1,000–₹1,00,000 are refused", async () => {
  assert.match(await refusal({ amount: 999 }), /Choose an amount/);
  assert.match(await refusal({ amount: 100001 }), /Choose an amount/);
});

await check("a digital card needs a valid email, the sender's phone and a date from today to a year ahead", async () => {
  assert.match(await refusal({ recipient_email: null }), /Recipient Email is required/);
  // No address is asked for a digital card, so the sender's phone is its billing contact.
  assert.match(await refusal({ sender_phone: null }), /valid sender phone/);
  assert.match(await refusal({ recipient_email: "not-an-email" }), /valid recipient email/);
  assert.match(await refusal({ delivery_date: "2020-01-01" }), /delivery date/);
  assert.match(await refusal({ recipient_phone: "call me" }), /valid recipient phone/);
  assert.match(await refusal({ sender_name: "Line\u0007break" }), /not valid/);
  // A right-to-left override would disguise the name on the printed card.
  assert.match(await refusal({ recipient_name: "Dee\u202Epa" }), /not valid/);
});

await check("a physical card ships free and is prepaid only (no COD)", async () => {
  const cartId = await newCart();
  const added = await gql(ADD, {
    i: { cart_id: cartId, type: "PHYSICAL", amount: 50000, sender_name: "QA", recipient_name: "QA R", recipient_phone: "+91 9876543210" },
  });
  assert.equal(added.errors, undefined, added.errors?.[0]?.message);
  const result = await gql(
    `mutation ($c: String!, $a: CartAddressInput!) {
      setShippingAddressesOnCart(input: { cart_id: $c, shipping_addresses: [{ address: $a }] }) { cart { id } }
      setBillingAddressOnCart(input: { cart_id: $c, billing_address: { same_as_shipping: true } }) {
        cart { available_payment_methods { code } }
      }
    }`,
    { c: cartId, a: address },
  );
  const methods = result.data.setBillingAddressOnCart.cart.available_payment_methods.map((m) => m.code);
  assert.ok(!methods.includes("cashondelivery") && !methods.includes("checkmo"), methods.join(","));
});

await check("a gift card added through the standard cart call (₹0) cannot be ordered", async () => {
  // Borrow the option uid from a properly added card, then add the SKU the ordinary way.
  const probe = await newCart();
  await gql(ADD, digital(probe));
  const amountUid = (await gql(CART, { c: probe })).data.cart.items[0].customizable_options.find(
    (o) => o.label === "Gift Card Amount",
  ).customizable_option_uid;

  const cartId = await newCart();
  const added = await gql(
    `mutation ($c: String!, $u: ID!) {
      addProductsToCart(cartId: $c, cartItems: [{ sku: "sd-gift-card-digital", quantity: 1, entered_options: [{ uid: $u, value: "5000" }] }]) {
        cart { prices { grand_total { value } } }
      }
    }`,
    { c: cartId, u: amountUid },
  );
  assert.equal(added.data.addProductsToCart.cart.prices.grand_total.value, 0);
  await gql(
    `mutation ($c: String!, $a: CartAddressInput!) {
      setGuestEmailOnCart(input: { cart_id: $c, email: "sdqa-giftcard@yopmail.com" }) { cart { id } }
      setBillingAddressOnCart(input: { cart_id: $c, billing_address: { address: $a } }) { cart { id } }
      setPaymentMethodOnCart(input: { cart_id: $c, payment_method: { code: "free" } }) { cart { id } }
    }`,
    { c: cartId, a: address },
  );
  const placed = await gql(`mutation ($c: String!) { placeOrder(input: { cart_id: $c }) { orderV2 { number } } }`, {
    c: cartId,
  });
  assert.equal(placed.data?.placeOrder?.orderV2?.number, undefined, "a ₹0 gift card order was placed");
  assert.ok(placed.errors?.length, "placeOrder should be refused");
});

console.log(`\n${passed} gift card checks passed against ${GRAPHQL}`);

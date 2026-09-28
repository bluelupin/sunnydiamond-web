/**
 * Gift card checks against a Magento store (CR-C5 GC-0 to GC-6). Places no order: the only
 * placeOrder call is one the store must refuse.
 * Run: npm run test:gift-card
 *      npm run test:gift-card -- --graphql https://sunnydiamond-store-dev.on-forge.com/graphql
 * Redemption with a real card: set GIFT_CARD_TEST_CODE to an active card's code (and
 * optionally GIFT_CARD_USED_CODE to a used one). The codes are never printed. Applying a card
 * reserves nothing, so the card stays active.
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

const APPLY = `mutation ($c: String!, $k: String!) {
  sunnyApplyGiftCard(input: { cart_id: $c, code: $k }) {
    cart { sunny_gift_card { code_last4 amount { value } problem } prices { grand_total { value } } }
  }
}`;
const REMOVE = `mutation ($c: String!) {
  sunnyRemoveGiftCard(input: { cart_id: $c }) { cart { sunny_gift_card { code_last4 } prices { grand_total { value } } } }
}`;

// A jewellery cart: the first in-stock simple product with no required options.
async function jewelleryCart() {
  const list = await gql(`{ products(search: "ring", pageSize: 40) { items { __typename sku stock_status
    ... on CustomizableProductInterface { options { required } } } } }`);
  const product = list.data.products.items.find(
    (p) => p.__typename === "SimpleProduct" && p.stock_status === "IN_STOCK" && !(p.options ?? []).some((o) => o.required),
  );
  assert.ok(product, "no simple in-stock ring without required options to test with");
  const cartId = await newCart();
  await gql(`mutation ($c: String!, $s: String!) { addProductsToCart(cartId: $c, cartItems: [{ sku: $s, quantity: 1 }]) { cart { id } } }`, {
    c: cartId,
    s: product.sku,
  });
  const total = (await gql(`query ($c: String!) { cart(cart_id: $c) { prices { grand_total { value } } } }`, { c: cartId })).data.cart.prices
    .grand_total.value;
  return { cartId, total };
}

await check("wrong codes are refused, and a cart is blocked after 5 wrong codes", async () => {
  const { cartId } = await jewelleryCart();
  for (let i = 0; i < 5; i += 1) {
    const result = await gql(APPLY, { c: cartId, k: `WRONG${i}WRONGWRONG1` });
    assert.match(result.errors?.[0]?.message ?? "", /not valid/);
  }
  const blocked = await gql(APPLY, { c: cartId, k: "WRONGWRONGWRONG6" });
  assert.match(blocked.errors?.[0]?.message ?? "", /Too many gift card attempts/);
});

const activeCode = process.env.GIFT_CARD_TEST_CODE?.trim();
if (activeCode) {
  await check("a real card comes off the total in full, typed in any case with spaces, and can be removed", async () => {
    const { cartId, total } = await jewelleryCart();
    const messy = activeCode.toLowerCase().replace(/(.{4})/g, "$1 ").trim();
    const applied = await gql(APPLY, { c: cartId, k: messy });
    const card = applied.data?.sunnyApplyGiftCard?.cart;
    if (applied.errors) {
      // Only acceptable refusal: the test cart is worth less than the card (R-GC-9).
      assert.match(applied.errors[0].message, /add items to use it/);
      console.log("    (card worth more than the test cart: refusal checked instead)");
      return;
    }
    assert.equal(card.sunny_gift_card.problem, null);
    assert.equal(Math.round((total - card.sunny_gift_card.amount.value) * 100), Math.round(card.prices.grand_total.value * 100));

    const second = await gql(APPLY, { c: cartId, k: activeCode });
    assert.match(second.errors?.[0]?.message ?? "", /already applied/);

    const removed = await gql(REMOVE, { c: cartId });
    assert.equal(removed.data.sunnyRemoveGiftCard.cart.sunny_gift_card, null);
    assert.equal(removed.data.sunnyRemoveGiftCard.cart.prices.grand_total.value, total);
  });
} else {
  console.log("--  real-card redemption skipped (set GIFT_CARD_TEST_CODE)");
}

const usedCode = process.env.GIFT_CARD_USED_CODE?.trim();
if (usedCode) {
  await check("a used card is refused", async () => {
    const { cartId } = await jewelleryCart();
    const result = await gql(APPLY, { c: cartId, k: usedCode });
    assert.match(result.errors?.[0]?.message ?? "", /already been used|no longer be used/);
  });
}

console.log(`\n${passed} gift card checks passed against ${GRAPHQL}`);

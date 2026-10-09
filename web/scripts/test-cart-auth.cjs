const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercise the real service with a deterministic Magento transport and cart storage.
function load(file, mocks = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.resolve(file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    throw new Error(`Unexpected import: ${name}`);
  }, module, module.exports);
  return module.exports;
}

const { MagentoGraphqlError } = load('src/services/magento/magento.errors.ts');
const queries = { MAGENTO_GET_CART_QUERY: 'guest-cart', MAGENTO_GET_CUSTOMER_CART_QUERY: 'customer-cart' };
const mutations = new Proxy({}, { get: (_, name) => name });

function fixture({ storedId = null, failGuest, failCustomer } = {}) {
  let cartId = storedId;
  const calls = [];
  const service = load('src/services/magento/cart/cart.service.ts', {
    '../graphqlClient': { magentoGraphqlFetch: async request => {
      calls.push(request.query);
      if (request.signal?.aborted) throw request.signal.reason;
      if (request.query === 'guest-cart') {
        if (failGuest) throw failGuest;
        return { cart: { id: request.variables.cartId, itemsV2: { items: [] } } };
      }
      if (request.query === 'customer-cart' || request.query === 'customer-cart-id') {
        if (failCustomer) throw failCustomer;
        return { customerCart: { id: 'customer-id', itemsV2: { items: [] } } };
      }
      if (request.query === mutations.MAGENTO_CREATE_GUEST_CART_MUTATION) {
        return { createGuestCart: { cart: { id: 'new-guest' } } };
      }
      if (request.query === mutations.MAGENTO_SET_PAYMENT_METHOD_ON_CART_MUTATION) {
        return { setPaymentMethodOnCart: { cart: { id: request.variables.cartId } } };
      }
      if (request.query === mutations.MAGENTO_PLACE_ORDER_MUTATION) {
        return { placeOrder: { orderV2: { number: '1001', id: 'order-id' } } };
      }
      throw new Error(`Unexpected query: ${request.query}`);
    } },
    './cart.queries': queries,
    './cart.mutations': mutations,
    './cart.mapper': {
      mapMagentoCartItems: () => [],
      mapMagentoCartTotals: cart => ({ cartId: cart.id, paymentMethods: [{ code: 'cashondelivery' }] }),
      computeCartTotalQuantity: () => 0,
    },
    './cartSession': {
      getGuestCartId: () => cartId,
      setGuestCartId: id => { cartId = id; },
      clearGuestCartId: () => { cartId = null; },
      writeCartLineMetadata: () => {},
    },
    './cartLineCustomOptions.mapper': {
      buildMagentoCartItemSyncOptions: () => ({}),
      syncOptionsMatchServer: () => true,
    },
    './checkoutAddress.mapper': {},
    './checkoutPayment.mapper': {
      resolveMagentoPaymentCode: () => 'cashondelivery',
      isOfflineMagentoPaymentCode: () => true,
    },
    '../magento.errors': { MagentoGraphqlError },
    '@/services/customer/customer.gql': { MAGENTO_CUSTOMER_CART_QUERY: 'customer-cart-id' },
    './cartShippingEstimate': {},
  });
  return { service, calls, storedId: () => cartId };
}

test('new guest creates a guest cart without probing customerCart', async () => {
  const f = fixture();
  assert.equal(await f.service.ensureCartId(false), 'new-guest');
  assert.deepEqual(f.calls, [mutations.MAGENTO_CREATE_GUEST_CART_MUTATION]);
});

test('existing guest cart is reused without a customer query', async () => {
  const f = fixture({ storedId: 'guest-id' });
  assert.equal(await f.service.ensureCartId(false), 'guest-id');
  assert.deepEqual(f.calls, ['guest-cart']);
});

for (const message of ['Could not find a cart with ID old-id', 'The cart is not active', 'Use customerCart for customer carts']) {
  test(`stale guest cart recovery never probes auth: ${message}`, async () => {
    const f = fixture({ storedId: 'old-id', failGuest: new MagentoGraphqlError(message) });
    assert.equal(await f.service.ensureCartId(false), 'new-guest');
    assert.deepEqual(f.calls, ['guest-cart', mutations.MAGENTO_CREATE_GUEST_CART_MUTATION]);
  });
}

test('network failure preserves existing cart and does not create a replacement', async () => {
  const failure = new Error('Network unavailable');
  const f = fixture({ storedId: 'guest-id', failGuest: failure });
  await assert.rejects(f.service.ensureCartId(false), error => error === failure);
  assert.equal(f.storedId(), 'guest-id');
  assert.deepEqual(f.calls, ['guest-cart']);
});

test('aborted guest request preserves stored cart', async () => {
  const f = fixture({ storedId: 'guest-id' });
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(f.service.ensureCartId(false, controller.signal), { name: 'AbortError' });
  assert.equal(f.storedId(), 'guest-id');
  assert.deepEqual(f.calls, ['guest-cart']);
});

test('signed-in cart selection directly resolves customer cart', async () => {
  const f = fixture({ storedId: 'previous-id' });
  assert.equal(await f.service.ensureCartId(true), 'customer-id');
  assert.deepEqual(f.calls, ['customer-cart-id']);
});

test('customer authorization failure never falls back to a guest cart', async () => {
  const failure = new MagentoGraphqlError('Not authorized');
  const f = fixture({ failCustomer: failure });
  await assert.rejects(f.service.ensureCartId(true), error => error === failure);
  assert.deepEqual(f.calls, ['customer-cart-id']);
  assert.equal(f.storedId(), null);
});

test('guest fetch does not retry customerCart when Magento suggests it', async () => {
  const failure = new MagentoGraphqlError('Use customerCart');
  const f = fixture({ storedId: 'old-id', failGuest: failure });
  await assert.rejects(f.service.fetchActiveCartState({}), error => error === failure);
  assert.deepEqual(f.calls, ['guest-cart']);
});

test('authenticated active cart resolves without a local guest ID', async () => {
  const f = fixture();
  const state = await f.service.fetchActiveCartState({}, undefined, true);
  assert.equal(state.cart.id, 'customer-id');
  assert.deepEqual(f.calls, ['customer-cart']);
});

test('guest with no cart ID issues no GraphQL query when asked to fetch active cart', async () => {
  const f = fixture();
  await assert.rejects(f.service.fetchActiveCartState({}), /cart was not available/);
  assert.deepEqual(f.calls, []);
});

for (const authenticated of [false, true]) {
  test(`option sync uses explicit session type: authenticated=${authenticated}`, async () => {
    const f = fixture();
    await f.service.syncGuestCartLineOptions('cart-id', {}, undefined, authenticated);
    await f.service.syncGuestCartLineOption('cart-id', 'item-id', { options: {} }, 1, {}, {}, undefined, authenticated);
    const query = authenticated ? 'customer-cart' : 'guest-cart';
    assert.deepEqual(f.calls, [query, query]);
  });

  test(`COD checkout preserves session type through both cart reads: authenticated=${authenticated}`, async () => {
    const f = fixture();
    const order = await f.service.completeGuestCheckout('cart-id', 'cod', {}, undefined, authenticated);
    assert.equal(order.orderNumber, '1001');
    const query = authenticated ? 'customer-cart' : 'guest-cart';
    assert.deepEqual(f.calls, [query, query, mutations.MAGENTO_SET_PAYMENT_METHOD_ON_CART_MUTATION, mutations.MAGENTO_PLACE_ORDER_MUTATION]);
  });
}

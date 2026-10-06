const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
// Run from web/: node --test scripts/test-guest-appointments.cjs
const localRequire = createRequire(path.resolve('package.json'));
const ts = localRequire('typescript');
function load(file, mocks) {
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

test('customer identity includes only verified Magento contacts', async () => {
  let token = 'session-token';
  let requests = 0;
  let fail = false;
  let customer = { id: 7, email: ' Person@Example.com ', sd_email_verified: true,
    sd_mobile_verified: true, custom_attributes: [{ code: 'mobile_number', value: ' +919876543210 ' }] };
  const auth = load('src/services/auth/getSessionMagentoCustomerId.ts', {
    '@/services/magento/graphqlClient': { magentoGraphqlFetch: async options => {
      requests++; assert.equal(options.authToken, 'session-token');
      if (fail) throw new Error('Expired session');
      assert.equal(options.query, 'customer-me');
      return { customer };
    } },
    '@/services/magento/decodeMagentoEntityId': { decodeMagentoEntityId: value => value },
    '@/services/customer/customer.gql': { MAGENTO_CUSTOMER_ME_QUERY: 'customer-me' },
    './session': { getCustomerTokenFromRequest: async () => token, getCustomerToken: async () => token },
  });
  assert.deepEqual(await auth.getSessionMagentoCustomerIdentity(new Request('https://example.com')), { id: 7, email: 'person@example.com', phone: '+919876543210' });
  assert.equal(await auth.getSessionMagentoCustomerId(), 7);
  token = null;
  assert.equal(await auth.getSessionMagentoCustomerIdentity(), null);
  assert.equal(requests, 2);
  token = 'session-token';
  const verified = customer;
  for (const flag of [false, null, undefined, 'true', 1]) {
    customer = { ...verified, sd_email_verified: flag, sd_mobile_verified: flag };
    assert.deepEqual(await auth.getSessionMagentoCustomerIdentity(), { id: 7, email: '' });
  }
  customer = { ...verified, sd_email_verified: false };
  assert.deepEqual(await auth.getSessionMagentoCustomerIdentity(), { id: 7, email: '', phone: '+919876543210' });
  customer = { ...verified, sd_mobile_verified: false };
  assert.deepEqual(await auth.getSessionMagentoCustomerIdentity(), { id: 7, email: 'person@example.com' });
  for (const attributes of [undefined, null, [], [{ code: 'telephone', value: '+919876543210' }], [{ code: 'mobile_number', value: '   ' }], [{ code: 'mobile_number', value: null }]]) {
    customer = { ...verified, custom_attributes: attributes };
    assert.deepEqual(await auth.getSessionMagentoCustomerIdentity(), { id: 7, email: 'person@example.com' });
  }
  customer = null;
  assert.equal(await auth.getSessionMagentoCustomerIdentity(), null);
  customer = verified;
  token = 'session-token'; fail = true;
  assert.equal(await auth.getSessionMagentoCustomerIdentity(), null);
});

test('both BFF list routes ignore forged browser identity and reject missing sessions', async () => {
  for (const open of [false, true]) {
    let customer = { id: 7, email: 'person@example.com', phone: '+919876543210' };
    const calls = [];
    const route = load(`src/app/api/customer/appointments/${open ? 'open/' : ''}route.ts`, {
      'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) } },
      '@/services/auth/getSessionMagentoCustomerId': { getSessionMagentoCustomerIdentity: async request => { assert.ok(request instanceof Request); return customer; } },
      '@/services/customer/customer-appointments.service': {
        CustomerAppointmentsApiError: class extends Error {},
        fetchCustomerAppointments: async (...args) => { calls.push(args); return { appointments: [] }; },
        getOpenCustomerAppointments: async (...args) => { calls.push(args); return []; },
      },
    });
    const request = new Request('https://example.com/api/customer/appointments?magentoCustomerId=99&magentoCustomerEmail=attacker@example.com&magentoCustomerPhone=%2B12025550123&page=2&pageSize=10');
    assert.equal((await route.GET(request)).status, 200);
    assert.deepEqual(calls[0], open
      ? [7, 'person@example.com', undefined, '+919876543210']
      : [7, 'person@example.com', 2, 10, undefined, '+919876543210']);
    // No verified session phone: forged browser phone must still be ignored.
    customer = { id: 7, email: 'person@example.com' };
    assert.equal((await route.GET(request)).status, 200);
    assert.equal(calls[1][open ? 3 : 5], undefined);
    // Phone signup may have no verified email yet.
    customer = { id: 7, email: '', phone: '+919876543210' };
    assert.equal((await route.GET(request)).status, 200);
    assert.equal(calls[2][1], '');
    assert.equal(calls[2][open ? 3 : 5], '+919876543210');
    customer = null;
    assert.equal((await route.GET(request)).status, 401);
    assert.equal(calls.length, 3);
  }
});

test('server service forwards verified identity for both lists without caching', async () => {
  const service = load('src/services/customer/customer-appointments.service.ts', {
    '@/api/config': { getStrapiApiToken: () => 'server-token', getStrapiBaseUrl: () => 'https://cms.example.com/api' },
    '@/api/endpoints': { STRAPI_ENDPOINTS: { customerAppointments: 'customer/appointments' } },
    './customer-appointments.mapper': { mapCustomerAppointmentsPage: () => ({ appointments: [] }), mapCustomerAppointment: value => value },
  });
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => { calls.push({ url: new URL(url), options }); return Response.json({ data: [] }); };
  try {
    const signal = new AbortController().signal;
    await service.fetchCustomerAppointments(7, 'person+booking@example.com', 2, 10, signal, ' +919876543210 ');
    await service.getOpenCustomerAppointments(7, 'person+booking@example.com', signal, '+919876543210');
    assert.equal(calls.length, 2);
    for (const { url, options } of calls) {
      assert.equal(url.searchParams.get('magentoCustomerId'), '7');
      assert.equal(url.searchParams.get('magentoCustomerEmail'), 'person+booking@example.com');
      assert.equal(options.headers.Authorization, 'Bearer server-token');
      assert.equal(options.cache, 'no-store');
      assert.equal(options.signal, signal);
      assert.equal(url.searchParams.get('magentoCustomerPhone'), '+919876543210');
    }
    assert.equal(calls[0].url.searchParams.get('page'), '2');
    assert.equal(calls[0].url.searchParams.get('pageSize'), '10');
    assert.equal(calls[1].url.pathname, '/api/customer/appointments/open');
    calls.length = 0;
    for (const phone of [undefined, '', '   ']) {
      await service.fetchCustomerAppointments(7, '', 1, 20, undefined, phone);
      await service.getOpenCustomerAppointments(7, '', undefined, phone);
    }
    for (const { url } of calls) {
      assert.equal(url.searchParams.has('magentoCustomerPhone'), false);
      assert.equal(url.searchParams.has('magentoCustomerEmail'), false);
      assert.equal(url.searchParams.get('magentoCustomerId'), '7');
    }
    calls.length = 0;
    await service.fetchCustomerAppointments(7, 'legacy@example.com', 2, 10);
    await service.getOpenCustomerAppointments(7, 'legacy@example.com');
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url.searchParams.get('page'), '2');
    assert.ok(calls.every(({ url }) => !url.searchParams.has('magentoCustomerPhone')));
  } finally { global.fetch = originalFetch; }
});


test('store visit contact validation accepts blank email and validates supplied addresses', () => {
  const validation = load('src/shared/utils/formValidation.ts', {
    '@/features/checkout/constants/cod': { CHECKOUT_COD_MAX_ORDER_TOTAL: 50000 },
    '@/shared/utils/appointmentTimeSlots': { getAppointmentBookingDateBounds: () => ({ minDate: '2099-01-01', maxDate: '2099-01-31' }) },
  });
  const values = { name: 'Guest Customer', phone: '9876543210', countryCode: '+91',
    date: '2099-01-02', note: '', purpose: 'Browse jewellery', selectedSlot: '10:00' };
  const options = { emailRequired: false, dateRequired: true, validatePurpose: true, selectedSlotRequired: true, bookingWindow: { minDaysAhead: 0, maxDaysAhead: 30 } };
  for (const email of ['', '   ', 'guest@example.com']) {
    assert.equal(validation.isAppointmentContactValid({ ...values, email }, options), true);
    assert.equal(validation.getAppointmentContactErrors({ ...values, email }, options).email, undefined);
  }
  assert.equal(validation.isAppointmentContactValid({ ...values, email: 'invalid' }, options), false);
  assert.equal(validation.getAppointmentContactErrors({ ...values, email: 'invalid' }, options).email, 'Please enter a valid email');
  // Required-email forms retain their existing validation.
  assert.ok(validation.getAppointmentContactErrors({ ...values, email: '' }, { ...options, emailRequired: true }).email);
});


// Minimal hook scheduler: execute the real hook, run dependency changes and cleanup,
// and flush asynchronous state updates without adding a DOM/test-renderer dependency.
function hookHarness(auth, request) {
  const slots = [];
  let cursor = 0, pending = [], dirty = false, result;
  const equal = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!slots[i]) slots[i] = { value: initial };
      return [slots[i].value, next => {
        const value = typeof next === 'function' ? next(slots[i].value) : next;
        if (!Object.is(value, slots[i].value)) { slots[i].value = value; dirty = true; }
      }];
    },
    useCallback(callback, deps) {
      const i = cursor++;
      if (!slots[i] || !equal(slots[i].deps, deps)) slots[i] = { value: callback, deps };
      return slots[i].value;
    },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!slots[i] || !equal(slots[i].deps, deps)) {
        slots[i]?.cleanup?.();
        slots[i] = { deps };
        pending.push(() => { slots[i].cleanup = effect(); });
      }
    },
  };
  const { useCustomerAppointments } = load('src/features/account/hooks/useCustomerAppointments.ts', {
    react,
    '@/features/auth/context/AuthContext': { useAuth: () => auth },
    '@/services/customer/customer-appointments.client': { getCustomerAppointments: request },
  });
  const render = (enabled = true) => {
    cursor = 0; dirty = false;
    result = useCustomerAppointments(enabled);
    const effects = pending; pending = []; effects.forEach(effect => effect());
    return result;
  };
  return { render, get result() { return result; }, async flush(enabled = true) {
    for (let i = 0; i < 8; i++) { await Promise.resolve(); if (dirty) render(enabled); }
  }, unmount() { slots.forEach(slot => slot?.cleanup?.()); } };
}

test('appointments reload after phone verification, ignore unchanged auth refresh, and cancel stale loads', async () => {
  const auth = { status: 'authenticated', customer: { id: 7, phone: '+919876543210', phoneVerified: false, email: 'person@example.com', emailVerified: true } };
  const requests = [];
  const harness = hookHarness(auth, (page, pageSize, signal) => new Promise(resolve => requests.push({ page, pageSize, signal, resolve })));
  try {
    harness.render(); await harness.flush();
    assert.equal(requests.length, 1);
    auth.customer = { ...auth.customer, phoneVerified: true };
    harness.render(); await harness.flush();
    assert.equal(requests.length, 2);
    assert.equal(requests[0].signal.aborted, true);
    requests[1].resolve({ appointments: [{ documentId: 'linked-booking' }] }); await harness.flush();
    requests[0].resolve({ appointments: [] }); await harness.flush();
    assert.deepEqual(harness.result.data.appointments, [{ documentId: 'linked-booking' }]);
    assert.equal(harness.result.isLoading, false);
    auth.customer = { ...auth.customer }; harness.render(); await harness.flush();
    assert.equal(requests.length, 2);
    auth.customer = { ...auth.customer, phone: '+918765432109' }; harness.render(); await harness.flush();
    assert.equal(requests.length, 3);
    harness.result.setPage(2); harness.render(); await harness.flush();
    assert.equal(requests[3].page, 2);
    assert.equal(requests[2].signal.aborted, true);
    harness.result.refresh(); harness.render(); await harness.flush();
    assert.equal(requests.length, 5);
    auth.status = 'guest'; auth.customer = null; harness.render(); await harness.flush();
    assert.equal(requests[4].signal.aborted, true);
    assert.equal(harness.result.data, null);
    assert.equal(harness.result.isLoading, false);
    assert.equal(requests.length, 5);
    auth.status = 'authenticated'; auth.customer = { id: 8, phone: '+919876543210', phoneVerified: true };
    harness.render(); await harness.flush(); assert.equal(requests.length, 6);
    harness.render(false); await harness.flush(false);
    assert.equal(requests[5].signal.aborted, true);
    assert.equal(requests.length, 6);
  } finally { harness.unmount(); }
});

test('appointments wait for authentication and refresh after email verification', async () => {
  const auth = { status: 'loading', customer: null };
  let calls = 0;
  const harness = hookHarness(auth, async () => { calls++; return { appointments: [] }; });
  try {
    harness.render(); await harness.flush(); assert.equal(calls, 0);
    auth.status = 'authenticated'; auth.customer = { id: 7, email: 'person@example.com', emailVerified: false };
    harness.render(); await harness.flush(); assert.equal(calls, 1);
    auth.customer = { ...auth.customer, emailVerified: true };
    harness.render(); await harness.flush(); assert.equal(calls, 2);
    auth.customer = { ...auth.customer, email: 'new@example.com' };
    harness.render(); await harness.flush(); assert.equal(calls, 3);
  } finally { harness.unmount(); }
});


test('both appointment endpoints forward only contacts proven by the real identity helper', async () => {
  let customer = { id: 7, email: 'person@example.com', sd_email_verified: true, sd_mobile_verified: false,
    custom_attributes: [{ code: 'mobile_number', value: '+919876543210' }] };
  const auth = load('src/services/auth/getSessionMagentoCustomerId.ts', {
    '@/services/magento/graphqlClient': { magentoGraphqlFetch: async () => ({ customer }) },
    '@/services/magento/decodeMagentoEntityId': { decodeMagentoEntityId: value => value },
    '@/services/customer/customer.gql': { MAGENTO_CUSTOMER_ME_QUERY: 'customer-me' },
    './session': { getCustomerTokenFromRequest: async () => 'session-token' },
  });
  const service = load('src/services/customer/customer-appointments.service.ts', {
    '@/api/config': { getStrapiApiToken: () => 'server-token', getStrapiBaseUrl: () => 'https://cms.example.com/api' },
    '@/api/endpoints': { STRAPI_ENDPOINTS: { customerAppointments: 'customer/appointments' } },
    './customer-appointments.mapper': { mapCustomerAppointmentsPage: () => ({ appointments: [] }), mapCustomerAppointment: value => value },
  });
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => { calls.push({ url: new URL(url), options }); return Response.json({ data: [] }); };
  try {
    for (const open of [false, true]) {
      const route = load('src/app/api/customer/appointments/' + (open ? 'open/' : '') + 'route.ts', {
        'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) } },
        '@/services/auth/getSessionMagentoCustomerId': auth,
        '@/services/customer/customer-appointments.service': service,
      });
      const request = new Request('https://example.com/api/customer/appointments?magentoCustomerPhone=%2B12025550123&magentoCustomerId=99&magentoCustomerEmail=forged@example.com');
      for (const [phoneVerified, emailVerified] of [[false, true], [true, true], [true, false], [false, false]]) {
        customer = { ...customer, sd_mobile_verified: phoneVerified, sd_email_verified: emailVerified };
        assert.equal((await route.GET(request)).status, 200);
        const { url, options } = calls.at(-1);
        assert.equal(url.searchParams.get('magentoCustomerId'), '7');
        assert.equal(url.searchParams.get('magentoCustomerPhone'), phoneVerified ? '+919876543210' : null);
        assert.equal(url.searchParams.get('magentoCustomerEmail'), emailVerified ? 'person@example.com' : null);
        assert.equal(options.headers.Authorization, 'Bearer server-token');
      }
    }
    assert.equal(calls.length, 8);
  } finally { global.fetch = originalFetch; }
});

test('guest and signed-in store visits submit without email through the browser service and BFF', async () => {
  let customerId = null;
  const route = load('src/app/api/product-submissions/submit/route.ts', {
    'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) } },
    '@/api/config': { getStrapiApiToken: () => 'server-token', getStrapiBaseUrl: () => 'https://cms.example.com/api' },
    '@/api/endpoints': { STRAPI_ENDPOINTS: { productSubmissionsSubmit: 'product-submissions/submit' } },
    '@/services/http/clientIp': { cmsForwardedIpHeaders: () => ({}) },
    '@/services/auth/getSessionMagentoCustomerId': { getSessionMagentoCustomerId: async () => customerId },
  });
  const service = load('src/services/forms/product-form.service.ts', {
    '@/api/fetchClient': {}, '@/api/endpoints': {}, './product-form.mapper': {},
  });
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (url, options) => {
    if (url === '/api/product-submissions/submit') {
      return route.POST(new Request('https://example.com' + url, { method: 'POST', body: options.body }));
    }
    const data = JSON.parse(options.body.get('data'));
    calls.push(data);
    assert.equal(Object.hasOwn(data, 'customerEmail'), false);
    assert.equal(data.magentoCustomerId, customerId ?? undefined);
    assert.equal(options.headers.Authorization, 'Bearer server-token');
    return Response.json({ data: { documentId: 'booking' } });
  };
  try {
    for (const id of [null, 7]) {
      customerId = id;
      for (const formTag of ['store-visit', 'product-store-visit']) {
        await service.createProductSubmission({ formTag, customerName: 'Customer', customerPhone: '+91 9876543210',
          customerEmail: undefined, preferredShowroom: 'showroom', magentoCustomerId: 99 });
      }
    }
    assert.equal(calls.length, 4);
  } finally { global.fetch = originalFetch; }
});

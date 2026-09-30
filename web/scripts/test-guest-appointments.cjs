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

test('customer identity comes from authenticated Magento query, including normalized email', async () => {
  let token = 'session-token';
  let requests = 0;
  let fail = false;
  const auth = load('src/services/auth/getSessionMagentoCustomerId.ts', {
    '@/services/magento/graphqlClient': { magentoGraphqlFetch: async options => {
      requests++; assert.equal(options.authToken, 'session-token');
      if (fail) throw new Error('Expired session');
      return { customer: { id: 7, email: ' Person@Example.com ' } };
    } },
    '@/services/magento/decodeMagentoEntityId': { decodeMagentoEntityId: value => value },
    '@/services/customer/customer.gql': { MAGENTO_CUSTOMER_ME_QUERY: 'customer-me' },
    './session': { getCustomerTokenFromRequest: async () => token, getCustomerToken: async () => token },
  });
  assert.deepEqual(await auth.getSessionMagentoCustomerIdentity(new Request('https://example.com')), { id: 7, email: 'person@example.com' });
  assert.equal(await auth.getSessionMagentoCustomerId(), 7);
  token = null;
  assert.equal(await auth.getSessionMagentoCustomerIdentity(), null);
  assert.equal(requests, 2);
  token = 'session-token'; fail = true;
  assert.equal(await auth.getSessionMagentoCustomerIdentity(), null);
});

test('both BFF list routes ignore forged browser identity and reject missing sessions', async () => {
  for (const open of [false, true]) {
    let customer = { id: 7, email: 'person@example.com' };
    const calls = [];
    const route = load(`src/app/api/customer/appointments/${open ? 'open/' : ''}route.ts`, {
      'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) } },
      '@/services/auth/getSessionMagentoCustomerId': { getSessionMagentoCustomerIdentity: async () => customer },
      '@/services/customer/customer-appointments.service': {
        CustomerAppointmentsApiError: class extends Error {},
        fetchCustomerAppointments: async (...args) => { calls.push(args); return { appointments: [] }; },
        getOpenCustomerAppointments: async (...args) => { calls.push(args); return []; },
      },
    });
    const request = new Request('https://example.com/api/customer/appointments?magentoCustomerId=99&magentoCustomerEmail=attacker@example.com&page=2');
    assert.equal((await route.GET(request)).status, 200);
    assert.deepEqual(calls[0].slice(0, 2), [7, 'person@example.com']);
    if (!open) assert.equal(calls[0][2], 2);
    customer = null;
    assert.equal((await route.GET(request)).status, 401);
    assert.equal(calls.length, 1);
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
    await service.fetchCustomerAppointments(7, 'person+booking@example.com', 2, 10);
    await service.getOpenCustomerAppointments(7, 'person+booking@example.com');
    assert.equal(calls.length, 2);
    for (const { url, options } of calls) {
      assert.equal(url.searchParams.get('magentoCustomerId'), '7');
      assert.equal(url.searchParams.get('magentoCustomerEmail'), 'person+booking@example.com');
      assert.equal(options.headers.Authorization, 'Bearer server-token');
      assert.equal(options.cache, 'no-store');
    }
  } finally { global.fetch = originalFetch; }
});

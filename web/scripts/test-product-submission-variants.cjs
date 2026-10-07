const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file, stubs = {}) {
  const filename = path.resolve(file), module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  new Function('require', 'module', 'exports', code)(name => {
    if (Object.hasOwn(stubs, name)) return stubs[name];
    if (name.startsWith('@/')) return load('src/' + name.slice(2) + '.ts', stubs);
    if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), name + '.ts'), stubs);
    return require(name);
  }, module, module.exports);
  return module.exports;
}
const { applySelectedMetalVariant } = load('src/features/products/utils/productVariant.utils.ts');
const { getProductSubmissionVariant } = load('src/features/products/utils/productSubmissionVariant.ts');
const product = { id: 'RING', metalColorValue: 'yellow-gold', configurable: {
  options: [{ attributeCode: 'sd_metal_color', values: [] }],
  variants: ['yellow-gold', 'rose-gold'].flatMap(colour => ['14K', '18K'].map(purity => ({
    sku: 'RING-' + colour + '-' + purity, price: 100, image: '', images: [], inStock: true,
    attributes: { sd_metal_color: colour, sd_metal_purity: purity }, optionUids: [],
  }))),
} };
test('each colour and purity submits the exact child SKU while keeping the parent identity', () => {
  for (const colour of ['yellow-gold', 'rose-gold']) for (const purity of ['14K', '18K']) {
    const selected = applySelectedMetalVariant(product, colour, [purity]);
    assert.equal(selected.id, 'RING');
    assert.deepEqual(getProductSubmissionVariant(selected), {
      productSku: 'RING-' + colour + '-' + purity, metalColour: colour, metalPurity: purity,
    });
  }
});
test('simple products use their own SKU; unmatched configurable colours cannot submit', () => {
  assert.equal(getProductSubmissionVariant({ id: 'SIMPLE' }).productSku, 'SIMPLE');
  assert.throws(() => getProductSubmissionVariant({ ...product, metalColorValue: 'platinum' }), /select/);
  assert.throws(() => getProductSubmissionVariant({ ...product, configurable: { ...product.configurable, variants: [] } }), /unavailable/);
});
test('duplicate bookings distinguish variants while supporting historical parent-only records', async () => {
  let appointments = [{ documentId: 'booking', formTag: 'product-video-call', workflowStatus: 'New',
    requestedDate: '2099-12-01', selectedTimeSlot: '11:00 AM', products: [
      { productId: 'RING', productSku: 'RING-yellow-gold-18K', workflowStatus: 'New' },
    ] }];
  const { hasDuplicateAppointmentBooking } = load('src/features/products/utils/appointmentDuplicateBooking.ts', {
    '@/services/customer/customer-appointments.client': { getCustomerAppointments: async () => ({ appointments }) },
    '@/features/products/utils/tryAtHomeBooking': { normalizeAppointmentDateInput: value => value },
  });
  const candidate = { kind: 'video_call', productId: 'RING', date: '2099-12-01', selectedSlot: '11:00 AM' };
  assert.equal(await hasDuplicateAppointmentBooking({ ...candidate, productSku: 'RING-yellow-gold-18K' }), true);
  assert.equal(await hasDuplicateAppointmentBooking({ ...candidate, productSku: 'RING-rose-gold-18K' }), false);
  appointments[0].products[0].productSku = undefined;
  assert.equal(await hasDuplicateAppointmentBooking(candidate), true);
});
test('appointment mapper preserves each piece selection instead of inheriting the parent selection', () => {
  const { mapCustomerAppointment } = load('src/services/customer/customer-appointments.mapper.ts');
  const mapped = mapCustomerAppointment({ documentId: 'booking', productId: 'RING', productSku: 'YG', metalColour: 'yellow-gold',
    products: [{ documentId: 'first', productId: 'RING', productSku: 'YG', metalColour: 'yellow-gold' },
      { documentId: 'second', productId: 'RING', productSku: 'RG', metalColour: 'rose-gold', metalPurity: '18K' }] });
  assert.equal(mapped.products[1].productSku, 'RG');
  assert.equal(mapped.products[1].metalColour, 'rose-gold');
  assert.equal(mapped.products[1].metalPurity, '18K');
  assert.equal(mapCustomerAppointment({ documentId: 'old', productId: 'RING' }).productSku, null);
});

test('add-piece BFF validates and forwards the variant fields with server-owned identity', async () => {
  const calls = [];
  const route = load('src/app/api/customer/appointments/[documentId]/pieces/route.ts', {
    'next/server': { NextResponse: { json: (data, init = {}) => ({ data, status: init.status || 200 }) } },
    '@/services/auth/getSessionMagentoCustomerId': { getSessionMagentoCustomerId: async () => 7 },
    '@/services/http/clientIp': { cmsForwardedIpHeaders: () => ({}) },
    '@/services/customer/customer-appointments.service': {
      CustomerAppointmentsApiError: class extends Error {},
      addPieceToCustomerAppointment: async (customerId, id, input) => { calls.push({ customerId, id, input }); return { meta: { changed: true } }; },
    },
  });
  const data = { productId: 'RING', productName: 'Ring', productPath: '/rings/ring', productSku: ' RING-RG ', metalColour: 'rose-gold', metalPurity: '18K', magentoCustomerId: 999 };
  const request = value => new Request('https://example.com/api/customer/appointments/booking/pieces', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value),
  });
  const result = await route.POST(request(data), { params: Promise.resolve({ documentId: 'booking' }) });
  assert.equal(result.status, 200);
  assert.deepEqual(calls[0], { customerId: 7, id: 'booking', input: { productId: 'RING', productName: 'Ring', productPath: '/rings/ring',
    productSku: 'RING-RG', metalColour: 'rose-gold', metalPurity: '18K' } });
  assert.equal((await route.POST(request({ ...data, productSku: {} }), { params: Promise.resolve({ documentId: 'booking' }) })).status, 400);
  assert.equal(calls.length, 1);
});
test('server add-piece service forwards variant details to CMS', async () => {
  const service = load('src/services/customer/customer-appointments.service.ts', {
    '@/api/config': { getStrapiApiToken: () => 'test-token', getStrapiBaseUrl: () => 'https://cms.example.com/api' },
    '@/api/endpoints': { STRAPI_ENDPOINTS: { customerAppointments: 'customer/appointments' } },
  });
  const originalFetch = global.fetch;
  let sent;
  global.fetch = async (_, options) => { sent = JSON.parse(options.body).data; return new Response(JSON.stringify({ data: {}, meta: { changed: true } })); };
  try {
    const input = { productId: 'RING', productName: 'Ring', productPath: '/rings/ring', productSku: 'RING-RG', metalColour: 'rose-gold', metalPurity: '18K' };
    await service.addPieceToCustomerAppointment(7, 'booking', input);
    assert.deepEqual(sent, { magentoCustomerId: 7, ...input });
  } finally { global.fetch = originalFetch; }
});
test('browser form service forwards the selected variant through multipart submissions', async () => {
  const service = load('src/services/forms/product-form.service.ts', {
    '@/api/fetchClient': {}, '@/api/endpoints': { STRAPI_ENDPOINTS: {} }, './product-form.mapper': {},
  });
  const originalFetch = global.fetch;
  let sent;
  global.fetch = async (_, options) => { sent = JSON.parse(options.body.get('data')); return new Response('{}', { status: 201 }); };
  try {
    await service.createProductSubmission({ formTag: 'product-personalisation', productId: 'RING', productSku: 'RING-RG',
      metalColour: 'rose-gold', metalPurity: '18K', customerName: 'Customer', customerPhone: '9876543210' });
    assert.equal(sent.productId, 'RING');
    assert.equal(sent.productSku, 'RING-RG');
    assert.equal(sent.metalColour, 'rose-gold');
    assert.equal(sent.metalPurity, '18K');
  } finally { global.fetch = originalFetch; }
});

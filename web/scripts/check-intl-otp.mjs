/**
 * Self-check: international mobile OTP (CR-B3).
 * Run: npm run test:intl-otp
 * Also against a store: npm run test:intl-otp -- https://<store>/graphql
 *   (checks the server's number rules through verifyLoginOtp with a dummy code: it
 *   normalises the number first and sends nothing, so no SMS and no rate limit is used)
 */
import assert from "node:assert/strict";
import { register } from "node:module";

// Lets Node load the app's own TS modules: "@/..." → src/..., extensionless → .ts / .tsx.
const aliasHooks = `
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
const SRC = ${JSON.stringify(new URL("../src/", import.meta.url).href)};
const isFile = (url) => { try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; } };
export async function resolve(specifier, context, next) {
  const aliased = specifier.startsWith("@/");
  if (!aliased && !specifier.startsWith(".")) return next(specifier, context);
  const base = aliased ? new URL(specifier.slice(2), SRC).href : new URL(specifier, context.parentURL).href;
  for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
    if (isFile(base + suffix)) return next(base + suffix, context);
  }
  return next(specifier, context);
}`;
register(`data:text/javascript,${encodeURIComponent(aliasHooks)}`);

const phone = await import("../src/lib/auth/magentoPhone.ts");
const { mapCheckoutFormToShippingAddress } = await import(
  "../src/services/magento/cart/checkoutAddress.mapper.ts"
);
const { createEmptyCheckoutForm } = await import("../src/features/checkout/types/checkout.types.ts");

// Allowed countries from storeConfig: India always first.
assert.deepEqual(phone.parseOtpCountryCodes("1"), ["+91", "+1"]);
assert.deepEqual(phone.parseOtpCountryCodes("1,971,91"), ["+91", "+1", "+971"]);
assert.deepEqual(phone.parseOtpCountryCodes(null), ["+91"]);

// What the sign-in, checkout and profile code screens send to Magento.
assert.equal(phone.formatLoginPhoneForMagento("+1", "4155552671"), "+14155552671");
assert.equal(phone.formatLoginPhoneForMagento("+91", "9876543210"), "+919876543210");
// A US number that looks Indian must stay American end to end.
assert.equal(phone.formatLoginPhoneForMagento("+1", "9876543210"), "+19876543210");
assert.equal(phone.normalizePhoneForMagento("+19876543210"), "+19876543210");
assert.equal(phone.normalizePhoneForMagento("9876543210"), "+919876543210");
assert.equal(phone.normalizePhoneForMagento("+971501234567"), "+971501234567");

// Stored numbers back into picker code + national digits.
assert.deepEqual(phone.splitPhoneNumber("+14155552671"), { countryCode: "+1", national: "4155552671" });
assert.deepEqual(phone.splitPhoneNumber("+919876543210"), { countryCode: "+91", national: "9876543210" });
assert.deepEqual(phone.splitPhoneNumber("9876543210"), { countryCode: "+91", national: "9876543210" });
assert.deepEqual(phone.splitPhoneNumber("+971501234567"), { countryCode: "+971", national: "501234567" });
assert.deepEqual(phone.splitPhoneNumber(""), { countryCode: "+91", national: "" });

// Address telephones: India stays bare digits (as before), others keep their code.
assert.equal(phone.joinAddressPhone("+91", "9876543210"), "9876543210");
assert.equal(phone.joinAddressPhone("+1", "4155552671"), "+14155552671");
assert.equal(phone.canonicalAddressPhone("+919876543210"), "9876543210");
assert.equal(phone.canonicalAddressPhone("+14155552671"), "+14155552671");

const form = {
  ...createEmptyCheckoutForm(),
  name: "Sara Test",
  phoneOrEmail: "4155552671",
  contactCountryCode: "+1",
  shippingName: "Sara Test",
  addressLine1: "12 MG Road",
  addressLine2: "",
  pincode: "682016",
  city: "Kochi",
  state: "Kerala",
  shippingPhone: "",
  shippingCountryCode: "+91",
};
assert.equal(mapCheckoutFormToShippingAddress(form).telephone, "+14155552671");
assert.equal(
  mapCheckoutFormToShippingAddress({ ...form, shippingPhone: "9876543210" }).telephone,
  "9876543210",
);
assert.equal(
  mapCheckoutFormToShippingAddress({ ...form, phoneOrEmail: "sara123@example.com", shippingPhone: "" })
    .telephone,
  "0000000000",
);

console.log("intl OTP: helper checks passed");

const graphqlUrl = process.argv[2];
if (graphqlUrl) {
  const VERIFY = `mutation ($input: VerifyLoginOtpInput!) { verifyLoginOtp(input: $input) { token } }`;
  const errorFor = async (number) => {
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: VERIFY, variables: { input: { phone: number, otp: "000000" } } }),
    });
    const body = await response.json();
    return body.errors?.[0]?.message ?? "(no error)";
  };

  // Accepted numbers get past the normaliser and fail later, on the code or the SMS switch.
  const accepted = ["Invalid or expired OTP.", "Mobile OTP login is not available."];
  // Assumes the store allows +1 only (the dev setting), so +44 and +971 are refused.
  const cases = [
    ["+919876543210", accepted],
    ["+91 98765 43210", accepted],
    ["919876543210", accepted],
    ["09876543210", accepted],
    ["9876543210", accepted],
    ["+14155552671", accepted],
    ["+1 (415) 555-2671", accepted],
    ["+11155552671", ["Please enter a valid mobile number."]],
    ["+1415555267", ["Please enter a valid mobile number."]],
    ["+8613800138000", ["PHONE_COUNTRY_NOT_SUPPORTED"]],
    ["+447911123456", ["PHONE_COUNTRY_NOT_SUPPORTED"]],
    ["+971501234567", ["PHONE_COUNTRY_NOT_SUPPORTED"]],
    ["+1 abc", ["Please enter a valid mobile number."]],
    ["5876543210", ["Please enter a valid Indian mobile number."]],
  ];
  for (const [number, expected] of cases) {
    const message = await errorFor(number);
    assert.ok(expected.includes(message), `${number}: got "${message}", expected one of ${expected}`);
  }
  console.log(`intl OTP: ${cases.length} server checks passed (${graphqlUrl})`);
}

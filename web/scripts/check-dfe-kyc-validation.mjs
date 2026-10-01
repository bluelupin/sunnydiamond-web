/**
 * Self-check for DFE KYC ID validation helpers.
 * Run: npm run test:dfe-kyc
 */
import assert from "node:assert/strict";
import {
  getKycIdNumberValidationError,
  isValidAadhaar,
  isValidPan,
  normalizePan,
  sanitizeKycIdNumberInput,
} from "../src/features/diamonds-for-everyone/utils/kycIdValidation.ts";

const messages = {
  aadhaarError: "Enter Valid Aadhar Number",
  aadhaarDigitsOnlyError: "Aadhaar must contain only numbers",
  aadhaarLengthError: "Enter a 12-digit Aadhaar number",
  panError: "Enter a valid PAN",
};

assert.equal(isValidAadhaar("rr"), false);
assert.equal(
  getKycIdNumberValidationError("Aadhaar", "rr", messages),
  messages.aadhaarDigitsOnlyError,
);
assert.equal(
  getKycIdNumberValidationError("Aadhaar", "12345", messages),
  messages.aadhaarLengthError,
);
assert.equal(isValidAadhaar("012345678901"), false);
assert.equal(isValidAadhaar("111111111111"), false);

assert.equal(isValidAadhaar("277746357591"), true);
assert.equal(isValidAadhaar("234123412354"), true);

assert.equal(isValidPan("ABCDE1234F"), true);
assert.equal(isValidPan("abcde1234f"), true);
assert.equal(normalizePan("abcde1234f"), "ABCDE1234F");
assert.equal(isValidPan("ABCDE123"), false);
assert.equal(getKycIdNumberValidationError("PAN", "ABCDE123", messages), messages.panError);

assert.equal(sanitizeKycIdNumberInput("Aadhaar", "12ab 34-56"), "123456");
assert.equal(sanitizeKycIdNumberInput("PAN", "abpcd1234e"), "ABPCD1234E");

console.log("check-dfe-kyc-validation: ok");

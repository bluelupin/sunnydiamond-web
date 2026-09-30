/**
 * Phone helpers for Magento: E.164 for OTP calls, split/join for stored numbers.
 *
 * normalizePhoneForMagento: normalizes Indian mobile numbers for Magento OTP mutations.
 * Accepts 10-digit national, 12-digit with 91 prefix, or values already prefixed with +91.
 * Any other "+<digits>" value passes through as E.164; Magento decides whether the country is allowed.
 */
export function normalizePhoneForMagento(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return phone.trim();
  }

  if (phone.trim().startsWith("+")) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return digits;
}

/** Builds E.164 phone for Magento from UI country code + national digits. */
export function formatLoginPhoneForMagento(countryCode: string, nationalDigits: string): string {
  const national = nationalDigits.replace(/\D/g, "");
  const codeDigits = countryCode.replace(/\D/g, "");

  if (!national) {
    return "";
  }

  if (!codeDigits) {
    return normalizePhoneForMagento(national);
  }

  return `+${codeDigits}${national}`;
}

/** "1,971" → ["+91", "+1", "+971"]. India is always allowed while SMS OTP is on. */
export const parseOtpCountryCodes = (value: string | null | undefined): string[] => [
  "+91",
  ...(value ?? "")
    .split(",")
    .map((code) => code.replace(/\D/g, ""))
    .filter((code) => code && code !== "91")
    .map((code) => `+${code}`),
];

/**
 * Dial codes the store knows: India plus Magento's OtpCountries table
 * (SunnyDiamonds\CustomerAuth\Model\Otp\OtpCountries). Dial codes are prefix-free,
 * so the first match is the only match.
 */
const KNOWN_DIAL_CODES = ["+1", "+44", "+61", "+65", "+91", "+965", "+966", "+968", "+971", "+973", "+974"];

/**
 * Splits a stored number into picker code + national digits. "+<code>…" keeps its
 * country; bare digits are Indian, which is how Indian numbers have always been stored.
 */
export function splitPhoneNumber(value: string | null | undefined): {
  countryCode: string;
  national: string;
} {
  const trimmed = (value ?? "").trim();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    const code = KNOWN_DIAL_CODES.find((dial) => digits.startsWith(dial.slice(1)));
    if (code && code !== "+91") {
      return { countryCode: code, national: digits.slice(code.length - 1) };
    }
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return { countryCode: "+91", national: digits.slice(2) };
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return { countryCode: "+91", national: digits.slice(1) };
  }
  return { countryCode: "+91", national: digits };
}

/**
 * An address telephone as it is saved in Magento: bare digits for India (as before),
 * "+<code><digits>" for any other country so the code is not lost.
 */
export function joinAddressPhone(countryCode: string | null | undefined, national: string): string {
  const digits = national.replace(/\D/g, "");
  const codeDigits = (countryCode ?? "").replace(/\D/g, "") || "91";
  return !digits || codeDigits === "91" ? digits : `+${codeDigits}${digits}`;
}

/** Any stored or typed address phone in its saved form (see joinAddressPhone). */
export function canonicalAddressPhone(value: string | null | undefined): string {
  const { countryCode, national } = splitPhoneNumber(value);
  return joinAddressPhone(countryCode, national);
}

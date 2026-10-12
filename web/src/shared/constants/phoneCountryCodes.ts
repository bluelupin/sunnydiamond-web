import {
  DEFAULT_COUNTRY_CODE,
  PHONE_COUNTRY_ENTRIES,
  type PhoneCountryEntry,
} from "./phoneCountryCodes.generated";

export { DEFAULT_COUNTRY_CODE, PHONE_COUNTRY_ENTRIES, type PhoneCountryEntry };

/** Unique E.164 dial prefixes, longest first (for parsing stored numbers). */
let sortedUniqueDialCodesCache: readonly string[] | null = null;

export function getSortedUniqueDialCodes(): readonly string[] {
  if (!sortedUniqueDialCodesCache) {
    const unique = [...new Set(PHONE_COUNTRY_ENTRIES.map((entry) => entry.code))];
    unique.sort((a, b) => b.length - a.length || a.localeCompare(b));
    sortedUniqueDialCodesCache = unique;
  }

  return sortedUniqueDialCodesCache;
}

/** Restrict list to allowed dial codes (login OTP). Omit or pass all codes for the full world list. */
export function filterPhoneCountryEntriesByDialCodes(
  allowedDialCodes: readonly string[] | undefined,
): readonly PhoneCountryEntry[] {
  if (!allowedDialCodes?.length) {
    return PHONE_COUNTRY_ENTRIES;
  }

  const allowed = new Set(allowedDialCodes.map((code) => code.trim()).filter(Boolean));
  return PHONE_COUNTRY_ENTRIES.filter((entry) => allowed.has(entry.code));
}

export function findPhoneCountryEntryByIso(iso: string): PhoneCountryEntry | undefined {
  const normalized = iso.trim().toUpperCase();
  return PHONE_COUNTRY_ENTRIES.find((entry) => entry.country === normalized);
}

export function findPhoneCountryEntryByDialCode(code: string): PhoneCountryEntry | undefined {
  const normalized = code.trim();
  return PHONE_COUNTRY_ENTRIES.find((entry) => entry.code === normalized);
}

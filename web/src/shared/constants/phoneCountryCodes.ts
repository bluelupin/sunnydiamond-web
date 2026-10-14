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

/** Dropdown list length — 193 UN members + Holy See + Palestine. */
export const PHONE_COUNTRY_DROPDOWN_COUNT = 195 as const;

/** Restrict list to allowed dial codes (login OTP). Omit or pass all codes for the full dropdown list. */
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

export function findPhoneCountryEntryByDialCode(
  code: string,
  iso?: string,
): PhoneCountryEntry | undefined {
  const normalized = code.trim();
  const normalizedIso = iso?.trim().toUpperCase();

  if (normalizedIso) {
    const byIso = PHONE_COUNTRY_ENTRIES.find((entry) => entry.country === normalizedIso);
    if (byIso?.code === normalized) {
      return byIso;
    }
  }

  return PHONE_COUNTRY_ENTRIES.find((entry) => entry.code === normalized);
}

/** Resolves a picker row when the list may be filtered (e.g. login OTP countries). */
export function resolvePhoneCountryEntryInList(
  dialCode: string,
  entries: readonly PhoneCountryEntry[],
  options?: { iso?: string; preferredIso?: string },
): PhoneCountryEntry | undefined {
  const normalized = dialCode.trim();
  const iso = options?.iso?.trim().toUpperCase();
  const preferredIso = options?.preferredIso?.trim().toUpperCase();

  if (iso) {
    const byIso = entries.find((entry) => entry.country === iso);
    if (byIso?.code === normalized) {
      return byIso;
    }
  }

  if (preferredIso) {
    const preferred = entries.find((entry) => entry.country === preferredIso);
    if (preferred?.code === normalized) {
      return preferred;
    }
  }

  return entries.find((entry) => entry.code === normalized);
}

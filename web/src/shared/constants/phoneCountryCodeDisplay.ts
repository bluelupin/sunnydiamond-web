import {
  findPhoneCountryEntryByDialCode,
  findPhoneCountryEntryByIso,
  type PhoneCountryEntry,
} from "./phoneCountryCodes";

/** Display metadata for phone country-code picker rows (Figma 6752:65169). */
export type PhoneCountryCodeDisplay = {
  code: string;
  iso: string;
  name: string;
};

/** Dial code label in list rows — Figma shows `(+91)` including the plus sign. */
export function formatPhoneDialCodeLabel(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("+") ? `(${trimmed})` : `(+${trimmed})`;
}

export function resolvePhoneCountryCodeDisplayFromEntry(entry: PhoneCountryEntry): PhoneCountryCodeDisplay {
  return {
    code: entry.code,
    iso: entry.country,
    name: entry.name,
  };
}

export function resolvePhoneCountryCodeDisplay(code: string, iso?: string): PhoneCountryCodeDisplay {
  const normalized = code.trim();
  const byIso = iso?.trim() ? findPhoneCountryEntryByIso(iso) : undefined;
  const entry = byIso ?? findPhoneCountryEntryByDialCode(normalized, iso);

  if (entry) {
    return resolvePhoneCountryCodeDisplayFromEntry(entry);
  }

  return {
    code: normalized,
    iso: iso?.trim().toUpperCase() ?? "",
    name: "International",
  };
}

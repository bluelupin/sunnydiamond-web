/** Display metadata for phone country-code picker rows (Figma 6752:65169). */
export type PhoneCountryCodeDisplay = {
  code: string;
  iso: string;
  name: string;
};

const PHONE_COUNTRY_BY_DIAL_CODE: Record<string, { iso: string; name: string }> = {
  "+1": { iso: "US", name: "United States" },
  "+44": { iso: "GB", name: "United Kingdom" },
  "+61": { iso: "AU", name: "Australia" },
  "+64": { iso: "NZ", name: "New Zealand" },
  "+65": { iso: "SG", name: "Singapore" },
  "+91": { iso: "IN", name: "India" },
  "+93": { iso: "AF", name: "Afghanistan" },
  "+355": { iso: "AL", name: "Albania" },
  "+965": { iso: "KW", name: "Kuwait" },
  "+966": { iso: "SA", name: "Saudi Arabia" },
  "+968": { iso: "OM", name: "Oman" },
  "+971": { iso: "AE", name: "United Arab Emirates" },
  "+973": { iso: "BH", name: "Bahrain" },
  "+974": { iso: "QA", name: "Qatar" },
};

/** Dial code label in list rows — Figma shows `(+91)` including the plus sign. */
export function formatPhoneDialCodeLabel(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.startsWith("+") ? `(${trimmed})` : `(+${trimmed})`;
}

export function resolvePhoneCountryCodeDisplay(code: string): PhoneCountryCodeDisplay {
  const normalized = code.trim();
  const meta = PHONE_COUNTRY_BY_DIAL_CODE[normalized];

  if (meta) {
    return {
      code: normalized,
      iso: meta.iso,
      name: meta.name,
    };
  }

  return {
    code: normalized,
    iso: "",
    name: "International",
  };
}

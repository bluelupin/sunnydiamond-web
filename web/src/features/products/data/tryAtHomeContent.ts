export const TRY_AT_HOME_INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

function normalizeStateOptionKey(value: string): string {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ");
}

/** Prefilled values may differ in case or punctuation from the dropdown (e.g. "uttar pradesh", "Jammu & Kashmir"). */
export function matchTryAtHomeStateSelectOption(
  value: string,
  options: readonly string[],
): string {
  const normalized = normalizeStateOptionKey(value);
  if (!normalized) {
    return "";
  }

  const exact = options.find((option) => normalizeStateOptionKey(option) === normalized);
  if (exact) {
    return exact;
  }

  // "NCT of Delhi" → "Delhi". Skip very short values so a code like "UP" is not matched by substring.
  if (normalized.length < 4) {
    return "";
  }

  return (
    options.find((option) => {
      const optionKey = normalizeStateOptionKey(option);
      return (
        optionKey.length >= 4 &&
        (normalized.includes(optionKey) || optionKey.includes(normalized))
      );
    }) ?? ""
  );
}

/** Full state/UT list for address forms; CMS entries are merged in but never replace this list. */
export function getTryAtHomeStateSelectOptions(
  cmsStateOptions?: readonly string[] | null,
  currentState?: string,
): string[] {
  const options = new Set<string>(TRY_AT_HOME_INDIAN_STATES);

  for (const state of cmsStateOptions ?? []) {
    const trimmed = state.trim();
    if (trimmed) {
      options.add(trimmed);
    }
  }

  const selected = currentState?.trim();
  if (selected) {
    options.add(selected);
  }

  return Array.from(options).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

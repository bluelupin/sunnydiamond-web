import type { CmsStateRelationOption } from "@/services/forms/product-form.types";
import { getIndiaMagentoRegionId } from "@/services/magento/regions/indiaRegionIds";
import { INDIAN_STATES_AND_UTS } from "@/shared/constants/indianStatesAndUts";

export const TRY_AT_HOME_INDIAN_STATES = INDIAN_STATES_AND_UTS;

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

function canonicalTryAtHomeState(value: string): string {
  return matchTryAtHomeStateSelectOption(value, TRY_AT_HOME_INDIAN_STATES) || value.trim();
}

/** Dropdown display label after pincode / prefill (unchanged UI copy). */
export function resolveTryAtHomeAddressStateLabelForUi(
  value: string,
  cmsStateFieldOptions?: readonly string[] | null,
  cmsRelationOptions?: readonly CmsStateRelationOption[] | null,
): string {
  const canonical = canonicalTryAtHomeState(value);
  if (!canonical) {
    return "";
  }

  const fieldOptions = cmsStateFieldOptions?.map((option) => option.trim()).filter(Boolean) ?? [];
  if (fieldOptions.length > 0) {
    const fieldMatch = matchTryAtHomeStateSelectOption(canonical, fieldOptions);
    if (fieldMatch) {
      return fieldMatch;
    }
  }

  const relations = cmsRelationOptions ?? [];
  if (relations.length > 0) {
    const matchedLabel = matchTryAtHomeStateSelectOption(
      canonical,
      relations.map((option) => option.label),
    );
    if (matchedLabel) {
      return matchedLabel;
    }
  }

  return matchTryAtHomeStateSelectOption(canonical, TRY_AT_HOME_INDIAN_STATES) || canonical;
}

type CmsStateFormSlice = {
  stateFieldOptions: string[];
  stateOptions: string[];
  stateRelationOptions: CmsStateRelationOption[];
};

/**
 * Value Strapi accepts on Try at Home / reschedule (name, region id, or CMS option text).
 * `pincodeGeoState` — from `/api/pincode-geo` / server lookup when available.
 */
export function pickTryAtHomeStateForCmsApi(
  rawState: string,
  cmsForm: CmsStateFormSlice | null,
  pincodeGeoState?: string,
): string {
  const fromGeo = pincodeGeoState ? canonicalTryAtHomeState(pincodeGeoState) : "";
  const fromRaw = canonicalTryAtHomeState(rawState);
  const base = fromGeo || fromRaw;
  if (!base) {
    return "";
  }

  const regionId = getIndiaMagentoRegionId(base);
  const tryValues = regionId != null ? [base, String(regionId)] : [base];

  const allowLists: string[][] = [];
  if (cmsForm?.stateFieldOptions.length) {
    allowLists.push(cmsForm.stateFieldOptions);
  }
  if (cmsForm?.stateOptions.length) {
    allowLists.push(cmsForm.stateOptions);
  }
  if (cmsForm?.stateRelationOptions.length) {
    allowLists.push(cmsForm.stateRelationOptions.map((option) => option.label));
    allowLists.push(cmsForm.stateRelationOptions.map((option) => option.submitValue));
  }

  if (allowLists.length === 0) {
    return base;
  }

  for (const candidate of tryValues) {
    for (const list of allowLists) {
      const hit = matchTryAtHomeStateSelectOption(candidate, list);
      if (hit) {
        return hit;
      }
    }
  }

  return base;
}

/** @deprecated Use pickTryAtHomeStateForCmsApi — kept for client submit hints. */
export function resolveTryAtHomeAddressStateForSubmit(
  value: string,
  cmsStateFieldOptions?: readonly string[] | null,
  cmsRelationOptions?: readonly CmsStateRelationOption[] | null,
): string {
  return pickTryAtHomeStateForCmsApi(
    value,
    cmsStateFieldOptions?.length || cmsRelationOptions?.length
      ? {
          stateFieldOptions: [...(cmsStateFieldOptions ?? [])],
          stateOptions: [],
          stateRelationOptions: [...(cmsRelationOptions ?? [])],
        }
      : null,
  );
}

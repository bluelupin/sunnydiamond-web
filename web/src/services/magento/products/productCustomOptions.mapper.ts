import type {
  ProductCustomOptionChoice,
  ProductCustomOptionChoiceValue,
  ProductCustomOptionField,
  ProductCustomOptions,
} from "@/features/products/types/productCustomOptions";

export type MagentoProductCustomOption = {
  uid?: string | null;
  title?: string | null;
  __typename?: string | null;
  fieldValue?: { uid?: string | null; max_characters?: number | null } | null;
  dropDownValues?: Array<{
    uid?: string | null;
    title?: string | null;
    option_type_id?: number | null;
  }> | null;
  radioValues?: Array<{
    uid?: string | null;
    title?: string | null;
    option_type_id?: number | null;
  }> | null;
};

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

export type CustomOptionFamily =
  | "engravingFont"
  | "engravingText"
  | "ringSize"
  | "metal"
  | "lineInstance";

/**
 * Canonical option-title classifier shared by the product, cart, and order
 * mappers. Ordering is load-bearing: "Engraving Font" contains "engrav", so the
 * font family must match first. The titles themselves ("Engraving Text" /
 * "Engraving Font") are a published contract with the backend option sync.
 */
export function classifyCustomOptionLabel(label: string): CustomOptionFamily | null {
  const normalized = normalizeLabel(label);

  if (normalized.includes("font")) {
    return "engravingFont";
  }

  if (
    normalized.includes("line instance") ||
    normalized.includes("cart line") ||
    normalized.includes("line key")
  ) {
    return "lineInstance";
  }

  if (normalized.includes("engrav")) {
    return "engravingText";
  }

  // "length" covers chain-length options on necklaces — same selector family.
  if (normalized.includes("size") || normalized.includes("length")) {
    return "ringSize";
  }

  if (normalized.includes("metal")) {
    return "metal";
  }

  return null;
}

/**
 * Option uids are base64 of "custom-option/<id>" — updateCartItems needs the
 * numeric id (the vendor's uid input silently wipes all custom options).
 * Single canonical decoder for both the product and cart mappers.
 */
export function decodeCustomOptionUid(uid: string | null | undefined): number | null {
  const value = uid?.trim();
  if (!value) {
    return null;
  }

  try {
    const decoded =
      typeof atob === "function"
        ? atob(value)
        : Buffer.from(value, "base64").toString("utf8");
    const match = /(\d+)\s*$/.exec(decoded);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

function mapChoiceOption(
  option: MagentoProductCustomOption,
): ProductCustomOptionChoice | null {
  const optionUid = option.uid?.trim();
  if (!optionUid) {
    return null;
  }

  const optionId = decodeCustomOptionUid(optionUid);
  if (optionId == null) {
    return null;
  }

  const values = option.dropDownValues ?? option.radioValues ?? [];
  const valuesByLabel: Record<string, string> = {};
  const valueMetaByLabel: Record<string, ProductCustomOptionChoiceValue> = {};
  const labels: string[] = [];

  for (const value of values) {
    const valueUid = value.uid?.trim();
    const label = value.title?.trim();
    if (!valueUid || !label) {
      continue;
    }

    valuesByLabel[normalizeLabel(label)] = valueUid;
    valueMetaByLabel[normalizeLabel(label)] = {
      valueUid,
      optionTypeId: value.option_type_id ?? null,
    };
    labels.push(label);
  }

  return {
    optionUid,
    optionId,
    valuesByLabel,
    valueMetaByLabel,
    labels,
  };
}

function mapFieldOption(option: MagentoProductCustomOption): ProductCustomOptionField | null {
  const optionUid = option.uid?.trim();
  if (!optionUid) {
    return null;
  }

  const optionId = decodeCustomOptionUid(optionUid);
  if (optionId == null) {
    return null;
  }

  const maxRaw = option.fieldValue?.max_characters;
  const maxCharacters =
    typeof maxRaw === "number" && Number.isFinite(maxRaw) && maxRaw > 0
      ? Math.floor(maxRaw)
      : null;

  return { optionUid, optionId, maxCharacters };
}

export function mapMagentoProductCustomOptions(
  options: MagentoProductCustomOption[] | null | undefined,
): ProductCustomOptions | undefined {
  if (!options?.length) {
    return undefined;
  }

  const mapped: ProductCustomOptions = {};

  for (const option of options) {
    const title = option.title?.trim();
    const optionUid = option.uid?.trim();
    if (!title || !optionUid) {
      continue;
    }

    switch (classifyCustomOptionLabel(title)) {
      case "engravingFont": {
        const choice = mapChoiceOption(option);
        if (choice) {
          mapped.engravingFont = choice;
        }
        break;
      }
      case "engravingText": {
        if (option.__typename === "CustomizableFieldOption") {
          const field = mapFieldOption(option);
          if (field) {
            mapped.engravingText = field;
          }
        }
        break;
      }
      case "ringSize": {
        // First match wins: the size family matches both "size" and "length", and
        // the size selector has one slot. Backend sort_order puts the real size
        // option first, so a later look-alike cannot displace it.
        const choice = mapped.ringSize ? null : mapChoiceOption(option);
        if (choice) {
          mapped.ringSize = choice;
        }
        break;
      }
      case "metal": {
        const choice = mapChoiceOption(option);
        if (choice) {
          mapped.metal = choice;
        }
        break;
      }
      case "lineInstance": {
        if (option.__typename === "CustomizableFieldOption") {
          const field = mapFieldOption(option);
          if (field) {
            mapped.lineInstance = field;
          }
        }
        break;
      }
      default:
        break;
    }
  }

  return Object.keys(mapped).length > 0 ? mapped : undefined;
}

function extractComparableToken(value: string): string {
  return value.trim().toLowerCase().replace(/[^\da-z.]/g, "");
}

export function getCustomOptionDisplayLabels(
  choice: ProductCustomOptionChoice | undefined,
): string[] {
  if (!choice) {
    return [];
  }

  if (choice.labels.length > 0) {
    return choice.labels;
  }

  return Object.keys(choice.valuesByLabel);
}

export function resolveCustomOptionValueMeta(
  choice: ProductCustomOptionChoice | undefined,
  label: string | undefined,
): ProductCustomOptionChoiceValue | null {
  const normalized = label?.trim();
  if (!choice || !normalized) {
    return null;
  }

  const exact = choice.valueMetaByLabel[normalizeLabel(normalized)];
  if (exact) {
    return exact;
  }

  const comparable = extractComparableToken(normalized);
  if (!comparable) {
    return null;
  }

  for (const [key, meta] of Object.entries(choice.valueMetaByLabel)) {
    if (extractComparableToken(key) === comparable) {
      return meta;
    }
  }

  for (const displayLabel of choice.labels) {
    if (extractComparableToken(displayLabel) === comparable) {
      return choice.valueMetaByLabel[normalizeLabel(displayLabel)] ?? null;
    }
  }

  return null;
}

export function resolveCustomOptionValueUid(
  choice: ProductCustomOptionChoice | undefined,
  label: string | undefined,
): string | null {
  return resolveCustomOptionValueMeta(choice, label)?.valueUid ?? null;
}

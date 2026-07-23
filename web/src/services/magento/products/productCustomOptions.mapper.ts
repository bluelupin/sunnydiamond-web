import type {
  ProductCustomOptionChoice,
  ProductCustomOptionField,
  ProductCustomOptions,
} from "@/features/products/types/productCustomOptions";

export type MagentoProductCustomOption = {
  uid?: string | null;
  title?: string | null;
  __typename?: string | null;
  fieldValue?: { uid?: string | null } | null;
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

function matchesTitle(title: string, patterns: RegExp[]): boolean {
  const normalized = normalizeLabel(title);
  return patterns.some((pattern) => pattern.test(normalized));
}

function mapChoiceOption(
  option: MagentoProductCustomOption,
): ProductCustomOptionChoice | null {
  const optionUid = option.uid?.trim();
  if (!optionUid) {
    return null;
  }

  const values = option.dropDownValues ?? option.radioValues ?? [];
  const valuesByLabel: Record<string, string> = {};

  for (const value of values) {
    const valueUid = value.uid?.trim();
    const label = value.title?.trim();
    if (!valueUid || !label) {
      continue;
    }

    valuesByLabel[normalizeLabel(label)] = valueUid;
  }

  return {
    optionUid,
    valuesByLabel,
  };
}

function mapFieldOption(option: MagentoProductCustomOption): ProductCustomOptionField | null {
  const optionUid = option.uid?.trim();
  if (!optionUid) {
    return null;
  }

  return { optionUid };
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

    if (matchesTitle(title, [/engrav/])) {
      if (option.__typename === "CustomizableFieldOption") {
        const field = mapFieldOption(option);
        if (field) {
          mapped.engravingText = field;
        }
      }
      continue;
    }

    if (matchesTitle(title, [/font/])) {
      const choice = mapChoiceOption(option);
      if (choice) {
        mapped.engravingFont = choice;
      }
      continue;
    }

    if (matchesTitle(title, [/ring\s*size/, /^size$/])) {
      const choice = mapChoiceOption(option);
      if (choice) {
        mapped.ringSize = choice;
      }
      continue;
    }

    if (matchesTitle(title, [/metal/])) {
      const choice = mapChoiceOption(option);
      if (choice) {
        mapped.metal = choice;
      }
    }
  }

  return Object.keys(mapped).length > 0 ? mapped : undefined;
}

export function resolveCustomOptionValueUid(
  choice: ProductCustomOptionChoice | undefined,
  label: string | undefined,
): string | null {
  const normalized = label?.trim();
  if (!choice || !normalized) {
    return null;
  }

  return choice.valuesByLabel[normalizeLabel(normalized)] ?? null;
}

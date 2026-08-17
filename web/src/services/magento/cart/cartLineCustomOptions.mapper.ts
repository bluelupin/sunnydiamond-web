import type { CartLineOptions } from "@/features/cart/types/cart.types";
import type {
  ProductCustomOptionChoice,
  ProductCustomOptions,
} from "@/features/products/types/productCustomOptions";
import {
  embedLineInstanceInEngraving,
  extractLineInstanceFromEngraving,
  resolveEngravingFieldMaxCharacters,
  stripLineInstanceFromEngraving,
} from "@/features/cart/utils/cartLineInstance.utils";
import {
  classifyCustomOptionLabel,
  decodeCustomOptionUid,
  resolveCustomOptionValueMeta,
  resolveCustomOptionValueUid,
} from "@/services/magento/products/productCustomOptions.mapper";
import type { MagentoCartCustomizableOption } from "./magentoCart.types";

export { decodeCustomOptionUid };

export type MagentoCartItemOptionPayload = {
  enteredOptions: Array<{ uid: string; value: string }>;
  selectedOptions: string[];
};

export function buildMagentoCartItemOptionPayload(
  lineOptions: CartLineOptions,
  productCustomOptions?: ProductCustomOptions,
): MagentoCartItemOptionPayload | null {
  if (!productCustomOptions) {
    return null;
  }

  const enteredOptions: Array<{ uid: string; value: string }> = [];
  const selectedOptions: string[] = [];

  const lineInstance = lineOptions.lineInstance?.trim();
  const lineInstanceOptionUid = productCustomOptions.lineInstance?.optionUid;
  if (lineInstanceOptionUid && lineInstance) {
    enteredOptions.push({
      uid: lineInstanceOptionUid,
      value: lineInstance,
    });
  }

  const engravingOptionUid = productCustomOptions.engravingText?.optionUid;
  const shouldUseEngravingCarrier = Boolean(
    engravingOptionUid && !lineInstanceOptionUid && lineInstance,
  );
  if (engravingOptionUid && (lineOptions.engravingSupported || shouldUseEngravingCarrier)) {
    const engraving = lineOptions.engraving?.trim() ?? "";
    const engravingMaxCharacters = resolveEngravingFieldMaxCharacters(productCustomOptions);

    if (engraving || shouldUseEngravingCarrier) {
      enteredOptions.push({
        uid: engravingOptionUid,
        value: shouldUseEngravingCarrier
          ? embedLineInstanceInEngraving(engraving, lineInstance!, engravingMaxCharacters)
          : engraving,
      });
    }
  }

  const engravingFont = lineOptions.engravingFont?.trim();
  if (engravingFont && productCustomOptions.engravingFont) {
    const engravingFontUid = resolveCustomOptionValueUid(
      productCustomOptions.engravingFont,
      engravingFont,
    );
    if (!engravingFontUid) {
      throw new Error(
        `Engraving font "${engravingFont}" could not be matched. Please choose a font from the list.`,
      );
    }
    selectedOptions.push(engravingFontUid);
  }

  const ringSize = lineOptions.ringSize?.trim();
  const ringSizeUid = resolveCustomOptionValueUid(productCustomOptions.ringSize, ringSize);
  if (ringSizeUid && ringSize) {
    selectedOptions.push(ringSizeUid);
  }

  const metal = lineOptions.metal?.trim();
  const metalUid = resolveCustomOptionValueUid(productCustomOptions.metal, metal);
  if (metalUid && metal) {
    selectedOptions.push(metalUid);
  }

  if (enteredOptions.length === 0 && selectedOptions.length === 0) {
    return null;
  }

  return {
    enteredOptions,
    selectedOptions,
  };
}

export type CartLineServerCustomOption = {
  optionId: number;
  /** updateCartItems value_string: entered text for field options, option_type_id string for selects. */
  valueString: string;
};

/** Option identity decoded from a cart line's own customizable_options response. */
export type CartLineServerCustomOptions = {
  engravingText?: CartLineServerCustomOption;
  engravingFont?: CartLineServerCustomOption;
  ringSize?: CartLineServerCustomOption;
  metal?: CartLineServerCustomOption;
  lineInstance?: CartLineServerCustomOption;
  /** Options outside the classified families — resent verbatim so updates cannot wipe them. */
  other?: CartLineServerCustomOption[];
};

export type MappedCartLineCustomOptions = {
  lineOptions: Partial<CartLineOptions>;
  serverOptions: CartLineServerCustomOptions;
};

export function mapMagentoCartCustomizableOptions(
  options: MagentoCartCustomizableOption[] | null | undefined,
): MappedCartLineCustomOptions {
  const lineOptions: Partial<CartLineOptions> = {};
  const serverOptions: CartLineServerCustomOptions = {};

  for (const option of options ?? []) {
    const label = option.label?.trim();
    const value = option.values?.[0];
    const valueLabel = value?.label?.trim();
    const valueText = value?.value?.trim() || valueLabel;
    if (!label || !valueText) {
      continue;
    }

    const key = classifyCustomOptionLabel(label);
    if (!key || serverOptions[key]) {
      // Unclassified (or duplicate-labelled) options still need their identity
      // preserved — an update payload omitting them wipes them from the quote.
      const otherId = decodeCustomOptionUid(option.customizable_option_uid);
      if (otherId != null) {
        (serverOptions.other ??= []).push({
          optionId: otherId,
          valueString: value?.value?.trim() ?? valueText,
        });
      }
      continue;
    }

    switch (key) {
      case "engravingText": {
        const embeddedLineInstance = extractLineInstanceFromEngraving(valueText);
        lineOptions.engraving = stripLineInstanceFromEngraving(valueText);
        if (embeddedLineInstance) {
          lineOptions.lineInstance = embeddedLineInstance;
        }
        break;
      }
      case "lineInstance":
        lineOptions.lineInstance = valueText;
        break;
      case "engravingFont":
        lineOptions.engravingFont = valueLabel || valueText;
        break;
      case "ringSize":
        lineOptions.ringSize = valueLabel || valueText;
        break;
      case "metal":
        lineOptions.metal = valueLabel || valueText;
        break;
    }

    const optionId = decodeCustomOptionUid(option.customizable_option_uid);
    if (optionId != null) {
      serverOptions[key] = { optionId, valueString: value?.value?.trim() ?? valueText };
    }
  }

  return { lineOptions, serverOptions };
}

export function mapMagentoCartCustomizableOptionsToLineOptions(
  options: MagentoCartCustomizableOption[] | null | undefined,
): Partial<CartLineOptions> {
  return mapMagentoCartCustomizableOptions(options).lineOptions;
}

export type MagentoCartItemSyncOption = {
  id: number;
  value_string: string;
};

/** Legacy persisted metadata predates optionId — fall back to decoding the stored uid. */
function resolveMetadataOptionId(
  option: { optionId?: number | null; optionUid?: string | null } | undefined,
): number | null {
  if (!option) {
    return null;
  }

  if (typeof option.optionId === "number" && Number.isFinite(option.optionId)) {
    return option.optionId;
  }

  return decodeCustomOptionUid(option.optionUid);
}

function resolveChoiceOptionTypeId(
  choice: ProductCustomOptionChoice | undefined,
  label: string | undefined,
): string | null {
  // Legacy persisted metadata may lack valueMetaByLabel entirely.
  if (!choice?.valueMetaByLabel) {
    return null;
  }

  const optionTypeId = resolveCustomOptionValueMeta(choice, label)?.optionTypeId;
  return optionTypeId != null ? String(optionTypeId) : null;
}

function appendChoiceSyncOption(
  target: MagentoCartItemSyncOption[],
  label: string | undefined,
  serverOption: CartLineServerCustomOption | undefined,
  metadataChoice: ProductCustomOptionChoice | undefined,
): void {
  const id = serverOption?.optionId ?? resolveMetadataOptionId(metadataChoice);
  if (id == null) {
    return;
  }

  const valueString =
    resolveChoiceOptionTypeId(metadataChoice, label?.trim()) ||
    serverOption?.valueString ||
    null;
  if (!valueString) {
    return;
  }

  target.push({ id, value_string: valueString });
}

export type BuildMagentoCartItemSyncOptionsInput = {
  /** Desired state for the line. */
  lineOptions: CartLineOptions;
  /** Ids decoded from the line's own server customizable_options — preferred source. */
  serverOptions?: CartLineServerCustomOptions;
  /** Stored product option metadata — fallback for optimistic/legacy lines. */
  productCustomOptions?: ProductCustomOptions;
};

/**
 * updateCartItems customizable_options payload. Must use numeric ids (never uid)
 * and must resend every option on the line — options missing from the payload
 * are removed by Magento.
 */
export function buildMagentoCartItemSyncOptions({
  lineOptions,
  serverOptions,
  productCustomOptions,
}: BuildMagentoCartItemSyncOptionsInput): MagentoCartItemSyncOption[] | null {
  const syncOptions: MagentoCartItemSyncOption[] = [];

  const lineInstanceId =
    serverOptions?.lineInstance?.optionId ??
    resolveMetadataOptionId(productCustomOptions?.lineInstance);
  const lineInstance = lineOptions.lineInstance?.trim();
  const serverLineInstance = serverOptions?.lineInstance;

  if (lineInstanceId != null && lineInstance) {
    syncOptions.push({ id: lineInstanceId, value_string: lineInstance });
  } else if (serverLineInstance) {
    syncOptions.push({
      id: serverLineInstance.optionId,
      value_string: serverLineInstance.valueString,
    });
  }

  const engravingTextId =
    serverOptions?.engravingText?.optionId ??
    resolveMetadataOptionId(productCustomOptions?.engravingText);
  // Key presence distinguishes an explicit clear ("") from engraving never tracked locally.
  const engravingTracked = lineOptions.engraving !== undefined;
  const engraving = lineOptions.engraving?.trim() ?? "";
  const serverEngravingText = serverOptions?.engravingText;

  if (engravingTracked && engravingTextId != null) {
    const shouldEmbedLineInstance =
      lineInstanceId == null && Boolean(lineInstance || serverLineInstance?.valueString);
    const resolvedLineInstance =
      lineInstance || extractLineInstanceFromEngraving(serverEngravingText?.valueString ?? "");
    const engravingMaxCharacters = resolveEngravingFieldMaxCharacters(productCustomOptions);
    const engravingPayload =
      shouldEmbedLineInstance && resolvedLineInstance
        ? embedLineInstanceInEngraving(engraving, resolvedLineInstance, engravingMaxCharacters)
        : engraving;

    // Empty value clears the text; the font is cleared by omitting it below.
    syncOptions.push({ id: engravingTextId, value_string: engravingPayload });

    if (engraving) {
      appendChoiceSyncOption(
        syncOptions,
        lineOptions.engravingFont,
        serverOptions?.engravingFont,
        productCustomOptions?.engravingFont,
      );
    }
  } else if (serverEngravingText) {
    // Not tracked locally — resend the server's engraving so this update cannot wipe it.
    syncOptions.push({
      id: serverEngravingText.optionId,
      value_string: serverEngravingText.valueString,
    });
    appendChoiceSyncOption(
      syncOptions,
      lineOptions.engravingFont,
      serverOptions?.engravingFont,
      productCustomOptions?.engravingFont,
    );
  }

  appendChoiceSyncOption(
    syncOptions,
    lineOptions.ringSize,
    serverOptions?.ringSize,
    productCustomOptions?.ringSize,
  );
  appendChoiceSyncOption(
    syncOptions,
    lineOptions.metal,
    serverOptions?.metal,
    productCustomOptions?.metal,
  );

  // Unclassified server options ride along unchanged — omission would wipe them.
  for (const option of serverOptions?.other ?? []) {
    syncOptions.push({ id: option.optionId, value_string: option.valueString });
  }

  return syncOptions.length > 0 ? syncOptions : null;
}

/** True when the payload would not change the line — skipping avoids a needless cart item uid rotation. */
export function syncOptionsMatchServer(
  syncOptions: MagentoCartItemSyncOption[],
  serverOptions: CartLineServerCustomOptions,
): boolean {
  const serverById = new Map<number, string>();
  const { other, ...classified } = serverOptions;
  for (const option of Object.values(classified)) {
    if (option) {
      serverById.set(option.optionId, option.valueString);
    }
  }
  for (const option of other ?? []) {
    serverById.set(option.optionId, option.valueString);
  }

  for (const { id, value_string } of syncOptions) {
    // An option absent on the server matches only an empty (clearing) value.
    if ((serverById.get(id) ?? "") !== value_string) {
      return false;
    }
    serverById.delete(id);
  }

  // Any server option left out of the payload would be wiped — that is a change.
  return serverById.size === 0;
}

type AssertResolvableCartLineOptionsInput = {
  lineOptions: CartLineOptions;
  productCustomOptions?: ProductCustomOptions;
  /** When metal is sent as configurable variant UIDs, skip custom-option metal checks. */
  skipMetal?: boolean;
};

export function assertResolvableCartLineOptions({
  lineOptions,
  productCustomOptions,
  skipMetal = false,
}: AssertResolvableCartLineOptionsInput): void {
  if (!productCustomOptions) {
    return;
  }

  const ringSize = lineOptions.ringSize?.trim();
  if (ringSize && productCustomOptions.ringSize) {
    const ringSizeUid = resolveCustomOptionValueUid(productCustomOptions.ringSize, ringSize);
    if (!ringSizeUid) {
      throw new Error(
        `Ring size "${ringSize}" could not be matched. Please choose a size from the list.`,
      );
    }
  }

  if (!skipMetal) {
    const metal = lineOptions.metal?.trim();
    if (metal && productCustomOptions.metal) {
      const metalUid = resolveCustomOptionValueUid(productCustomOptions.metal, metal);
      if (!metalUid) {
        throw new Error(
          `Metal "${metal}" could not be matched. Please choose a metal option from the list.`,
        );
      }
    }
  }

  const engravingFont = lineOptions.engravingFont?.trim();
  if (engravingFont && productCustomOptions.engravingFont) {
    const fontUid = resolveCustomOptionValueUid(productCustomOptions.engravingFont, engravingFont);
    if (!fontUid) {
      throw new Error(
        `Engraving font "${engravingFont}" could not be matched. Please choose a font from the list.`,
      );
    }
  }
}

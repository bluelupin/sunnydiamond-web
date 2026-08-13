import type { Product } from "@/features/products/data/products";
import type { CartGiftingOptions, CartLineItem, CartLineOptions } from "@/features/cart/types/cart.types";
import { buildProductSeo } from "@/shared/lib/seo/productSeo";
import { resolveMagentoProductImages } from "../products/products.mapper";
import fallBackImage from "@/assets/fallBackImage.png";
import type {
  MagentoCart,
  MagentoCartConfigurableOption,
  MagentoCartDiscount,
  MagentoCartItem,
  MagentoShippingMethod,
  MagentoShippingMethodOption,
  MagentoPaymentMethod,
  MagentoPaymentMethodOption,
  MagentoSelectedPaymentMethod,
  MagentoSelectedShippingMethod,
  MappedMagentoCart,
} from "./magentoCart.types";
import type { CartLineMetadata, StoredCartLineMetadata } from "./cartSession";
import { mapMagentoCartCustomizableOptionsToLineOptions } from "./cartLineCustomOptions.mapper";
import {
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
  isCartLineEngravingCapable,
} from "@/features/products/constants/engraving";

function mapCartItemProduct(item: MagentoCartItem): Product | null {
  const product = item.product;
  const sku = product?.sku?.trim();
  const name = product?.name?.trim();
  const urlKey = product?.url_key?.trim();
  const unitPrice = item.prices?.price?.value;
  const rowTotal = item.prices?.row_total?.value;
  const quantity = item.quantity ?? 1;
  const resolvedUnitPrice =
    rowTotal != null && quantity > 0 ? rowTotal / quantity : unitPrice;

  if (!sku || !name || !urlKey || resolvedUnitPrice == null) {
    return null;
  }

  // Prefer Magento configured child (gold variant) imagery over the configurable parent.
  const variant = item.configured_variant;
  const { primaryImage } = resolveMagentoProductImages(
    variant?.media_gallery ?? product?.media_gallery,
    variant?.image?.url ?? product?.image?.url,
  );
  const image = primaryImage || fallBackImage;

  return {
    id: sku,
    urlKey,
    name,
    price: resolvedUnitPrice,
    description: name,
    shortDescription: name,
    category: "",
    image,
    images: [image],
    carat: "",
    metal: "",
    inStock: true,
    featured: false,
    rating: 0,
    reviews: 0,
    detailAttributes: [],
    seo: buildProductSeo({
      name,
      urlKey,
      shortDescription: name,
    }),
  };
}

function mapMagentoConfigurableOptionsToLineOptions(
  options: MagentoCartConfigurableOption[] | null | undefined,
): Partial<CartLineOptions> {
  const mapped: Partial<CartLineOptions> = {};

  for (const option of options ?? []) {
    const optionLabel = option.option_label?.trim().toLowerCase() ?? "";
    const valueLabel = option.value_label?.trim();
    if (!valueLabel) {
      continue;
    }

    if (optionLabel.includes("metal") || optionLabel.includes("color") || optionLabel.includes("gold")) {
      mapped.metal = valueLabel;
    }
  }

  return mapped;
}

export function mapEstimateShippingMethods(
  methods: MagentoShippingMethod[] | null | undefined,
): MagentoShippingMethodOption[] {
  const mapped: MagentoShippingMethodOption[] = [];

  for (const method of methods ?? []) {
    const option = mapShippingMethodOption(method);
    if (option) {
      mapped.push(option);
    }
  }

  return mapped;
}

function mapShippingMethodOption(method: MagentoShippingMethod): MagentoShippingMethodOption | null {
  const carrierCode = method.carrier_code?.trim();
  const methodCode = method.method_code?.trim();

  if (!carrierCode || !methodCode) {
    return null;
  }

  return {
    carrierCode,
    carrierTitle: method.carrier_title?.trim() || carrierCode,
    methodCode,
    methodTitle: method.method_title?.trim() || methodCode,
    amount: method.amount?.value ?? 0,
    currency: method.amount?.currency ?? "INR",
  };
}

export function mapAvailableShippingMethods(cart: MagentoCart): MagentoShippingMethodOption[] {
  const methods: MagentoShippingMethodOption[] = [];

  for (const method of cart.shipping_addresses?.[0]?.available_shipping_methods ?? []) {
    const mapped = mapShippingMethodOption(method);
    if (mapped) {
      methods.push(mapped);
    }
  }

  return methods;
}

export function mapSelectedShippingMethod(
  cart: MagentoCart,
): MagentoSelectedShippingMethod | null {
  const selected = cart.shipping_addresses?.[0]?.selected_shipping_method;
  const methodCode = selected?.method_code?.trim();
  const carrierCode = selected?.carrier_code?.trim() || methodCode;

  if (!methodCode || !carrierCode) {
    return null;
  }

  return {
    carrierCode,
    methodCode,
    title: selected?.method_title?.trim() || selected?.carrier_title?.trim() || methodCode,
    amount: selected?.amount?.value ?? 0,
  };
}

export function pickDefaultShippingMethod(
  methods: MagentoShippingMethodOption[],
): MagentoShippingMethodOption | null {
  if (methods.length === 0) {
    return null;
  }

  const freeMethod = methods.find((method) => method.amount === 0);
  if (freeMethod) {
    return freeMethod;
  }

  return methods.reduce((cheapest, method) =>
    method.amount < cheapest.amount ? method : cheapest,
  );
}

export function mapAvailablePaymentMethods(cart: MagentoCart): MagentoPaymentMethodOption[] {
  const methods: MagentoPaymentMethodOption[] = [];

  for (const method of cart.available_payment_methods ?? []) {
    const code = method.code?.trim();
    if (!code) {
      continue;
    }

    methods.push({
      code,
      title: method.title?.trim() || code,
    });
  }

  return methods;
}

export function mapSelectedPaymentMethod(cart: MagentoCart): MagentoSelectedPaymentMethod | null {
  const selected = cart.selected_payment_method;
  const code = selected?.code?.trim();

  if (!code || !selected) {
    return null;
  }

  return {
    code,
    title: selected.title?.trim() || code,
  };
}

function isGiftCardDiscount(discount: MagentoCartDiscount): boolean {
  const label = discount.label?.toLowerCase() ?? "";
  return label.includes("gift card") || label.includes("giftcard");
}

export function mapCartDiscounts(cart: MagentoCart) {
  let offerDiscount = 0;
  let giftCardDiscount = 0;
  let appliedGiftCardCode: string | null = null;

  for (const discount of cart.prices?.discounts ?? []) {
    const amount = Math.abs(discount.amount?.value ?? 0);
    if (amount <= 0) {
      continue;
    }

    if (isGiftCardDiscount(discount)) {
      giftCardDiscount += amount;
      appliedGiftCardCode =
        discount.coupon?.code?.trim() || appliedGiftCardCode;
      continue;
    }

    offerDiscount += amount;
  }

  return {
    offerDiscount,
    giftCardDiscount,
    appliedGiftCardCode,
  };
}

export function mapMagentoCartTotals(cart: MagentoCart): MappedMagentoCart | null {
  const cartId = cart.id?.trim();
  if (!cartId) {
    return null;
  }

  const subtotal = cart.prices?.subtotal_excluding_tax?.value ?? 0;
  const taxes = (cart.prices?.applied_taxes ?? []).reduce(
    (sum, tax) => sum + (tax.amount?.value ?? 0),
    0,
  );
  const shipping = cart.shipping_addresses?.[0]?.selected_shipping_method?.amount?.value ?? 0;
  const grandTotal = cart.prices?.grand_total?.value ?? subtotal + taxes + shipping;
  const { offerDiscount, giftCardDiscount, appliedGiftCardCode } = mapCartDiscounts(cart);

  return {
    cartId,
    totalQuantity: cart.total_quantity ?? 0,
    subtotal,
    taxes,
    shipping,
    offerDiscount,
    giftCardDiscount,
    appliedGiftCardCode,
    grandTotal,
    currency: cart.prices?.grand_total?.currency ?? "INR",
    shippingMethods: mapAvailableShippingMethods(cart),
    selectedShippingMethod: mapSelectedShippingMethod(cart),
    paymentMethods: mapAvailablePaymentMethods(cart),
    selectedPaymentMethod: mapSelectedPaymentMethod(cart),
  };
}

export function computeCartTotalQuantity(items: readonly CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function mapServerGifting(
  cart: MagentoCart,
  item: MagentoCartItem,
): CartGiftingOptions | undefined {
  if (!item.is_gift) {
    return undefined;
  }

  const wrapMode = cart.gift_mode === "SEPARATE" ? "separate" : "single";
  const note =
    wrapMode === "separate"
      ? item.gift_message?.message?.trim()
      : cart.gift_message?.message?.trim();

  return { wrapMode, note: note || undefined };
}

/** Magento may return is_gift without per-line messages in separate mode — keep stored notes. */
function mergeLineGifting(
  serverGifting: CartGiftingOptions | undefined,
  metadataGifting: CartGiftingOptions | undefined,
): CartGiftingOptions | undefined {
  if (!serverGifting && !metadataGifting) {
    return undefined;
  }

  const wrapMode = serverGifting?.wrapMode ?? metadataGifting?.wrapMode;
  const note = serverGifting?.note?.trim() || metadataGifting?.note?.trim() || undefined;

  if (!wrapMode && !note) {
    return serverGifting ?? metadataGifting;
  }

  return {
    ...(wrapMode ? { wrapMode } : {}),
    ...(note ? { note } : {}),
  };
}

export function mapMagentoCartItems(
  cart: MagentoCart,
  lineMetadata: StoredCartLineMetadata,
): CartLineItem[] {
  const items: CartLineItem[] = [];

  for (const item of cart.itemsV2?.items ?? []) {
    const uid = item.uid?.trim();
    const quantity = item.quantity ?? 0;
    const product = mapCartItemProduct(item);

    if (!uid || !product || quantity <= 0) {
      continue;
    }

    const metadata: CartLineMetadata = lineMetadata[uid] ?? { options: {} };
    const magentoOptions = mapMagentoCartCustomizableOptionsToLineOptions(item.customizable_options);
    const configurableOptions = mapMagentoConfigurableOptionsToLineOptions(item.configurable_options);
    const mergedOptions = {
      ...metadata.options,
      ...magentoOptions,
      ...configurableOptions,
    };

    const engravingEnabledForLine = isCartLineEngravingCapable({
      options: metadata.options,
      productCustomOptions: metadata.productCustomOptions,
    });

    if (engravingEnabledForLine) {
      mergedOptions.engravingSupported = true;

      if ("engraving" in metadata.options) {
        mergedOptions.engraving = metadata.options.engraving?.trim() || undefined;
      }

      if ("engravingFont" in metadata.options) {
        mergedOptions.engravingFont = metadata.options.engravingFont?.trim() || undefined;
      }

      if (mergedOptions.engravingMaxCharacters == null) {
        mergedOptions.engravingMaxCharacters =
          metadata.options.engravingMaxCharacters ?? DEFAULT_ENGRAVING_MAX_CHARACTERS;
      }
    } else {
      delete mergedOptions.engraving;
      delete mergedOptions.engravingFont;
      delete mergedOptions.engravingMaxCharacters;
      delete mergedOptions.engravingSupported;
    }

    // Magento is the source of truth once a gift is saved there; localStorage
    // metadata covers marks that have not been synced yet.
    const serverGifting = mapServerGifting(cart, item);
    if (serverGifting) {
      mergedOptions.isGift = true;
    }

    items.push({
      id: uid,
      product,
      quantity,
      options: mergedOptions,
      gifting: mergeLineGifting(serverGifting, metadata.gifting),
      ...(metadata.displayPrice != null && Number.isFinite(metadata.displayPrice)
        ? { displayPrice: metadata.displayPrice }
        : {}),
    });
  }

  return items;
}

export function findCartItemUidBySku(cart: MagentoCart, sku: string): string | null {
  const normalizedSku = sku.trim();

  for (const item of cart.itemsV2?.items ?? []) {
    if (item.product?.sku?.trim() === normalizedSku && item.uid?.trim()) {
      return item.uid.trim();
    }
  }

  return null;
}

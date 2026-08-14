"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/features/products/data/products";
import { useAuth } from "@/features/auth/context/AuthContext";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import {
  addProductToGuestCart,
  ensureGuestCartId,
  estimateGuestCartShippingMethods,
  fetchCustomerCart,
  fetchGuestCart,
  migrateLegacyLinesToGuestCart,
  removeGuestCartItem,
  setCartGiftOptions,
  setGuestShippingMethod,
  syncGuestCartLineOption,
  updateGuestCartItemQuantity,
  type GuestCartState,
} from "@/services/magento/cart/cart.service";
import type {
  MagentoSelectedShippingMethod,
  MagentoShippingMethodOption,
  MagentoPaymentMethodOption,
  MagentoSelectedPaymentMethod,
} from "@/services/magento/cart/magentoCart.types";
import {
  clearGuestCartId,
  getGuestCartId,
  readCartLineMetadata,
  writeCartLineMetadata,
  type CartLineMetadata,
  type StoredCartLineMetadata,
} from "@/services/magento/cart/cartSession";
import { findCartItemUidBySku, computeCartTotalQuantity } from "@/services/magento/cart/cart.mapper";
import { readStoredCartLines, writeStoredCartLines } from "@/features/cart/utils/cartProduct.utils";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import {
  DEFAULT_ENGRAVING_MAX_CHARACTERS,
  ENGRAVING_CHARSET_MESSAGE,
  ENGRAVING_TEXT_PATTERN,
  isCartLineEngravingCapable,
  mergeCartLineOptions,
} from "@/features/products/constants/engraving";
import type {
  AddItemResult,
  AddToBagPayload,
  CartGiftingOptions,
  CartGiftingSelection,
  CartLineItem,
  CartLineOptions,
} from "../types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";
import { getProductDisplayPrice } from "@/features/products/data/productDetailContent";
import {
  assertResolvableCartLineOptions,
  mapMagentoCartCustomizableOptions,
} from "@/services/magento/cart/cartLineCustomOptions.mapper";

/** @deprecated Use CartLineItem from cart.types */
export type CartItem = CartLineItem;

type RemoveItemOptions = {
  showToast?: boolean;
};

interface CartContextType {
  items: CartLineItem[];
  isHydrating: boolean;
  isUpdating: boolean;
  addItem: (payload: AddToBagPayload | Product) => Promise<AddItemResult>;
  removeItem: (lineItemId: string, options?: RemoveItemOptions) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  updateLineItemOptions: (lineItemId: string, options: Partial<CartLineOptions>) => Promise<void>;
  applyGiftingSelection: (selection: CartGiftingSelection) => Promise<void>;
  applyMagentoCartState: (state: GuestCartState) => void;
  refreshCart: () => Promise<void>;
  selectShippingMethod: (carrierCode: string, methodCode: string) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  taxes: number;
  shipping: number;
  offerDiscount: number;
  giftCardDiscount: number;
  appliedGiftCardCode: string | null;
  localGiftCardDiscount: number;
  appliedLocalGiftCardCode: string | null;
  applyLocalGiftCard: (code: string, balance: number) => void;
  removeLocalGiftCard: () => void;
  replaceLineItem: (lineItemId: string, payload: AddToBagPayload) => Promise<AddItemResult>;
  buyNow: (lineItemId: string) => Promise<void>;
  getLineItemMetadata: (lineItemId: string) => CartLineMetadata | undefined;
  shippingMethods: MagentoShippingMethodOption[];
  estimatedShippingMethods: MagentoShippingMethodOption[];
  selectedShippingMethod: MagentoSelectedShippingMethod | null;
  paymentMethods: MagentoPaymentMethodOption[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isAddToBagPayload = (payload: AddToBagPayload | Product): payload is AddToBagPayload =>
  "product" in payload;

const normalizePayload = (payload: AddToBagPayload | Product): AddToBagPayload =>
  isAddToBagPayload(payload)
    ? payload
    : { product: payload, options: {}, productCustomOptions: payload.customOptions };

function resolveLineUidForSku(state: GuestCartState, sku: string): string | null {
  const fromCart = findCartItemUidBySku(state.cart, sku);
  if (fromCart) {
    return fromCart;
  }

  const matchingItems = state.items.filter((item) => item.product.id === sku);
  return matchingItems.at(-1)?.id ?? null;
}

function resolveAddedLineUid(
  previousItems: CartLineItem[],
  nextState: GuestCartState,
  sku: string,
  options: CartLineOptions,
): string | null {
  const previousIds = new Set(previousItems.map((item) => item.id));
  const newLines = nextState.items.filter((item) => !previousIds.has(item.id));

  if (newLines.length === 1) {
    return newLines[0].id;
  }

  const ringSize = options.ringSize?.trim();
  const metal = options.metal?.trim();

  const matchingNew = newLines.find((item) => {
    if (item.product.id !== sku) {
      return false;
    }

    if (ringSize && item.options.ringSize?.trim() !== ringSize) {
      return false;
    }

    if (metal && item.options.metal?.trim() !== metal) {
      return false;
    }

    return true;
  });

  if (matchingNew) {
    return matchingNew.id;
  }

  return resolveLineUidForSku(nextState, sku);
}

function upsertLineMetadata(
  current: StoredCartLineMetadata,
  lineUid: string,
  options: CartLineOptions,
  productCustomOptions?: ProductCustomOptions,
  displayPrice?: number,
): StoredCartLineMetadata {
  const previous = current[lineUid] ?? { options: {} };

  return {
    ...current,
    [lineUid]: {
      ...previous,
      options: { ...previous.options, ...options },
      productCustomOptions: productCustomOptions ?? previous.productCustomOptions,
      ...(displayPrice != null && Number.isFinite(displayPrice) ? { displayPrice } : {}),
    },
  };
}

const emptyTotals = {
  subtotal: 0,
  taxes: 0,
  shipping: 0,
  offerDiscount: 0,
  giftCardDiscount: 0,
  appliedGiftCardCode: null as string | null,
  grandTotal: 0,
  totalQuantity: 0,
  currency: "INR",
  shippingMethods: [] as MagentoShippingMethodOption[],
  selectedShippingMethod: null as MagentoSelectedShippingMethod | null,
  paymentMethods: [] as MagentoPaymentMethodOption[],
  selectedPaymentMethod: null as MagentoSelectedPaymentMethod | null,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";
  const [cartState, setCartState] = useState<GuestCartState | null>(null);
  const [lineMetadata, setLineMetadata] = useState<StoredCartLineMetadata>(() => readCartLineMetadata());
  const [estimatedShippingMethods, setEstimatedShippingMethods] = useState<
    MagentoShippingMethodOption[]
  >([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cartStatusToastMessage, setCartStatusToastMessage] = useState<string | null>(null);
  const [localGiftCardDiscount, setLocalGiftCardDiscount] = useState(0);
  const [appliedLocalGiftCardCode, setAppliedLocalGiftCardCode] = useState<string | null>(null);
  const cartStatusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineMetadataRef = useRef(lineMetadata);
  const initRef = useRef(false);
  const shippingEstimateRequestRef = useRef(0);

  useEffect(() => {
    lineMetadataRef.current = lineMetadata;
    if (!isHydrating) {
      writeCartLineMetadata(lineMetadata);
    }
  }, [isHydrating, lineMetadata]);

  const dismissCartStatusToast = useCallback(() => {
    if (cartStatusToastTimeoutRef.current) {
      clearTimeout(cartStatusToastTimeoutRef.current);
      cartStatusToastTimeoutRef.current = null;
    }
    setCartStatusToastMessage(null);
  }, []);

  const showCartStatusToast = useCallback(
    (message: string) => {
      dismissCartStatusToast();
      setCartStatusToastMessage(message);
      cartStatusToastTimeoutRef.current = setTimeout(() => {
        setCartStatusToastMessage(null);
        cartStatusToastTimeoutRef.current = null;
      }, appStatusToastDurationMs);
    },
    [dismissCartStatusToast],
  );

  const showRemovedFromCartToast = useCallback(() => {
    showCartStatusToast("Item removed from cart");
  }, [showCartStatusToast]);

  useEffect(() => {
    return () => {
      if (cartStatusToastTimeoutRef.current) {
        clearTimeout(cartStatusToastTimeoutRef.current);
      }
    };
  }, []);

  const refreshShippingEstimate = useCallback(async (state: GuestCartState | null) => {
    const requestId = ++shippingEstimateRequestRef.current;

    if (
      !state ||
      state.items.length === 0 ||
      state.totals.selectedShippingMethod ||
      state.totals.shippingMethods.length > 0
    ) {
      setEstimatedShippingMethods([]);
      return;
    }

    try {
      const methods = await estimateGuestCartShippingMethods(state.totals.cartId);
      if (requestId !== shippingEstimateRequestRef.current) {
        return;
      }
      setEstimatedShippingMethods(methods);
    } catch {
      if (requestId !== shippingEstimateRequestRef.current) {
        return;
      }
      setEstimatedShippingMethods([]);
    }
  }, []);

  const applyCartState = useCallback(
    (nextState: GuestCartState) => {
      setCartState(nextState);
      void refreshShippingEstimate(nextState);
    },
    [refreshShippingEstimate],
  );

  const refreshCart = useCallback(
    async (cartId: string) => {
      const nextState = isAuthenticated
        ? await fetchCustomerCart(lineMetadataRef.current)
        : await fetchGuestCart(cartId, lineMetadataRef.current);
      applyCartState(nextState);
      return nextState;
    },
    [applyCartState, isAuthenticated],
  );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (initRef.current) {
      return;
    }

    initRef.current = true;

    async function initializeCart() {
      setIsHydrating(true);

      try {
        const metadata = readCartLineMetadata();
        setLineMetadata(metadata);
        lineMetadataRef.current = metadata;

        if (isAuthenticated) {
          const nextState = await fetchCustomerCart(metadata);
          applyCartState(nextState);
          return;
        }

        const legacyLines = readStoredCartLines();
        const cartId = getGuestCartId();

        if (!cartId && legacyLines.length > 0) {
          const migrated = await migrateLegacyLinesToGuestCart(
            legacyLines.map((line) => ({ sku: line.sku, quantity: line.quantity })),
            metadata,
          );
          writeStoredCartLines([]);

          if (migrated) {
            const nextMetadata = { ...metadata };
            for (const line of legacyLines) {
              const uid = findCartItemUidBySku(migrated.cart, line.sku);
              if (uid) {
                nextMetadata[uid] = {
                  options: line.options,
                  gifting: line.gifting,
                };
              }
            }
            setLineMetadata(nextMetadata);
            lineMetadataRef.current = nextMetadata;
            applyCartState({
              ...migrated,
              items: migrated.items.map((item) => ({
                ...item,
                options: nextMetadata[item.id]?.options ?? item.options,
                gifting: nextMetadata[item.id]?.gifting,
              })),
            });
            return;
          }
        }

        if (!cartId) {
          shippingEstimateRequestRef.current += 1;
          setCartState(null);
          setEstimatedShippingMethods([]);
          return;
        }

        if (legacyLines.length > 0) {
          writeStoredCartLines([]);
        }

        await refreshCart(cartId);
      } catch {
        clearGuestCartId();
        shippingEstimateRequestRef.current += 1;
        setCartState(null);
        setEstimatedShippingMethods([]);
      } finally {
        setIsHydrating(false);
      }
    }

    void initializeCart();
  }, [applyCartState, isAuthenticated, refreshCart, status]);

  const addItem = useCallback(async (payload: AddToBagPayload | Product): Promise<AddItemResult> => {
    const {
      product,
      options = {},
      productCustomOptions = product.customOptions,
      configurableOptionUids,
    } = normalizePayload(payload);
    const sku = product.id.trim();

    if (!sku) {
      throw new Error("Cannot add product without SKU to bag");
    }

    const displayPrice = getProductDisplayPrice(product);

    assertResolvableCartLineOptions({
      lineOptions: options,
      productCustomOptions,
      skipMetal: (configurableOptionUids?.length ?? 0) > 0,
    });

    setIsUpdating(true);

    try {
      const cartId = await ensureGuestCartId();
      const previousItems = cartState?.items ?? [];
      const nextState = await addProductToGuestCart({
        cartId,
        sku,
        quantity: 1,
        lineOptions: options,
        productCustomOptions,
        configurableOptionUids,
        lineMetadata: lineMetadataRef.current,
      });

      const lineUid = resolveAddedLineUid(previousItems, nextState, sku, options);
      if (lineUid) {
        const nextMetadata = upsertLineMetadata(
          lineMetadataRef.current,
          lineUid,
          options,
          productCustomOptions,
          displayPrice,
        );
        lineMetadataRef.current = nextMetadata;
        writeCartLineMetadata(nextMetadata);
        setLineMetadata(nextMetadata);
      }

      const hydratedState = lineUid
        ? {
          ...nextState,
          items: nextState.items.map((item) =>
            item.id === lineUid
              ? {
                ...item,
                options: { ...item.options, ...options },
                displayPrice,
              }
              : item,
          ),
        }
        : nextState;

      applyCartState(hydratedState);

      const lineItem =
        hydratedState.items.find((item) => item.id === lineUid) ??
        hydratedState.items.find((item) => item.product.id === sku);

      if (!lineItem) {
        throw new Error("Added product was not returned in Magento cart");
      }

      trackEvent("add_to_cart", {
        currency: hydratedState.totals.currency,
        value: lineItem.product.price,
        items: [
          {
            item_id: lineItem.product.id,
            item_name: lineItem.product.name,
            price: lineItem.product.price,
          },
        ],
      });

      return {
        lineItemId: lineItem.id,
        lineItem,
        totalItemsAfterAdd: computeCartTotalQuantity(hydratedState.items),
      };
    } finally {
      setIsUpdating(false);
    }
  }, [applyCartState, cartState?.items]);

  const removeItem = useCallback(async (lineItemId: string, options?: RemoveItemOptions) => {
    const cartId = getGuestCartId();
    if (!cartId) {
      return;
    }

    const existingItem = cartState?.items.find((item) => item.id === lineItemId);
    const shouldShowToast = options?.showToast !== false;

    setIsUpdating(true);

    try {
      const nextMetadata = { ...lineMetadataRef.current };
      delete nextMetadata[lineItemId];
      lineMetadataRef.current = nextMetadata;
      setLineMetadata(nextMetadata);

      const nextState = await removeGuestCartItem(cartId, lineItemId, nextMetadata);
      applyCartState(nextState);

      if (existingItem) {
        trackEvent("remove_from_cart", {
          currency: nextState.totals.currency,
          value: existingItem.product.price * existingItem.quantity,
          items: [
            {
              item_id: existingItem.product.id,
              item_name: existingItem.product.name,
              price: existingItem.product.price,
            },
          ],
        });
        if (shouldShowToast) {
          showRemovedFromCartToast();
        }
      }
    } finally {
      setIsUpdating(false);
    }
  }, [applyCartState, cartState?.items, showRemovedFromCartToast]);

  const replaceLineItem = useCallback(
    async (lineItemId: string, payload: AddToBagPayload): Promise<AddItemResult> => {
      await removeItem(lineItemId, { showToast: false });
      return addItem(payload);
    },
    [addItem, removeItem],
  );

  const buyNow = useCallback(
    async (lineItemId: string) => {
      const otherLineIds = (cartState?.items ?? [])
        .filter((item) => item.id !== lineItemId)
        .map((item) => item.id);

      for (const id of otherLineIds) {
        await removeItem(id, { showToast: false });
      }
    },
    [cartState?.items, removeItem],
  );

  const applyLocalGiftCard = useCallback((code: string, balance: number) => {
    const normalizedCode = code.trim();
    if (!normalizedCode || balance <= 0) {
      return;
    }

    setAppliedLocalGiftCardCode(normalizedCode);
    setLocalGiftCardDiscount(balance);
  }, []);

  const removeLocalGiftCard = useCallback(() => {
    setAppliedLocalGiftCardCode(null);
    setLocalGiftCardDiscount(0);
  }, []);

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(lineItemId);
        return;
      }

      const cartId = getGuestCartId();
      if (!cartId) {
        return;
      }

      setIsUpdating(true);

      try {
        const nextState = await updateGuestCartItemQuantity(
          cartId,
          lineItemId,
          quantity,
          lineMetadataRef.current,
        );
        applyCartState(nextState);
      } finally {
        setIsUpdating(false);
      }
    },
    [applyCartState, removeItem],
  );

  const updateLineItemOptions = useCallback(
    async (lineItemId: string, options: Partial<CartLineOptions>): Promise<void> => {
      const cartLine = cartState?.items.find((item) => item.id === lineItemId);
      const storedMeta = lineMetadataRef.current[lineItemId];
      const baseOptions = mergeCartLineOptions(cartLine?.options, storedMeta?.options);
      const nextOptions: CartLineOptions = { ...baseOptions, ...options };
      const clearingGift = options.isGift === false;
      const togglingGift = typeof options.isGift === "boolean";
      const engravingContext = {
        options: baseOptions,
        productCustomOptions: storedMeta?.productCustomOptions,
      };

      if ("engraving" in options && isCartLineEngravingCapable(engravingContext)) {
        const trimmedEngraving = options.engraving?.trim() ?? "";
        const maxCharacters =
          baseOptions.engravingMaxCharacters ?? DEFAULT_ENGRAVING_MAX_CHARACTERS;

        // Mirror server validation before any optimistic write — the update path
        // only reports failures via updateCartItems.errors[].
        if (!ENGRAVING_TEXT_PATTERN.test(trimmedEngraving)) {
          throw new Error(ENGRAVING_CHARSET_MESSAGE);
        }

        if (trimmedEngraving.length > maxCharacters) {
          throw new Error(
            `Engraving text is too long. Use up to ${maxCharacters} characters.`,
          );
        }

        nextOptions.engraving = trimmedEngraving;
        nextOptions.engravingSupported = true;

        if (nextOptions.engravingMaxCharacters == null) {
          nextOptions.engravingMaxCharacters = maxCharacters;
        }

        if (trimmedEngraving && !nextOptions.engravingFont?.trim()) {
          // Only fall back to a font that actually exists on the product's
          // native font option — a fontless product stays fontless.
          nextOptions.engravingFont =
            baseOptions.engravingFont?.trim() ||
            storedMeta?.productCustomOptions?.engravingFont?.labels?.[0] ||
            undefined;
        }
      }

      const nextLine: CartLineMetadata = {
        ...(storedMeta ?? { options: {} }),
        options: nextOptions,
        productCustomOptions: storedMeta?.productCustomOptions,
      };

      if (clearingGift) {
        nextOptions.isGift = false;
        nextLine.options = nextOptions;
        delete nextLine.gifting;
      }

      const nextMetadata = {
        ...lineMetadataRef.current,
        [lineItemId]: nextLine,
      };
      lineMetadataRef.current = nextMetadata;
      writeCartLineMetadata(nextMetadata);
      setLineMetadata(nextMetadata);

      setCartState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          items: current.items.map((item) => {
            if (item.id !== lineItemId) {
              return item;
            }

            if (clearingGift) {
              return {
                ...item,
                options: { ...nextOptions, isGift: false },
                gifting: undefined,
              };
            }

            return {
              ...item,
              options: nextOptions,
            };
          }),
        };
      });

      const cartId = cartState?.totals.cartId?.trim() || getGuestCartId();
      const lineItems = cartState?.items;
      if (!cartId || !lineItems) {
        return;
      }

      // Gift checkbox is not a Magento customizable option — sync via gift API
      // so refresh/mapper cannot force the old is_gift flag back on.
      if (togglingGift) {
        try {
          const hasSeparate = lineItems.some((item) => {
            const meta = nextMetadata[item.id];
            return meta?.gifting?.wrapMode === "separate";
          });

          const selection: CartGiftingSelection = {
            mode: hasSeparate ? "separate" : "single",
            groupedNote: undefined,
            items: lineItems.map((item) => {
              const meta = nextMetadata[item.id];
              const isGift =
                item.id === lineItemId
                  ? options.isGift === true
                  : Boolean(meta?.options.isGift || meta?.gifting);

              return {
                lineItemId: item.id,
                isGift,
                note:
                  isGift && hasSeparate
                    ? meta?.gifting?.note?.trim() || undefined
                    : undefined,
              };
            }),
          };

          if (selection.mode === "single") {
            const noteOwner = selection.items.find((item) => item.isGift);
            selection.groupedNote = noteOwner
              ? nextMetadata[noteOwner.lineItemId]?.gifting?.note?.trim() || undefined
              : undefined;
          }

          const syncedState = await setCartGiftOptions(cartId, selection, nextMetadata);
          applyCartState(syncedState);
        } catch {
          // Keep local gifting state; checkout re-syncs before placing the order.
        }
        return;
      }

      const lineItem = lineItems.find((item) => item.id === lineItemId);
      if (!lineItem) {
        return;
      }

      try {
        // Prefer option ids decoded from the line's own server customizable_options;
        // metadata productCustomOptions covers optimistic/legacy lines.
        const rawItem = cartState?.cart.itemsV2?.items?.find(
          (raw) => raw.uid?.trim() === lineItemId,
        );
        const serverOptions = rawItem
          ? mapMagentoCartCustomizableOptions(rawItem.customizable_options).serverOptions
          : undefined;

        const syncedState = await syncGuestCartLineOption(
          cartId,
          lineItemId,
          nextMetadata[lineItemId],
          lineItem.quantity,
          nextMetadata,
          serverOptions,
        );

        // The cart item uid rotates on every option update — re-key this line's
        // metadata onto the one uid that is new in the mutation response.
        const previousIds = new Set(lineItems.map((item) => item.id));
        const rotatedItem = syncedState.items.find((item) => !previousIds.has(item.id));
        let finalState = syncedState;

        if (rotatedItem && rotatedItem.id !== lineItemId) {
          const lineMeta = lineMetadataRef.current[lineItemId] ?? nextMetadata[lineItemId];
          const rekeyedMetadata = { ...lineMetadataRef.current };
          delete rekeyedMetadata[lineItemId];
          rekeyedMetadata[rotatedItem.id] = lineMeta;
          lineMetadataRef.current = rekeyedMetadata;
          writeCartLineMetadata(rekeyedMetadata);
          setLineMetadata(rekeyedMetadata);

          // The synced state was mapped before the re-key — reapply line metadata.
          finalState = {
            ...syncedState,
            items: syncedState.items.map((item) =>
              item.id === rotatedItem.id
                ? {
                  ...item,
                  options: { ...lineMeta.options, ...item.options },
                  ...(lineMeta.displayPrice != null && Number.isFinite(lineMeta.displayPrice)
                    ? { displayPrice: lineMeta.displayPrice }
                    : {}),
                }
                : item,
            ),
          };
        }

        applyCartState(finalState);
      } catch (error) {
        // Magento refused the update — revert the optimistic change and surface it.
        const revertedMetadata = { ...lineMetadataRef.current };
        if (storedMeta) {
          revertedMetadata[lineItemId] = storedMeta;
        } else {
          delete revertedMetadata[lineItemId];
        }
        lineMetadataRef.current = revertedMetadata;
        writeCartLineMetadata(revertedMetadata);
        setLineMetadata(revertedMetadata);

        setCartState((current) => {
          if (!current || !cartLine) {
            return current;
          }

          return {
            ...current,
            items: current.items.map((item) =>
              item.id === lineItemId
                ? { ...item, options: cartLine.options, gifting: cartLine.gifting }
                : item,
            ),
          };
        });

        throw error;
      }
    },
    [applyCartState, cartState?.cart, cartState?.items, cartState?.totals.cartId],
  );

  const applyGiftingSelection = useCallback(
    async (selection: CartGiftingSelection) => {
      const giftingByLine = new Map<string, CartGiftingOptions | undefined>(
        selection.items.map((item) => [
          item.lineItemId,
          item.isGift
            ? {
              wrapMode: selection.mode,
              note:
                (selection.mode === "separate" ? item.note : selection.groupedNote)?.trim() ||
                undefined,
            }
            : undefined,
        ]),
      );

      const nextMetadata = { ...lineMetadataRef.current };
      for (const [lineItemId, gifting] of giftingByLine) {
        const previous = nextMetadata[lineItemId] ?? { options: {} };
        nextMetadata[lineItemId] = {
          ...previous,
          options: { ...previous.options, isGift: Boolean(gifting) },
          gifting,
        };
      }
      lineMetadataRef.current = nextMetadata;
      writeCartLineMetadata(nextMetadata);
      setLineMetadata(nextMetadata);

      setCartState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          items: current.items.map((item) =>
            giftingByLine.has(item.id)
              ? {
                ...item,
                options: { ...item.options, isGift: Boolean(giftingByLine.get(item.id)) },
                gifting: giftingByLine.get(item.id),
              }
              : item,
          ),
        };
      });

      const cartId = getGuestCartId();
      if (!cartId) {
        return;
      }

      try {
        const syncedState = await setCartGiftOptions(cartId, selection, nextMetadata);
        applyCartState(syncedState);
      } catch {
        // Keep the local gifting state; checkout re-syncs before placing the order.
      }
    },
    [applyCartState],
  );

  const getLineItemMetadata = useCallback((lineItemId: string) => {
    return lineMetadataRef.current[lineItemId];
  }, []);

  const clearCart = useCallback(() => {
    clearGuestCartId();
    writeCartLineMetadata({});
    lineMetadataRef.current = {};
    setLineMetadata({});
    shippingEstimateRequestRef.current += 1;
    setCartState(null);
    setEstimatedShippingMethods([]);
  }, []);

  const applyMagentoCartState = useCallback((state: GuestCartState) => {
    applyCartState(state);
  }, [applyCartState]);

  const refreshCartFromMagento = useCallback(async () => {
    if (isAuthenticated) {
      setIsUpdating(true);

      try {
        const nextState = await fetchCustomerCart(lineMetadataRef.current);
        applyCartState(nextState);
      } catch (error) {
        console.error("Failed to refresh customer cart:", error);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    const cartId = getGuestCartId();
    if (!cartId) {
      return;
    }

    setIsUpdating(true);

    try {
      await refreshCart(cartId);
    } catch (error) {
      console.error("Failed to refresh guest cart:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [applyCartState, isAuthenticated, refreshCart]);

  const selectShippingMethod = useCallback(
    async (carrierCode: string, methodCode: string) => {
      const cartId = getGuestCartId();
      if (!cartId) {
        return;
      }

      if (
        cartState?.totals.selectedShippingMethod?.carrierCode === carrierCode &&
        cartState?.totals.selectedShippingMethod?.methodCode === methodCode
      ) {
        return;
      }

      setIsUpdating(true);

      try {
        const nextState = await setGuestShippingMethod(
          cartId,
          carrierCode,
          methodCode,
          lineMetadataRef.current,
        );
        applyCartState(nextState);
      } finally {
        setIsUpdating(false);
      }
    },
    [applyCartState, cartState?.totals.selectedShippingMethod],
  );

  const items = cartState?.items ?? [];
  const totalItems = useMemo(
    () => computeCartTotalQuantity(items),
    [items],
  );
  const subtotal = cartState?.totals.subtotal ?? emptyTotals.subtotal;
  const taxes = cartState?.totals.taxes ?? emptyTotals.taxes;
  const shipping = cartState?.totals.shipping ?? emptyTotals.shipping;
  const offerDiscount = cartState?.totals.offerDiscount ?? emptyTotals.offerDiscount;
  const giftCardDiscount = cartState?.totals.giftCardDiscount ?? emptyTotals.giftCardDiscount;
  const appliedGiftCardCode =
    cartState?.totals.appliedGiftCardCode ?? emptyTotals.appliedGiftCardCode;
  const totalPrice = cartState?.totals.grandTotal ?? emptyTotals.grandTotal;
  const shippingMethods = cartState?.totals.shippingMethods ?? emptyTotals.shippingMethods;
  const selectedShippingMethod =
    cartState?.totals.selectedShippingMethod ?? emptyTotals.selectedShippingMethod;
  const paymentMethods = cartState?.totals.paymentMethods ?? emptyTotals.paymentMethods;

  const value = useMemo(
    () => ({
      items,
      isHydrating,
      isUpdating,
      addItem,
      removeItem,
      updateQuantity,
      updateLineItemOptions,
      applyGiftingSelection,
      applyMagentoCartState,
      refreshCart: refreshCartFromMagento,
      selectShippingMethod,
      clearCart,
      totalItems,
      totalPrice,
      subtotal,
      taxes,
      shipping,
      offerDiscount,
      giftCardDiscount,
      appliedGiftCardCode,
      localGiftCardDiscount,
      appliedLocalGiftCardCode,
      applyLocalGiftCard,
      removeLocalGiftCard,
      replaceLineItem,
      buyNow,
      getLineItemMetadata,
      shippingMethods,
      estimatedShippingMethods,
      selectedShippingMethod,
      paymentMethods,
    }),
    [
      addItem,
      applyMagentoCartState,
      refreshCartFromMagento,
      clearCart,
      estimatedShippingMethods,
      isHydrating,
      isUpdating,
      items,
      removeItem,
      selectShippingMethod,
      selectedShippingMethod,
      shipping,
      offerDiscount,
      giftCardDiscount,
      appliedGiftCardCode,
      localGiftCardDiscount,
      appliedLocalGiftCardCode,
      applyLocalGiftCard,
      removeLocalGiftCard,
      replaceLineItem,
      buyNow,
      getLineItemMetadata,
      shippingMethods,
      paymentMethods,
      subtotal,
      taxes,
      totalItems,
      totalPrice,
      applyGiftingSelection,
      updateLineItemOptions,
      updateQuantity,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <AppStatusToast
        open={Boolean(cartStatusToastMessage)}
        message={cartStatusToastMessage ?? ""}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

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
  type StoredCartLineMetadata,
} from "@/services/magento/cart/cartSession";
import { findCartItemUidBySku } from "@/services/magento/cart/cart.mapper";
import { readStoredCartLines, writeStoredCartLines } from "@/features/cart/utils/cartProduct.utils";
import type {
  AddItemResult,
  AddToBagPayload,
  CartGiftingOptions,
  CartGiftingSelection,
  CartLineItem,
  CartLineOptions,
} from "../types/cart.types";
import type { ProductCustomOptions } from "@/features/products/types/productCustomOptions";

/** @deprecated Use CartLineItem from cart.types */
export type CartItem = CartLineItem;

interface CartContextType {
  items: CartLineItem[];
  isHydrating: boolean;
  isUpdating: boolean;
  addItem: (payload: AddToBagPayload | Product) => Promise<AddItemResult>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  updateLineItemOptions: (lineItemId: string, options: Partial<CartLineOptions>) => void;
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
  shippingMethods: MagentoShippingMethodOption[];
  estimatedShippingMethods: MagentoShippingMethodOption[];
  selectedShippingMethod: MagentoSelectedShippingMethod | null;
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

function upsertLineMetadata(
  current: StoredCartLineMetadata,
  lineUid: string,
  options: CartLineOptions,
  productCustomOptions?: ProductCustomOptions,
): StoredCartLineMetadata {
  const previous = current[lineUid] ?? { options: {} };

  return {
    ...current,
    [lineUid]: {
      ...previous,
      options: { ...previous.options, ...options },
      productCustomOptions: productCustomOptions ?? previous.productCustomOptions,
    },
  };
}

const emptyTotals = {
  subtotal: 0,
  taxes: 0,
  shipping: 0,
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
  const lineMetadataRef = useRef(lineMetadata);
  const initRef = useRef(false);
  const shippingEstimateRequestRef = useRef(0);

  useEffect(() => {
    lineMetadataRef.current = lineMetadata;
    if (!isHydrating) {
      writeCartLineMetadata(lineMetadata);
    }
  }, [isHydrating, lineMetadata]);

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
    const { product, options = {}, productCustomOptions = product.customOptions } =
      normalizePayload(payload);
    const sku = product.id.trim();

    if (!sku) {
      throw new Error("Cannot add product without SKU to bag");
    }

    setIsUpdating(true);

    try {
      const cartId = await ensureGuestCartId();
      const nextState = await addProductToGuestCart({
        cartId,
        sku,
        quantity: 1,
        lineOptions: options,
        productCustomOptions,
        lineMetadata: lineMetadataRef.current,
      });

      const lineUid = resolveLineUidForSku(nextState, sku);
      if (lineUid) {
        const nextMetadata = upsertLineMetadata(
          lineMetadataRef.current,
          lineUid,
          options,
          productCustomOptions,
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
        totalItemsAfterAdd: hydratedState.totals.totalQuantity,
      };
    } finally {
      setIsUpdating(false);
    }
  }, [applyCartState]);

  const removeItem = useCallback(async (lineItemId: string) => {
    const cartId = getGuestCartId();
    if (!cartId) {
      return;
    }

    const existingItem = cartState?.items.find((item) => item.id === lineItemId);

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
      }
    } finally {
      setIsUpdating(false);
    }
  }, [applyCartState, cartState?.items]);

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
    (lineItemId: string, options: Partial<CartLineOptions>) => {
      const previous = lineMetadataRef.current[lineItemId] ?? { options: {} };
      const nextMetadata = {
        ...lineMetadataRef.current,
        [lineItemId]: {
          ...previous,
          options: { ...previous.options, ...options },
        },
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
          items: current.items.map((item) =>
            item.id === lineItemId
              ? { ...item, options: { ...item.options, ...options } }
              : item,
          ),
        };
      });

      const cartId = getGuestCartId();
      const lineItem = cartState?.items.find((item) => item.id === lineItemId);
      if (!cartId || !lineItem) {
        return;
      }

      void (async () => {
        try {
          const syncedState = await syncGuestCartLineOption(
            cartId,
            lineItemId,
            nextMetadata[lineItemId],
            lineItem.quantity,
            nextMetadata,
          );
          applyCartState(syncedState);
        } catch {
          // Keep local metadata even if Magento sync fails.
        }
      })();
    },
    [applyCartState, cartState?.items],
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
  const totalItems = cartState?.totals.totalQuantity ?? 0;
  const subtotal = cartState?.totals.subtotal ?? emptyTotals.subtotal;
  const taxes = cartState?.totals.taxes ?? emptyTotals.taxes;
  const shipping = cartState?.totals.shipping ?? emptyTotals.shipping;
  const totalPrice = cartState?.totals.grandTotal ?? emptyTotals.grandTotal;
  const shippingMethods = cartState?.totals.shippingMethods ?? emptyTotals.shippingMethods;
  const selectedShippingMethod =
    cartState?.totals.selectedShippingMethod ?? emptyTotals.selectedShippingMethod;

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
      shippingMethods,
      estimatedShippingMethods,
      selectedShippingMethod,
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
      shippingMethods,
      subtotal,
      taxes,
      totalItems,
      totalPrice,
      applyGiftingSelection,
      updateLineItemOptions,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

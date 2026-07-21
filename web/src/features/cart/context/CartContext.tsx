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
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import {
  addSimpleProductToGuestCart,
  ensureGuestCartId,
  fetchGuestCart,
  migrateLegacyLinesToGuestCart,
  removeGuestCartItem,
  setGuestShippingMethod,
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
  CartLineItem,
  CartLineOptions,
} from "../types/cart.types";

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
  updateLineItemGifting: (lineItemId: string, gifting: CartGiftingOptions) => void;
  applyMagentoCartState: (state: GuestCartState) => void;
  selectShippingMethod: (carrierCode: string, methodCode: string) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  taxes: number;
  shipping: number;
  shippingMethods: MagentoShippingMethodOption[];
  selectedShippingMethod: MagentoSelectedShippingMethod | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isAddToBagPayload = (payload: AddToBagPayload | Product): payload is AddToBagPayload =>
  "product" in payload;

const normalizePayload = (payload: AddToBagPayload | Product): AddToBagPayload =>
  isAddToBagPayload(payload) ? payload : { product: payload, options: {} };

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
  const [cartState, setCartState] = useState<GuestCartState | null>(null);
  const [lineMetadata, setLineMetadata] = useState<StoredCartLineMetadata>({});
  const [isHydrating, setIsHydrating] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const lineMetadataRef = useRef(lineMetadata);
  const initRef = useRef(false);

  useEffect(() => {
    lineMetadataRef.current = lineMetadata;
    writeCartLineMetadata(lineMetadata);
  }, [lineMetadata]);

  const applyCartState = useCallback((nextState: GuestCartState) => {
    setCartState(nextState);
  }, []);

  const refreshCart = useCallback(async (cartId: string) => {
    const nextState = await fetchGuestCart(cartId, lineMetadataRef.current);
    applyCartState(nextState);
    return nextState;
  }, [applyCartState]);

  useEffect(() => {
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

        const legacyLines = readStoredCartLines();
        let cartId = getGuestCartId();

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
          setCartState(null);
          return;
        }

        await refreshCart(cartId);
      } catch {
        clearGuestCartId();
        setCartState(null);
      } finally {
        setIsHydrating(false);
      }
    }

    void initializeCart();
  }, [applyCartState, refreshCart]);

  const addItem = useCallback(async (payload: AddToBagPayload | Product): Promise<AddItemResult> => {
    const { product, options = {} } = normalizePayload(payload);
    const sku = product.id.trim();

    if (!sku) {
      throw new Error("Cannot add product without SKU to bag");
    }

    setIsUpdating(true);

    try {
      const cartId = await ensureGuestCartId();
      const nextState = await addSimpleProductToGuestCart(
        cartId,
        sku,
        1,
        lineMetadataRef.current,
      );

      const lineUid = findCartItemUidBySku(nextState.cart, sku);
      if (lineUid) {
        setLineMetadata((current) => {
          const next = {
            ...current,
            [lineUid]: {
              options,
              gifting: current[lineUid]?.gifting,
            },
          };
          lineMetadataRef.current = next;
          return next;
        });
      }

      const hydratedState = lineUid
        ? {
            ...nextState,
            items: nextState.items.map((item) =>
              item.id === lineUid ? { ...item, options } : item,
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
      setLineMetadata((current) => {
        const previous = current[lineItemId] ?? { options: {} };
        const next = {
          ...current,
          [lineItemId]: {
            ...previous,
            options: { ...previous.options, ...options },
          },
        };
        lineMetadataRef.current = next;
        return next;
      });

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
    },
    [],
  );

  const updateLineItemGifting = useCallback((lineItemId: string, gifting: CartGiftingOptions) => {
    setLineMetadata((current) => {
      const previous = current[lineItemId] ?? { options: {} };
      const next = {
        ...current,
        [lineItemId]: {
          ...previous,
          gifting,
        },
      };
      lineMetadataRef.current = next;
      return next;
    });

    setCartState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        items: current.items.map((item) =>
          item.id === lineItemId ? { ...item, gifting } : item,
        ),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    clearGuestCartId();
    writeCartLineMetadata({});
    lineMetadataRef.current = {};
    setLineMetadata({});
    setCartState(null);
  }, []);

  const applyMagentoCartState = useCallback((state: GuestCartState) => {
    applyCartState(state);
  }, [applyCartState]);

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
      updateLineItemGifting,
      applyMagentoCartState,
      selectShippingMethod,
      clearCart,
      totalItems,
      totalPrice,
      subtotal,
      taxes,
      shipping,
      shippingMethods,
      selectedShippingMethod,
    }),
    [
      addItem,
      applyMagentoCartState,
      clearCart,
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
      updateLineItemGifting,
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

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/features/products/data/products";
import { trackEvent } from "@/infrastructure/analytics/use-gtag";
import type {
  AddItemResult,
  AddToBagPayload,
  CartGiftingOptions,
  CartLineItem,
  CartLineOptions,
} from "../types/cart.types";
import { calculateCartSubtotal, calculateCartTaxes, calculateCartTotal } from "../utils/cartPricing";

const STORAGE_KEY = "sunny-cart-v1";

/** @deprecated Use CartLineItem from cart.types */
export type CartItem = CartLineItem;

interface CartContextType {
  items: CartLineItem[];
  addItem: (payload: AddToBagPayload | Product) => AddItemResult;
  removeItem: (lineItemId: string) => void;
  updateQuantity: (lineItemId: string, quantity: number) => void;
  updateLineItemOptions: (lineItemId: string, options: Partial<CartLineOptions>) => void;
  updateLineItemGifting: (lineItemId: string, gifting: CartGiftingOptions) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  taxes: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const createLineItemId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const optionsKey = (options: CartLineOptions) =>
  [options.metal ?? "", options.ringSize ?? "", options.engraving ?? "", options.isGift ? "1" : "0"].join("|");

const isAddToBagPayload = (payload: AddToBagPayload | Product): payload is AddToBagPayload =>
  "product" in payload;

const normalizePayload = (payload: AddToBagPayload | Product): AddToBagPayload =>
  isAddToBagPayload(payload) ? payload : { product: payload, options: {} };

const readStoredItems = (): CartLineItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((payload: AddToBagPayload | Product): AddItemResult => {
    const { product, options = {} } = normalizePayload(payload);
    const key = optionsKey(options);

    trackEvent("add_to_cart", {
      currency: "INR",
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    });

    const existing = items.find(
      (item) => item.product.id === product.id && optionsKey(item.options) === key,
    );

    let lineItem: CartLineItem;
    let nextItems: CartLineItem[];

    if (existing) {
      lineItem = { ...existing, quantity: existing.quantity + 1 };
      nextItems = items.map((item) => (item.id === existing.id ? lineItem : item));
    } else {
      lineItem = {
        id: createLineItemId(),
        product,
        quantity: 1,
        options,
      };
      nextItems = [...items, lineItem];
    }

    setItems(nextItems);

    const totalItemsAfterAdd = nextItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      lineItemId: lineItem.id,
      lineItem,
      totalItemsAfterAdd,
    };
  }, [items]);

  const removeItem = useCallback((lineItemId: string) => {
    setItems((prev) => {
      const item = prev.find((entry) => entry.id === lineItemId);
      if (item) {
        trackEvent("remove_from_cart", {
          currency: "INR",
          value: item.product.price * item.quantity,
          items: [
            {
              item_id: item.product.id,
              item_name: item.product.name,
              price: item.product.price,
            },
          ],
        });
      }
      return prev.filter((entry) => entry.id !== lineItemId);
    });
  }, []);

  const updateQuantity = useCallback(
    (lineItemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(lineItemId);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.id === lineItemId ? { ...item, quantity } : item)),
      );
    },
    [removeItem],
  );

  const updateLineItemOptions = useCallback(
    (lineItemId: string, options: Partial<CartLineOptions>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === lineItemId
            ? { ...item, options: { ...item.options, ...options } }
            : item,
        ),
      );
    },
    [],
  );

  const updateLineItemGifting = useCallback((lineItemId: string, gifting: CartGiftingOptions) => {
    setItems((prev) =>
      prev.map((item) => (item.id === lineItemId ? { ...item, gifting } : item)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => calculateCartSubtotal(items), [items]);
  const taxes = useMemo(() => calculateCartTaxes(subtotal), [subtotal]);
  const totalPrice = useMemo(() => calculateCartTotal(items), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateLineItemOptions,
        updateLineItemGifting,
        clearCart,
        totalItems,
        totalPrice,
        subtotal,
        taxes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

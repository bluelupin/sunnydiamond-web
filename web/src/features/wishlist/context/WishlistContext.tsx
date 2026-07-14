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

const WISHLIST_STORAGE_KEY = "sunny-wishlist";

interface WishlistContextType {
  wishlistedIds: string[];
  totalItems: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function readStoredWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setWishlistedIds(readStoredWishlist());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistedIds));
  }, [wishlistedIds, hasLoaded]);

  const isWishlisted = useCallback(
    (productId: string) => {
      if (wishlistedIds.includes(productId)) return true;

      const baseId = productId.split("-")[0];
      return productId !== baseId && wishlistedIds.includes(baseId);
    },
    [wishlistedIds],
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const value = useMemo(
    () => ({
      wishlistedIds,
      totalItems: wishlistedIds.length,
      isWishlisted,
      toggleWishlist,
    }),
    [wishlistedIds, isWishlisted, toggleWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface WishlistContextType {
  wishlistedIds: string[];
  totalItems: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  const isWishlisted = useCallback(
    (productId: string) => wishlistedIds.includes(productId),
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

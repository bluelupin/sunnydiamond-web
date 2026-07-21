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
import WishlistMovedToast from "@/features/wishlist/components/WishlistMovedToast";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import { normalizeWishlistSkus } from "@/features/wishlist/utils/wishlistProduct.utils";

const WISHLIST_STORAGE_KEY = "sunny-wishlist";

interface WishlistContextType {
  wishlistedIds: string[];
  totalItems: number;
  isWishlisted: (productSku: string) => boolean;
  toggleWishlist: (productSku: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function readStoredWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? normalizeWishlistSkus(parsed.filter((id): id is string => typeof id === "string"))
      : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMovedToastOpen, setIsMovedToastOpen] = useState(false);
  const movedToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissMovedToast = useCallback(() => {
    if (movedToastTimeoutRef.current) {
      clearTimeout(movedToastTimeoutRef.current);
      movedToastTimeoutRef.current = null;
    }
    setIsMovedToastOpen(false);
  }, []);

  const showMovedToast = useCallback(() => {
    dismissMovedToast();
    setIsMovedToastOpen(true);
    movedToastTimeoutRef.current = setTimeout(() => {
      setIsMovedToastOpen(false);
      movedToastTimeoutRef.current = null;
    }, wishlistMovedToastDurationMs);
  }, [dismissMovedToast]);

  useEffect(() => {
    return () => {
      if (movedToastTimeoutRef.current) {
        clearTimeout(movedToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setWishlistedIds(readStoredWishlist());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistedIds));
  }, [wishlistedIds, hasLoaded]);

  const isWishlisted = useCallback(
    (productSku: string) => wishlistedIds.includes(productSku.trim()),
    [wishlistedIds],
  );

  const toggleWishlist = useCallback((productSku: string) => {
    const normalizedSku = productSku.trim();
    if (!normalizedSku) {
      return;
    }

    setWishlistedIds((current) => {
      if (current.includes(normalizedSku)) {
        return current.filter((id) => id !== normalizedSku);
      }

      showMovedToast();
      return [...current, normalizedSku];
    });
  }, [showMovedToast]);

  const value = useMemo(
    () => ({
      wishlistedIds,
      totalItems: wishlistedIds.length,
      isWishlisted,
      toggleWishlist,
    }),
    [wishlistedIds, isWishlisted, toggleWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <WishlistMovedToast open={isMovedToastOpen} onClose={dismissMovedToast} />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

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
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import WishlistMovedToast from "@/features/wishlist/components/WishlistMovedToast";
import { WISHLIST_STORAGE_KEY } from "@/features/wishlist/constants";
import { wishlistMovedToastDurationMs } from "@/features/wishlist/data/content";
import {
  addCustomerWishlistSku,
  getCustomerWishlist,
  removeCustomerWishlistSku,
} from "@/services/customer/customer-wishlist.client";

interface WishlistContextType {
  wishlistedIds: string[];
  totalItems: number;
  isWishlisted: (productSku: string) => boolean;
  toggleWishlist: (productSku: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const pathname = usePathname() ?? "/";
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const wishlistedIdsRef = useRef(wishlistedIds);
  const syncRequestIdRef = useRef(0);
  const [isMovedToastOpen, setIsMovedToastOpen] = useState(false);
  const movedToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  wishlistedIdsRef.current = wishlistedIds;

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
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    if (status === "guest") {
      setWishlistedIds([]);
      window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    const requestId = ++syncRequestIdRef.current;

    void getCustomerWishlist()
      .then((wishlist) => {
        if (requestId !== syncRequestIdRef.current || !wishlist) {
          return;
        }

        setWishlistedIds(wishlist.skus);
      })
      .catch(() => {
        setWishlistedIds([]);
      });
  }, [hasLoaded, status]);

  useEffect(() => {
    if (!hasLoaded || status !== "authenticated") {
      return;
    }

    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistedIds));
  }, [wishlistedIds, hasLoaded, status]);

  const isWishlisted = useCallback(
    (productSku: string) => {
      if (status !== "authenticated") {
        return false;
      }

      return wishlistedIds.includes(productSku.trim());
    },
    [wishlistedIds, status],
  );

  const toggleWishlist = useCallback(
    (productSku: string) => {
      const normalizedSku = productSku.trim();
      if (!normalizedSku) {
        return;
      }

      if (status !== "authenticated") {
        openLoginModal({ returnUrl: pathname });
        return;
      }

      const current = wishlistedIdsRef.current;
      const isCurrentlyWishlisted = current.includes(normalizedSku);
      const previous = current;
      const next = isCurrentlyWishlisted
        ? current.filter((id) => id !== normalizedSku)
        : [...current, normalizedSku];

      setWishlistedIds(next);

      if (!isCurrentlyWishlisted) {
        showMovedToast();
      }

      void (async () => {
        try {
          const wishlist = isCurrentlyWishlisted
            ? await removeCustomerWishlistSku(normalizedSku)
            : await addCustomerWishlistSku(normalizedSku);
          setWishlistedIds(wishlist.skus);
        } catch {
          setWishlistedIds(previous);
        }
      })();
    },
    [openLoginModal, pathname, showMovedToast, status],
  );

  const value = useMemo(
    () => ({
      wishlistedIds,
      totalItems: status === "authenticated" ? wishlistedIds.length : 0,
      isWishlisted,
      toggleWishlist,
    }),
    [isWishlisted, status, toggleWishlist, wishlistedIds],
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

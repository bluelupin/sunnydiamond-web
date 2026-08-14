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
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import WishlistMovedToast from "@/features/wishlist/components/WishlistMovedToast";
import { WISHLIST_STORAGE_KEY } from "@/features/wishlist/constants";
import { wishlistMovedToastDurationMs, wishlistPageContent } from "@/features/wishlist/data/content";
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
  const lastLocalMutationAtRef = useRef(0);
  const toggleGenerationRef = useRef(0);
  const inflightSkusRef = useRef(new Set<string>());
  const [isMovedToastOpen, setIsMovedToastOpen] = useState(false);
  const movedToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRemovedToastOpen, setIsRemovedToastOpen] = useState(false);
  const removedToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const dismissRemovedToast = useCallback(() => {
    if (removedToastTimeoutRef.current) {
      clearTimeout(removedToastTimeoutRef.current);
      removedToastTimeoutRef.current = null;
    }
    setIsRemovedToastOpen(false);
  }, []);

  const showRemovedToast = useCallback(() => {
    dismissRemovedToast();
    setIsRemovedToastOpen(true);
    removedToastTimeoutRef.current = setTimeout(() => {
      setIsRemovedToastOpen(false);
      removedToastTimeoutRef.current = null;
    }, appStatusToastDurationMs);
  }, [dismissRemovedToast]);

  useEffect(() => {
    return () => {
      if (movedToastTimeoutRef.current) {
        clearTimeout(movedToastTimeoutRef.current);
      }
      if (removedToastTimeoutRef.current) {
        clearTimeout(removedToastTimeoutRef.current);
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
    const syncStartedAt = Date.now();

    void getCustomerWishlist()
      .then((wishlist) => {
        if (requestId !== syncRequestIdRef.current || !wishlist) {
          return;
        }

        if (lastLocalMutationAtRef.current >= syncStartedAt) {
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

      if (inflightSkusRef.current.has(normalizedSku)) {
        return;
      }

      const current = wishlistedIdsRef.current;
      const isCurrentlyWishlisted = current.includes(normalizedSku);
      const previous = current;
      const next = isCurrentlyWishlisted
        ? current.filter((id) => id !== normalizedSku)
        : [...current, normalizedSku];

      inflightSkusRef.current.add(normalizedSku);
      const toggleGeneration = ++toggleGenerationRef.current;
      lastLocalMutationAtRef.current = Date.now();
      setWishlistedIds(next);

      if (!isCurrentlyWishlisted) {
        dismissRemovedToast();
        showMovedToast();
      } else {
        dismissMovedToast();
        showRemovedToast();
      }

      void (async () => {
        try {
          const wishlist = isCurrentlyWishlisted
            ? await removeCustomerWishlistSku(normalizedSku)
            : await addCustomerWishlistSku(normalizedSku);

          if (toggleGeneration !== toggleGenerationRef.current) {
            return;
          }

          setWishlistedIds(wishlist.skus);
        } catch {
          if (toggleGeneration !== toggleGenerationRef.current) {
            return;
          }

          setWishlistedIds(previous);

          if (isCurrentlyWishlisted) {
            dismissRemovedToast();
          }
        } finally {
          inflightSkusRef.current.delete(normalizedSku);
        }
      })();
    },
    [
      dismissMovedToast,
      dismissRemovedToast,
      openLoginModal,
      pathname,
      showMovedToast,
      showRemovedToast,
      status,
    ],
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
      <AppStatusToast
        open={isRemovedToastOpen}
        message={wishlistPageContent.removedFromWishlistMessage}
      />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

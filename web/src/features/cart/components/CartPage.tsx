"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useMobileStickyFooterClearance } from "@/shared/hooks/use-mobile-sticky-footer-clearance";
import { MobileStickyFooterSpacer } from "@/shared/ui/layout/MobileStickyFooterSpacer";
import CartBenefitsSection from "@/features/cart/components/CartBenefitsSection";
import CartItem from "@/features/cart/components/CartItem";
import CartMobileStickyFooter from "@/features/cart/components/CartMobileStickyFooter";
import CartPriceDetails from "@/features/cart/components/CartPriceDetails";
import { useCart } from "@/features/cart/context/CartContext";
import { useCartCheckout } from "@/features/cart/hooks/useCartCheckout";
import type { NormalizedProductDisplayStrip } from "@/services/product-display/product-display-page.types";
import CartEmptyState from "./CartEmptyState";
import CartRefreshErrorState from "./CartRefreshErrorState";
import { cartCheckoutAsideLayout } from "../data/cartFlowSpec";
import CartPageSkeleton from "./skeletons/CartPageSkeleton";

type CartPageProps = {
  benefitsStrip: NormalizedProductDisplayStrip;
};

const CartPage = ({ benefitsStrip }: CartPageProps) => {
  const {
    items,
    isHydrating,
    isUpdating,
    cartRefreshError,
    refreshCart,
    removeItem,
    updateLineItemOptions,
  } = useCart();
  const { isNavigatingToCheckout } = useCartCheckout();
  const [offersOpen, setOffersOpen] = useState(false);
  const [priceBreakupOpen, setPriceBreakupOpen] = useState(false);
  const [hasCompletedMountRefresh, setHasCompletedMountRefresh] = useState(false);
  const { footerRef, clearancePx } = useMobileStickyFooterClearance();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    let cancelled = false;

    void refreshCart().finally(() => {
      if (!cancelled) {
        setHasCompletedMountRefresh(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isHydrating, refreshCart]);

  const handleRetryCartRefresh = () => {
    void refreshCart();
  };

  const isAwaitingInitialCartData =
    !hasCompletedMountRefresh && items.length === 0 && !cartRefreshError;

  if (isHydrating || isAwaitingInitialCartData) {
    return <CartPageSkeleton />;
  }

  if (cartRefreshError && items.length === 0) {
    return (
      <CartRefreshErrorState message={cartRefreshError} onRetry={handleRetryCartRefresh} />
    );
  }

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <>
      <section
        className={cn(
          "bg-gray300 lg:pb-104",
          "md:max-lg:-mt-2 md:max-lg:landscape:mt-0",
          "md:pb-16",
        )}
      >
        <div className="mx-auto w-full px-4 max-md:pt-6 pt-6 md:max-lg:px-8 md:max-lg:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
          <h1 className="mb-6 font-larken text-32 font-light leading-110 text-darkblack lg:mb-10 lg:text-32">
            Your Shopping Bag
          </h1>

          {cartRefreshError ? (
            <div className="mb-6">
              <CartRefreshErrorState
                variant="banner"
                message={cartRefreshError}
                onRetry={handleRetryCartRefresh}
              />
            </div>
          ) : null}

          <div
            className={cn(
              cartCheckoutAsideLayout.gridClassName,
              isNavigatingToCheckout && "pointer-events-none",
            )}
            aria-busy={isNavigatingToCheckout || isUpdating || undefined}
          >
            <div className="flex min-w-0 flex-col gap-6"
              {...(isNavigatingToCheckout ? { inert: true } : {})}
            >
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateOptions={updateLineItemOptions}
                />
              ))}

              <div className="pt-4 md:hidden">
                <CartBenefitsSection strip={benefitsStrip} />
              </div>

              <MobileStickyFooterSpacer height={clearancePx} />
            </div>
            <aside
              className={cn(
                cartCheckoutAsideLayout.asideClassName,
                "hidden h-fit min-w-0 flex-col gap-0 md:max-lg:sticky md:max-lg:top-12 md:max-lg:flex lg:sticky lg:top-12 lg:flex",
              )}
            >
              <CartPriceDetails />
              <CartBenefitsSection strip={benefitsStrip} />
            </aside>
          </div>
        </div>
      </section>

      <CartMobileStickyFooter
        ref={footerRef}
        offersOpen={offersOpen}
        onOffersToggle={() => setOffersOpen((open) => !open)}
        breakupOpen={priceBreakupOpen}
        onBreakupToggle={() => setPriceBreakupOpen((open) => !open)}
      />
    </>
  );
};

export default CartPage;

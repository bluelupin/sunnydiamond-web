"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { useCartUI } from "@/features/cart/context/CartUIContext";
import { FeatureErrorBoundary } from "@/shared/ui/FeatureErrorBoundary";

const CartBagDrawer = dynamic(() => import("@/features/cart/components/CartBagDrawer"), { ssr: false });
const GiftingOptionsPanel = dynamic(() => import("@/features/cart/components/GiftingOptionsPanel"), { ssr: false });
const GuestCheckoutModal = dynamic(() => import("@/features/cart/components/GuestCheckoutModal"), { ssr: false });
const LoginModal = dynamic(() => import("@/features/auth/components/LoginModal"), { ssr: false });

export default function DeferredGlobalOverlays() {
  const { isBagDrawerOpen, isGiftingPanelOpen, isGuestCheckoutModalOpen } = useCartUI();
  const { isLoginModalOpen } = useLoginModal();
  const [mounted, setMounted] = useState({ bag: false, gifting: false, guest: false, login: false });

  useEffect(() => {
    if (isBagDrawerOpen || isGiftingPanelOpen || isGuestCheckoutModalOpen || isLoginModalOpen) {
      const frame = requestAnimationFrame(() => setMounted(current => ({
        bag: current.bag || isBagDrawerOpen,
        gifting: current.gifting || isGiftingPanelOpen,
        guest: current.guest || isGuestCheckoutModalOpen,
        login: current.login || isLoginModalOpen,
      })));
      return () => cancelAnimationFrame(frame);
    }
  }, [isBagDrawerOpen, isGiftingPanelOpen, isGuestCheckoutModalOpen, isLoginModalOpen]);

  return (
    <>
      {(isBagDrawerOpen || mounted.bag) && (
        <FeatureErrorBoundary featureName="CartBagDrawer"><CartBagDrawer /></FeatureErrorBoundary>
      )}
      {(isGiftingPanelOpen || mounted.gifting) && (
        <FeatureErrorBoundary featureName="GiftingOptionsPanel"><GiftingOptionsPanel /></FeatureErrorBoundary>
      )}
      {(isGuestCheckoutModalOpen || mounted.guest) && (
        <FeatureErrorBoundary featureName="GuestCheckoutModal"><GuestCheckoutModal /></FeatureErrorBoundary>
      )}
      {(isLoginModalOpen || mounted.login) && (
        <FeatureErrorBoundary featureName="LoginModal"><LoginModal /></FeatureErrorBoundary>
      )}
    </>
  );
}

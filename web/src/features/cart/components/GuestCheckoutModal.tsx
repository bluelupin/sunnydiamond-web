"use client";

import { useRouter } from "next/navigation";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { useCartUI } from "../context/CartUIContext";
import {
  CartDivider,
  CartPrimaryButton,
  CartTextLink,
} from "./CartFlowUi";

const GUEST_CHECKOUT_MOBILE_QUERY = "(max-width: 1023px)";

const GUEST_CHECKOUT_OVERLAY_CLASS = "z-[70] bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";

const GuestCheckoutContent = ({
  onContinueAsGuest,
  onExistingAccount,
}: {
  onContinueAsGuest: () => void;
  onExistingAccount: () => void;
}) => (
  <div className="flex w-full flex-col gap-6 bg-gray300 p-6">
    <div className="flex flex-col gap-6">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32">
        Welcome, New User
      </h2>
      <CartDivider weight={1} />
      <p className="font-gill text-base font-light leading-110 text-darkblack">
        Complete your checkout. We&apos;ll take care of setting up your account for effortless
        order tracking and quicker future purchases.
      </p>
    </div>

    <div className="flex flex-col items-center gap-4 border-t border-neutral300 pt-6 [border-top-width:0.5px]">
      <CartPrimaryButton type="button" className="w-full uppercase" onClick={onContinueAsGuest}>
        Continue as Guest
      </CartPrimaryButton>
      <CartTextLink onClick={onExistingAccount} className="uppercase">
        I Already Have an Account
      </CartTextLink>
    </div>
  </div>
);

const GuestCheckoutModal = () => {
  const router = useRouter();
  const { openLoginModal } = useLoginModal();
  const { isGuestCheckoutModalOpen, closeGuestCheckoutModal, startCheckoutNavigation } = useCartUI();
  const { showMobileShell } = useResponsiveOverlayShell(
    isGuestCheckoutModalOpen,
    GUEST_CHECKOUT_MOBILE_QUERY,
  );

  const handleContinueAsGuest = () => {
    startCheckoutNavigation();
    closeGuestCheckoutModal();
    router.push("/checkout");
  };

  const handleExistingAccount = () => {
    closeGuestCheckoutModal();
    openLoginModal({ returnUrl: "/checkout" });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeGuestCheckoutModal();
    }
  };

  const content = (
    <GuestCheckoutContent
      onContinueAsGuest={handleContinueAsGuest}
      onExistingAccount={handleExistingAccount}
    />
  );

  if (showMobileShell) {
    return (
      <Drawer
        open={isGuestCheckoutModalOpen}
        shouldScaleBackground={false}
        onOpenChange={handleOpenChange}
      >
        <DrawerContent
          overlayClassName={GUEST_CHECKOUT_OVERLAY_CLASS}
          className="max-h-[90vh] overflow-hidden rounded-none border-0 bg-gray300 p-0 [&>div:first-child]:hidden"
        >
          <DrawerTitle className="sr-only">Welcome, New User</DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isGuestCheckoutModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton
        overlayClassName={GUEST_CHECKOUT_OVERLAY_CLASS}
        className="z-[70] max-w-[560px] gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100"
      >
        <DialogTitle className="sr-only">Welcome, New User</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutModal;

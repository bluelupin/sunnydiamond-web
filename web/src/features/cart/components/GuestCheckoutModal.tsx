"use client";

import { useRouter } from "next/navigation";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { cn } from "@/shared/utils/cn";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { RightPanelCloseButton } from "@/shared/ui/RightPanelCloseButton";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { useCartUI } from "../context/CartUIContext";
import { cartFlowSpec } from "../data/cartFlowSpec";
import {
  CartDivider,
  CartPrimaryButton,
  CartTextLink,
} from "./CartFlowUi";

const GUEST_CHECKOUT_MOBILE_QUERY = "(max-width: 1023px)";

const GUEST_CHECKOUT_OVERLAY_CLASS = "z-[70] bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";

const guestCheckoutSpec = cartFlowSpec.guestCheckout;

const GUEST_CHECKOUT_MOBILE_OVERLAY_CLASS = "z-[70] bg-[rgba(0,0,0,0.7)] backdrop-blur-[10px]";

const GUEST_CHECKOUT_COPY =
  "Complete your purchase, and we'll create your account to track this order and speed up future visits.";

const GuestCheckoutActions = ({
  onContinueAsGuest,
  onExistingAccount,
  className,
}: {
  onContinueAsGuest: () => void;
  onExistingAccount: () => void;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col items-center gap-4", className)}>
    <CartPrimaryButton type="button" className="w-full uppercase" onClick={onContinueAsGuest}>
      Continue as Guest
    </CartPrimaryButton>
    <CartTextLink onClick={onExistingAccount} className="uppercase">
      I Already Have an Account
    </CartTextLink>
  </div>
);

const GuestCheckoutDesktopContent = ({
  onContinueAsGuest,
  onExistingAccount,
}: {
  onContinueAsGuest: () => void;
  onExistingAccount: () => void;
}) => (
  <div
    className="flex w-full flex-col bg-gray300"
    style={{
      gap: guestCheckoutSpec.sectionGap,
      padding: guestCheckoutSpec.desktopPadding,
    }}
  >
    <div className="flex flex-col" style={{ gap: guestCheckoutSpec.innerGap }}>
      <h2 className="font-larken text-32 font-light leading-110 text-darkblack">
        New to Sunny Diamonds?
      </h2>
      <CartDivider weight={1} />
      <p className="font-gill text-base font-light leading-110 text-darkblack">{GUEST_CHECKOUT_COPY}</p>
    </div>

    <GuestCheckoutActions
      onContinueAsGuest={onContinueAsGuest}
      onExistingAccount={onExistingAccount}
      className="gap-6"
    />
  </div>
);

const GuestCheckoutMobileContent = ({
  onClose,
  onContinueAsGuest,
  onExistingAccount,
}: {
  onClose: () => void;
  onContinueAsGuest: () => void;
  onExistingAccount: () => void;
}) => (
  <div className="relative h-full w-full overflow-hidden bg-white">
    <div
      className="absolute left-1/2 flex w-[343px] max-w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between"
      style={{ top: guestCheckoutSpec.headerTop }}
    >
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
        New to Sunny Diamonds?
      </h2>
      <RightPanelCloseButton onClick={onClose} aria-label="Close guest checkout options" />
    </div>

    <div
      className="absolute left-1/2 w-[343px] max-w-[calc(100%-32px)] -translate-x-1/2"
      style={{ top: guestCheckoutSpec.dividerTop }}
    >
      <CartDivider weight={1} />
    </div>

    <div
      className="absolute left-4 flex w-[343px] max-w-[calc(100%-32px)] -translate-y-1/2 flex-col justify-center font-gill text-base font-light leading-110 text-darkblack"
      style={{ top: guestCheckoutSpec.bodyTop }}
    >
      <p>{GUEST_CHECKOUT_COPY}</p>
    </div>

    <div className="absolute bottom-0 left-1/2 flex w-full max-w-[375px] -translate-x-1/2 flex-col">
      <div
        className="bg-gradient-to-b from-transparent to-white"
        style={{ height: guestCheckoutSpec.footerGradientHeight }}
        aria-hidden
      />
      <div
        className="border-t-[0.5px] border-neutral300 bg-white"
        style={{
          paddingInline: guestCheckoutSpec.footerPaddingX,
          paddingBlock: guestCheckoutSpec.footerPaddingY,
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{ gap: guestCheckoutSpec.footerGap }}
        >
          <GuestCheckoutActions
            onContinueAsGuest={onContinueAsGuest}
            onExistingAccount={onExistingAccount}
          />
        </div>
      </div>
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

  if (showMobileShell) {
    return (
      <Drawer
        open={isGuestCheckoutModalOpen}
        shouldScaleBackground={false}
        onOpenChange={handleOpenChange}
      >
        <DrawerContent
          overlayClassName={GUEST_CHECKOUT_MOBILE_OVERLAY_CLASS}
          className={cn(
            "z-[70] mt-0 flex min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden",
          )}
          style={{ height: guestCheckoutSpec.mobileHeight }}
        >
          <DrawerTitle className="sr-only">New to Sunny Diamonds?</DrawerTitle>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <GuestCheckoutMobileContent
              onClose={closeGuestCheckoutModal}
              onContinueAsGuest={handleContinueAsGuest}
              onExistingAccount={handleExistingAccount}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isGuestCheckoutModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton
        overlayClassName={GUEST_CHECKOUT_OVERLAY_CLASS}
        className="z-[70] w-full gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100"
        style={{ maxWidth: guestCheckoutSpec.desktopWidth }}
      >
        <DialogTitle className="sr-only">New to Sunny Diamonds?</DialogTitle>
        <GuestCheckoutDesktopContent
          onContinueAsGuest={handleContinueAsGuest}
          onExistingAccount={handleExistingAccount}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutModal;

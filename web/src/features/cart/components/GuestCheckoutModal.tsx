"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { cn } from "@/shared/utils/cn";
import { useCartUI } from "../context/CartUIContext";
import {
  CartDivider,
  CartPrimaryButton,
  CartTextLink,
} from "./CartFlowUi";

const modalFadeClassName =
  "transition-opacity duration-300 ease-out motion-reduce:transition-none";

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

const GuestCheckoutDesktopModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frame);
      setIsVisible(false);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[4.5px]" aria-hidden />
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center p-4",
          modalFadeClassName,
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="Close guest checkout"
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(30,30,30,0.75)]"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome, New User"
          className="relative z-10 w-full max-w-[560px]"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const GuestCheckoutModal = () => {
  const router = useRouter();
  const { openLoginModal } = useLoginModal();
  const { isGuestCheckoutModalOpen, closeGuestCheckoutModal } = useCartUI();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleContinueAsGuest = () => {
    closeGuestCheckoutModal();
    router.push("/checkout");
  };

  const handleExistingAccount = () => {
    closeGuestCheckoutModal();
    openLoginModal({ returnUrl: "/checkout" });
  };

  const content = (
    <GuestCheckoutContent
      onContinueAsGuest={handleContinueAsGuest}
      onExistingAccount={handleExistingAccount}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        open={isGuestCheckoutModalOpen}
        shouldScaleBackground={false}
        onOpenChange={(open) => !open && closeGuestCheckoutModal()}
      >
        <DrawerContent className="max-h-[90vh] overflow-hidden rounded-none border-0 bg-gray300 p-0 [&>div:first-child]:hidden">
          <DrawerTitle className="sr-only">Welcome, New User</DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <GuestCheckoutDesktopModal
      open={isGuestCheckoutModalOpen}
      onClose={closeGuestCheckoutModal}
    >
      {content}
    </GuestCheckoutDesktopModal>
  );
};

export default GuestCheckoutModal;

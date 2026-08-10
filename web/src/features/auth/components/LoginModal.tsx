"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { getAuthFlowLabel } from "../utils/authNavigation";
import AuthFlowSteps from "./AuthFlowSteps";

const LoginModal = () => {
  const router = useRouter();
  const { isLoginModalOpen, returnUrl, initialIdentifier, closeLoginModal } = useLoginModal();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const { step, contentProps } = useAuthFlow({
    active: isLoginModalOpen,
    returnUrl,
    initialIdentifier,
    surface: "modal",
    onComplete: (nextReturnUrl) => {
      closeLoginModal();
      router.push(nextReturnUrl);
    },
    onAbort: closeLoginModal,
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const showDesktopModal = isLoginModalOpen && isMobile === false;
  const showMobileDrawer = isLoginModalOpen && isMobile === true;
  const modalLabel = getAuthFlowLabel(step);
  const titleClassName = isMobile ? "text-2xl" : undefined;

  useEffect(() => {
    if (!isLoginModalOpen || isMobile !== false) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoginModalOpen, isMobile]);

  return (
    <>
      {showDesktopModal ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="Close sign in modal"
            onClick={closeLoginModal}
            className="absolute inset-0 bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
          />
          <div className="relative flex h-full w-full items-center justify-center px-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={modalLabel}
              className="relative z-10 w-full max-w-[560px] bg-white p-6"
            >
              <AuthFlowSteps {...contentProps} titleClassName={titleClassName} />
            </div>
          </div>
        </div>
      ) : null}

      <Drawer
        open={showMobileDrawer}
        onOpenChange={(nextOpen) => !nextOpen && closeLoginModal()}
        shouldScaleBackground={false}
      >
        <DrawerContent className="z-[80] flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden">
          <DrawerTitle className="sr-only">{modalLabel}</DrawerTitle>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:px-6 py-6 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <AuthFlowSteps {...contentProps} titleClassName={titleClassName} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LoginModal;

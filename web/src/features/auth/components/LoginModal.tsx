"use client";

import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { useResponsiveOverlayShell } from "@/shared/hooks/use-responsive-overlay-shell";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuthFlow } from "../hooks/useAuthFlow";
import { getAuthFlowLabel } from "../utils/authNavigation";
import AuthFlowSteps from "./AuthFlowSteps";

const LOGIN_MODAL_MOBILE_QUERY = "(max-width: 1023px)";

const LOGIN_MODAL_OVERLAY_CLASS = "z-[70] bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]";

const LoginModal = () => {
  const router = useRouter();
  const { isLoginModalOpen, returnUrl, initialIdentifier, closeLoginModal } = useLoginModal();
  const { showMobileShell } = useResponsiveOverlayShell(isLoginModalOpen, LOGIN_MODAL_MOBILE_QUERY);

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

  const modalLabel = getAuthFlowLabel(step);
  const titleClassName = showMobileShell ? "text-2xl" : undefined;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeLoginModal();
    }
  };

  if (showMobileShell) {
    return (
      <Drawer
        open={isLoginModalOpen}
        onOpenChange={handleOpenChange}
        shouldScaleBackground={false}
      >
        <DrawerContent
          overlayClassName={LOGIN_MODAL_OVERLAY_CLASS}
          className="z-[80] flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-white p-0 [&>div:first-child]:hidden"
        >
          <DrawerTitle className="sr-only">{modalLabel}</DrawerTitle>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:px-6">
            <AuthFlowSteps {...contentProps} titleClassName={titleClassName} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        hideCloseButton
        overlayClassName={LOGIN_MODAL_OVERLAY_CLASS}
        className="z-[70] max-w-[560px] gap-0 border-0 bg-white p-6 sm:rounded-none data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100"
      >
        <DialogTitle className="sr-only">{modalLabel}</DialogTitle>
        <AuthFlowSteps {...contentProps} titleClassName={titleClassName} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

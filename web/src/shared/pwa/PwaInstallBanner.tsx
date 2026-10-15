"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { CartOutlineButton, CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { cn } from "@/shared/utils/cn";
import { isAuthRoute, isCartOrCheckoutRoute } from "@/shared/utils/navigation";
import {
  type BeforeInstallPromptEvent,
  isPwaStandaloneDisplayMode,
  markPwaInstallBannerDismissed,
  wasPwaInstallBannerDismissed,
} from "./pwaInstallPrompt";
import SDLogo from "@/assets/Icons/SDLogo";

const BANNER_COPY = {
  title: "Install Sunny Diamonds",
  description: "Add the app to your home screen for quick access to our jewellery collection.",
  install: "Install app",
  dismiss: "Not now",
};

export default function PwaInstallBanner() {
  const pathname = usePathname() ?? "/";
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  const shouldSuppressRoute = isAuthRoute(pathname) || isCartOrCheckoutRoute(pathname);

  useEffect(() => {
    if (shouldSuppressRoute || isPwaStandaloneDisplayMode() || wasPwaInstallBannerDismissed()) {
      setVisible(false);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [shouldSuppressRoute]);

  const handleDismiss = useCallback(() => {
    markPwaInstallBannerDismissed();
    setVisible(false);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
      setVisible(false);
    }
  }, [deferredPrompt]);

  if (!visible || !deferredPrompt || shouldSuppressRoute || isPwaStandaloneDisplayMode()) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Install application"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4",
        "pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:justify-end md:px-6 md:pb-6",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md flex-col gap-4 border border-neutral300 bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "md:max-w-sm md:flex-row md:items-center",
        )}
      >
        <div className="flex flex-1 items-start gap-3 md:items-center">
          <SDLogo className="text-darkblack size-12 shrink-0 rounded-lg" aria-hidden />
          <div className="min-w-0 text-left">
            <p className="font-larken text-lg font-light leading-110 text-darkblack">{BANNER_COPY.title}</p>
            <p className="mt-1 font-gill text-sm font-light leading-110 text-neutral500">
              {BANNER_COPY.description}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col md:gap-2 lg:flex-col">
          <CartPrimaryButton
            type="button"
            className="w-full sm:flex-1 md:w-[140px]"
            disabled={installing}
            onClick={handleInstall}
          >
            {BANNER_COPY.install}
          </CartPrimaryButton>
          <CartOutlineButton type="button" className="w-full sm:flex-1 md:w-[140px]" onClick={handleDismiss}>
            {BANNER_COPY.dismiss}
          </CartOutlineButton>
        </div>
      </div>
    </div>
  );
}

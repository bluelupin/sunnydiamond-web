/** Chromium `beforeinstallprompt` event (not in default DOM typings). */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export const PWA_INSTALL_DISMISS_STORAGE_KEY = "sunny-diamonds-pwa-install-dismissed";

export function isPwaStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function wasPwaInstallBannerDismissed(): boolean {
  if (typeof sessionStorage === "undefined") {
    return false;
  }
  try {
    return sessionStorage.getItem(PWA_INSTALL_DISMISS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPwaInstallBannerDismissed(): void {
  try {
    sessionStorage.setItem(PWA_INSTALL_DISMISS_STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}
